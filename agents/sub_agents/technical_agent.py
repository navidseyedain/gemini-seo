import os
import json
from google import genai
from pydantic import BaseModel
from typing import List, Optional

from agents.gemini_client import get_client, generate_with_retry

class TechFinding(BaseModel):
    category: str # "performance", "accessibility", "seo", "best-practices"
    message: str
    impact: str # high, medium, low
    recommendation: str

class TechnicalReport(BaseModel):
    score: int # 0-100
    findings: List[TechFinding]
    mobile_friendly: bool
    ssl_secure: bool

async def analyze_technical(html_content: str, text_content: str, url: str, api_key: str = None) -> TechnicalReport:
    client = get_client(api_key)
    
    prompt = f"""
    You are an expert Technical SEO analyst.
    Analyze the following HTML and extracted text for technical SEO issues (tags, meta, structure).
    URL: {url}
    
    Return a JSON response matching this schema:
    {{
        "score": 0-100,
        "findings": [
            {{
                "category": "seo" | "performance" | "accessibility",
                "message": "description of the finding",
                "impact": "high" | "medium" | "low",
                "recommendation": "how to fix"
            }}
        ],
        "mobile_friendly": true/false, // Infer from viewport meta tag
        "ssl_secure": true/false // Infer from url protocol
    }}
    
    HTML Content:
    {html_content[:20000]}
    """
    
    response = await generate_with_retry(
        client=client,
        prompt=prompt,
        response_schema=TechnicalReport,
    )
    
    return TechnicalReport.model_validate_json(response.text)
