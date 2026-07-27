from pydantic import BaseModel
from agents.gemini_client import get_client, generate_with_retry
from agents.crawler import crawl_url
from duckduckgo_search import DDGS
from urllib.parse import urlparse
import asyncio

class CompetitorResult(BaseModel):
    score: int
    competitor_url: str
    gap_analysis: str
    missing_keywords: list[str]
    strengths: list[str]
    weaknesses: list[str]

async def analyze_competitor(main_url: str, main_text_content: str, api_key: str = None) -> CompetitorResult:
    # 1. Ask Gemini to extract the main keyword
    keyword_prompt = f"""
    Based on the following content from {main_url}, what is the single most important SEO search phrase or keyword that this business would want to rank for?
    Respond with ONLY the search phrase, nothing else. No quotes.
    Content (truncated): {main_text_content[:2000]}
    """
    client = get_client(api_key)
    keyword_response = await generate_with_retry(client, keyword_prompt)
    search_keyword = keyword_response.text.strip()
    
    # Sometimes Gemini returns JSON instead of plain string (e.g. {"keyword": "space news"})
    if search_keyword.startswith('{') and 'keyword' in search_keyword:
        try:
            import json
            parsed = json.loads(search_keyword)
            if 'keyword' in parsed:
                search_keyword = parsed['keyword']
        except:
            pass
    
    if not search_keyword:
        search_keyword = urlparse(main_url).netloc
        
    # 2 & 3. Search DuckDuckGo and Crawl the top competitor
    competitor_url = ""
    comp_text = ""
    error_msg = ""
    
    try:
        def sync_search():
            with DDGS() as ddgs:
                return list(ddgs.text(search_keyword, max_results=10))
                
        results = await asyncio.to_thread(sync_search)
        main_domain = urlparse(main_url).netloc
        
        for res in results:
            res_url = res.get("href", "")
            res_domain = urlparse(res_url).netloc
            if res_domain and res_domain != main_domain:
                try:
                    competitor_data = await crawl_url(res_url)
                    # If it successfully crawls, keep this competitor
                    competitor_url = res_url
                    comp_text = competitor_data.text_content
                    break
                except Exception as crawl_err:
                    print(f"Skipping {res_url} due to crawl error: {crawl_err}")
                    continue
                    
    except Exception as e:
        error_msg = f"DuckDuckGo Search error: {str(e)}"
        print(error_msg)
        
    if not competitor_url:
        return CompetitorResult(
            score=0,
            competitor_url="Not Found",
            gap_analysis=f"Could not automatically find a crawlable competitor for keyword: '{search_keyword}'. Error: {error_msg if error_msg else 'None found in top 10 or all blocked crawling (like Cloudflare/403)'}",
            missing_keywords=[],
            strengths=[],
            weaknesses=[]
        )
        
    # 4. Compare with Gemini
    compare_prompt = f"""
    You are an expert SEO strategist. Compare our website with our top competitor.
    Our URL: {main_url}
    Our Content (truncated): {main_text_content[:4000]}
    
    Competitor URL: {competitor_url}
    Competitor Content (truncated): {comp_text[:4000]}
    
    Return a JSON response with this exact structure:
    {{
      "score": <0-100 integer representing how competitive our site is vs them. 100 means we are much better.>,
      "gap_analysis": "<A short paragraph explaining the main gap between us and them>",
      "missing_keywords": ["keyword1", "keyword2"],
      "strengths": ["Our strength 1"],
      "weaknesses": ["Our weakness 1"]
    }}
    """
    
    response = await generate_with_retry(client, compare_prompt)
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
        return CompetitorResult(
            score=int(data.get("score", 50)),
            competitor_url=competitor_url,
            gap_analysis=data.get("gap_analysis", ""),
            missing_keywords=data.get("missing_keywords", []),
            strengths=data.get("strengths", []),
            weaknesses=data.get("weaknesses", [])
        )
    except Exception as e:
        return CompetitorResult(
            score=50,
            competitor_url=competitor_url,
            gap_analysis=f"Error parsing comparison data: {str(e)}",
            missing_keywords=[],
            strengths=[],
            weaknesses=[]
        )
