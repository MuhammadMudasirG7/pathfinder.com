"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function CalendarTab() {
  // Google Calendar States
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [googleEmail, setGoogleEmail] = useState('')
  const [loadingGoogle, setLoadingGoogle] = useState(true)
  const [isDisconnectingGoogle, setIsDisconnectingGoogle] = useState(false)
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false)

  // Outlook Calendar States
  const [isOutlookConnected, setIsOutlookConnected] = useState(false)
  const [outlookEmail, setOutlookEmail] = useState('')
  const [loadingOutlook, setLoadingOutlook] = useState(true)
  const [isDisconnectingOutlook, setIsDisconnectingOutlook] = useState(false)
  const [isConnectingOutlook, setIsConnectingOutlook] = useState(false)

  // Check connection status on load & handle URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    
    // Google Success Check (Matched with backend: google_connected)
    const googleSuccess = queryParams.get('success')
    if (googleSuccess === 'google_connected') {
      setIsGoogleConnected(true)
      toast.success("Google Calendar connected successfully!")
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    // Outlook Success Check
    const outlookSuccess = queryParams.get('success')
    if (outlookSuccess === 'outlook_calendar_connected') {
      setIsOutlookConnected(true)
      toast.success("Outlook Calendar connected successfully!")
      window.history.replaceState({}, document.title, window.location.pathname)
    }

    async function checkStatuses() {
      // Check Google Calendar Status
      try {
        const res = await fetch('/api/auth/calendar/google/status')
        const data = await res.json()
        if (data.success && data.connected) {
          setIsGoogleConnected(true)
          if (data.email) setGoogleEmail(data.email)
        }
      } catch (error) {
        console.log("Error checking Google calendar status:", error)
      } finally {
        setLoadingGoogle(false)
      }

      // Check Outlook Calendar Status
      try {
        const res = await fetch('/api/auth/calendar/outlook/status')
        const data = await res.json()
        if (data.success && data.connected) {
          setIsOutlookConnected(true)
          if (data.email) setOutlookEmail(data.email)
        }
      } catch (error) {
        console.log("Error checking Outlook calendar status:", error)
      } finally {
        setLoadingOutlook(false)
      }
    }
    
    checkStatuses()
  }, [])

  // Handle Google Disconnect
  const handleGoogleDisconnect = async () => {
    setIsDisconnectingGoogle(true)
    try {
      const res = await fetch('/api/auth/calendar/google/disconnect', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setIsGoogleConnected(false)
        setGoogleEmail('')
        toast.success("Google Calendar disconnected successfully!")
      } else {
        toast.error(data.message || "Failed to disconnect Google Calendar.")
      }
    } catch (error) {
      console.log("Error:", error)
      toast.error("Something went wrong while disconnecting.")
    } finally {
      setIsDisconnectingGoogle(false)
    }
  }

  // Handle Google Connect / Change
  const handleGoogleConnect = () => {
    setIsConnectingGoogle(true)
    toast.info("Redirecting to Google Calendar...", { autoClose: 1500 })
    setTimeout(() => {
      window.location.href = "/api/auth/calendar/google"
    }, 500)
  }

  // Handle Outlook Disconnect
  const handleOutlookDisconnect = async () => {
    setIsDisconnectingOutlook(true)
    try {
      const res = await fetch('/api/auth/calendar/outlook/disconnect', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setIsOutlookConnected(false)
        setOutlookEmail('')
        toast.success("Outlook Calendar disconnected successfully!")
      } else {
        toast.error(data.message || "Failed to disconnect Outlook Calendar.")
      }
    } catch (error) {
      console.log("Error:", error)
      toast.error("Something went wrong while disconnecting.")
    } finally {
      setIsDisconnectingOutlook(false)
    }
  }

  // Handle Outlook Connect / Change
  const handleOutlookConnect = () => {
    setIsConnectingOutlook(true)
    toast.info("Redirecting to Outlook Calendar...", { autoClose: 1500 })
    setTimeout(() => {
      window.location.href = "/api/auth/calendar/outlook"
    }, 500)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 font-sans p-9 relative">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* 1. Google Calendar Card */}
      <div className="border border-gray-200 rounded-lg bg-white p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 relative shrink-0">
            <Image src="/calender.png" alt="Google Calendar" fill className="object-contain" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-800">Google Calendar</h2>
            <p className="text-[12px] text-gray-500 mt-0.5">
              {isGoogleConnected && googleEmail 
                ? `Connected with ${googleEmail}` 
                : isGoogleConnected 
                ? "Connected" 
                : "Sync your Google Calendar with Pathfinder ATS CRM"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {loadingGoogle ? (
            <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              Loading...
            </div>
          ) : isGoogleConnected ? (
            <>
              <button
                onClick={handleGoogleDisconnect}
                disabled={isDisconnectingGoogle}
                className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium px-4 py-2 rounded-md transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isDisconnectingGoogle && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-600" />}
                {isDisconnectingGoogle ? "Disconnecting..." : "Disconnect"}
              </button>
              <button
                onClick={handleGoogleConnect}
                disabled={isConnectingGoogle}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-medium px-4 py-2 rounded-md transition-colors cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isConnectingGoogle && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                {isConnectingGoogle ? "Changing..." : "Change"}
              </button>
            </>
          ) : (
            <button
              onClick={handleGoogleConnect}
              disabled={isConnectingGoogle}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-medium px-5 py-2 rounded transition-colors cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isConnectingGoogle && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
              {isConnectingGoogle ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>
      </div>

      {/* 2. Outlook Calendar Card */}
      <div className="border border-gray-200 rounded-lg bg-white p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 relative shrink-0">
            <Image src="/outlook.png" alt="Outlook Calendar" fill className="object-contain" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-800">Outlook Calendar</h2>
            <p className="text-[12px] text-gray-500 mt-0.5">
              {isOutlookConnected && outlookEmail 
                ? `Connected with ${outlookEmail}` 
                : isOutlookConnected 
                ? "Connected" 
                : "Sync your Outlook Calendar with Pathfinder ATS CRM"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {loadingOutlook ? (
            <div className="flex items-center gap-2 text-xs text-gray-400 px-3 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              Loading...
            </div>
          ) : isOutlookConnected ? (
            <>
              <button
                onClick={handleOutlookDisconnect}
                disabled={isDisconnectingOutlook}
                className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium px-4 py-2 rounded-md transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isDisconnectingOutlook && <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-600" />}
                {isDisconnectingOutlook ? "Disconnecting..." : "Disconnect"}
              </button>
              <button
                onClick={handleOutlookConnect}
                disabled={isConnectingOutlook}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-medium px-4 py-2 rounded-md transition-colors cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {isConnectingOutlook && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
                {isConnectingOutlook ? "Changing..." : "Change"}
              </button>
            </>
          ) : (
            <button
              onClick={handleOutlookConnect}
              disabled={isConnectingOutlook}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-medium px-5 py-2 rounded transition-colors cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isConnectingOutlook && <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />}
              {isConnectingOutlook ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}