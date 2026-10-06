import GlobalDoubleIcon from '@/components/GlobalDoubleIcon'
import GlobalFormBuilder from '@/components/GlobalFormBuilder'
import React, { useState } from 'react'

function WorkHistory({ data, handleChange,setFormData }) {

    const [isWorkOpen, setIsWorkOpen] = useState(false)

    const FormFields = [
        {
            name: "jobTitle",
            label: "Job Title",
            type: "input",
            placeholder: "Product Manager",
            fullWidth: true
        },

        {
            name: "company",
            label: "Company",
            type: "input",
            placeholder: "Google"
        },

        {
            name: "employmentType",
            label: "Employment Type",
            type: "dropdown",
            placeholder: "Select Employment Type",
            options: [
                { label: "Full Time", value: "full-time" },
                { label: "Part Time", value: "part-time" },
                { label: "Contract", value: "contract" },
                { label: "Internship", value: "internship" }
            ]
        },

        {
            name: "industry",
            label: "Industry",
            type: "dropdown",
            placeholder: "Select Industry",
            options: [
                { label: "Information Technology", value: "information-technology" },
                { label: "Software", value: "software" },
                { label: "Finance", value: "finance" },
                { label: "Healthcare", value: "healthcare" },
                { label: "Education", value: "education" }
            ]
        },

        {
            name: "workArrangementType",
            label: "Work Arrangement Type",
            type: "dropdown",
            placeholder: "Select Work Arrangement Type",
            options: [
                { label: "On-site", value: "on-site" },
                { label: "Remote", value: "remote" },
                { label: "Hybrid", value: "hybrid" }
            ]
        },

        {
            name: "duration",
            label: "Duration",
            type: "duration"
        },

        {
            name: "currentlyWorking",
            label: "I currently work here",
            type: "toggle"
        },

        {
            name: "workSummary",
            label: "Work Summary",
            type: "textarea",
            placeholder: "Describe your responsibilities...",
            fullWidth: true
        }
    ]
    const handleDelete = () => {
        setFormData((prev) => ({ ...prev, jobTitle: "", company: "", employmentType: "", industry: "", workArrangementType: "", duration: {}, currentlyWorking: false, workSummary: ""}))
        setIsWorkOpen(false)}

    return (
        <div>

            <GlobalDoubleIcon title="Work History" isOpen={isWorkOpen} onToggle={() => setIsWorkOpen(!isWorkOpen)} />

            {isWorkOpen && (
                <GlobalFormBuilder fields={FormFields} formData={data} onChange={handleChange} onDelete={handleDelete} />
            )}

        </div>
    )
}

export default WorkHistory