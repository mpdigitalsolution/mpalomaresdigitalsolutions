import React, { useState } from 'react'
import { usePortal } from '../PortalContext'
import type { InvoiceRecord } from '../types'

export const InvoicesView: React.FC = () => {
  const { invoices, client } = usePortal()
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null)

  const totalPaid = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount_cents, 0)
  const totalOutstanding = invoices
    .filter((i) => i.status !== 'paid')
    .reduce((sum, i) => sum + i.amount_cents, 0)

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-zinc-100">Billing & Invoices</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Review milestone statements, manage recurring retainers, and settle sprint invoices via Stripe or Wire transfer.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs font-medium text-zinc-400">Total Settled</div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-400">
            ${(totalPaid / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[10px] text-zinc-500">Processed through Stripe</div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs font-medium text-zinc-400">Outstanding Balance</div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-400">
            ${(totalOutstanding / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-[10px] text-zinc-500">Net 15 Terms</div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs font-medium text-zinc-400">Billing Entity</div>
          <div className="mt-2 text-sm font-semibold text-zinc-200">{client?.company || 'Apex Health Partners'}</div>
          <div className="mt-1 text-[10px] text-zinc-500 font-mono">Currency: USD ($)</div>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 text-zinc-400 border-b border-zinc-800 font-mono text-[10px] uppercase">
              <tr>
                <th className="px-5 py-3.5">Invoice #</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Due Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {invoices.map((inv) => {
                const isPaid = inv.status === 'paid'

                return (
                  <tr key={inv.id} className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-5 py-4 font-mono font-medium text-zinc-200">
                      {inv.invoice_number}
                    </td>
                    <td className="px-5 py-4 text-zinc-300 max-w-xs">{inv.description}</td>
                    <td className="px-5 py-4 font-mono font-bold text-zinc-100">
                      ${(inv.amount_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-4 text-zinc-400 font-mono text-[11px]">
                      {inv.due_date}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                          isPaid
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPaid ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                          }`}
                        />
                        {isPaid ? 'Paid' : 'Due Soon'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {isPaid ? (
                        <button
                          onClick={() => alert(`Receipt downloaded for ${inv.invoice_number} from Cloudflare R2.`)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs transition-colors"
                        >
                          Download Receipt
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm"
                        >
                          Pay Now
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Now Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-zinc-100">Settle Invoice</h3>
              <span className="font-mono text-xs text-zinc-400">{selectedInvoice.invoice_number}</span>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
              <div className="text-xs text-zinc-400">Total Amount Due</div>
              <div className="text-3xl font-extrabold font-mono text-zinc-100 mt-1">
                ${(selectedInvoice.amount_cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-zinc-500 mt-1">{selectedInvoice.description}</div>
            </div>

            <div className="mt-4 space-y-3">
              <a
                href={selectedInvoice.stripe_payment_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                Pay via Stripe Checkout (Credit Card / Apple Pay)
              </a>

              <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
                <div className="font-semibold text-zinc-300">Domestic & International Wire Transfer:</div>
                <div className="font-mono text-[10px]">Bank: Mercury Technologies Inc.</div>
                <div className="font-mono text-[10px]">Account Name: Marlon Palomares Digital Solutions</div>
                <div className="font-mono text-[10px]">Routing (ACH): 021000021</div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
