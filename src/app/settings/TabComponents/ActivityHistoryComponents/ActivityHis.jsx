"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Info, X } from 'lucide-react'
import HeaderNotification from '../NotificationComponents/HeaderNotification'

export default function ActivityHis() {
    const [session, setSession] = useState([])
    const [activityHisOpen, setActivityHisOpen] = useState(false)

    const getExpiredSessions = async () => {
        try {
            const response = await fetch("/api/auth/activity/activity-history")
            const data = await response.json()
            if (data.success) setSession(data.sessions)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getExpiredSessions()
    }, [])

    const spanClass = "text-[9px] text-gray-700 font-medium font-sans text-nowrap"

    // Reusable item row component code ko repeat hone se bachata hai
    const ActivityRow = ({ item, paddingClass = "p-3" }) => (
        <div key={item.id} className={`${paddingClass} flex items-center justify-between hover:bg-gray-50`}>
            <div className='flex items-center gap-3 w-48 shrink-0'>
                <Image src="/screen.png" alt='Screenpic' width={24} height={24} className='object-contain' />
                <div className='flex flex-col'>
                    <h2 className={spanClass}>{item.device}</h2>
                    <span className={spanClass}>{item.time}</span>
                </div>
            </div>

            <div className='flex items-center gap-14 justify-center'>
                <div className='flex items-center gap-3 w-32 shrink-0'>
                    <Image src="/screen.png" alt='screenpic' width={24} height={24} className='object-contain' />
                    <Image src="/apple.png" alt='apple' width={24} height={24} className='object-contain' />
                    <Image src="/google.png" alt='google' width={24} height={24} className='object-contain' />
                </div>

                <div className='flex items-center gap-2 flex-1 px-4'>
                    <span className={spanClass}>{item.location}</span>
                    <Info size={14} className="text-[#142142] cursor-pointer" />
                </div>

                <div className='w-28 text-right shrink-0'>
                    <span className='text-red-600 text-[9px] font-medium font-sans'>{item.status}</span>
                </div>
            </div>
        </div>
    )

    return (
        <div>
            <HeaderNotification title="Activity History" />

            <div className='border border-gray-200 mt-6'>
                {/* Sirf pehle 2 sessions dikhayein */}
                {session.slice(0, 2).map((item) => (
                    <ActivityRow key={item.id} item={item} paddingClass="p-3 mt-2" />
                ))}

                {/* View More button agar 2 se zyada sessions hon */}
                {session.length > 2 && (
                    <div onClick={() => setActivityHisOpen(true)} className='flex items-center justify-center my-4'>
                        <span className='text-[12px] text-blue-600 font-sans cursor-pointer hover:underline'>
                            View More
                        </span>
                    </div>
                )}
            </div>

            {/* Modal */}
            {activityHisOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden border border-gray-200">
                        
                        {/* Modal Header */}
                        <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h2 className="text-xs font-bold text-gray-900">Recent Activity History</h2>
                                <p className="text-[9px] text-gray-500">Latest sign-ins and session records</p>
                            </div>
                            <button onClick={() => setActivityHisOpen(false)} className="cursor-pointer text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Body - Sare sessions */}
                        <div className="max-h-[50vh] divide-y divide-gray-100 overflow-y-auto">
                            {session.map((item) => (
                                <ActivityRow key={item.id} item={item} paddingClass="p-6" />
                            ))}
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}