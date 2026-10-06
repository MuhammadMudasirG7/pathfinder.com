import { GripVertical, Info, Lock, Plus, X } from 'lucide-react'
import React, { useState } from 'react'

export default function JobStatus() {
    const statusArray = [
        { id: 1, status: "Draft", system: "System", text: "Internal drafting phase. The job is not visible to candidates or external job boards.", category: "Preparation" },
        { id: 2, status: "Open", system: "System", text: "The role is actively recruiting. Applications are being accepted and the post is public.", category: "Active" },
        { id: 3, status: "On Hold", system: "System", text: "Recruitment is currently suspended. No new applications can be submitted.", category: "Paused" },
        { id: 4, status: "Cancelled", system: "System", text: "The requisition is withdrawn before a hire was made. All activity is stopped.", category: "Close" },
        { id: 5, status: "Filled", system: "System", text: "A candidate has been successfully hired and the position is no longer available.", category: "Close" },
        { id: 6, status: "Archieved", system: "System", text: "Administrative archived state. Used for historical reporting once all tasks are done.", category: "Close" }
    ]
    const [openModule, setOpenModule] = useState(false)
    const spanClass = "text-[10px] font-medium text-gray-700 text-white"
    const labelClass = "text-[12px] font-sans font-medium text-gray-600 ml-0.5"
    const inputClass = "px-2 mt-0.5 py-1 text-[12px] font-sans font-medium text-gray-700 rounded-xs w-full outline-none border border-gray-200 hover:shadow-[0_0_3px_rgb(99,102,239,0.52)] placeholder:text-[12px]"
    return (
        <div className='p-4'>
            <div className='flex items-center justify-end p-1.5 mb-2.5 '>
                <button onClick={() => setOpenModule(true)} className='flex items-center gap-2 px-3 py-2 bg-[#6E41E2] text-white rounded cursor-pointer'>
                    <Plus size={14} className='text-white' />
                    <span className={spanClass}>Custom Job Status</span>
                </button>
            </div>

            <div className='p-4 border border-gray-200 rounded'>
                {statusArray.map((item) => (
                    <div key={item.id} className='border border-gray-200 rounded p-3 mb-2 flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <GripVertical size={12} className='text-gray-400 cursor-not-allowed' />
                            <div className='flex flex-col'>
                                <div className='flex items-center gap-2.5'>
                                    <span className='h-5 w-fit px-2 flex items-center justify-center text-[10px] font-medium text-gray-800 rounded-full bg-gray-50 border border-gray-200'>{item.status}</span>
                                    <span className='h-5 w-fit px-1 flex items-center justify-center gap-2 text-[10px] font-medium text-gray-700 rounded-full bg-gray-100'><Lock size={9} /> {item.system}</span>
                                </div>
                                <span className='text-[11px]  text-gray-600'>{item.text}</span>
                                <span className='text-[11px]  text-gray-600  font-sans mt-1'>Category: <span className='text-[11px] text-gray-800 font-sans font-medium'>{item.category}</span> </span>
                            </div>
                        </div>
                        <Info size={14} className='text-gray-700' />
                    </div>
                ))}
            </div>

            {openModule && (
                <div className='fixed inset-0 bg-black/40 flex justify-end'>
                    <div className='w-[45%] h-screen bg-white'>
                        <div className='flex items-center justify-between p-4 border-b border-gray-200 font-medium font-sans'>
                            <h2 className='text-[14px] text-gray-700'>Add Custom Job Status</h2>
                            <X onClick={() => setOpenModule(false)} size={16} className='cursor-pointer text-gray-700' />
                        </div>
                        <div className='p-4 border-b border-gray-200 space-y-2'>
                            <div>
                                <label className={labelClass}>Status Name</label>
                                <input type="text" placeholder='e.g .., Talent Pool' className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Category Group</label>
                                <select className={inputClass}>
                                    <option value="active">Active</option>
                                    <option value="preparation">Preparation</option>
                                    <option value="paused">Paused</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Description</label>
                                <input className={inputClass} type="text" placeholder='Describes the objective of this stage' />
                            </div>
                        </div>
                        <div className='flex items-center justify-end gap-3 p-4'>
                            <button className='px-2 py-1.5 border border-gray-200 rounded bg-white text-[12px] font-medium font-sans flex items-center justify-center cursor-pointer'>Cancel</button>
                            <button className='px-3 py-1.5 border border-gray-200 rounded text-white bg-[#6E41E2] text-[12px] font-medium font-sans flex items-center justify-center cursor-pointer'>Create Status</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
