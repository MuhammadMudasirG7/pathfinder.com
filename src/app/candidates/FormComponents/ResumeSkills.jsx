import React, { useState } from 'react'
import { Search, Upload } from 'lucide-react'

function ResumeSkills() {

    const [skills, setSkills] = useState("")
    const [resume, setResume] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0]

        if (file) {
            setResume(file)
            console.log("Selected Resume:", file)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()

        const file = e.dataTransfer.files[0]

        if (file) {
            setResume(file)
            console.log("Dropped Resume:", file)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    return (
        <div className="mt-5">

            {/* Header */}
            <div className="bg-gray-100 rounded px-4 py-4">
                <h2 className="text-[13px] font-bold text-gray-700">
                    Resume & Skills
                </h2>
            </div>


            {/* Resume Upload */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="mt-5 border border-dashed border-gray-300 rounded h-36.5 flex flex-col items-center justify-center"
            >

                <Upload
                    size={18}
                    className="text-gray-500 mb-3"
                />

                <p className="text-[13px] text-gray-700 mb-3">
                    Upload Candidate Resume
                </p>

                <p className="text-[11px] text-gray-500">
                    Drag & Drop to upload document or{" "}
                    
                    <label
                        htmlFor="resume-upload"
                        className="text-indigo-600 cursor-pointer"
                    >
                        choose file
                    </label>{" "}
                    
                    from your computer
                </p>

                <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={handleFileChange}
                />

            </div>


            {/* Selected File */}
            {resume && (
                <p className="mt-2 text-[11px] text-gray-500">
                    Selected: {resume.name}
                </p>
            )}


            {/* Skills */}
            <div className="mt-5">

                <label className="block text-[12px] text-gray-600 font-bold mb-2">
                    Skills
                </label>

                <div className="relative">

                    <input
                        type="text"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                        placeholder="Search and Add"
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded outline-none text-[12px] text-gray-600 placeholder:text-gray-300 hover:shadow-[0_0_0_3px_rgba(99,102,241,0.12)] transition-shadow duration-200"
                    />

                    <Search
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />

                </div>

            </div>

        </div>
    )
}

export default ResumeSkills