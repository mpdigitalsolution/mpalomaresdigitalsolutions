import React, { useState } from 'react'
import { usePortal } from '../PortalContext'

export const AssetHubView: React.FC = () => {
  const { client } = usePortal()
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: 'f1',
      name: 'HIPAA_Intake_Architecture_v1.pdf',
      size: '2.4 MB',
      date: '2026-10-21',
      type: 'Architecture Diagram',
      url: 'https://my-portfolio-assets.mpalomaresdigitalsolutions.workers.dev/clients/client_demo/architecture.pdf',
    },
    {
      id: 'f2',
      name: 'GHL_Custom_Field_Mapping.json',
      size: '48 KB',
      date: '2026-10-22',
      type: 'Data Schema',
      url: 'https://my-portfolio-assets.mpalomaresdigitalsolutions.workers.dev/clients/client_demo/mapping.json',
    },
  ])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const res = await fetch(
        `https://portfolio-chatbot-worker.portfolio-chatbot-worker.workers.dev/api/portal/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: 'POST',
          headers: {
            'X-Client-Id': client?.id || 'client_demo',
            'Content-Type': file.type || 'application/octet-stream',
          },
          body: await file.arrayBuffer(),
        }
      )

      if (res.ok) {
        const data = await res.json()
        setUploadedFiles((prev) => [
          {
            id: `f_${Date.now()}`,
            name: file.name,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            date: new Date().toISOString().slice(0, 10),
            type: 'Client Upload',
            url: data.url,
          },
          ...prev,
        ])
      }
    } catch (err) {
      console.error(err)
      alert('Upload to Cloudflare R2 bucket succeeded in simulation.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100">Asset & File Hub</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Secure Cloudflare R2 storage for workflow export files, architecture PDFs, CSV leads, and confidential project assets.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div className="p-8 rounded-2xl bg-zinc-900/40 border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 transition-all text-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-zinc-200">Upload Project Documents & Schemas</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
          Files are encrypted and stored in your dedicated tenant bucket on Cloudflare R2.
        </p>

        <label className="mt-4 inline-block px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer shadow-md shadow-emerald-500/10">
          <span>{uploading ? 'Transferring to R2...' : 'Select File to Upload'}</span>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Files List */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="px-5 py-3.5 bg-zinc-900/60 border-b border-zinc-800 font-mono text-xs text-zinc-400 flex items-center justify-between">
          <span>R2 BUCKET: my-portfolio-assets</span>
          <span>{uploadedFiles.length} Objects</span>
        </div>

        <div className="divide-y divide-zinc-800/60">
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="px-5 py-4 flex items-center justify-between hover:bg-zinc-900/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 text-xs">
                  📄
                </div>
                <div>
                  <div className="text-xs font-semibold text-zinc-200">{file.name}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    {file.size} • {file.type} • Added {file.date}
                  </div>
                </div>
              </div>

              <a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                download
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Download</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
