import asyncio
import httpx
from pydantic import BaseModel
from typing import List, Optional

class PerformanceMetric(BaseModel):
    name: str
    value: str
    score: int
    status: str # "good", "needs_improvement", "poor"

class PerformanceReport(BaseModel):
    score: int
    lcp: Optional[str] = None
    fcp: Optional[str] = None
    cls: Optional[str] = None
    metrics: List[PerformanceMetric] = []
    error: Optional[str] = None

async def analyze_performance(url: str, api_key: str = None) -> PerformanceReport:
    """
    Calls Google PageSpeed Insights API to get Core Web Vitals and Performance Score.
    Uses mobile strategy by default for stricter performance metrics.
    """
    api_url = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    params = {
        "url": url,
        "strategy": "mobile",
        "category": "performance",
    }
    
    if api_key:
        params["key"] = api_key
        
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            for attempt in range(3):
                try:
                    response = await client.get(api_url, params=params)
                    response.raise_for_status()
                    data = response.json()
                    break # Success, exit retry loop
                except Exception as e:
                    if attempt == 2:
                        raise e
                    await asyncio.sleep(2.0)
                
            lighthouse_result = data.get("lighthouseResult", {})
            categories = lighthouse_result.get("categories", {})
            performance = categories.get("performance", {})
            
            # Lighthouse score is 0.0 to 1.0
            overall_score = int(performance.get("score", 0) * 100)
            
            audits = lighthouse_result.get("audits", {})
            
            # Helper to extract metrics
            def extract_metric(audit_key: str, name: str) -> PerformanceMetric:
                audit = audits.get(audit_key, {})
                score = audit.get("score")
                
                status = "poor"
                if score is not None:
                    if score >= 0.9:
                        status = "good"
                    elif score >= 0.5:
                        status = "needs_improvement"
                
                return PerformanceMetric(
                    name=name,
                    value=audit.get("displayValue", "N/A"),
                    score=int((score or 0) * 100),
                    status=status
                )
            
            lcp = extract_metric("largest-contentful-paint", "Largest Contentful Paint (LCP)")
            fcp = extract_metric("first-contentful-paint", "First Contentful Paint (FCP)")
            cls = extract_metric("cumulative-layout-shift", "Cumulative Layout Shift (CLS)")
            tti = extract_metric("interactive", "Time to Interactive (TTI)")
            speed_index = extract_metric("speed-index", "Speed Index")
            tbt = extract_metric("total-blocking-time", "Total Blocking Time (TBT)")
            
            return PerformanceReport(
                score=overall_score,
                lcp=lcp.value,
                fcp=fcp.value,
                cls=cls.value,
                metrics=[lcp, fcp, cls, tti, speed_index, tbt]
            )
            
    except Exception as e:
        error_msg = str(e)
        if "401 Unauthorized" in error_msg:
            return PerformanceReport(score=0, error="Your Google API Key is invalid or does not have the 'PageSpeed Insights API' enabled. Please fix it in Settings or leave it blank to use the free tier.")
        if "429 Too Many Requests" in error_msg:
            return PerformanceReport(score=0, error="Google PageSpeed API rate limit exceeded (429 Too Many Requests). You have made too many requests from your IP. Please add a free Google API Key in Settings to increase your limit.")
        return PerformanceReport(score=0, error=f"PageSpeed API Error: {error_msg}")
