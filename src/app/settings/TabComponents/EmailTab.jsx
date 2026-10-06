"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Check, Loader2 } from 'lucide-react'

import ConnectModal from './EmailComponents/ConnectModal'
import ProvidersModal from './EmailComponents/ProvidersModal'
import Toast from './UsersComponents.jsx/Toast'


export default function EmailTab() {
  const [modalState, setModalState] = useState(null) // null, 'main', 'providers'

  // Connection states
  const [isConnected, setIsConnected] = useState(false)
  const [connectedEmail, setConnectedEmail] = useState('')
  const [loading, setLoading] = useState(true)

  // Specific loading states for actions
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false)

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  // Check email connection status on component load
  useEffect(() => {
    async function checkEmailConnection() {
      try {
        const res = await fetch('/api/auth/email/status')
        const data = await res.json()
        if (data.success && data.connected) {
          setIsConnected(true)
          setConnectedEmail(data.email)
        }
      } catch (error) {
        console.log("Error checking connection status:", error)
      } finally {
        setLoading(false)
      }
    }
    checkEmailConnection()
  }, [])

  // Handle email disconnect
  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    try {
      const res = await fetch('/api/auth/email/disconnect', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setIsConnected(false)
        setConnectedEmail('')
        setToast({ show: true, message: "Email disconnected successfully!", type: 'success' })
      } else {
        setToast({ show: true, message: data.message || "Failed to disconnect email.", type: 'error' })
      }
    } catch (error) {
      console.log("Error disconnecting email:", error)
      setToast({ show: true, message: "Something went wrong while disconnecting.", type: 'error' })
    } finally {
      setIsDisconnecting(false)
    }
  }

  // Handle Google Connection click
  const handleGoogleConnect = () => {
    setIsConnectingGoogle(true)
    setToast({ show: true, message: "Redirecting to Google...", type: 'success' })
    setTimeout(() => {
      window.location.href = "/api/auth/email/google"
    }, 500)
  }

  const benefits = [
    "Manage all your communication directly from one platform.",
    "Emails auto-link to profiles.",
    "Parse resumes from email.",
    "Get email open notifications.",
    "Emails sync automatically (e.g., every couple of hours).",
    "Full control, disconnect anytime."
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 font-sans p-9 relative">

      {/* Top Card */}
      <div className="border border-gray-200 rounded-lg bg-white p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 relative shrink-0">
            <Image src="/envelope.png" alt="Email" fill className="object-contain" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Email</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {isConnected && connectedEmail 
                ? `Connected with ${connectedEmail}` 
                : "Connect your email with pathfinder ats crm"}
            </p>
          </div>
        </div>

        {/* Dynamic Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              Loading...
            </div>
          ) : isConnected ? (
            <>
              <button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium px-4 py-2 rounded-md transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isDisconnecting && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-600" />}
                {isDisconnecting ? "Disconnecting..." : "Disconnect"}
              </button>
              <button
                onClick={() => setModalState('main')}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-medium px-4 py-2 rounded-md transition-colors cursor-pointer shadow-sm"
              >
                Change
              </button>
            </>
          ) : (
            <button
              onClick={() => setModalState('main')}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-medium px-5 py-2.5 rounded-md transition-colors cursor-pointer shadow-sm"
            >
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Bottom Features Card */}
      <div className="border border-gray-200 rounded-lg bg-white p-6 shadow-sm space-y-4">
        {benefits.map((text, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="text-[#7c3aed] shrink-0">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-xs text-gray-700 font-normal">{text}</span>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ConnectModal 
        isOpen={modalState === 'main'}
        onClose={() => setModalState(null)}
        onOpenProviders={() => setModalState('providers')}
        onGoogleConnect={handleGoogleConnect}
        isConnectingGoogle={isConnectingGoogle}
      />

      <ProvidersModal 
        isOpen={modalState === 'providers'}
        onClose={() => setModalState(null)}
        onBack={() => setModalState('main')}
        onGoogleConnect={handleGoogleConnect}
      />

      {/* Custom Toast Integration */}
      <Toast
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />
    </div>
  )
}