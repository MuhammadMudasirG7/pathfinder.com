import GlobalDoubleIcon from '@/components/GlobalDoubleIcon';
import GlobalFormBuilder from '@/components/GlobalFormBuilder';
import React, { useState } from 'react'

function ProfessionalDetails({ data, handleChange }) {
    const [isProfessionalOpen, setIsProfessionalOpen] = useState(true)
    const FormFields = [
        { name: "currentemployer", label: "Current Employer", type: "input", placeholder: "Acme Corp" },
        { name: "currentjobtitle", label: "Current Job Title", type: "input", placeholder: "Softwear Engineer" },
        { name: "experience", label: "Experience In Years", type: "input", placeholder: "5" },
        { name: "currentsalary", label: "Current Salary", type: "input", placeholder: "85,000" },
        { name: "expectedsalary", label: "Expected Salary", type: "input", placeholder: "95,000" },
        { name: "employmentstatus", label: "Employment Status", type: "dropdown", placeholder: "Select Status", options: [{ name: "employed", label: "Employed" }, { name: "unemployed", label: "Un-Employed" }, { name: "freelancer", label: "Freelancer" }] },
        { name: "notice", label: "Notice Period", type: "input", placeholder: "4 Weaks" },
        { name: "availabefrom", label: "Availabe From", type: "date", placeholder: "DD-MM-YY" }
    ];
    return (
        <div>
            <GlobalDoubleIcon title={"Professional Details"} isOpen={isProfessionalOpen} onToggle={() => setIsProfessionalOpen(!isProfessionalOpen)} />
            {isProfessionalOpen && (
                <GlobalFormBuilder fields={FormFields} onChange={handleChange} formData={data} />
            )}
        </div>
    )
}

export default ProfessionalDetails