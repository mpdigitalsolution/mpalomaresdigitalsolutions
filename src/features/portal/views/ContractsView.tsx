import React, { useRef, useState, useEffect } from 'react'
import { usePortal } from '../PortalContext'

export const ContractsView: React.FC = () => {
  const { contracts, client, handleSignContract } = usePortal()
  const contract = contracts[0] // Primary active contract

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [signerName, setSignerName] = useState(client?.name || '')
  const [agreed, setAgreed] = useState(false)
  const [signing, setSigning] = useState(false)

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = '#10b981' // emerald stroke
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [contract?.status])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    setHasDrawn(true)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const touch = 'touches' in e ? e.touches[0] : null
    const clientX = touch ? touch.clientX : (e as React.MouseEvent<HTMLCanvasElement>).clientX
    const clientY = touch ? touch.clientY : (e as React.MouseEvent<HTMLCanvasElement>).clientY
    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const touch = 'touches' in e ? e.touches[0] : null
    const clientX = touch ? touch.clientX : (e as React.MouseEvent<HTMLCanvasElement>).clientX
    const clientY = touch ? touch.clientY : (e as React.MouseEvent<HTMLCanvasElement>).clientY
    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasDrawn(false)
  }

  const onSubmitSignature = async () => {
    if (!contract || !signerName.trim() || !hasDrawn || !agreed) return
    const canvas = canvasRef.current
    if (!canvas) return
    const signatureDataUrl = canvas.toDataURL('image/png')

    setSigning(true)
    try {
      await handleSignContract(contract.id, signerName.trim(), signatureDataUrl)
    } finally {
      setSigning(false)
    }
  }

  if (!contract) {
    return (
      <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-zinc-400 text-xs">
        No contracts on file for this account.
      </div>
    )
  }

  const isSigned = contract.status === 'signed'

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-zinc-100">{contract.title}</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              v{contract.version}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Standard Master Services Agreement governed by agency SLA guidelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs transition-colors flex items-center gap-1.5 print:hidden"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Print / PDF</span>
          </button>

          {isSigned ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Digitally Signed & Validated
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold font-mono">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              Awaiting Signature
            </span>
          )}
        </div>
      </div>

      {/* Contract Viewer Document */}
      <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800/80 shadow-2xl space-y-6 text-zinc-300 font-sans text-xs leading-relaxed max-w-4xl mx-auto">
        <div className="border-b border-zinc-800 pb-4 flex items-center justify-between text-zinc-500 text-[10px] font-mono">
          <span>DOCUMENT REF: {contract.id.toUpperCase()}</span>
          <span>SECURITY CLASSIFICATION: CONFIDENTIAL</span>
        </div>

        <div className="space-y-4 prose prose-invert max-w-none text-zinc-300 text-xs">
          <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800/60 flex justify-between items-center text-xs">
            <div>
              <span className="text-zinc-500">CLIENT:</span>{' '}
              <strong className="text-zinc-200">{client?.company || 'Client Organization'}</strong>
            </div>
            <div>
              <span className="text-zinc-500">AGENCY:</span>{' '}
              <strong className="text-zinc-200">Marlon Palomares Digital Solutions</strong>
            </div>
            <div>
              <span className="text-zinc-500">EFFECTIVE:</span>{' '}
              <strong className="text-zinc-200">October 24, 2026</strong>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wide">1. Scope of Engagement & Automation Infrastructure</h3>
          <p>
            Marlon Palomares Digital Solutions agrees to engineer, test, host, and monitor custom automated workflows, conversational AI webhooks, and CRM data pipeline integrations for the Client. All architecture will be deployed utilizing Cloudflare Workers, n8n automation clusters, and verified GoHighLevel CRM endpoints.
          </p>

          <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wide">2. Deliverables & Acceptance SLA</h3>
          <p>
            The Agency shall deliver functional workflow snapshots, API connectors, and automated patient intake pipelines as detailed in the active sprint backlog. The Client shall have 14 business days from delivery notification to review and test within the Client Portal.
          </p>

          <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wide">3. Intellectual Property & Confidentiality</h3>
          <p>
            All custom CRM snapshots, private client customer records, API authentication tokens, and business configurations created under this agreement remain 100% the exclusive property of the Client. Data transmitted across Cloudflare Edge endpoints is encrypted at rest and in transit via TLS 1.3.
          </p>

          <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wide">4. Financial Terms</h3>
          <p>
            Monthly retainer services are billed at the beginning of each billing cycle according to the agreed upon proposal tier. Invoices are payable within 15 days of portal notification.
          </p>
        </div>

        {/* Signature Section */}
        <div className="mt-8 pt-6 border-t border-zinc-800">
          {isSigned ? (
            <div className="p-6 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Cryptographic Audit Stamp
                </div>
                <div className="text-xs text-zinc-300">
                  Digitally signed by <span className="font-semibold text-white">{contract.signer_name}</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  Timestamp: {contract.signed_at ? new Date(contract.signed_at).toLocaleString() : 'Recent'} • IP Verified
                </div>
              </div>

              {/* Render Signature Image */}
              {contract.signer_signature && (
                <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
                  <div className="text-[9px] font-mono text-zinc-500 mb-1">SIGNATURE SEAL:</div>
                  <img
                    src={contract.signer_signature}
                    alt="Digital Signature"
                    className="h-12 w-auto max-w-[200px] object-contain filter invert opacity-90"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-zinc-100">Digital Signature Studio</h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Draw your signature in the canvas below to execute this agreement.
                </p>
              </div>

              {/* Signer Name Input */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Full Legal Signer Name</label>
                <input
                  type="text"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  placeholder="e.g. Authorized Signatory"
                  className="w-full max-w-sm px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* HTML5 Canvas Drawing Pad */}
              <div>
                <div className="flex items-center justify-between mb-1 max-w-md">
                  <label className="text-xs font-medium text-zinc-300">Draw Signature</label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[10px] text-zinc-400 hover:text-zinc-200 underline"
                  >
                    Clear Canvas
                  </button>
                </div>
                <div className="w-full max-w-md h-32 rounded-lg bg-zinc-950 border border-zinc-800 relative cursor-crosshair overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={448}
                    height={128}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-full"
                  />
                  {!hasDrawn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-zinc-600 text-xs italic">
                      Sign with finger or mouse here...
                    </div>
                  )}
                </div>
              </div>

              {/* Legal Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="agree-checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-900"
                />
                <label htmlFor="agree-checkbox" className="text-xs text-zinc-400 select-none">
                  I confirm that I am authorized to bind {client?.company || 'Client Organization'} and that this digital signature is legally binding under the Electronic Signatures in Global and National Commerce Act (ESIGN).
                </label>
              </div>

              {/* Submit Button */}
              <button
                onClick={onSubmitSignature}
                disabled={!agreed || !hasDrawn || !signerName.trim() || signing}
                className="mt-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                {signing ? 'Submitting to D1 Database...' : 'Apply Signature & Finalize Agreement'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
