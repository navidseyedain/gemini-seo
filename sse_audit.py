"""
SSE (Server-Sent Events) streaming audit endpoint.
Sends real-time progress as each agent completes its analysis.
"""

import asyncio
import json
from typing import AsyncGenerator

from agents.crawler import crawl_url
from agents.sub_agents.technical_agent import analyze_technical
from agents.sub_agents.schema_agent import analyze_schema
from agents.sub_agents.eeat_agent import analyze_eeat
from agents.sub_agents.local_agent import analyze_local
from agents.sub_agents.performance_agent import analyze_performance
from agents.sub_agents.content_agent import analyze_content
from agents.sub_agents.search_console_agent import analyze_search_console
from agents.sub_agents.firecrawl_agent import analyze_firecrawl
from agents.sub_agents.geo_agent import analyze_geo
from agents.sub_agents.accessibility_agent import analyze_accessibility
from agents.sub_agents.backlink_agent import analyze_backlinks
from agents.sub_agents.competitor_agent import analyze_competitor


def sse_event(event: str, data: dict) -> str:
    """Format a Server-Sent Event string."""
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


async def stream_audit(
    url: str, 
    api_key: str = None, 
    google_api_key: str = None, 
    gsc_json: str = None, 
    firecrawl_key: str = None,
    openpagerank_key: str = None
) -> AsyncGenerator[str, None]:
    """
    Generator that yields SSE events as each agent completes.
    Flow: crawling → agent results (as they finish) → complete
    """

    # 1. Crawl phase
    yield sse_event("status", {"agent": "crawler", "status": "running", "message": "Fetching webpage..."})
    try:
        crawl_data = await crawl_url(url)
    except Exception as e:
        yield sse_event("error_event", {"message": f"Crawl failed: {str(e)}"})
        return

    yield sse_event("status", {"agent": "crawler", "status": "done", "message": "Page fetched successfully"})

    # 2. Launch all agents in parallel, collect results as they complete
    results = {}

    async def run_agent(name: str, coro):
        """Run a single agent and yield its result."""
        try:
            result = await coro
            results[name] = result.model_dump()
            return name, result.model_dump(), None
        except Exception as e:
            results[name] = None
            return name, None, str(e)

    # Create tasks with slight stagger to avoid API overload
    tasks = {}

    async def staggered_technical():
        # Batch 1 (0s)
        return await run_agent("technical", analyze_technical(crawl_data.html_content, crawl_data.text_content, url, api_key=api_key))

    async def staggered_schema():
        await asyncio.sleep(2.0)
        return await run_agent("schema_report", analyze_schema(crawl_data.html_content, url, api_key=api_key))

    async def staggered_eeat():
        await asyncio.sleep(4.0)
        return await run_agent("eeat", analyze_eeat(crawl_data.text_content, url, api_key=api_key))

    async def staggered_local():
        await asyncio.sleep(6.0)
        return await run_agent("local", analyze_local(crawl_data.html_content, crawl_data.text_content, url, api_key=api_key))

    async def staggered_content():
        await asyncio.sleep(8.0)
        return await run_agent("content", analyze_content(crawl_data.text_content, url, api_key=api_key))

    # ---- Non-Gemini Agents (No Rate Limit) ----
    async def staggered_performance():
        await asyncio.sleep(1.0)
        return await run_agent("performance", analyze_performance(url, api_key=google_api_key))

    async def staggered_search_console():
        await asyncio.sleep(0.5)
        return await run_agent("search_console", analyze_search_console(url, gsc_json))
    
    async def staggered_firecrawl():
        await asyncio.sleep(1.0)
        return await run_agent("firecrawl", analyze_firecrawl(url, firecrawl_key))

    async def staggered_backlink():
        await asyncio.sleep(1.5)
        return await run_agent("backlink", analyze_backlinks(url, openpagerank_key))

    # ---- Batch 2 (After 65s) to bypass 5 RPM Limit ----
    async def staggered_geo():
        await asyncio.sleep(65.0)
        return await run_agent("geo", analyze_geo(crawl_data.text_content, url, api_key=api_key))

    async def staggered_accessibility():
        await asyncio.sleep(67.0)
        return await run_agent("accessibility", analyze_accessibility(crawl_data.html_content, url, api_key=api_key))

    async def staggered_competitor():
        await asyncio.sleep(69.0)
        return await run_agent("competitor", analyze_competitor(url, crawl_data.text_content, api_key=api_key))

    # Add to pending tasks
    pending = {
        asyncio.create_task(staggered_technical()): "technical",
        asyncio.create_task(staggered_schema()): "schema_report",
        asyncio.create_task(staggered_eeat()): "eeat",
        asyncio.create_task(staggered_local()): "local",
        asyncio.create_task(staggered_performance()): "performance",
        asyncio.create_task(staggered_content()): "content",
        asyncio.create_task(staggered_search_console()): "search_console",
        asyncio.create_task(staggered_firecrawl()): "firecrawl",
        asyncio.create_task(staggered_geo()): "geo",
        asyncio.create_task(staggered_accessibility()): "accessibility",
        asyncio.create_task(staggered_backlink()): "backlink",
        asyncio.create_task(staggered_competitor()): "competitor",
    }

    for coro in asyncio.as_completed(pending.keys()):
        name, data, error = await coro
        if error:
            yield sse_event("agent_error", {"agent": name, "error": error})
        else:
            yield sse_event("agent_done", {"agent": name, "data": data})

    # 3. Final complete event with full report
    full_report = {
        "url": url,
        "technical": results.get("technical", {}),
        "schema_report": results.get("schema_report", {}),
        "eeat": results.get("eeat", {}),
        "local": results.get("local", {}),
        "performance": results.get("performance", {}),
        "content": results.get("content", {}),
        "search_console": results.get("search_console", {}),
        "firecrawl": results.get("firecrawl", {}),
        "geo": results.get("geo", {}),
        "accessibility": results.get("accessibility", {}),
        "backlink": results.get("backlink", {}),
        "competitor": results.get("competitor", {}),
    }
    yield sse_event("complete", full_report)
