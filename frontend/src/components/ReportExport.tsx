import React from 'react'
import { Download, Printer } from 'lucide-react'

interface ReportExportProps {
  report: any
}

export const ReportExport: React.FC<ReportExportProps> = ({ report }) => {
  const handleDownloadJson = () => {
    if (!report) return
    const domain = report.url ? new URL(report.url).hostname.replace(/[^a-z0-9]/gi, '_') : 'report'
    const fileName = `seo-audit-${domain}-${Date.now()}.json`
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", fileName)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex items-center gap-3 no-print">
      <button
        onClick={handleDownloadJson}
        className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        title="Download full audit data as JSON"
      >
        <Download className="w-4 h-4 mr-2 text-slate-500" />
        Download JSON
      </button>
      <button
        onClick={handlePrint}
        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        title="Print or Save as PDF"
      >
        <Printer className="w-4 h-4 mr-2" />
        Print / PDF
      </button>
    </div>
  )
}
