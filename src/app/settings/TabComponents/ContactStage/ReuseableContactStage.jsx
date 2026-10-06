import React, { useState } from 'react'
import { meetingTypeFields } from '../../settingComponents/SettingData'
import { GripVertical, Info, Plus, Trash2 } from 'lucide-react'


export default function ReuseableContactStage({ initialFields, title, btnText, placeholder }) {
    const [meetings, setMeetings] = useState(initialFields)
    const handleAddMeeting = () => {
        const isAnyInputOpen = meetings.some(item => item.isCustom && !item.isSaved)
        if (isAnyInputOpen) {
            return
        }
        const newMeeting = { id: Date.now(), name: "", isCustom: true, isSaved: false }
        setMeetings([...meetings, newMeeting])
    }
    const handleDelete = (id) => {
        setMeetings(meetings.filter(item => item.id !== id))
    }
    const handleNameChange = (id, value) => {
        setMeetings(meetings.map(item => item.id === id ? { ...item, name: value } : item))
    }
    const handleSave = () => {
        setMeetings(meetings.map(item => item.isCustom ? { ...item, isSaved: true } : item))
    }
    const inputClass = "px-2 py-0.5 text-[12px] font-sans font-medium text-gray-700 rounded-xs w-[25%] outline-none border border-gray-200 hover:shadow-[0_0_3px_rgb(99,102,239,0.52)] placeholder:text-[12px]"
    return (
        <div className='p-4 relative'>
            <div className='p-4 flex items-center justify-end'>
                <button onClick={handleAddMeeting} className='bg-[#6E41E2] flex items-center gap-2 font-sans font-medium rounded  px-2 py-2 cursor-pointer'>
                    <Plus size={14} className='text-white' />
                    <span className='text-[10px] text-white'>{btnText}</span></button>
            </div>
            <div className='border border-gray-200 rounded'>
                <div className='bg-gray-100 border-b border-gray-200 py-1.5 px-3'>
                    <span className='text-[12px] text-gray-700 font-medium font-sans'>{title}</span>
                </div>
                <div className='p-3.5 mt-2'>
                    {meetings.map((item) => (
                        <div key={item.id}>

                            <div className='flex items-center justify-between p-2 mb-4 border border-gray-200 rounded'>
                                <div className='flex items-center gap-2 w-full'>
                                    {item.isGrab && (
                                        <GripVertical size={14} className='text-gray-600' />
                                    )}
                                    {item.isCustom && !item.isSaved ? (
                                        <input type="text" onChange={(e) => handleNameChange(item.id, e.target.value)} value={item.name} placeholder={placeholder} className={inputClass} />)
                                        : (<span className='text-[11px] text-gray-700'>{item.name}</span>
                                        )}
                                </div>
                                {item.isCustom ? <Trash2 onClick={() => handleDelete(item.id)} size={14} className='cursor-pointer' /> : <Info size={14} />}
                            </div>

                            {item.isCustom && !item.isSaved && (
                                <div className='flex justify-end gap-4 border-t border-gray-200'>
                                    <button onClick={() => handleDelete(item.id)} className='px-3 py-1 border border-gray-200 rounded font-sans mt-3 text-[12px] cursor-pointer'>Cancel</button>
                                    <button onClick={handleSave} className='px-4 py-1 border border-gray-200 text-white rounded mt-3 bg-[#6E41E2] font-sans cursor-pointer text-[12px]'>Save</button>
                                </div>
                            )}
                        </div>

                    ))}
                </div>
            </div>
            
        </div>
    )
}
