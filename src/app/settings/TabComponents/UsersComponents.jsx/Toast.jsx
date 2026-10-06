"use client"

import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export default function Toast({ show, message, type = 'success', onClose }) {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose()
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [show, onClose])

    if (!show) return null

    const isSuccess = type === 'success'

    return (
        <div className="fixed top-5 right-5 z-[9999999] flex items-center justify-between gap-3 px-4 py-3 bg-white border border-gray-100 shadow-xl rounded-xl text-xs font-medium animate-bounce transition-all min-w-[240px]">
            <div className="flex items-center gap-2">
                {isSuccess ? (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                ) : (
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                )}
                <span className="text-gray-700">{message}</span>
            </div>
            <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-0.5 rounded-md cursor-pointer shrink-0"
            >
                <X size={14} />
            </button>
        </div>
    )
}