

"use client"
import React, { useState } from 'react'

import CandidateTable from './CandidateTable'
import CandidateForm from './CandidateForm'
function page() {
    const [candidates, setCandidates] = useState([])
    const [selectedCandidate, setSelectedCandidate] = useState(null)
    const [isVisible, setIsVisible] = useState(null)

    const handleFormSubmit = (data) => {
    let index = candidates.findIndex((b) => b.id === data.id); 
    if (index > -1) {
        candidates[index] = data;
        console.log("data Updated", dataList); 
    } else {
            const newCandidate = { ...data, id: Date.now() }
            setCandidates(prev => [...prev, newCandidate])
        }
        setSelectedCandidate(null);
        setIsVisible(false)
    }
    const handleEditForm = (candidate) => {
        setSelectedCandidate(candidate);
        setIsVisible(true)
    }
    const handleDelete = (id) => {
        setCandidates(prev => prev.filter(i => i.id !== id))
    }
    const handleAddNew = () => {
        setSelectedCandidate(null);
        setIsVisible(true)
    }
    return (
        <div className=' min-h-screen bg-gray-50'>
            
            <CandidateTable onEdit={handleEditForm} onDelete={handleDelete} data={candidates} onAddNew = {handleAddNew} />
            {isVisible && 
             <CandidateForm onSubmitSuccess={handleFormSubmit} onClose={() => setIsVisible(false)} />
            }
        </div>
    )
}

export default page