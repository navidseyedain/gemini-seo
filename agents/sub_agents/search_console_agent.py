import json
import datetime
from pydantic import BaseModel
from typing import List, Optional

class GSCKeyword(BaseModel):
    query: str
    clicks: int
    impressions: int
    ctr: float
    position: float

class SearchConsoleReport(BaseModel):
    total_clicks: int = 0
    total_impressions: int = 0
    avg_ctr: float = 0.0
    avg_position: float = 0.0
    top_keywords: List[GSCKeyword] = []
    error: Optional[str] = None

async def analyze_search_console(url: str, gsc_json: str = None) -> SearchConsoleReport:
    """
    Calls Google Search Console API using the provided OAuth JSON.
    Fetches the last 30 days of data for the exact URL.
    """
    if not gsc_json:
        return SearchConsoleReport(error="Google Search Console OAuth JSON is missing.")
        
    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        
        credentials_dict = json.loads(gsc_json)
        creds = service_account.Credentials.from_service_account_info(
            credentials_dict,
            scopes=['https://www.googleapis.com/auth/webmasters.readonly']
        )
        
        service = build('webmasters', 'v3', credentials=creds)
        
        # We need the site URL to query. GSC requires the exact property URL.
        # We will try to guess the property URL. Typically it's the domain (sc-domain:domain.com) or the exact URL.
        # Let's extract domain:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        domain = parsed.netloc
        site_url = f"sc-domain:{domain}"
        
        # Calculate date range: last 30 days
        end_date = datetime.date.today()
        start_date = end_date - datetime.timedelta(days=30)
        
        request = {
            'startDate': start_date.strftime('%Y-%m-%d'),
            'endDate': end_date.strftime('%Y-%m-%d'),
            'dimensions': ['query'],
            'rowLimit': 10,
            # Filter for the specific URL being audited
            'dimensionFilterGroups': [{
                'filters': [{
                    'dimension': 'page',
                    'operator': 'equals',
                    'expression': url
                }]
            }]
        }
        
        # We need to run the blocking Google API call in a thread
        import asyncio
        loop = asyncio.get_event_loop()
        
        def fetch_data():
            try:
                return service.searchanalytics().query(siteUrl=site_url, body=request).execute()
            except Exception as e:
                # Fallback to https://domain/ property if sc-domain fails
                fallback_site_url = f"https://{domain}/"
                return service.searchanalytics().query(siteUrl=fallback_site_url, body=request).execute()
                
        response = await loop.run_in_executor(None, fetch_data)
        
        rows = response.get('rows', [])
        
        top_keywords = []
        total_clicks = 0
        total_impressions = 0
        
        for row in rows:
            keys = row.get('keys', [])
            if not keys:
                continue
            kw = GSCKeyword(
                query=keys[0],
                clicks=row.get('clicks', 0),
                impressions=row.get('impressions', 0),
                ctr=row.get('ctr', 0.0),
                position=row.get('position', 0.0)
            )
            top_keywords.append(kw)
            total_clicks += kw.clicks
            total_impressions += kw.impressions
            
        avg_ctr = sum(k.ctr for k in top_keywords) / len(top_keywords) if top_keywords else 0.0
        avg_position = sum(k.position for k in top_keywords) / len(top_keywords) if top_keywords else 0.0
        
        return SearchConsoleReport(
            total_clicks=int(total_clicks),
            total_impressions=int(total_impressions),
            avg_ctr=avg_ctr,
            avg_position=avg_position,
            top_keywords=top_keywords
        )
        
    except Exception as e:
        return SearchConsoleReport(error=f"Search Console API failed: {str(e)}")
