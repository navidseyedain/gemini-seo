from pydantic import BaseModel
from agents.gemini_client import get_client, generate_with_retry

class AccessibilityResult(BaseModel):
    score: int
    wcag_compliance: str
    issues: list[str]
    good_practices: list[str]

async def analyze_accessibility(html_content: str, url: str, api_key: str = None) -> AccessibilityResult:
    prompt = f"""
    You are an Accessibility (a11y) expert. Analyze the following HTML for WCAG compliance.
    URL: {url}
    HTML (truncated): {html_content[:8000]}
    
    Focus on:
    - Proper use of semantic HTML (nav, main, header, footer)
    - Presence of 'alt' attributes on images
    - ARIA labels and roles where appropriate
    - Form labels and input accessibility
    - Heading hierarchy (h1, h2, h3) skipping
    
    Return a JSON response with this exact structure:
    {{
      "score": <0-100 integer representing accessibility score>,
      "wcag_compliance": "<High/Medium/Low>",
      "issues": [
        "Issue 1",
        "Issue 2"
      ],
      "good_practices": [
        "Good practice 1",
        "Good practice 2"
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
        return AccessibilityResult(
            score=int(data.get("score", 50)),
            wcag_compliance=data.get("wcag_compliance", "Medium"),
            issues=data.get("issues", []),
            good_practices=data.get("good_practices", [])
        )
    except Exception as e:
        return AccessibilityResult(
            score=50,
            wcag_compliance="Unknown",
            issues=[f"Error parsing Accessibility data: {str(e)}"],
            good_practices=[]
        )
