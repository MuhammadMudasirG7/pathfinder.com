'use client'
import React, { useState, useEffect } from 'react'
import HeaderNotification from '../../TabComponents/NotificationComponents/HeaderNotification'

export default function AuditLog() {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAuditLogs()
    }, [])

    const fetchAuditLogs = async () => {
        try {
            const res = await fetch('/api/auth/audit-logs')
            const data = await res.json()
            if (data.success) {
                setLogs(data.logs)
            }
        } catch (error) {
            console.error("Error fetching audit logs:", error)
        } finally {
            setLoading(false)
        }
    }

    const spanClass = 'text-[10px] font-sans font-medium text-gray-700'

    return (
        <div className='pt-5 px-3 max-w-7xl mx-auto'>
            <HeaderNotification title={`${logs.length} Results`} />
            <div className='border border-gray-200 rounded-lg bg-white shadow-xs'>
                {loading ? (
                    <div className='p-4 text-center text-xs text-gray-500'>Loading audit logs...</div>
                ) : logs.length === 0 ? (
                    <div className='p-4 text-center text-xs text-gray-500'>No audit logs found.</div>
                ) : (
                    logs.map((item) => (
                        <div key={item._id} className='flex items-center justify-between p-3 border-b border-gray-100 last:border-none'>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-[#7c3aed] font-bold text-xs'>
                                    <span>{item.avatar}</span>
                                </div>
                                <span className={spanClass}>{item.text}</span>
                            </div>
                            <span className={spanClass}>{item.date}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}