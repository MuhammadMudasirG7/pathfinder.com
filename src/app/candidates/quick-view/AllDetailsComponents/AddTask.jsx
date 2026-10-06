import React, { useState } from 'react'
import ModalHeader from './ModalHeader'
import { useDraggable } from '../../hooks/useDraggable';
import CustomDropdown from './CustomDropdown';
import RichTextToolbar from './RichTextToolbar';
import RecordSearchPopup from './RecordSearchPopup';
import { Clock } from 'lucide-react';

function AddTask({ onClose }) {
    const [open, setOpen] = useState(true); // <--- Yeh state add karein
    const [priority, setPriority] = useState("None");
    const [task, setTask] = useState("Select");
    const [assign, setAssign] = useState("Sarah Jenkins");
    const [activityDate, setActivityDate] = useState("In 2 business days (Wednesday)");
    const [activityTime, setActivityTime] = useState("8:00 AM");
    const [reminder, setReminder] = useState("No reminder");
    const [checkedRecord, setCheckedRecord] = useState(true);

    const { position, isMaximized, setIsMaximized, handleMouseMoveDown, modalRef } = useDraggable();

    return (
        <div className='fixed inset-0 z-[9999] p-4 bg-black/50 flex items-center justify-center'>
            <div ref={modalRef}
                style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                className={`bg-white relative w-full ${isMaximized ? "max-w-[800px]" : "max-w-[650px]"} rounded-lg border border-gray-300 shadow-xl overflow-visible transition-transform duration-75`}
            >
                <ModalHeader 
                    title="Task" 
                    open={open}               // <--- Pass karein
                    setOpen={setOpen}         // <--- Pass karein
                    isMaximized={isMaximized}
                    setIsMaximized={setIsMaximized}
                    onClose={onClose}
                    onMouseDown={handleMouseMoveDown}
                />

                {/* Agar open true ho tab hi content dikhe */}
                {open && (
                    <div className='p-2 bg-white rounded-b-lg'>
                        <div className='flex items-center mt-1 pb-4 border-b border-gray-100'>
                            <span className='text-[13px] font-semibold text-gray-800 whitespace-nowrap'>Task Title:</span> 
                            <input 
                                type="text" 
                                placeholder='Enter task name...' 
                                className='px-3 py-0.5 rounded w-full outline-none border border-gray-200 focus:border-purple-600 ml-3 text-[13px] bg-white' 
                            />
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2'>
                            <CustomDropdown label="Task Type" options={["Select", "To Do", "Call", "Email"]} selected={task} onSelect={setTask} showCheckbox={true} />
                            <CustomDropdown label="Task Priority" options={["None", "Low", "Medium", "High"]} selected={priority} onSelect={setPriority} showCheckbox={true} />
                            <CustomDropdown label="Assigned To" options={["No Owner", "Sarah Jenkins", "John Doe", "Jane Doe"]} selected={assign} onSelect={setAssign} showCheckbox={true} />
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4'>
                            <CustomDropdown label="Activity Date" options={["Today", "Tomorrow", "In 2 business days (Wednesday)", "Next Week"]} selected={activityDate} onSelect={setActivityDate} showCheckbox={false} />
                            <CustomDropdown label="Time" options={["7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "5:00 PM"]} selected={activityTime} onSelect={setActivityTime} showCheckbox={false} leftIcon={<Clock size={14} />} />
                            <CustomDropdown label="Set Reminder" options={["No reminder", "At time of activity", "15 minutes before", "1 hour before"]} selected={reminder} onSelect={setReminder} showCheckbox={false} />
                        </div>
                         
                        <div className='mt-5'>
                            <RichTextToolbar placeholder="Add task description..." />
                        </div>
                        
                        <div className='mt-3'>
                            <RecordSearchPopup checkedRecord={checkedRecord} setCheckedRecord={setCheckedRecord} />
                        </div>

                        <div className='mt-4 flex justify-start'>
                            <button type="button" className='px-4 py-2 bg-purple-400 hover:bg-purple-500 text-white font-medium text-[13px] rounded transition-colors cursor-pointer'>
                                Create Task
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AddTask;