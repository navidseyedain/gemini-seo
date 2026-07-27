from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class SEOReport(Base):
    __tablename__ = "seo_reports"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    score = Column(Integer)
    # Storing the full raw JSON report to be easily served to frontend
    report_json = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
