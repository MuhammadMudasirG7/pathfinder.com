"use client"

import React, { useEffect, useState } from 'react'
import HeaderNotification from '../NotificationComponents/HeaderNotification'

export default function VerificationMethods() {
  const [phone, setPhone] = useState("")
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [tempPhone, setTempPhone] = useState("")

  const [email, setEmail] = useState("")
  const [isEditingEmail, setIsEditingEmail] = useState(true)
  const [tempEmail, setTempEmail] = useState("")

  const getVerificationMethods = async () => {
    try {
      const response = await fetch("/api/auth/security");
      const data = await response.json()
      if (data.success) {
        setPhone(data.security.phoneNumber)
        setTempPhone(data.security.phoneNumber)
        setEmail(data.security.alternateEmails[0] || "")
        setTempEmail(data.security.alternateEmails[0] || "")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getVerificationMethods()
  }, [])

  const savePhone = async () => {
    try {
      const response = await fetch("/api/auth/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: tempPhone })
      })
      const data = await response.json()
      if (data.success) {
        setPhone(tempPhone)
        setIsEditingPhone(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const saveEmail = async () => {
    try {
      const response = await fetch("/api/auth/security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alternateEmails: [tempEmail] })
      })
      const data = await response.json()
      if (data.success) {
        setEmail(tempEmail)
        setIsEditingEmail(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto border border-gray-200 rounded-lg bg-white shadow-sm font-sans">
      <HeaderNotification title="Verification Methods" />

      {/* Phone Number */}
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-gray-800 mb-1">Phone Number</h3>
          <p className="text-[12px] text-gray-500 mb-3">
            Require additional verification step for logins from a new device or browser.
          </p>
          {isEditingPhone ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-purple-600 shadow-sm w-56"
                placeholder="Enter phone number"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-700">{phone}</span>
              <button
                onClick={() => { setTempPhone(phone); setIsEditingPhone(true); }}
                className="text-xs text-[#7c3aed] hover:underline font-medium cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div>
          <button
            disabled={!isEditingPhone}
            onClick={savePhone}
            className={`text-xs font-medium px-4 py-2 rounded transition-colors ${
              isEditingPhone ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white cursor-pointer" : "bg-[#c4b5fd] text-white opacity-60 cursor-not-allowed"
            }`}
          >
            {phone ? "Save" : "Add Phone"}
          </button>
        </div>
      </div>

      {/* Alternate Emails */}
      <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-gray-800 mb-1">Alternate Emails</h3>
          <p className="text-[12px] text-gray-500 mb-3">
            Add alternate emails in addition to your default email to receive a verification code.
          </p>
          {isEditingEmail ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-purple-600 shadow-sm w-56"
                placeholder="Enter alternate email"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-700">{email}</span>
              <button
                onClick={() => { setTempEmail(email); setIsEditingEmail(true); }}
                className="text-xs text-[#7c3aed] hover:underline font-medium cursor-pointer"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div>
          <button
            disabled={!isEditingEmail}
            onClick={saveEmail}
            className={`text-xs font-medium px-5 py-2 rounded transition-colors ${
              isEditingEmail ? "bg-[#7c3aed] hover:bg-[#6d28d9] text-white cursor-pointer" : "bg-[#c4b5fd] text-white opacity-60 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>

      {/* Authenticator App */}
      <div className="px-6 py-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-bold text-gray-800 mb-1">Authenticator App</h3>
          <p className="text-[12px] text-gray-500">
            Set up an authenticator on your mobile device to receive verification code.
          </p>
        </div>
        <div>
          <button className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-medium px-4 py-2 rounded transition-colors cursor-pointer">
            Set Up App
          </button>
        </div>
      </div>
    </div>
  )
}