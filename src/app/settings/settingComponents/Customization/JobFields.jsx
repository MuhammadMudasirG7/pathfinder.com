import React, { useState } from 'react'
import EnforceHeader from '../../TabComponents/jobFieldsComponents/EnforceHeader'
import JobTitleHeader from '../../TabComponents/jobFieldsComponents/JobTitleHeader'
import JobFieldsList from '../../TabComponents/jobFieldsComponents/JobFieldsList'
import { adminFields, jobDetailsFields } from '../SettingData'

export default function JobFields() {
    const [isjobOpen,setIsjobOpen] = useState(true)
    const [isAdminOpen,setIsAdmin] = useState(true)
    return (
        <div className='p-3 min-h-screen'>
            <div className='p-2 border border-gray-200 rounded space-y-3'>
                <EnforceHeader />
                <JobTitleHeader title="Job Details" isOpen={isjobOpen} setIsOpen ={setIsjobOpen} />
                <JobFieldsList isOpen={isjobOpen} initialFields = {jobDetailsFields} />
                <JobTitleHeader title="Admin Details" isOpen={isAdminOpen} setIsOpen ={setIsAdmin} />
                <JobFieldsList isOpen={isAdminOpen} initialFields = {adminFields} />
                <div className='flex items-center justify-end'>
                    <button className='text-[10px] font-medium font-sans bg-violet-700 hover:bg-violet-600 text-white px-3 py-1.5 rounded cursor-pointer'>Save Changes</button>
                </div>
            </div>
        </div>
    )
}
