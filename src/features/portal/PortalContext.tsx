import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type {
  ClientRecord,
  PortalDashboardData,
  OnboardingStepRecord,
  ContractRecord,
  InvoiceRecord,
  ChatMessageRecord,
  ApprovalRecord,
} from './types'
import {
  fetchClients,
  fetchPortalDashboard,
  completeOnboardingStep,
  signContractDocument,
  sendChatMessage,
  decideDeliverableApproval,
  settleInvoice,
} from './portalApi'

interface PortalContextType {
  client: ClientRecord | null
  clientId: string
  setClientId: (id: string) => void
  availableClients: ClientRecord[]
  loading: boolean
  error: string | null
  activeTab: 'overview' | 'onboarding' | 'contracts' | 'invoices' | 'chat' | 'approvals' | 'assets'
  setActiveTab: (tab: 'overview' | 'onboarding' | 'contracts' | 'invoices' | 'chat' | 'approvals' | 'assets') => void
  onboardingSteps: OnboardingStepRecord[]
  contracts: ContractRecord[]
  invoices: InvoiceRecord[]
  messages: ChatMessageRecord[]
  approvals: ApprovalRecord[]
  refreshData: (silent?: boolean) => Promise<void>
  handleCompleteStep: (stepId: string, submittedData?: Record<string, unknown>) => Promise<void>
  handleSignContract: (contractId: string, signerName: string, signature: string) => Promise<void>
  handleSendMessage: (messageText: string) => Promise<void>
  handleApprovalDecision: (approvalId: string, status: 'approved' | 'revisions_requested', notes?: string) => Promise<void>
  handlePayInvoice: (invoiceId: string) => Promise<void>
}

const PortalContext = createContext<PortalContextType | null>(null)

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientId, setClientIdState] = useState<string>(() => {
    return localStorage.getItem('mp_portal_client_id') || 'client_demo'
  })
  const [availableClients, setAvailableClients] = useState<ClientRecord[]>([])
  const [activeTab, setActiveTab] = useState<
    'overview' | 'onboarding' | 'contracts' | 'invoices' | 'chat' | 'approvals' | 'assets'
  >('overview')
  const [client, setClient] = useState<ClientRecord | null>(null)
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStepRecord[]>([])
  const [contracts, setContracts] = useState<ContractRecord[]>([])
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [messages, setMessages] = useState<ChatMessageRecord[]>([])
  const [approvals, setApprovals] = useState<ApprovalRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const setClientId = (newId: string) => {
    setClientIdState(newId)
    localStorage.setItem('mp_portal_client_id', newId)
    setLoading(true)
  }

  // Fetch list of available clients
  useEffect(() => {
    fetchClients().then((cls) => {
      if (cls && cls.length > 0) setAvailableClients(cls)
    }).catch(console.warn)
  }, [])

  const refreshData = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      setError(null)
      const data: PortalDashboardData = await fetchPortalDashboard(clientId)
      setClient(data.client)
      setOnboardingSteps(data.onboardingSteps || [])
      setContracts(data.contracts || [])
      setInvoices(data.invoices || [])
      setMessages(data.messages || [])
      setApprovals(data.approvals || [])
    } catch (err: unknown) {
      console.error('Portal refresh error:', err)
      if (!silent) {
        setError(err instanceof Error ? err.message : 'Failed to connect to edge portal')
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [clientId])

  // Initial and client change fetch
  useEffect(() => {
    refreshData(false)
  }, [refreshData])

  // Background interval sync (Task 2: 15-second background polling)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData(true)
    }, 15000)
    return () => clearInterval(interval)
  }, [refreshData])

  // Step Completion
  const handleCompleteStep = async (stepId: string, submittedData?: Record<string, unknown>) => {
    if (!client) return
    setOnboardingSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, status: 'completed', completed_at: new Date().toISOString() } : s))
    )
    try {
      await completeOnboardingStep(client.id, stepId, 'completed', submittedData)
      await refreshData(true)
    } catch (err) {
      console.error(err)
      refreshData(false)
    }
  }

  // Contract Signature
  const handleSignContract = async (contractId: string, signerName: string, signature: string) => {
    if (!client) return
    const now = new Date().toISOString()
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? {
              ...c,
              status: 'signed',
              signer_name: signerName,
              signer_signature: signature,
              signed_at: now,
            }
          : c
      )
    )
    try {
      await signContractDocument(client.id, contractId, signerName, signature)
      await refreshData(true)
    } catch (err) {
      console.error(err)
      refreshData(false)
    }
  }

  // Chat message send
  const handleSendMessage = async (messageText: string) => {
    if (!client || !messageText.trim()) return
    const tempMsg: ChatMessageRecord = {
      id: `temp_${Date.now()}`,
      client_id: client.id,
      sender: 'client',
      sender_name: client.name,
      message_text: messageText,
      attachment_url: null,
      read_at: null,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempMsg])
    try {
      const realMsg = await sendChatMessage(client.id, 'client', client.name, messageText)
      setMessages((prev) => prev.map((m) => (m.id === tempMsg.id ? realMsg : m)))
    } catch (err) {
      console.error(err)
      refreshData(true)
    }
  }

  // Deliverable approval decision
  const handleApprovalDecision = async (
    approvalId: string,
    status: 'approved' | 'revisions_requested',
    notes?: string
  ) => {
    if (!client) return
    const now = new Date().toISOString()
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === approvalId
          ? {
              ...a,
              status,
              client_notes: notes || null,
              decided_at: now,
            }
          : a
      )
    )
    try {
      await decideDeliverableApproval(client.id, approvalId, status, notes)
      await refreshData(true)
    } catch (err) {
      console.error(err)
      refreshData(false)
    }
  }

  // Settle invoice (Task 4)
  const handlePayInvoice = async (invoiceId: string) => {
    if (!client) return
    const now = new Date().toISOString()
    setInvoices((prev) =>
      prev.map((i) => (i.id === invoiceId ? { ...i, status: 'paid', paid_at: now } : i))
    )
    try {
      await settleInvoice(client.id, invoiceId)
      await refreshData(true)
    } catch (err) {
      console.error(err)
      refreshData(false)
    }
  }

  return (
    <PortalContext.Provider
      value={{
        client,
        clientId,
        setClientId,
        availableClients,
        loading,
        error,
        activeTab,
        setActiveTab,
        onboardingSteps,
        contracts,
        invoices,
        messages,
        approvals,
        refreshData,
        handleCompleteStep,
        handleSignContract,
        handleSendMessage,
        handleApprovalDecision,
        handlePayInvoice,
      }}
    >
      {children}
    </PortalContext.Provider>
  )
}

export function usePortal() {
  const context = useContext(PortalContext)
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider')
  }
  return context
}
