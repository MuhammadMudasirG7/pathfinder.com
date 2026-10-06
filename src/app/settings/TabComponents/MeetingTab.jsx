"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { toast } from 'react-toastify'

export default function MeetingTab() {
  const [meetStatus, setMeetStatus] = useState({ connected: false, email: '' })
  const [zoomStatus, setZoomStatus] = useState({ connected: false, email: '' })
  const [loading, setLoading] = useState(true)

  // Status fetch karne ke liye function (Meet aur Zoom dono ke liye)
  const fetchStatuses = async () => {
    try {
      // Google Meet Status
      const meetRes = await fetch('/api/auth/meeting-apps/meet/status')
      const meetContentType = meetRes.headers.get("content-type")
      if (meetContentType && meetContentType.includes("application/json")) {
        const meetData = await meetRes.json()
        if (meetData.success) {
          setMeetStatus({ connected: meetData.connected, email: meetData.email || '' })
        }
      }

      // Zoom Status
      const zoomRes = await fetch('/api/auth/meeting-apps/zoom/status')
      const zoomContentType = zoomRes.headers.get("content-type")
      if (zoomContentType && zoomContentType.includes("application/json")) {
        const zoomData = await zoomRes.json()
        if (zoomData.success) {
          setZoomStatus({ connected: zoomData.connected, email: zoomData.email || '' })
        }
      }
    } catch (error) {
      console.error("Failed to fetch integration statuses", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatuses()

    // URL query params check karna (Redirect ke baad success/error ke liye)
    const queryParams = new URLSearchParams(window.location.search)
    const success = queryParams.get('success')
    const error = queryParams.get('error')

    if (success === 'google_meet_connected') {
      toast.success("Google Meet connected successfully!")
      window.history.replaceState({}, document.title, window.location.pathname)
      fetchStatuses()
    } else if (success === 'zoom_connected') {
      toast.success("Zoom connected successfully!")
      window.history.replaceState({}, document.title, window.location.pathname)
      fetchStatuses()
    } else if (error) {
      toast.error("Failed to connect integration. Please try again.")
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  // Google Meet Connect Handler
  const handleMeetConnect = () => {
    toast.info("Redirecting to Google for authorization...", { autoClose: 2000 })
    setTimeout(() => {
      window.location.href = '/api/auth/meeting-apps/meet'
    }, 500)
  }

  // Google Meet Disconnect Handler
  const handleMeetDisconnect = async () => {
    try {
      const res = await fetch('/api/auth/meeting-apps/meet/disconnect', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setMeetStatus({ connected: false, email: '' })
        toast.success("Google Meet disconnected successfully!")
      } else {
        toast.error("Failed to disconnect Google Meet.")
      }
    } catch (error) {
      console.error("Disconnect error:", error)
      toast.error("Something went wrong.")
    }
  }

  // Zoom Connect Handler
  const handleZoomConnect = () => {
    toast.info("Redirecting to Zoom for authorization...", { autoClose: 2000 })
    setTimeout(() => {
      window.location.href = '/api/auth/meeting-apps/zoom'
    }, 500)
  }

  // Zoom Disconnect Handler
  const handleZoomDisconnect = async () => {
    try {
      const res = await fetch('/api/auth/meeting-apps/zoom/disconnect', { method: 'POST' })
      const data = await res.json()
      if (data.success) {
        setZoomStatus({ connected: false, email: '' })
        toast.success("Zoom disconnected successfully!")
      } else {
        toast.error("Failed to disconnect Zoom.")
      }
    } catch (error) {
      console.error("Disconnect error:", error)
      toast.error("Something went wrong.")
    }
  }

  const integrations = [
    {
      id: 'meet',
      title: 'Google Meet Integration',
      description: 'Connect your preferred video conferencing tools to centralise scheduling, hosting, and managing all virtual interactions within Pathfinder ATS CRM.',
      icon: '/meet.png',
      connected: meetStatus.connected,
      email: meetStatus.email,
      onConnect: handleMeetConnect,
      onDisconnect: handleMeetDisconnect,
    },
    {
      id: 'zoom',
      title: 'Zoom Integration',
      description: 'Connect your preferred video conferencing tools to centralise scheduling, hosting, and managing all virtual interactions within Pathfinder ATS CRM.',
      icon: '/zoom.png',
      connected: zoomStatus.connected,
      email: zoomStatus.email,
      onConnect: handleZoomConnect,
      onDisconnect: handleZoomDisconnect,
    },
    {
      id: 'microsoft',
      title: 'Microsoft Teams Integration',
      description: 'Connect your preferred video conferencing tools to centralise scheduling, hosting, and managing all virtual interactions within Pathfinder ATS CRM.',
      icon: '/microsoft.png',
      connected: false,
      email: '',
      onConnect: () => toast.info("Microsoft Teams integration coming soon!"),
    },
  ];

  if (loading) {
    return <div className="p-9 text-center text-xs text-gray-500">Loading integrations...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 font-sans p-9">
      {integrations.map((item) => (
        <div 
          key={item.id} 
          className="border border-gray-200 rounded-lg bg-white p-5 flex items-center justify-between gap-6 shadow-sm"
        >
          {/* Left Side: Icon & Text */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 relative shrink-0">
              <Image 
                src={item.icon} 
                alt={item.title} 
                fill 
                className="object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold text-gray-800">{item.title}</h2>
                {item.connected && (
                  <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    Connected ({item.email})
                  </span>
                )}
              </div>
              <p className="text-[12px] text-gray-500 mt-0.5 max-w-2xl leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>

          {/* Right Side: Dynamic Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {item.connected ? (
              <>
                <button 
                  onClick={item.onConnect}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-4 py-2 rounded transition-colors cursor-pointer"
                >
                  Change
                </button>
                <button 
                  onClick={item.onDisconnect}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium px-4 py-2 rounded transition-colors cursor-pointer"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button 
                onClick={item.onConnect}
                className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-medium px-5 py-2 rounded transition-colors cursor-pointer shadow-sm"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
} 