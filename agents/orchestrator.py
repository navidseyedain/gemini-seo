import asyncio
from pydantic import BaseModel
from typing import Dict, Any

from agents.crawler import crawl_url
from agents.sub_agents.schema_agent import analyze_schema
from agents.sub_agents.technical_agent import analyze_technical
from agents.sub_agents.eeat_agent import analyze_eeat
from agents.sub_agents.local_agent import analyze_local

class FullAuditReport(BaseModel):
    url: str
    technical: Dict[str, Any]
    schema_report: Dict[str, Any]
    eeat: Dict[str, Any]
    local: Dict[str, Any]

async def run_full_audit(url: str, api_key: str = None) -> FullAuditReport:
    # 1. Crawl the URL to get the base data needed by all agents
    crawl_data = await crawl_url(url)
    
    # 2. Run agents in parallel with small stagger to reduce 503 errors
    #    Each agent starts with a slight delay to avoid thundering herd
    async def staggered_technical():
        return await analyze_technical(crawl_data.html_content, crawl_data.text_content, url, api_key=api_key)
    
    async def staggered_schema():
        await asyncio.sleep(0.5)
        return await analyze_schema(crawl_data.html_content, url, api_key=api_key)
    
    async def staggered_eeat():
        await asyncio.sleep(1.0)
        return await analyze_eeat(crawl_data.text_content, url, api_key=api_key)
    
    async def staggered_local():
        await asyncio.sleep(1.5)
        return await analyze_local(crawl_data.html_content, crawl_data.text_content, url, api_key=api_key)
    
    # Wait for all parallel tasks to finish
    technical_result, schema_result, eeat_result, local_result = await asyncio.gather(
        staggered_technical(),
        staggered_schema(),
        staggered_eeat(),
        staggered_local()
    )
    
    return FullAuditReport(
        url=url,
        technical=technical_result.model_dump(),
        schema_report=schema_result.model_dump(),
        eeat=eeat_result.model_dump(),
        local=local_result.model_dump()
    )
