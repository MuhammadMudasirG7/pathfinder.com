import { ChevronsDown, ChevronsUp, GripVertical, Pencil, X } from 'lucide-react'
import React, { useState } from 'react'


export default function JobTitleHeader({ title, isOpen, setIsOpen, showToggle = true }) {
    const [isON, setIsON] = useState(true)
    const [isModuleOpen, setIsModuleOpen] = useState(false)
    const [currenttitle, setCurrentTitle] = useState(title)
    const [newTitle, setNewTitle] = useState(title)
    const handleSave = () => {
        setCurrentTitle(newTitle)
        setIsModuleOpen(false)
    }
    return (
        <div className='flex items-center justify-between p-2.5 bg-gray-50'>
            <div className='flex items-center gap-3'>
                <GripVertical size={14} />
                <span className='text-gray-800 text-[12px] font-medium'>{currenttitle}</span>
            </div>
            <div className='flex items-center gap-6'>
                {showToggle && (
                    <div onClick={() => setIsON(!isON)} className={`w-6.5 h-4 flex items-center cursor-pointer rounded-full p-1 transition-colors ${isON ? "bg-blue-700" : "bg-gray-400"}`}>
                        <div className={`w-2.5 h-2.5 bg-white rounded-full ${isON ? "ml-auto" : ""}`}></div>
                    </div>
                )}
                <div onClick={() => { setIsModuleOpen(true), setNewTitle(currenttitle) }} className='w-6 h-6 cursor-pointer hover:bg-gray-200 bg-gray-100 rounded flex items-center justify-center'>
                    <Pencil size={12} className='text-gray-600' />
                </div>
                <div onClick={() => setIsOpen(!isOpen)} className='w-6 h-6 cursor-pointer hover:bg-gray-200 bg-gray-100 rounded flex items-center justify-center'>
                    {isOpen ? <ChevronsUp size={14} className='text-gray-600' /> : <ChevronsDown size={14} className='text-gray-600' />}
                </div>
            </div>
            {isModuleOpen && (
                <div className='fixed inset-0 bg-black/40 flex items-center justify-center'>
                    <div className=' bg-white h-42 w-96 rounded-2xl p-6'>
                        <div className='flex items-center justify-between'>
                            <h2 className='text-[14px] text-gray-800 font-semibold font-sans'>Edit Section Name</h2>
                            <X onClick={() => setIsModuleOpen(false)} size={14} />
                        </div>
                        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} type="text" className='px-2 mt-5 text-[12px] py-2  border border-gray-300 outline-none w-full rounded hover:shadow-[0_0_3px_rgb(99,102,239,0.52)]' />
                        <div onClick={handleSave} className='flex items-center justify-end mt-4'>
                            <button className='px-2 py-0.5 bg-indigo-600 cursor-pointer rounded text-white text-[11px] font-medium '>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

