import React, { useState } from 'react'
import PersonalDetails from './FormComponents/PersonalDetails'
import ProfessionalDetails from './FormComponents/ProfessionalDetails';
import EducationalDetails from './FormComponents/EducationalDetails';
import WorkHistory from './FormComponents/WorkHistory';
import ResumeSkills from './FormComponents/ResumeSkills';
import CandidateSummary from './FormComponents/CandidateSummary'

function CandidateForm({onClose,onAddCandidate}) {

    const [formData, setFormData] = useState({});


    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev, [name]: value
        }))
    }
    const handleSubmit = () => {
        onAddCandidate(formData)
        onClose(true)
        console.log(formData);
        
    }
    return (
        <div className='fixed inset-0 z-9999'>
            <div className='absolute inset-0 bg-black/30'>
                <div className='absolute top-0 right-0 w-full h-full md:w-[70%] flex flex-col bg-white'>
                    {/* Header Div */}
                    <div className='flex items-center justify-between border-b border-gray-200'>
                        <div className='flex items-center gap-4 p-4'>
                            <span className='font-bold text-gray-500'>Candidates</span>
                            <span className='font-bold text-gray-500 text-2xl'>→</span>
                            <span className='font-bold text-gray-700'>Add Candidate</span>
                        </div>
                        <span onClick={onClose} className=' mr-9 text-gray-600 cursor-pointer'>X</span>
                    </div>
                    {/* Center Div */}
                    <div className='flex-1 min-h-0 overflow-y-auto px-5 py-2 overflow-x-visible'>
                        <PersonalDetails handleChange={handleChange} data={formData} />
                        <ProfessionalDetails handleChange={handleChange} data={formData} />
                        <EducationalDetails handleChange={handleChange} data={formData} />
                        <WorkHistory handleChange={handleChange} setFormData ={setFormData} data={formData} />
                        <ResumeSkills />
                        <CandidateSummary data={formData}  handleChange={handleChange} />
                    </div>
                    {/* Bottom Div */}
                    <div className='flex justify-end items-center gap-7 p-4 border-t border-gray-200 '>
                        <button onClick={onClose} className='px-5 py-1 border border-gray-300 rounded  font-medium text-gray-600 tracking-wide hover:bg-gray-50 cursor-pointer'>
                            Cancel
                        </button>
                        <button type='submit'  onClick={handleSubmit} className='px-5 py-2 mr-4 border border-gray-300 bg-violet-700 rounded text-white font-medium tracking-wide hover:bg-violet-600 cursor-pointer'>
                            Add Candidate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CandidateForm