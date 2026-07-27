import os
from google import genai
from pydantic import BaseModel
from typing import Dict

from agents.gemini_client import get_client, generate_with_retry

class EEATSignal(BaseModel):
    status: str # "good", "medium", "critical"
    score: int # 0-100
    description: str
    recommendation: str

class EEATReport(BaseModel):
    experience: EEATSignal
    expertise: EEATSignal
    authoritativeness: EEATSignal
    trustworthiness: EEATSignal

async def analyze_eeat(text_content: str, url: str, api_key: str = None) -> EEATReport:
    client = get_client(api_key)
    
    prompt = f"""
    You are an expert Google Quality Rater evaluating a web page for E-E-A-T signals.
    Analyze the following extracted text for E-E-A-T signals:
    URL: {url}
    
    Return a JSON response matching this schema exactly:
    {{
        "experience": {{"status": "good|medium|critical", "score": 0-100, "description": "...", "recommendation": "..."}},
        "expertise": {{"status": "good|medium|critical", "score": 0-100, "description": "...", "recommendation": "..."}},
        "authoritativeness": {{"status": "good|medium|critical", "score": 0-100, "description": "...", "recommendation": "..."}},
        "trustworthiness": {{"status": "good|medium|critical", "score": 0-100, "description": "...", "recommendation": "..."}}
    }}
    
    Look for:
    - Experience: First-hand experience, "I", "we", personal anecdotes, original photos.
    - Expertise: Author bios, credentials, deep topical coverage.
    - Authoritativeness: Mentions of brand, citations (if visible).
    - Trustworthiness: Contact info, privacy policies, secure terms, lack of spam.
    
    Extracted Text Content:
    {text_content[:20000]}
    """
    
    response = await generate_with_retry(
        client=client,
        prompt=prompt,
        response_schema=EEATReport,
    )
    
    return EEATReport.model_validate_json(response.text)
