"""
Shared Gemini API client with automatic retry and exponential backoff.
Handles 503 UNAVAILABLE and rate-limit errors gracefully.
"""

import asyncio
import os
import random
from google import genai


def get_client(api_key: str = None) -> genai.Client:
    """Create a Gemini client using the provided key or env variable."""
    key = api_key or os.environ.get("GEMINI_API_KEY")
    if not key:
        raise ValueError("GEMINI_API_KEY is not set.")
    return genai.Client(api_key=key)


async def generate_with_retry(
    client: genai.Client,
    prompt: str,
    response_schema=None,
    model: str = "gemini-3.5-flash",
    temperature: float = 0.2,
    max_retries: int = 4,
    base_delay: float = 2.0,
):
    """
    Call Gemini API with automatic retry on transient errors (503, 429, etc.).
    Uses exponential backoff with jitter to avoid thundering herd.
    """
    config = {
        "response_mime_type": "application/json",
        "temperature": temperature,
    }
    if response_schema:
        config["response_schema"] = response_schema

    last_error = None
    for attempt in range(max_retries + 1):
        try:
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=config,
            )
            return response
        except Exception as e:
            last_error = e
            error_str = str(e)
            # Retry on transient errors (503, 429, UNAVAILABLE, RESOURCE_EXHAUSTED)
            is_retryable = any(
                code in error_str
                for code in ["503", "429", "UNAVAILABLE", "RESOURCE_EXHAUSTED", "overloaded", "high demand"]
            )

            if not is_retryable or attempt == max_retries:
                raise

            # Exponential backoff with jitter
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            print(f"  [Retry {attempt + 1}/{max_retries}] Gemini API temporarily unavailable. Retrying in {delay:.1f}s...")
            await asyncio.sleep(delay)

    raise last_error
