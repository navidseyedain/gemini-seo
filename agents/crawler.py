import httpx
from bs4 import BeautifulSoup
from pydantic import BaseModel
from typing import List, Optional

class CrawlResult(BaseModel):
    url: str
    title: Optional[str]
    meta_description: Optional[str]
    h1_tags: List[str]
    text_content: str
    html_content: str
    links: List[str]

BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9,fa;q=0.8",
    "Sec-Ch-Ua": '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Upgrade-Insecure-Requests": "1"
}

async def crawl_url(url: str) -> CrawlResult:
    """Fetches a URL and parses basic SEO elements using realistic browser headers."""
    try:
        async with httpx.AsyncClient(timeout=20.0, follow_redirects=True, headers=BROWSER_HEADERS) as client:
            response = await client.get(url)
            response.raise_for_status()
            html = response.text
    except httpx.HTTPStatusError as e:
        raise Exception(f"Target server returned HTTP {e.response.status_code} ({e.response.reason_phrase}). The site may block automated crawlers.")
    except httpx.RequestError as e:
        raise Exception(f"Failed to connect to {url}. Please check if the URL is accessible.")
    except Exception as e:
        raise Exception(f"Web crawler error: {str(e)}")

    soup = BeautifulSoup(html, "html.parser")
    
    # Extract Title
    title = soup.title.string.strip() if soup.title and soup.title.string else None
    
    # Extract Meta Description
    meta_desc = None
    meta_tag = soup.find("meta", attrs={"name": "description"})
    if meta_tag and "content" in meta_tag.attrs:
        meta_desc = meta_tag["content"].strip()
        
    # Extract H1 tags
    h1_tags = [h1.get_text(strip=True) for h1 in soup.find_all("h1")]
    
    # Clean text content (remove scripts, styles, noscript)
    for script in soup(["script", "style", "noscript"]):
        script.extract()
    text_content = soup.get_text(separator=" ", strip=True)
    
    # Extract Links
    links = [a["href"] for a in soup.find_all("a", href=True)]
    
    return CrawlResult(
        url=url,
        title=title,
        meta_description=meta_desc,
        h1_tags=h1_tags,
        text_content=text_content,
        html_content=html,
        links=links
    )
