import { Check, GripVertical } from 'lucide-react'
import React, { useState } from 'react'

export default function JobFieldsList({ isOpen, initialFields, showExtensions = false }) {

    const [fields, setFields] = useState(initialFields)
    const [dragId, setDragId] = useState(null)
    const handleDragStart = (dragId) => {
        setDragId(dragId)
    }
    const handleDragOver = (e) => {
        e.preventDefault()
    }
    const handleDragDrop = (id) => {
        const oldIndex = fields.findIndex((item) => item.id === dragId)
        const newIndex = fields.findIndex((item) => item.id === id)
        const newFields = [...fields]
        const item = newFields.splice(oldIndex, 1)[0]
        newFields.splice(newIndex, 0, item)
        setFields(newFields)
    }
    const toggleVisibility = (id) => {
        setFields(fields.map((item) => {
            if (item.id === id) {
                return { ...item, visible: !item.visible }
            }
            return item
        }))
    }
    const toggleRequired = (id) => {
        setFields(fields.map((item) => {
            if (item.id === id) {
                return { ...item, required: !item.required }
            }
            return item
        }))
    }
    const toggleExtensions = (id) => {
        setFields(fields.map((item) => {
            if (item.id === id) {
                return { ...fields, extension: !item.extension }
            }
        }
        ))
    }
    const spanClass = 'text-[11px] text-gray-800'
    const fieldClass = 'text-[12px] text-gray-700 font-medium'
    const gridClass = `grid ${showExtensions ? "grid-cols-3 w-[380px]" : "grid-cols-2 w-[260px]"} items-center justify-items-center`
    return (
        <div>
            {isOpen && (
                <div className="p-1 bg-white">
                    <div className='flex justify-end pr-2 mb-1'>
                        <div className={gridClass}>
                            <span className={spanClass}>Visibility</span>
                            <span className={spanClass}>Required</span>
                            {showExtensions && (
                                <span className={spanClass}>Extension</span>
                            )}
                        </div>
                    </div>
                    {fields.map((item) => (
                        <div key={item.id} onDragOver={handleDragOver} onDrop={() => handleDragDrop(item.id)} className='flex items-center justify-between bg-white border border-gray-200 px-2.5 py-2 mb-2'>
                            <div className='flex items-center gap-3'>
                                <div
                                    draggable onDragStart={() => handleDragStart(item.id)}
                                    className="cursor-grab active:cursor-grabbing inline-flex items-center"
                                >
                                    <GripVertical size={18} className='hover:bg-gray-100 text-gray-600 rounded' />
                                </div>
                                <span className={fieldClass}>{item.name}</span>
                            </div>
                            <div className='flex justify-end'>
                                <div className={gridClass}>
                                    <div onClick={() => toggleVisibility(item.id)} className={`w-6.5 h-4 rounded-full flex items-center p-1 transition-colors ${item.visible ? "bg-blue-700" : "bg-gray-300"}`}>
                                        <div className={`w-2.5 h-2.5 rounded-full bg-white ${item.visible ? "ml-auto" : ""}`}></div>
                                    </div>
                                    <div onClick={() => toggleRequired(item.id)} className={`h-3 w-3  rounded border border-gray-400 flex items-center justify-center ${item.required ? "bg-blue-700 text-white" : ""}`}>
                                        <Check size={12} className={`${item.required ? "opacity-100 text-white" : "opacity-0"}`} />
                                    </div>
                                    {showExtensions && (
                                        <div onClick={() => toggleExtensions(item.id)} className={`h-3 w-3  rounded border border-gray-400 flex items-center justify-center ${item.extension ? "bg-blue-700 text-white" : ""}`}>
                                            <Check size={12} className={`${item.extension ? "opacity-100 text-white" : "opacity-0"}`} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}