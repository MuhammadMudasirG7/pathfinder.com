import React, { useState } from 'react'
import { Trash2, ChevronDown } from 'lucide-react'
import SimpleFollowUpSelector from './SimpleFollowUpSelector'
import RichTextToolbar from './RichTextToolbar'
import RecordSearchPopup from './RecordSearchPopup'
import ModalHeader from './ModalHeader'
import { useDraggable } from '../../hooks/useDraggable'

function AddNote({ onClose, onCreateNote }) {

    const [open, setOpen] = useState(true)
    const [checkedRecord, setCheckedRecord] = useState(true)
    const [selectedTask, setSelectedTask] = useState("To Do")
    const [noteContent, setNoteContent] = useState("")
    const [callOpen, setCallOpen] = useState(false)
    const [editorKey, setEditorKey] = useState(0)

    const { position, isMaximized, setIsMaximized, handleMouseMoveDown ,modalRef} = useDraggable()

    const taskOptions = ["To Do", "Email", "Call"]

    // Editor ka data yahan save hoga
    const triggerChange = (content) => {
        setNoteContent(content)
    }

    // Create Note button
    const handleCreateNote = () => {

        const noteData = {
            candidate: "John Smith",
            task: selectedTask,
            note: noteContent,
            associatedRecord: checkedRecord
        }

        // Data Activities ko bhej do
        onCreateNote(noteData)

        // Form clear
        setNoteContent("")
        setEditorKey(prev => prev + 1)
    }

    // Trash button
    const handleDelete = () => {
        setNoteContent("")
        setEditorKey(prev => prev + 1)
    }

    return (
        <div className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4'>

            <div ref={modalRef}
                style={{
                    transform: `translate(${position.x}px, ${position.y}px)`
                }}
                className={`relative bg-white rounded-lg border border-gray-300 shadow-xl overflow-visible transition-transform duration-75 ${
                    isMaximized
                        ? "w-full max-w-[800px]"
                        : "w-full max-w-[650px]"
                }`}
            >

                <ModalHeader
                    title="Note"
                    open={open}
                    setOpen={setOpen}
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    onClose={onClose}
                    onMouseDown={handleMouseMoveDown}
                />

                {open && (
                    <div className='p-5 bg-white rounded-b-lg relative'>

                        {/* Candidate */}
                        <div className='mb-4'>
                            <p className='text-[13px] font-semibold text-gray-800'>
                                For:
                                <span className='font-normal text-gray-700'>
                                    {' '}John Smith
                                </span>
                            </p>
                        </div>

                        {/* Editor */}
                        <RichTextToolbar
                            key={editorKey}
                            onContentChange={triggerChange}
                            placeholder='Start typing to leave a note...@ mention to notify users'
                        />

                        {/* Record */}
                        <div className='my-3'>
                            <RecordSearchPopup
                                checkedRecord={checkedRecord}
                                setCheckedRecord={setCheckedRecord}
                            />
                        </div>

                        {/* Task */}
                        <div className='mt-5'>

                            <div className='flex items-center gap-2 text-[13px] flex-wrap'>

                                <div
                                    onClick={() => setCheckedRecord(!checkedRecord)}
                                    className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                                        checkedRecord
                                            ? 'bg-purple-600 border-purple-600 text-white'
                                            : 'border-gray-300 bg-white'
                                    }`}
                                >
                                    {checkedRecord && (
                                        <span className='text-[11px] font-bold leading-none'>
                                            ✓
                                        </span>
                                    )}
                                </div>

                                <span className='text-gray-700'>
                                    Create a
                                </span>

                                {/* Task Dropdown */}
                                <div className='relative'>

                                    <button
                                        type="button"
                                        className='flex items-center gap-1 text-purple-600 font-medium cursor-pointer bg-transparent outline-none'
                                        onClick={() => setCallOpen(!callOpen)}
                                    >
                                        <span>{selectedTask}</span>

                                        <ChevronDown
                                            size={14}
                                            className={`transition-transform duration-200 ${
                                                callOpen ? "rotate-180" : ""
                                            }`}
                                        />
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
                                                    className={`px-3 py-1.5 text-[13px] cursor-pointer transition-colors ${
                                                        selectedTask === opt
                                                            ? 'bg-slate-100 text-purple-600 font-semibold'
                                                            : 'text-slate-700 hover:bg-slate-50'
                                                    }`}
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

                            {/* Buttons */}
                            <div className='flex items-center justify-between mt-6 pt-2'>

                                <button
                                    onClick={handleCreateNote}
                                    type="button"
                                    className='px-4 py-2 cursor-pointer rounded bg-purple-400 hover:bg-purple-500 text-white font-medium text-[13px] transition-colors'
                                >
                                    Create Note
                                </button>

                                <Trash2
                                    onClick={handleDelete}
                                    className='cursor-pointer text-gray-400 hover:text-red-500'
                                    size={18}
                                />

                            </div>

                        </div>

                    </div>
                )}

            </div>

        </div>
    )
}

export default AddNote