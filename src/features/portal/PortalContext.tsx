import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type {
  ClientRecord,
  OnboardingStepRecord,
  ContractRecord,
  InvoiceRecord,
  ChatMessageRecord,
  ApprovalRecord,
  AgencyAdminData,
} from './types'
import {
  fetchClients,
  fetchPortalDashboard,
  completeOnboardingStep,
  signContractDocument,
  sendChatMessage,
  decideDeliverableApproval,
  settleInvoice,
  fetchAgencyAdminData,
  createAdminInvoice,
  createAdminDeliverable,
  createAdminClient,
} from './portalApi'

export type PortalTab =
  | 'overview'
  | 'onboarding'
  | 'contracts'
  | 'invoices'
  | 'chat'
  | 'approvals'
  | 'assets'
  | 'telemetry'
  | 'admin'

interface PortalContextType {
  client: ClientRecord | null
  clientId: string
  setClientId: (id: string) => void
  availableClients: ClientRecord[]
  portalRole: 'client' | 'admin'
  setPortalRole: (role: 'client' | 'admin') => void
  mobileNavOpen: boolean
  setMobileNavOpen: (open: boolean) => void
  loading: boolean
  error: string | null
  activeTab: PortalTab
  setActiveTab: (tab: PortalTab) => void
  onboardingSteps: OnboardingStepRecord[]
  contracts: ContractRecord[]
  invoices: InvoiceRecord[]
  messages: ChatMessageRecord[]
  approvals: ApprovalRecord[]
  adminData: AgencyAdminData | null
  refreshData: (silent?: boolean) => Promise<void>
  handleCompleteStep: (stepId: string, submittedData?: Record<string, unknown>) => Promise<void>
  handleSignContract: (contractId: string, signerName: string, signature: string) => Promise<void>
  handleSendMessage: (messageText: string) => Promise<void>
  handleApprovalDecision: (approvalId: string, status: 'approved' | 'revisions_requested', notes?: string) => Promise<void>
  handlePayInvoice: (invoiceId: string) => Promise<void>
  handleCreateInvoice: (data: {
    clientId: string
    invoiceNumber: string
    description: string
    amountCents: number
    dueDate: string
    stripePaymentUrl?: string
  }) => Promise<void>
  handleCreateDeliverable: (data: {
    clientId: string
    deliverableName: string
    deliverableType: string
    version: string
    description: string
    previewUrl?: string
  }) => Promise<void>
  handleCreateClient: (data: {
    name: string
    company: string
    email: string
    passkey: string
    projectName: string
    tier: string
  }) => Promise<ClientRecord>
  logout: () => void
}

