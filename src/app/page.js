"use client";

import { useState } from "react";
import CandidateTable from "./candidates/CandidateTable";
import CandidateForm from "./candidates/CandidateForm";

export default function Page() {

    const [candidates, setCandidates] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleAddCandidate = (newCandidate) => {
        newCandidate.id = `PAC_${Date.now()}CAND`;
        setCandidates([...candidates, newCandidate])
    };
    const handleDelete = (selectedCandidates) => {
        const currentCandidates = [...candidates];
        selectedCandidates.forEach(candidate => {
            const index = currentCandidates.findIndex(item => item.id === candidate.id)
            if (index !== -1) {
                currentCandidates.splice(index, 1)
            }
        });
        
           setCandidates(currentCandidates)
    };
    return (
        <div className="max-w-7xl mx-auto">

            <CandidateTable
                candidates={candidates}
                onOpen={() => setIsFormOpen(true)}
                onDelete={handleDelete}
            />

            {isFormOpen && (
                <CandidateForm
                    onClose={() => setIsFormOpen(false)}
                    onAddCandidate={handleAddCandidate}
                />
            )}

        </div>
    );
}