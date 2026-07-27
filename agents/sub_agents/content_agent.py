from pydantic import BaseModel, Field
from typing import List
from agents.gemini_client import get_client, generate_with_retry

class ContentGap(BaseModel):
    topic: str
    importance: str = Field(description="Why this topic is important for the page's SEO")

class ContentReport(BaseModel):
    score: int = Field(description="Overall content quality score from 0 to 100")
    word_count: int
    readability_level: str = Field(description="e.g., Easy, Medium, Hard, or Grade level")
    primary_intent: str = Field(description="Informational, Navigational, Commercial, or Transactional")
    target_audience: str = Field(description="Who is this content written for?")
    tone: str = Field(description="e.g., Professional, Casual, Academic, Salesy")
    top_keywords: List[str] = Field(description="Top 3 to 5 keywords extracted from the content")
    content_gaps: List[ContentGap] = Field(description="Missing topics that competitors might cover")
    recommendations: List[str] = Field(description="Actionable tips to improve content SEO and engagement")

async def analyze_content(text_content: str, url: str, api_key: str = None) -> ContentReport:
    prompt = f"""
    You are an expert SEO Content Strategist. Analyze the following webpage text content and provide a comprehensive content quality report.
    URL: {url}
    
    Calculate an overall content quality score (0-100) based on relevance, depth, readability, and SEO best practices.
    Identify the primary search intent and the target audience.
    Extract the most prominent keywords being targeted.
    Identify any "Content Gaps" - important related topics that a user searching for this would expect to see but are missing.
    Provide actionable recommendations to improve the content.
    
    TEXT CONTENT:
    {text_content[:20000]} # Limit to ~20k chars to avoid token limits
    """
    
    client = get_client(api_key)
    response = await generate_with_retry(
        client=client,
        prompt=prompt,
        response_schema=ContentReport,
    )
    
    return ContentReport.model_validate_json(response.text)
