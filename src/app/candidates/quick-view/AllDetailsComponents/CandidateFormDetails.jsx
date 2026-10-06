import React from 'react';
import GlobalDetails from './GlobalDetails';


export default function CandidateFormDetails({ candidate }) {

  // 1. Personal Details Data Mapping
  const personalFields = [
    { label: 'First Name*', value: candidate?.firstName || 'John' },
    { label: 'Last Name*', value: candidate?.lastName || 'Smith' },
    { label: 'Email*', value: candidate?.email || 'john.smith@example.com' },
    { label: 'Phone', value: candidate?.phone || '+1 555-0184' },
    { label: 'Gender', value: candidate?.gender || 'Male' },
    { label: 'Birth Date', value: candidate?.dob || '12-05-1994' },
    { label: 'Full Address', value: candidate?.address || '42 Market Street, Apt 8B' },
    { label: 'City*', value: candidate?.city || 'New York' },
    { label: 'Suburb', value: candidate?.suburb || 'Manhattan' },
    { label: 'State', value: candidate?.state || 'NY' },
    { label: 'Country', value: candidate?.country || 'USA' },
    { label: 'Postal Code', value: candidate?.postalCode || '10001' },
    { label: 'Willing to Relocate', value: candidate?.relocate ? 'Yes' : 'Yes' },
  ];

  // 2. Educational Details Data Mapping
  const educationalFields = [
    { label: 'Degree*', value: candidate?.degree || 'BS Computer Science' },
    { label: 'Institute*', value: candidate?.institute || 'Harvard University' },
    { label: 'Field of Study', value: candidate?.major || 'Software Engineering' },
    { label: 'Graduation Year', value: candidate?.gradYear || '2016' },
    { label: 'Grade / CGPA', value: candidate?.cgpa || '3.8 / 4.0' },
  ];

  // 3. Professional Details Data Mapping
  const professionalFields = [
    { label: 'Current Role*', value: candidate?.jobTitle || 'Senior Frontend Engineer' },
    { label: 'Company*', value: candidate?.company || 'Acme Talent Systems' },
    { label: 'Total Experience', value: candidate?.experience || '7 Years' },
    { label: 'Notice Period', value: candidate?.noticePeriod || '4 Weeks' },
    { label: 'Current CTC', value: candidate?.currentCtc || '$110,000' },
    { label: 'Expected CTC', value: candidate?.expectedSalary || '$135,000' },
  ];

  return (
    <div className="space-y-6 w-full mt-4">
      {/* Section 1: Personal Details */}
      <GlobalDetails
        title="Personal Details"
        fields={personalFields}
        onEdit={() => console.log('Edit Personal Details Clicked')}
      />

      {/* Section 2: Educational Details */}
      <GlobalDetails
        title="Educational Details"
        fields={educationalFields}
        onEdit={() => console.log('Edit Educational Details Clicked')}
      />

      {/* Section 3: Professional Details */}
      <GlobalDetails
        title="Professional Details"
        fields={professionalFields}
        onEdit={() => console.log('Edit Professional Details Clicked')}
      />
    </div>
  );
}