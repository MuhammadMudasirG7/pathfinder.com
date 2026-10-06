import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Expand, GripVertical, Minimize2, X } from 'lucide-react'

const ModalHeader = ({  title,   open,  setOpen,   isMaximized,  setIsMaximized,  onClose, onMouseDown }) => {
    return (
        <div 
             
            className='p-3 bg-gray-200 font-medium text-gray-900 flex items-center justify-between select-none '
        >
            <div
                className='flex items-center gap-2 cursor-pointer'
                onClick={(e) => {
                    e.stopPropagation()
                    if (setOpen) setOpen(!open)
                }}
            >
                {setOpen && <span>{open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>}
                <h2 className='text-[14px] font-bold text-gray-800'>{title}</h2>
            </div>
             <GripVertical onMouseDown={onMouseDown} size={16} className='text-gray-500 cursor-grab active:cursor-grabbing' />
            
            <div className='flex items-center gap-8'>
               
                
                {setIsMaximized && (
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsMaximized(!isMaximized)
                        }}
                        className='text-gray-600 hover:text-black focus:outline-none'
                    >
                        {isMaximized ? <Minimize2 size={14} /> : <Expand size={14} />}
                    </button>
                )}
                
                <button 
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        if (typeof onClose === 'function') {
                            onClose()
                        }
                    }} 
                    className='text-gray-600 hover:text-black focus:outline-none'
                >
                    <X size={15} />
                </button>
            </div>
        </div>
    )
}

export default ModalHeader;