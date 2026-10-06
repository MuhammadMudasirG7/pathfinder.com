import React, { useState } from 'react'

export default function EnforceHeader() {
    const [isOn, setIsOn] = useState(false)
    return (
        <div className='border border-gray-200 rounded'>
            <div className='flex items-center justify-between p-2'>
                <div className='flex flex-col'>
                    <span className='text-[12px] text-gray-700'>Enforce required fields on extension</span>
                    <span className='text-[12px] text-blue-700 hover:underline font-medium cursor-pointer font-sans'>Learn more</span>
                </div>
                <div onClick={() => setIsOn(!isOn)} className={`w-6.5 h-4 flex items-center p-1 rounded-full cursor-pointer 
        ${isOn === true ? "bg-blue-700" : "bg-gray-400"}`}>
                    <div className={`bg-white w-2.5 h-2.5 rounded-full ${isOn ? "ml-auto" : ""}`}></div>
                </div>
            </div>
        </div>
    )
}
