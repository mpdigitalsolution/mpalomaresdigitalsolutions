import React, { useState, useRef } from 'react'
import { usePortal } from '../PortalContext'
import { loginWithPasskey, createAdminClient } from '../portalApi'
import type { ClientRecord } from '../types'

interface PortalAuthViewProps {
  onLoginSuccess?: (client: ClientRecord) => void
}

export const PortalAuthView: React.FC<PortalAuthViewProps> = () => {
  const { setClientId, availableClients } = usePortal()

  // Mode: 'login' | 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)

  // Validation & Error states
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [emailShaking, setEmailShaking] = useState(false)
  const [passwordShaking, setPasswordShaking] = useState(false)

  // Submit animation states
  const [submitting, setSubmitting] = useState(false)
  const [signedInSuccess, setSignedInSuccess] = useState(false)

  // Sign up states
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [newPasskey, setNewPasskey] = useState('')
  const [projectName, setProjectName] = useState('')
  const [tier, setTier] = useState('Enterprise Automation Retainer')
  const [signupError, setSignupError] = useState<string | null>(null)

  const emailInputRef = useRef<HTMLInputElement>(null)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Validation logic
  const validateEmail = (): boolean => {
    const val = email.trim()
    if (!val) {
      setEmailError('Email address or client passkey is required.')
      setEmailShaking(true)
      setTimeout(() => setEmailShaking(false), 400)
      return false
    }
    // Allow passkeys or valid emails
    if (!val.includes('@') && val.length < 3) {
      setEmailError('Please enter a valid email or passkey.')
      setEmailShaking(true)
      setTimeout(() => setEmailShaking(false), 400)
      return false
    }
    if (val.includes('@') && !emailRegex.test(val)) {
      setEmailError('Please enter a valid email address.')
      setEmailShaking(true)
      setTimeout(() => setEmailShaking(false), 400)
      return false
    }
    setEmailError(null)
    return true
  }

  const validatePassword = (): boolean => {
    const val = password.trim()
    if (!val) {
      setPasswordError('Password is required.')
      setPasswordShaking(true)
      setTimeout(() => setPasswordShaking(false), 400)
      return false
    }
    if (val.length < 4) {
      setPasswordError('Password must be at least 4 characters.')
      setPasswordShaking(true)
      setTimeout(() => setPasswordShaking(false), 400)
      return false
    }
    setPasswordError(null)
    return true
  }

  // Handle Login Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()

    if (!isEmailValid || !isPasswordValid) {
      if (!isEmailValid) emailInputRef.current?.focus()
      else passwordInputRef.current?.focus()
      return
    }

    setSubmitting(true)
    setEmailError(null)
    setPasswordError(null)

    try {
      // Connect to Cloudflare D1 via passkey or email
      const credentialsToTest = password.trim() || email.trim()
      let clientRecord: ClientRecord | null = null

      try {
        clientRecord = await loginWithPasskey(credentialsToTest)
      } catch {
        // Fallback check against loaded available clients
        const found = availableClients.find(
          (c) =>
            c.email.toLowerCase() === email.trim().toLowerCase() ||
            c.passkey === credentialsToTest
        )
        if (found) clientRecord = found
      }

      if (!clientRecord) {
        throw new Error('Workspace not found or passkey incorrect. Please check your credentials or contact Marlon Palomares.')
      }

      // Success animation
      setSubmitting(false)
      setSignedInSuccess(true)

      setTimeout(() => {
        setClientId(clientRecord!.id)
      }, 700)
    } catch (err: unknown) {
      setSubmitting(false)
      setPasswordError(err instanceof Error ? err.message : 'Invalid credentials. Please verify your workspace passkey.')
      setPasswordShaking(true)
      setTimeout(() => setPasswordShaking(false), 400)
    }
  }

  // Handle Quick SSO Demo
  const handleQuickSSO = () => {
    const firstClient = availableClients[0]
    if (firstClient) {
      setSubmitting(true)
      setTimeout(() => {
        setSubmitting(false)
        setSignedInSuccess(true)
        setTimeout(() => {
          setClientId(firstClient.id)
        }, 600)
      }, 700)
    } else {
      setEmailError('No provisioned client workspace found yet. Use Sign up tab to create one.')
      setEmailShaking(true)
      setTimeout(() => setEmailShaking(false), 400)
    }
  }

  // Handle Sign up submission
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company.trim() || !signupEmail.trim() || !newPasskey.trim()) {
      setSignupError('Please fill in company name, email, and a passkey.')
      return
    }

    setSubmitting(true)
    setSignupError(null)

    try {
      const created = await createAdminClient({
        company: company.trim(),
        name: name.trim() || 'Lead Executive',
        email: signupEmail.trim(),
        passkey: newPasskey.trim(),
        projectName: projectName.trim() || `${company.trim()} AI Automation Suite`,
        tier,
      })
      setSubmitting(false)
      setSignedInSuccess(true)
      setTimeout(() => {
        setClientId(created.id)
      }, 700)
    } catch (err: unknown) {
      setSubmitting(false)
      setSignupError(err instanceof Error ? err.message : 'Failed to register workspace.')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* LEFT COLUMN: 46% Inset Brand Panel (hidden < 760px)           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col justify-between relative overflow-hidden shrink-0"
        style={{
          width: '46%',
          margin: '14px',
          borderRadius: '22px',
          padding: '40px',
          background: 'linear-gradient(160deg, #059669 0%, #064e3b 50%, #022c22 100%)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        }}
        aria-label="Brand Overview and Telemetry"
      >
        {/* Soft lighter radial glow in top right */}
        <div
          className="absolute -top-16 -right-16 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.28) 0%, transparent 70%)',
          }}
        />

        {/* Faint dot grid 22px apart with fade-out mask */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.18) 1.2px, transparent 1.2px)',
            backgroundSize: '22px 22px',
            WebkitMaskImage: 'linear-gradient(to bottom, black 35%, transparent 92%)',
            maskImage: 'linear-gradient(to bottom, black 35%, transparent 92%)',
          }}
          aria-hidden="true"
        />

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center font-extrabold text-white text-base shadow-sm">
            MP
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight">MP Digital Solutions</div>
            <div className="text-xs text-white/70 font-mono">Cloudflare Edge Operations OS</div>
          </div>
        </div>

        {/* Middle: 3 Frosted Product Cards with Staggered 7s Float Loop */}
        <div className="relative z-10 flex flex-col gap-4 max-w-sm my-auto">
          {/* Card 1: Edge Webhook SLA */}
          <div
            className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl transition-transform animate-[floatCard_7s_ease-in-out_infinite]"
            style={{ animationDelay: '0s' }}
            role="status"
            aria-label="Edge Webhook SLA Telemetry"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/25 border border-emerald-400/40 flex items-center justify-center text-emerald-200 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Edge Webhook SLA</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-semibold">
                    99.9% Uptime
                  </span>
                </div>
                <span className="text-[11px] text-white/70 mt-0.5">Sub-25ms routing across APAC & US Edge</span>
              </div>
            </div>
          </div>

          {/* Card 2: Zero-Egress Database with 7-bar breathing chart */}
          <div
            className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl transition-transform animate-[floatCard_7s_ease-in-out_infinite] self-end w-[92%]"
            style={{ animationDelay: '-2.3s' }}
            role="region"
            aria-label="Database throughput metric"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-mono tracking-wider text-white/65">
                  Tenant Isolation
                </span>
                <span className="text-xl font-bold text-white tracking-tight">Zero-Egress D1</span>
              </div>

              {/* 7-bar chart with breathing animation */}
              <div className="flex items-end gap-1.5 h-9" aria-label="7-day activity bar chart">
                {[18, 26, 22, 34, 28, 36, 32].map((height, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 rounded-full bg-gradient-to-t from-white/30 to-emerald-200 origin-bottom animate-[barBreathe_3.5s_ease-in-out_infinite_alternate]"
                    style={{
                      height: `${height}px`,
                      animationDelay: `${-idx * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Engineering Desk Status */}
          <div
            className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl transition-transform animate-[floatCard_7s_ease-in-out_infinite] w-[88%]"
            style={{ animationDelay: '-4.6s' }}
            role="status"
            aria-label="Engineering Desk presence"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#34d399]" />
                <span className="text-xs font-bold text-white">Engineering Desk Online</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/15 text-white/90">
                  Ready to Dispatch
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Agency Value Proposition Quote */}
        <div className="relative z-10 border-t border-white/15 pt-5">
          <blockquote className="text-xs sm:text-sm text-white/90 italic leading-relaxed">
            "Custom n8n pipelines, high-converting GoHighLevel infrastructure, and edge-native AI automations engineered for scalable operations."
          </blockquote>
          <div className="mt-2 text-xs font-semibold text-white">Marlon Palomares</div>
          <div className="text-[11px] text-white/65">Founder & Lead Systems Architect</div>
        </div>
      </aside>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* RIGHT COLUMN: 54% (100% on mobile) Centered 360px Form       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative">
        <a
          href="/"
          className="absolute top-6 right-6 sm:top-8 sm:right-8 text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors font-mono"
        >
          <span>←</span> Back to Portfolio
        </a>

        {/* Small mobile logo (visible < 760px) */}
        <div className="md:hidden flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-sm">
            MP
          </div>
          <span className="text-sm font-bold text-zinc-100">MP Digital Solutions</span>
        </div>

        {/* Form Container: Strictly centered 360px width */}
        <div className="w-full max-w-[360px]">
          {/* Mode switch pills if in signup mode */}
          {mode === 'signup' ? (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Create an account</h1>
                <p className="text-xs text-zinc-400 mt-1">Onboard your organization into a dedicated Cloudflare workspace</p>
              </div>

              <form onSubmit={handleSignupSubmit} className="space-y-3" noValidate>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corporation"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-[1.5px] focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Lead Contact Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-[1.5px] focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@apexhealth.io"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-[1.5px] focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Workspace Passkey</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. apex2026"
                    value={newPasskey}
                    onChange={(e) => setNewPasskey(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500 focus:ring-[1.5px] focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Project Scope</label>
                  <input
                    type="text"
                    placeholder="e.g. n8n Telemetry & GHL Funnel"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500 focus:ring-[1.5px] focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Retainer Tier</label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Enterprise Automation Retainer">Enterprise Automation Retainer ($3,200/mo)</option>
                    <option value="Clinical Growth Retainer">Clinical Growth Retainer ($2,450/mo)</option>
                    <option value="Custom AI Infrastructure">Custom AI Infrastructure (Fixed Sprint)</option>
                  </select>
                </div>

                {signupError && <p className="text-xs text-rose-400 mt-2">{signupError}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 mt-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Provisioning Workspace...' : 'Create Workspace & Enter →'}
                </button>

                <div className="pt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Already have an account? <span className="text-emerald-400 font-semibold underline">Sign in</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              {/* Form Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-1">Welcome back</h1>
                <p className="text-xs text-zinc-400">
                  Sign in to your client operations workspace
                </p>
              </div>

              {/* Two Secondary Buttons Side by Side */}
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                <button
                  type="button"
                  onClick={handleQuickSSO}
                  className="h-10 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                >
                  <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span className="truncate">Continue with SSO</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const promptEmail = prompt('Enter your client email to receive a magic sign-in link:')
                    if (promptEmail) {
                      alert(`Magic onboarding link dispatched to ${promptEmail}`)
                    }
                  }}
                  className="h-10 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-200 text-xs font-medium flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-[1.5px] focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
                >
                  <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span className="truncate">Email me a link</span>
                </button>
              </div>

              {/* "or" Divider */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-[11px] text-zinc-500 lowercase font-mono">or</span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              {/* The Sign-In Form with novalidate */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Email Field with Leading Icon */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="emailInput" className="text-xs font-medium text-zinc-200">
                      Email or Passkey
                    </label>
                  </div>

                  <div className={`relative ${emailShaking ? 'animate-[shake_380ms_cubic-bezier(0.36,0.07,0.19,0.97)_both]' : ''}`}>
                    <input
                      ref={emailInputRef}
                      id="emailInput"
                      type="text"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (emailError) setEmailError(null)
                      }}
                      onBlur={validateEmail}
                      placeholder="name@company.com or apex2026"
                      autoComplete="email"
                      aria-invalid={emailError ? 'true' : 'false'}
                      aria-describedby={emailError ? 'emailError' : undefined}
                      className={`w-full h-11 pl-9 pr-4 rounded-xl bg-zinc-900 border text-xs text-zinc-100 placeholder:text-zinc-600 transition-all focus:outline-none ${
                        emailError
                          ? 'border-rose-500 shadow-[0_0_0_1.5px_#ef4444,0_0_0_4px_rgba(239,68,68,0.2)]'
                          : 'border-zinc-800 focus:border-emerald-500 focus:shadow-[0_0_0_1.5px_#10b981,0_0_0_4px_rgba(16,185,129,0.15)]'
                      }`}
                    />
                    <svg className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>

                  {emailError && (
                    <p id="emailError" role="alert" className="mt-1.5 text-[11px] text-rose-400 font-medium">
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password Field with Leading Icon & Eye Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="passwordInput" className="text-xs font-medium text-zinc-200">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Demo passkeys available: apex2026 or resilience2026')}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className={`relative ${passwordShaking ? 'animate-[shake_380ms_cubic-bezier(0.36,0.07,0.19,0.97)_both]' : ''}`}>
                    <input
                      ref={passwordInputRef}
                      id="passwordInput"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (passwordError) setPasswordError(null)
                      }}
                      placeholder="••••••••••••"
                      autoComplete="current-password"
                      aria-invalid={passwordError ? 'true' : 'false'}
                      aria-describedby={passwordError ? 'passwordError' : undefined}
                      className={`w-full h-11 pl-9 pr-10 rounded-xl bg-zinc-900 border text-xs text-zinc-100 placeholder:text-zinc-600 transition-all focus:outline-none ${
                        passwordError
                          ? 'border-rose-500 shadow-[0_0_0_1.5px_#ef4444,0_0_0_4px_rgba(239,68,68,0.2)]'
                          : 'border-zinc-800 focus:border-emerald-500 focus:shadow-[0_0_0_1.5px_#10b981,0_0_0_4px_rgba(16,185,129,0.15)]'
                      }`}
                    />
                    <svg className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>

                    {/* Eye toggle button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                      className="absolute right-2.5 top-2.5 p-1 rounded text-zinc-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {passwordError && (
                    <p id="passwordError" role="alert" className="mt-1.5 text-[11px] text-rose-400 font-medium">
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Keep me signed in Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="keepSignedIn"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-zinc-950 cursor-pointer"
                  />
                  <label htmlFor="keepSignedIn" className="text-xs text-zinc-400 cursor-pointer select-none">
                    Keep me signed in
                  </label>
                </div>

                {/* Primary Submit Button with Vertical Slide and Sheen */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full h-11 rounded-xl font-bold text-xs relative overflow-hidden transition-all shadow-lg flex items-center justify-center ${
                    signedInSuccess
                      ? 'bg-emerald-500 text-zinc-950'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20'
                  }`}
                >
                  {/* Light Sheen Sweep Gradient when submitting */}
                  {submitting && (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-[sheenSweep_1.2s_infinite]" />
                  )}

                  {/* Vertical Slide Label Swap */}
                  <div className="relative h-5 overflow-hidden flex flex-col items-center justify-center">
                    <div
                      className="transition-transform duration-300 ease-out flex flex-col items-center"
                      style={{
                        transform: signedInSuccess
                          ? 'translateY(-66.6%)'
                          : submitting
                          ? 'translateY(-33.3%)'
                          : 'translateY(0%)',
                      }}
                    >
                      <span className="h-5 flex items-center justify-center">Sign in</span>
                      <span className="h-5 flex items-center justify-center">Signing in</span>
                      <span className="h-5 flex items-center justify-center gap-1.5 font-bold">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Signed in
                      </span>
                    </div>
                  </div>
                </button>
              </form>

              {/* New to us? Create an account */}
              <div className="mt-6 text-center text-xs text-zinc-400">
                <span>New to us?</span>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="ml-1 text-zinc-100 font-semibold hover:text-emerald-400 hover:underline transition-colors"
                >
                  Create an account
                </button>
              </div>

              {/* Client support footer link */}
              <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
                <p className="text-[11px] text-zinc-500">
                  Need a dedicated client workspace?{' '}
                  <a href="/#contact" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                    Contact Marlon Palomares →
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes barBreathe {
          0% { transform: scaleY(0.45); }
          100% { transform: scaleY(1); }
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(3px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        @keyframes sheenSweep {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(150%) skewX(-12deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[floatCard_7s_ease-in-out_infinite\\],
          .animate-\\[barBreathe_3\\.5s_ease-in-out_infinite_alternate\\],
          .animate-\\[sheenSweep_1\\.2s_infinite\\],
          .animate-\\[shake_380ms_cubic-bezier\\(0\\.36\\,0\\.07\\,0\\.19\\,0\\.97\\)_both\\] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
