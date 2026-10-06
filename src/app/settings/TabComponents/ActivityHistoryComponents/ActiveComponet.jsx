import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Info } from 'lucide-react'


export default function ActiveComponet() {
    const [session, setSession] = useState([])
    const getSessions = async () => {
        try {
            const response = await fetch("/api/auth/activity")
            const data = await response.json()
            if (data.success) {
                setSession(data.sessions)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getSessions()
    }, [])
    const handleTerminate = async (sessionId) => {
        try {
            const response = await fetch("/api/auth/activity", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId: sessionId
                })
            });
            const data = await response.json();
            if (data.success) {
                setSession(session.filter((item) => item.sessionId !== sessionId))
            }
        } catch (error) {
           console.log(error)
        }
    }
    const spanClass = "text-[9px] text-gray-700 font-medium font-sans text-nowrap"
    return (
        <div>
            <div>
                {session.map((item) => (
                    <div key={item.id} className='p-4 flex items-center justify-between group hover:bg-gray-50'>
                        <div className='flex  items-center gap-3 w-48 shrink-0'>
                            <Image src="/screen.png" alt='Screenpic' width={24} height={24} className='object-contain' />
                            <div className='flex flex-col'>
                                <h2 className={spanClass}>{item.device}</h2>
                                <span className={spanClass}>{item.time}</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-14 justify-center '>
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
                                {item.isCurrent ? (
                                    <span className='text-green-600 text-[9px] font-medium font-sans  shadow-emerald-300'>Current Session</span>
                                ) : (
                                    <span onClick={() => handleTerminate(item.sessionId)} className='text-red-600 cursor-pointer text-[9px] font-medium font-sans opacity-0 group-hover:opacity-100 hover:underline'>Terminate</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div onClick={() => handleTerminate()} className='flex items-center justify-center mt-6'>
                    <span className='text-[12px] text-red-600 font-sans hover:underline'>Terminate all other sessions</span>
                </div>
            </div>
        </div>
    )
}
