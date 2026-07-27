from pydantic import BaseModel
from agents.gemini_client import get_client, generate_with_retry

class GeoResult(BaseModel):
    score: int
    readiness: str
    ai_overviews_probability: str
    recommendations: list[str]

async def analyze_geo(text_content: str, url: str, api_key: str = None) -> GeoResult:
    prompt = f"""
    You are an expert in GEO (Generative Engine Optimization). Analyze the following webpage content for AI Search readiness (like Google SGE, Perplexity, ChatGPT).
    URL: {url}
    Content (truncated): {text_content[:8000]}
    
    Evaluate based on:
    - Direct answers to common questions
    - Use of statistics, quotes, and citations
    - Structure optimized for NLP extraction
    - High informational value without fluff
    
    Return a JSON response with this exact structure:
    {{
      "score": <0-100 integer based on GEO readiness>,
      "readiness": "<High/Medium/Low>",
      "ai_overviews_probability": "<Likelihood of being featured in AI Overviews>",
      "recommendations": [
        "Recommendation 1",
        "Recommendation 2"
      ]
    }}
    """
    
    client = get_client(api_key)
    response = await generate_with_retry(client, prompt)
    response_text = response.text
    
    try:
        import json
        import re
        json_str = response_text.strip()
        if json_str.startswith("```json"):
            json_str = json_str.split("```json")[1].split("```")[0].strip()
        elif json_str.startswith("```"):
            json_str = json_str.split("```")[1].split("```")[0].strip()
            
        data = json.loads(json_str)
        return GeoResult(
            score=int(data.get("score", 50)),
            readiness=data.get("readiness", "Medium"),
            ai_overviews_probability=data.get("ai_overviews_probability", "Unknown"),
            recommendations=data.get("recommendations", [])
        )
    except Exception as e:
        return GeoResult(
            score=50,
            readiness="Unknown",
            ai_overviews_probability="Unknown",
            recommendations=[f"Error parsing GEO data: {str(e)}"]
        )
