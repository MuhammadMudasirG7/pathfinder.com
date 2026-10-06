import React, { useState } from 'react'
import JobTitleHeader from '../../TabComponents/jobFieldsComponents/JobTitleHeader'
import JobFieldsList from '../../TabComponents/jobFieldsComponents/JobFieldsList'
import { associatedWithFields, dealDetailsFields } from '../SettingData'

export default function DealFields() {
    const [dealOpen,setDealOpen] = useState(true)
    const [associateOpen,setAssociateOpen] = useState(true)
  return (
    <div className='p-3'>
        <div className='p-2 border border-gray-200'>
           <JobTitleHeader title="Deal Details" isOpen={dealOpen} setIsOpen={setDealOpen} showToggle={false} />
           <JobFieldsList isOpen={dealOpen} initialFields={dealDetailsFields} />

           <JobTitleHeader title="Associated With" isOpen={associateOpen} setIsOpen={setAssociateOpen} showToggle={false} />
           <JobFieldsList isOpen={associateOpen} initialFields={associatedWithFields} />
        </div>  
    </div>
  )
}
