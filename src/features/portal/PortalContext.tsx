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
  fetchPortalDashboard,
  completeOnboardingStep,
  signContractDocument,
  sendChatMessage,
  decideDeliverableApproval,
} from './portalApi'

interface PortalContextType {
  client: ClientRecord | null
  loading: boolean
  error: string | null
  activeTab: 'overview' | 'onboarding' | 'contracts' | 'invoices' | 'chat' | 'approvals' | 'assets'
  setActiveTab: (tab: 'overview' | 'onboarding' | 'contracts' | 'invoices' | 'chat' | 'approvals' | 'assets') => void
  onboardingSteps: OnboardingStepRecord[]
  contracts: ContractRecord[]
  invoices: InvoiceRecord[]
  messages: ChatMessageRecord[]
  approvals: ApprovalRecord[]
  refreshData: () => Promise<void>
  handleCompleteStep: (stepId: string, submittedData?: Record<string, unknown>) => Promise<void>
  handleSignContract: (contractId: string, signerName: string, signature: string) => Promise<void>
  handleSendMessage: (messageText: string) => Promise<void>
  handleApprovalDecision: (approvalId: string, status: 'approved' | 'revisions_requested', notes?: string) => Promise<void>
}

const PortalContext = createContext<PortalContextType | null>(null)

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientId] = useState<string>('client_demo')
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

  const refreshData = useCallback(async () => {
    try {
      setLoading(true)
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
      setError(err instanceof Error ? err.message : 'Failed to connect to edge portal')
    } finally {
      setLoading(false)
    }
  }, [clientId])

  useEffect(() => {
    refreshData()
  }, [refreshData])

  // Step Completion
  const handleCompleteStep = async (stepId: string, submittedData?: Record<string, unknown>) => {
    if (!client) return
    // Optimistic UI update
    setOnboardingSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, status: 'completed', completed_at: new Date().toISOString() } : s))
    )
    try {
      await completeOnboardingStep(client.id, stepId, 'completed', submittedData)
    } catch (err) {
      console.error(err)
      refreshData()
    }
  }

  // Contract Signature
  const handleSignContract = async (contractId: string, signerName: string, signature: string) => {
    if (!client) return
    const now = new Date().toISOString()
    // Optimistic
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
      await refreshData()
    } catch (err) {
      console.error(err)
      refreshData()
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
      refreshData()
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
      await refreshData()
    } catch (err) {
      console.error(err)
      refreshData()
    }
  }

  return (
    <PortalContext.Provider
      value={{
        client,
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
