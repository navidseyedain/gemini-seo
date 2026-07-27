import os
import json
from fastapi import FastAPI, HTTPException, Depends, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import uuid
from typing import Dict, Any

import models
from database import engine, get_db
from agents.orchestrator import run_full_audit
from sse_audit import stream_audit

load_dotenv()

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gemini SEO API v2")

tasks: Dict[str, Any] = {}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AuditRequest(BaseModel):
    url: str

class AuditStartRequest(BaseModel):
    url: str
    geminiKey: str = ""
    googleApiKey: str = ""
    searchConsoleJson: str = ""
    firecrawlKey: str = ""
    openpagerankKey: str = ""

@app.post("/api/audit/start")
async def start_audit(req: AuditStartRequest):
    url = req.url
    if not url.startswith("http"):
        url = "https://" + url
        
    task_id = str(uuid.uuid4())
    tasks[task_id] = {
        "url": url,
        "geminiKey": req.geminiKey,
        "googleApiKey": req.googleApiKey,
        "searchConsoleJson": req.searchConsoleJson,
        "firecrawlKey": req.firecrawlKey,
        "openpagerankKey": req.openpagerankKey,
    }
    return {"task_id": task_id}

@app.post("/api/audit")
async def create_audit(req: AuditRequest, x_api_key: str = Header(None), db: Session = Depends(get_db)):
    url = req.url
    if not url.startswith("http"):
        url = "https://" + url

    api_key = x_api_key or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API Key is missing. Please provide it in settings.")

    try:
        # Run the multi-agent orchestrator
        audit_report = await run_full_audit(url, api_key)
        report_data = audit_report.model_dump()
        
        # Calculate a basic score from technical agent for now
        score = report_data.get("technical", {}).get("score", 0)

        # Save to DB
        db_report = models.SEOReport(
            url=url, 
            score=score, 
            report_json=json.dumps(report_data)
        )
        db.add(db_report)
        db.commit()
        db.refresh(db_report)

        return {"id": db_report.id, "url": db_report.url, "data": report_data}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"AI Analysis Failed: {str(e)}")


@app.get("/api/audit/stream/{task_id}")
async def stream_audit_sse_task(task_id: str, db: Session = Depends(get_db)):
    """SSE streaming endpoint - sends real-time progress as each agent completes."""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
        
    task_data = tasks[task_id]
    url = task_data["url"]
    gemini_key = task_data["geminiKey"] or os.getenv("GEMINI_API_KEY")
    google_api_key = task_data["googleApiKey"]
    gsc_json = task_data["searchConsoleJson"]
    firecrawl_key = task_data["firecrawlKey"]
    openpagerank_key = task_data.get("openpagerankKey", "")

    if not gemini_key:
        raise HTTPException(status_code=400, detail="Gemini API Key is missing.")

    async def event_generator():
        full_report = None
        async for event in stream_audit(url, gemini_key, google_api_key, gsc_json, firecrawl_key, openpagerank_key):
            yield event
            # Capture the complete event to save to DB
            if event.startswith("event: complete"):
                data_line = event.split("data: ", 1)[1].strip()
                full_report = json.loads(data_line)
        
        # Save completed report to DB
        if full_report:
            try:
                technical_data = full_report.get("technical") or {}
                score = technical_data.get("score", 0)
                db_report = models.SEOReport(
                    url=url,
                    score=score,
                    report_json=json.dumps(full_report),
                )
                db.add(db_report)
                db.commit()
            except Exception as e:
                print(f"Error saving to DB: {e}")
                pass  # Don't fail the stream if DB save fails

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/api/reports")
def list_reports(db: Session = Depends(get_db)):
    reports = db.query(models.SEOReport).order_by(models.SEOReport.created_at.desc()).all()
    return [{"id": r.id, "url": r.url, "score": r.score, "created_at": str(r.created_at)} for r in reports]

@app.get("/api/reports/{report_id}")
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(models.SEOReport).filter(models.SEOReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"id": report.id, "url": report.url, "data": json.loads(report.report_json)}

@app.delete("/api/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(models.SEOReport).filter(models.SEOReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(report)
    db.commit()
    return {"status": "deleted", "id": report_id}
