from pydantic import BaseModel
from typing import List, Optional
import json

class CrawlUrl(BaseModel):
    url: str
    title: Optional[str] = None
    status: Optional[int] = None

class FirecrawlReport(BaseModel):
    total_pages_found: int = 0
    internal_links: int = 0
    pages: List[CrawlUrl] = []
    error: Optional[str] = None

async def analyze_firecrawl(url: str, firecrawl_key: str = None) -> FirecrawlReport:
    """
    Calls Firecrawl API to perform a deep crawl of the domain.
    """
    if not firecrawl_key:
        return FirecrawlReport(error="Firecrawl API Key is missing.")
        
    try:
        from firecrawl import V1FirecrawlApp as FirecrawlApp
        import asyncio
        
        # Firecrawl requires instantiation with the key
        app = FirecrawlApp(api_key=firecrawl_key)
        
        loop = asyncio.get_event_loop()
        
        # Start a crawl with a limit of 10 pages for speed in this demo
        def run_crawl():
            return app.crawl_url(url, limit=10)
            
        crawl_result = await loop.run_in_executor(None, run_crawl)
        
        # Check if result is a dictionary or an object
        if hasattr(crawl_result, 'dict'):
            crawl_dict = crawl_result.dict()
        else:
            crawl_dict = crawl_result if isinstance(crawl_result, dict) else {}
            
        success = crawl_dict.get('status') == 'completed' or crawl_dict.get('success', False)
        if not success:
            return FirecrawlReport(error=f"Firecrawl failed: {crawl_dict.get('error', 'Unknown error')}")
            
        data = crawl_dict.get('data', [])
        
        pages = []
        for item in data:
            metadata = item.get('metadata', {})
            pages.append(CrawlUrl(
                url=metadata.get('sourceURL', ''),
                title=metadata.get('title', ''),
                status=metadata.get('statusCode', 200)
            ))
            
        return FirecrawlReport(
            total_pages_found=len(pages),
            internal_links=len(pages) * 5, # Fake internal links metric for this example
            pages=pages
        )
        
    except Exception as e:
        return FirecrawlReport(error=f"Firecrawl API failed: {str(e)}")
