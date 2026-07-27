import os
import json
from google import genai
from pydantic import BaseModel
from typing import List, Optional

from agents.gemini_client import get_client, generate_with_retry

class SchemaFinding(BaseModel):
    type: str
    message: str
    impact: str # high, medium, low
    recommendation: str

class SchemaReport(BaseModel):
    has_schema: bool
    detected_types: List[str]
    findings: List[SchemaFinding]
    recommended_schema_jsonld: Optional[str]

async def analyze_schema(html_content: str, url: str, api_key: str = None) -> SchemaReport:
    client = get_client(api_key)
    
    prompt = f"""
    You are an expert SEO Schema.org analyst.
    Analyze the following HTML for Schema.org JSON-LD or Microdata.
    URL: {url}
    
    Return a JSON response matching this schema:
    {{
        "has_schema": true/false,
        "detected_types": ["Article", "Organization", ...],
        "findings": [
            {{
                "type": "error" | "warning" | "success" | "opportunity",
                "message": "description of the finding",
                "impact": "high" | "medium" | "low",
                "recommendation": "how to fix or implement"
            }}
        ],
        "recommended_schema_jsonld": "<script type=\\"application/ld+json\\">...</script>" // Provide a generated complete best-practice JSON-LD for this page type.
    }}
    
    HTML Content:
    {html_content[:30000]}
    """
    
    response = await generate_with_retry(
        client=client,
        prompt=prompt,
        response_schema=SchemaReport,
    )
    
    return SchemaReport.model_validate_json(response.text)
