import os
from google import genai
from pydantic import BaseModel
from typing import List

from agents.gemini_client import get_client, generate_with_retry

class LocalFinding(BaseModel):
    issue: str
    impact: str # high, medium, low
    recommendation: str

class LocalReport(BaseModel):
    has_nap: bool # Name, Address, Phone
    has_map_embed: bool
    has_local_schema: bool
    local_keywords_detected: List[str]
    findings: List[LocalFinding]
    score: int # 0-100

async def analyze_local(html_content: str, text_content: str, url: str, api_key: str = None) -> LocalReport:
    client = get_client(api_key)
    
    prompt = f"""
    You are an expert Local SEO analyst.
    Analyze the following extracted HTML and text for Local SEO signals (NAP, Maps, Local Schema, Local Keywords).
    URL: {url}
    
    Return a JSON response matching this schema exactly:
    {{
        "has_nap": true/false,
        "has_map_embed": true/false,
        "has_local_schema": true/false,
        "local_keywords_detected": ["keyword1", "keyword2"],
        "findings": [
            {{
                "issue": "description of local SEO flaw",
                "impact": "high|medium|low",
                "recommendation": "how to fix"
            }}
        ],
        "score": 0-100
    }}
    
    HTML Content:
    {html_content[:15000]}
    
    Text Content:
    {text_content[:10000]}
    """
    
    response = await generate_with_retry(
        client=client,
        prompt=prompt,
        response_schema=LocalReport,
    )
    
    return LocalReport.model_validate_json(response.text)
