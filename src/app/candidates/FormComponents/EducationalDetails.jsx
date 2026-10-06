import GlobalDoubleIcon from '@/components/GlobalDoubleIcon'
import GlobalFormBuilder from '@/components/GlobalFormBuilder'
import React, { useState } from 'react'

function EducationalDetails({data,handleChange,onDelete}) {
    const [isEduOpen,setIsEduOpen] = useState(false)
    
    const FormFields = [
        {name:"institute",label:"Insitute/School", type:"input", placeholder :"Stanford University", fullWidth:true},
        {name:"eduQualification", label:"Education Qualification", type:"input", placeholder:"Add Qualifications", required:true},
        {name:"specialization", label:"Specializations", type:"input", placeholder:"Computer Science"},
        {name: "duration",label: "Duration",type: "duration",},
        {name: "currentlyPursuing",label: "Currently pursuing",type: "toggle"},
        {name: "educationalSummary",label: "Educational Summary",type: "textarea",placeholder: "Brief overview of your studies...",fullWidth: true}
    ]
  return (
    <div>
          <GlobalDoubleIcon title={"Educational Details"} isOpen={isEduOpen} onToggle={() => setIsEduOpen(!isEduOpen)} /> 
          {isEduOpen && (
           <GlobalFormBuilder fields={FormFields} onChange={handleChange} formData={data}  />
          )}
    </div>
  )
}

export default EducationalDetails