const PortalContext = createContext<PortalContextType | null>(null)

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clientId, setClientIdState] = useState<string>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const urlClient = urlParams.get('client') || urlParams.get('workspace')
      if (urlClient) {
        if (urlClient === 'client_demo' || urlClient === 'client_resilience') {
          localStorage.removeItem('mp_portal_client_id')
          return ''
        }
        localStorage.setItem('mp_portal_client_id', urlClient)
        return urlClient
      }
    } catch {
      // ignore
    }
    const stored = localStorage.getItem('mp_portal_client_id') || ''
    if (stored === 'client_demo' || stored === 'client_resilience') {
      localStorage.removeItem('mp_portal_client_id')
      return ''
    }
    return stored
  })
  const [portalRole, setPortalRoleState] = useState<'client' | 'admin'>(() => {
    return (localStorage.getItem('mp_portal_role') as 'client' | 'admin') || 'client'
  })
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [availableClients, setAvailableClients] = useState<ClientRecord[]>([])
  const [activeTab, setActiveTabState] = useState<PortalTab>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('tab') as PortalTab) return urlParams.get('tab') as PortalTab
      if (urlParams.get('key') || urlParams.get('onboarding')) return 'onboarding'
    } catch {
      // ignore
    }
    return 'overview'
  })
  const [client, setClient] = useState<ClientRecord | null>(null)
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStepRecord[]>([])
  const [contracts, setContracts] = useState<ContractRecord[]>([])
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([])
  const [messages, setMessages] = useState<ChatMessageRecord[]>([])
  const [approvals, setApprovals] = useState<ApprovalRecord[]>([])
  const [adminData, setAdminData] = useState<AgencyAdminData | null>(null)
  const [loading, setLoading] = useState<boolean>(() => {
    return !!(localStorage.getItem('mp_portal_client_id'))
  })
  const [error, setError] = useState<string | null>(null)

  const logout = useCallback(() => {
    localStorage.removeItem('mp_portal_client_id')
    localStorage.removeItem('mp_portal_role')
    setClientIdState('')
    setClient(null)
    setActiveTabState('overview')
    setPortalRoleState('client')
  }, [])

  const setPortalRole = (role: 'client' | 'admin') => {
    setPortalRoleState(role)
    localStorage.setItem('mp_portal_role', role)
    if (role === 'admin') {
      setActiveTabState('admin')
    } else if (activeTab === 'admin') {
      setActiveTabState('overview')
    }
  }

  const setActiveTab = (tab: PortalTab) => {
    setActiveTabState(tab)
    setMobileNavOpen(false) // auto close on mobile tab click
  }

  const setClientId = (newId: string) => {
    if (!newId) {
      logout()
      return
    }
    if (newId === clientId) {
      refreshData(false)
      return
    }
    setClientIdState(newId)
    localStorage.setItem('mp_portal_client_id', newId)
  }

  // Fetch list of available clients
  useEffect(() => {
    fetchClients().then((cls) => {
      if (cls && cls.length > 0) setAvailableClients(cls)
    }).catch(console.warn)
  }, [])

  const refreshData = useCallback(async (silent = false) => {
    if (!clientId) {
      setLoading(false)
      setClient(null)
      return
    }
    try {
      if (!silent) setLoading(true)
      setError(null)
      const [dashData, aData] = await Promise.all([
        fetchPortalDashboard(clientId),
        fetchAgencyAdminData().catch(() => null),
      ])
      setClient(dashData.client)
      setOnboardingSteps(dashData.onboardingSteps || [])
      setContracts(dashData.contracts || [])
      setInvoices(dashData.invoices || [])
      setMessages(dashData.messages || [])
      setApprovals(dashData.approvals || [])
      if (aData) setAdminData(aData)
    } catch (err: unknown) {
      console.warn('Portal refresh notice:', err)
      // If client workspace not found or purged from D1, automatically clear obsolete session
      // so user immediately and seamlessly sees the clean Sign In / Register view.
      localStorage.removeItem('mp_portal_client_id')
      setClientIdState('')
      setClient(null)
      if (!silent) {
        setError(null)
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [clientId])

  // Initial and client change fetch
  useEffect(() => {
    if (clientId) {
      refreshData(false)
    } else {
      setLoading(false)
      setClient(null)
    }
  }, [clientId, refreshData])

  // Background interval sync (Task 2: 15-second background polling)
  useEffect(() => {
    if (!clientId) return
    const interval = setInterval(() => {
      refreshData(true)
    }, 15000)
    return () => clearInterval(interval)
  }, [clientId, refreshData])

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
    const sender = portalRole === 'admin' ? 'agency' : 'client'
    const senderName = portalRole === 'admin' ? 'Marlon Palomares' : client.name
    const tempMsg: ChatMessageRecord = {
      id: `temp_${Date.now()}`,
      client_id: client.id,
      sender,
      sender_name: senderName,
      message_text: messageText,
      attachment_url: null,
      read_at: null,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, tempMsg])
    try {
      const realMsg = await sendChatMessage(client.id, sender, senderName, messageText)
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

  // Settle invoice
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

  // Admin Actions
  const handleCreateInvoice = async (data: {
    clientId: string
    invoiceNumber: string
    description: string
    amountCents: number
    dueDate: string
    stripePaymentUrl?: string
  }) => {
    await createAdminInvoice(data)
    await refreshData(true)
  }

  const handleCreateDeliverable = async (data: {
    clientId: string
    deliverableName: string
    deliverableType: string
    version: string
    description: string
    previewUrl?: string
  }) => {
    await createAdminDeliverable(data)
    await refreshData(true)
  }

  const handleCreateClient = async (data: {
    name: string
    company: string
    email: string
    passkey: string
    projectName: string
    tier: string
  }): Promise<ClientRecord> => {
    const created = await createAdminClient(data)
    setAvailableClients((prev) => [created, ...prev])
    await refreshData(true)
    return created
  }

  return (
    <PortalContext.Provider
      value={{
        client,
        clientId,
        setClientId,
        availableClients,
        portalRole,
        setPortalRole,
        mobileNavOpen,
        setMobileNavOpen,
        loading,
        error,
        activeTab,
        setActiveTab,
        onboardingSteps,
        contracts,
        invoices,
        messages,
        approvals,
        adminData,
        refreshData,
        handleCompleteStep,
        handleSignContract,
        handleSendMessage,
        handleApprovalDecision,
        handlePayInvoice,
        handleCreateInvoice,
        handleCreateDeliverable,
        handleCreateClient,
        logout,
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
