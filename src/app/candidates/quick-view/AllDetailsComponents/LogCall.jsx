import React, { useState } from 'react'
import ModalHeader from './ModalHeader'
import { useDraggable } from '../../hooks/useDraggable'
import CustomDropdown from './CustomDropdown'
import RichTextToolbar from './RichTextToolbar'
import RecordSearchPopup from './RecordSearchPopup'
import { ChevronDown, Trash2 } from 'lucide-react'
import SimpleFollowUpSelector from './SimpleFollowUpSelector'

function LogCall({ onClose }) {
    const [open, setOpen] = useState(true); // <--- Yeh state add karein
    const taskOptions = ["To Do", "Email", "Call"]
    const [conact, setConact] = useState("JohnSmith")
    const [callOutcome, setCallOutcome] = useState("Select Call Outcome")
    const [callType, setCallType] = useState("Select Call Type")
    const [callDirection, setCallDirection] = useState("Inbound")
    const [selectedTask, setSelectedTask] = useState("To Do")
    const [checkedRecord, setCheckedRecord] = useState(true)
    const [callOpen, setCallOpen] = useState(false)
    const { position, isMaximized, setIsMaximized, handleMouseMoveDown, modalRef } = useDraggable()

    return (
        <div className='fixed p-4 inset-0 z-[9999] bg-black/50 flex items-center justify-center '>
            <div ref={modalRef} style={{ transform: `translate(${position.x}px,${position.y}px)` }} className={`bg-white relative w-full ${isMaximized ? "max-w-[900px]" : "max-w-[650px]"} rounded-lg border border-gray-300 shadow-xl overflow-visible transition-transform duration-75`}>
                <ModalHeader 
                    title="Log Call" 
                    open={open}             // <--- Pass karein
                    setOpen={setOpen}       // <--- Pass karein
                    isMaximized={isMaximized} 
                    setIsMaximized={setIsMaximized} 
                    onClose={onClose} 
                    onMouseDown={handleMouseMoveDown} 
                />

                {open && (
                    <>
                        <div className='grid grid-cols-4 mt-2 gap-2 px-4 border-b border-gray-100 py-5'>
                            <CustomDropdown label="Contacted" options={["John Smith"]} selected={conact} onSelect={setConact} showCheckbox={true} />
                            <CustomDropdown label="Call Outcome" options={["Busy", "Connected", "Left Voicemail", "No Answer", "Wrong Number"]} selected={callOutcome} onSelect={setCallOutcome} />
                            <CustomDropdown label="Call Type" options={["Follow Up Call", "Intro Call", "Screening Call", "Client Call"]} selected={callType} onSelect={setCallType} />
                            <CustomDropdown label="Call Direction" options={["Inbound", "Outbound"]} selected={callDirection} onSelect={setCallDirection} />
                        </div>
                        <div className='px-4'>
                            <RichTextToolbar placeholder="Start Typing to Log a Call..." />
                        </div>
                        <div className='px-4'>
                            <RecordSearchPopup />
                        </div>

                        <div className='mt-5 px-4 mb-4'>
                            <div className='flex items-center gap-2 text-[13px] flex-wrap'>
                                <div
                                    onClick={() => setCheckedRecord(!checkedRecord)}
                                    className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${checkedRecord ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300 bg-white'}`}
                                >
                                    {checkedRecord && <span className='text-[11px] font-bold leading-none'>✓</span>}
                                </div>
                                <span className='text-gray-700'>Create a</span>
                                <div className='relative'>
                                    <button
                                        type="button"
                                        className='flex items-center gap-1 text-purple-600 font-medium cursor-pointer bg-transparent outline-none'
                                        onClick={() => setCallOpen(!callOpen)}
                                    >
                                        <span>{selectedTask}</span>
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${callOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    {callOpen && (
                                        <div className="absolute left-0 top-full mt-1 w-28 bg-white border border-gray-200 rounded shadow-lg z-[100] overflow-hidden py-1">
                                            {taskOptions.map((opt) => (
                                                <div
                                                    key={opt}
                                                    onClick={() => {
                                                        setSelectedTask(opt)
                                                        setCallOpen(false)
                                                    }}
                                                    className={`px-3 py-1.5 text-[13px] cursor-pointer transition-colors ${selectedTask === opt ? 'bg-slate-100 text-purple-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <SimpleFollowUpSelector />
                                </div>
                            </div>

                            <div className='flex items-center justify-between mt-6 pt-2'>
                                <button type="button" className='px-4 py-2 cursor-pointer rounded bg-purple-400 hover:bg-purple-500 text-white font-medium text-[13px] transition-colors'>
                                    Create Note
                                </button>
                                <Trash2 className='cursor-pointer text-gray-400 hover:text-red-500' size={18} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default LogCall