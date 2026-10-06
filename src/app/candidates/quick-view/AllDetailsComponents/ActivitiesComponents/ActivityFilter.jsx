import { Check, ChevronDown } from 'lucide-react'
import React, { useState } from 'react'

function ActivityFilter() {
    const [openSection, setOpenSection] = useState(null)

    const options = ["Notes", "Tasks", "Calls", "Meetings", "Emails"]
    const assignOptions = ["No Owner", "Sarah Jenkins", "John Doe", "Meetings", "Jane Doe"]
    const dateOptions = ["Today", "Yesterday", "This Week", "Last Week", "This Month", "Last Month", "This Quarter", "Last Quarter", "This Year", "Last Year"]

    const [activityCheck, setActivityCheck] = useState({ Notes: false, Tasks: false, Calls: false, Meetings: false, Emails: false })
    const [dateCheck, setDateCheck] = useState({ Today: false, Yesterday: false, "This Week": false, "Last Week": false, "This Month": false, "Last Month": false, "This Quarter": false, "Last Quarter": false, "This Year": false, "Last Year": false })
    const [assignCheck, setAssignCheck] = useState({ "No Owner": false, "Sarah Jenkins": false, "John Doe": false, "Jane Doe": false })

    const toggleSection = (sectionName) => {
        setOpenSection(openSection === sectionName ? null : sectionName)
    }

    const handleAssignToggle = (optionName) => {
        setAssignCheck(prev => ({ ...prev, [optionName]: !prev[optionName] }))
    }
    const handleActivityToggle = (optionName) => {
        setActivityCheck(prev => ({ ...prev, [optionName]: !prev[optionName] }))
    }
    const handleTimeToggle = (optionName) => {
        setDateCheck(prev => ({ ...prev, [optionName]: !prev[optionName] }))
    }

    return (
        // h-screen ki jagah h-full taaki height parent ke mutabiq adjust ho
        <div className='w-52 h-full bg-white p-4 border-r border-gray-200 flex flex-col overflow-hidden select-none shrink-0'>
            <span className='font-bold text-[14px] text-gray-700 mb-3 block border-b border-gray-100 pb-2'>Add Filter</span>
            
            <div className='flex-1 overflow-y-auto pr-1 space-y-3'>
                {/* --- 1. ACTIVITY SECTION --- */}
                <div>
                    <div onClick={() => toggleSection('activity')} className='flex items-center justify-between cursor-pointer py-1'>
                        <span className='text-[13px] font-medium text-gray-700'>Activity</span>
                        <ChevronDown size={15} className={`text-gray-700 transition-transform duration-300 ${openSection === 'activity' ? "rotate-180" : ""}`} />
                    </div>
                    {openSection === 'activity' && (
                        <div className='mt-1 pl-1 space-y-1'>
                            {options.map((opt) => {
                                const isChecked = activityCheck[opt]
                                return (
                                    <div onClick={() => handleActivityToggle(opt)} key={opt} className='flex items-center gap-3 text-[12px] font-medium hover:bg-gray-100 cursor-pointer text-gray-700 py-1 px-1 rounded'>
                                        <div className={`w-4 h-4 flex items-center justify-center rounded border border-gray-300 transition-colors duration-300 ${isChecked ? "bg-indigo-700 text-white border-indigo-700" : "bg-white"}`}>
                                            {isChecked && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span>{opt}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* --- 2. ALL TIME SECTION --- */}
                <div>
                    <div onClick={() => toggleSection('time')} className='flex items-center justify-between cursor-pointer py-1'>
                        <span className='text-[13px] font-medium text-gray-700 text-nowrap'>All Time</span>
                        <ChevronDown size={15} className={`text-gray-700 transition-transform duration-300 ${openSection === 'time' ? "rotate-180" : ""}`} />
                    </div>
                    {openSection === 'time' && (
                        <div className='mt-1 pl-1 max-h-[160px] overflow-y-auto space-y-1 pr-1'>
                            {dateOptions.map((opt) => {
                                const isChecked = dateCheck[opt]
                                return (
                                    <div onClick={() => handleTimeToggle(opt)} key={opt} className='flex items-center gap-3 text-[12px] font-medium hover:bg-gray-100 cursor-pointer text-gray-700 py-1 px-1 rounded'>
                                        <div className={`w-4 h-4 flex items-center justify-center rounded-full border border-gray-300 transition-colors duration-300 ${isChecked ? "bg-indigo-700 text-white border-indigo-700" : "bg-white"}`}>
                                            {isChecked && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span>{opt}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* --- 3. ASSIGN TO SECTION --- */}
                <div>
                    <div onClick={() => toggleSection('assign')} className='flex items-center justify-between cursor-pointer py-1'>
                        <span className='text-[13px] font-medium text-gray-700 text-nowrap'>Assign To</span>
                        <ChevronDown size={15} className={`text-gray-700 transition-transform duration-300 ${openSection === 'assign' ? "rotate-180" : ""}`} />
                    </div>
                    {openSection === 'assign' && (
                        <div className='mt-1 pl-1 max-h-[130px] overflow-y-auto space-y-1 pr-1'>
                            {assignOptions.map((opt) => {
                                const isChecked = assignCheck[opt]
                                return (
                                    <div onClick={() => handleAssignToggle(opt)} key={opt} className='flex items-center gap-3 text-[12px] font-medium hover:bg-gray-100 cursor-pointer text-gray-700 py-1 px-1 rounded'>
                                        <div className={`w-4 h-4 flex items-center justify-center rounded border border-gray-300 transition-colors duration-300 ${isChecked ? "bg-indigo-700 text-white border-indigo-700" : "bg-white"}`}>
                                            {isChecked && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span>{opt}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ActivityFilter