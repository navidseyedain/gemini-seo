import httpx
from pydantic import BaseModel
from urllib.parse import urlparse

class BacklinkResult(BaseModel):
    score: int
    domain: str
    page_rank_integer: int
    page_rank_decimal: float
    rank: str
    error: str = None

async def analyze_backlinks(url: str, api_key: str = None) -> BacklinkResult:
    domain = urlparse(url).netloc
    if domain.startswith("www."):
        domain = domain[4:]

    if not api_key:
        return BacklinkResult(
            score=0,
            domain=domain,
            page_rank_integer=0,
            page_rank_decimal=0.0,
            rank="N/A",
            error="OpenPageRank API Key is missing. Please add it in settings."
        )

    try:
        api_url = f"https://openpagerank.com/api/v1.0/getPageRank?domains%5B0%5D={domain}"
        headers = {
            "API-OPR": api_key
        }
        async with httpx.AsyncClient() as client:
            response = await client.get(api_url, headers=headers, timeout=60.0)
            response.raise_for_status()
            data = response.json()
            
            if data.get("status_code") == 200 and data.get("response"):
                record = data["response"][0]
                # OpenPageRank score usually corresponds to the decimal * 10
                score_decimal = float(record.get("page_rank_decimal", 0.0))
                score = int(score_decimal * 10)
                return BacklinkResult(
                    score=score,
                    domain=domain,
                    page_rank_integer=int(record.get("page_rank_integer", 0)),
                    page_rank_decimal=score_decimal,
                    rank=str(record.get("rank", "N/A"))
                )
            else:
                return BacklinkResult(
                    score=0,
                    domain=domain,
                    page_rank_integer=0,
                    page_rank_decimal=0.0,
                    rank="N/A",
                    error="No data returned from OpenPageRank."
                )
    except Exception as e:
        error_msg = f"{type(e).__name__} - {str(e)}"
        if "Timeout" in type(e).__name__:
            error_msg = "The free OpenPageRank API server is currently unresponsive or overloaded. Please try again later."
        return BacklinkResult(
            score=0,
            domain=domain,
            page_rank_integer=0,
            page_rank_decimal=0.0,
            rank="N/A",
            error=f"Error fetching backlink data: {error_msg}"
        )
