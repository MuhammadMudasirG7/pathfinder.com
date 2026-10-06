"use client"
import React, { useEffect, useState } from 'react'

export default function NotifyEmail() {

  const [settings, setSettings] = useState([]);

  const getemailNotifications = async () => {
    try {
      const response = await fetch("/api/auth/notification")
      const data = await response.json()
      if (data.success) {
        setSettings(data.notification.emailNotifications || [])
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getemailNotifications()
  }, [])
  const updateEmailNotification = async (newSetting) => {
    try {
      const response = await fetch("/api/auth/notification", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailNotifications: newSetting
        })
      })
      const data = await response.json()
      if (data.success) {
        console.log("Email notifications Setting updated successfully")
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleToggle = (id) => {
    const newSetting = settings.map((item) => item.id === id ? { ...item, checked: !item.checked } : item)
    setSettings(newSetting)
    updateEmailNotification(newSetting)
  }

  return (
    <div className="h-[450px] relative flex flex-col overflow-hidden">
      <div className='sticy top-0 border border-gray-200 bg-gray-100 px-3 py-2.5'>
        <div>
          <span className='font-medium font-sans text-gray-800 text-[14px]'>Send email and push notifications for:</span>
        </div>
      </div>
      <div className='border border-gray-200 p-4 overflow-y-auto'>
        {settings.map((item) => (
          <div key={item.id} className='flex items-center gap-2 px-3 py-2.5'>
            <div onClick={() => handleToggle(item.id)} className={`w-8 h-4.5 flex items-center rounded-full p-1 ${item.checked ? "bg-purple-600 justify-end" : "bg-gray-400 justify-start"}`}>
              <div className='bg-white w-3 h-3 rounded-full'></div>
            </div>
            <span className='text-[12px] font-sans text-gray-700'>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}