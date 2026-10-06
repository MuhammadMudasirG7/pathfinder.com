import React, { useState } from 'react'
import EnforceHeader from '../../TabComponents/jobFieldsComponents/EnforceHeader'
import JobTitleHeader from '../../TabComponents/jobFieldsComponents/JobTitleHeader'
import { contactAddressInfoFields, contactCommunicationFields, contactDetailsFields, contactRelationshipFields, contactSocialLinksFields, locationFields, RecordDetailsFields } from '../SettingData'
import JobFieldsList from '../../TabComponents/jobFieldsComponents/JobFieldsList'

export default function ContactFields() {
  const [contactRecordOpen, setContactRecordOpen] = useState(true)
  const [contactDetailsOpen, setContactDetailsOpen] = useState(true)
  const [contactComunicationOpen, setContactComunicationOpen] = useState(true)
  const [contactLinksOpen, setContactLinksOpen] = useState(true)
  const [contactAddressOpen, setContactAddressOpen] = useState(true)
  const [contactRelationOpen, setContactRelationOpen] = useState(true)

  return (
    <div className='p-3 min-h-screen'>
      <div className='p-2 border border-gray-200 rounded space-y-3'>
        <EnforceHeader />
        <JobTitleHeader title="Contact Details" isOpen={contactDetailsOpen} setIsOpen={setContactDetailsOpen} />
        <JobFieldsList isOpen={contactDetailsOpen} initialFields={contactDetailsFields} showExtensions={true} />

        <JobTitleHeader title="Record Details" isOpen={contactRecordOpen} setIsOpen={setContactRecordOpen} />
        <JobFieldsList isOpen={contactRecordOpen} initialFields={RecordDetailsFields} showExtensions={true} />

        <JobTitleHeader title="Contact Communication" isOpen={contactComunicationOpen} setIsOpen={setContactComunicationOpen} />
        <JobFieldsList isOpen={contactComunicationOpen} initialFields={contactCommunicationFields} showExtensions={true} />

        <JobTitleHeader title="Contact Social Links" isOpen={contactLinksOpen} setIsOpen={setContactLinksOpen} />
        <JobFieldsList isOpen={contactLinksOpen} initialFields={contactSocialLinksFields} showExtensions={true} />

        <JobTitleHeader title="Contact Address Info" isOpen={contactAddressOpen} setIsOpen={setContactAddressOpen} />
        <JobFieldsList isOpen={contactAddressOpen} initialFields={contactAddressInfoFields} showExtensions={true} />

        <JobTitleHeader title="Contact Relationship" isOpen={contactRelationOpen} setIsOpen={setContactRelationOpen} />
        <JobFieldsList isOpen={contactRelationOpen} initialFields={contactRelationshipFields} showExtensions={true} />
      </div>
    </div>
  )
}
