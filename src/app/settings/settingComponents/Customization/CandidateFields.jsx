import React, { useState } from 'react'
import EnforceHeader from '../../TabComponents/jobFieldsComponents/EnforceHeader'
import JobTitleHeader from '../../TabComponents/jobFieldsComponents/JobTitleHeader'
import JobFieldsList from '../../TabComponents/jobFieldsComponents/JobFieldsList'
import { candidateSummaryFields, educationalDetailsFields, personalDetailsFields, professionalDetailsFields, resumeAndSkillsFields, workHistoryFields } from '../SettingData'

export default function CandidateFields() {
  const [personalOpen, setPersonalOpen] = useState(true)
  const [professionalOpen, setProfessionalOpen] = useState(true)
  const [eduOpen, setEduOpen] = useState(true)
  const [workHisOpen, setWorkHisOpen] = useState(true)
  const [skillOpen, setSkillOpen] = useState(true)
  const [linksOpen, setLinksOpen] = useState(true)
  const [summaryOpen, setSummaryOpen] = useState(true)

  return (
    <div className='p-3 min-h-screen'>
      <div className='p-2 border border-gray-200 rounded space-y-3'>
        <EnforceHeader />
        <JobTitleHeader title="Personal Details" isOpen={personalOpen} setIsOpen={setPersonalOpen} />
        <JobFieldsList isOpen={personalOpen} initialFields={personalDetailsFields} showExtensions={true} />

        <JobTitleHeader title="Professional Details" isOpen={professionalOpen} setIsOpen={setProfessionalOpen} />
        <JobFieldsList isOpen={professionalOpen} initialFields={professionalDetailsFields} showExtensions={true} />

        <JobTitleHeader title="Educational Details" isOpen={eduOpen} setIsOpen={setEduOpen} />
        <JobFieldsList isOpen={eduOpen} initialFields={educationalDetailsFields} showExtensions={true} />

        <JobTitleHeader title="Work History" isOpen={workHisOpen} setIsOpen={setWorkHisOpen} />
        <JobFieldsList isOpen={workHisOpen} initialFields={workHistoryFields} showExtensions={true} />

        <JobTitleHeader title="Resume and Skills" isOpen={skillOpen} setIsOpen={setSkillOpen} />
        <JobFieldsList isOpen={skillOpen} initialFields={resumeAndSkillsFields} showExtensions={true} />

        <JobTitleHeader title="Social Links" isOpen={linksOpen} setIsOpen={setLinksOpen} />
        <JobFieldsList isOpen={linksOpen} initialFields={educationalDetailsFields} showExtensions={true} />

        <JobTitleHeader title="Candidate Summary" isOpen={summaryOpen} setIsOpen={setSummaryOpen} />
        <JobFieldsList isOpen={summaryOpen} initialFields={candidateSummaryFields} showExtensions={true} />
      </div>
    </div>
  )
}
