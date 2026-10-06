export const settingsGroups = [
    {
        groupName: 'User Settings',
        items: [
            { name: 'Profile', id: 'profile' },
            { name: 'Notifications', id: 'notifications' },
            { name: 'Privacy & Security', id: 'privacy-security' },
            { name: 'Email', id: 'email' },
            { name: 'Calendar', id: 'calendar' },
            { name: 'Meeting Apps', id: 'meeting-apps' },
            { name: 'Activity History', id: 'activity-history' },
        ]
    },
    {
        groupName: 'Admin Settings',
        items: [
            { name: 'Company Details', id: 'company-details' },
            { name: 'Users', id: 'users' },
            { name: 'Roles & Permissions', id: 'roles-permissions' },
            { name: 'Teams', id: 'teams' },
            { name: 'Subscription & Billing', id: 'subscription-billing' },
            { name: 'Audit Log', id: 'audit-log' },
        ]
    },
    {
        groupName: 'Job Settings',
        items: [
            { name: 'Career Page', id: 'career-page' },
            { name: 'Application Form', id: 'application-form' },
            { name: 'Job Boards', id: 'job-boards' },
        ]
    },
    {
        groupName: 'Customisation',
        items: [
            { name: 'Candidate Fields', id: 'candidate-fields' },
            { name: 'Company Fields', id: 'company-fields' },
            { name: 'Contact Fields', id: 'contact-fields' },
            { name: 'Job Fields', id: 'job-fields' },
            { name: 'Job Templates', id: 'job-templates' },
            { name: 'Job Status', id: 'job-status' },
            { name: 'Email Templates', id: 'email-templates' },
            { name: 'Hiring Pipeline', id: 'hiring-pipeline' },
            { name: 'Deals Pipeline', id: 'deals-pipeline' },
            { name: 'Deal Fields', id: 'deal-fields' },
            { name: 'Contact Stage', id: 'contact-stage' },
            { name: 'Meeting Type', id: 'meeting-type' },
            { name: 'Note Type', id: 'note-type' },
            { name: 'Task Type', id: 'task-type' },
            { name: 'Tags', id: 'tags' },
            { name: 'Skill Set', id: 'skill-set' },
        ]
    },
    {
        groupName: 'Automation',
        items: [
            { name: 'Email Triggers', id: 'email-triggers' },
        ]
    },
    {
        groupName: 'Portal Settings',
        items: [
            { name: 'Client Portal', id: 'client-portal' },
        ]
    },
    {
        groupName: 'Data Admin',
        items: [
            { name: 'Data Migration', id: 'data-migration' },
            { name: 'Export Data', id: 'export-data' },
            { name: 'Storage', id: 'storage' },
            { name: 'Recycle Bin', id: 'recycle-bin' },
        ]
    },
    {
        groupName: 'Developer Space',
        items: [
            { name: 'APIs', id: 'apis' },
        ]
    },
    {
        groupName: 'Compliance',
        items: [
            { name: 'GDPR', id: 'gdpr' },
        ]
    },
    {
        groupName: 'AI Assist',
        items: [
            { name: 'PAC', id: 'pac' },
        ]
    }
];

// src/data/jobFieldsData.js

export const jobDetailsFields = [
    { id: 1, name: "Job Title", visible: true, required: true },
    { id: 2, name: "Job Type", visible: false, required: false },
    { id: 3, name: "Job Category", visible: false, required: false },
    { id: 4, name: "Job Industry", visible: false, required: false },
    { id: 5, name: "Job Location Type", visible: false, required: false },
    { id: 6, name: "Job Level", visible: false, required: false },
    { id: 7, name: "City", visible: false, required: false },
    { id: 8, name: "Suburb", visible: false, required: false },
    { id: 9, name: "State", visible: false, required: false },
    { id: 10, name: "Country", visible: false, required: false },
    { id: 11, name: "Postal Code", visible: false, required: false },
    { id: 12, name: "Minimum Salary", visible: false, required: false },
    { id: 13, name: "Maximum Salary", visible: false, required: false },
    { id: 14, name: "Frequency", visible: false, required: false },
    { id: 15, name: "Currency", visible: false, required: false },
    { id: 16, name: "Job Description", visible: true, required: true },
    { id: 17, name: "Educational Qualifications", visible: false, required: false },
    { id: 18, name: "Skills", visible: false, required: false },
    { id: 19, name: "Job Application Questions For Candidates", visible: false, required: false },
];

export const adminFields = [
    { id: 20, name: "Company Name", visible: true, required: true },
    { id: 21, name: "Contact Name", visible: false, required: false },
    { id: 22, name: "Contact Email", visible: false, required: false },
    { id: 23, name: "Contact Phone", visible: false, required: false },
    { id: 24, name: "No. of Positions", visible: false, required: false },
    { id: 25, name: "Hiring Pipeline", visible: false, required: false },
    { id: 26, name: "Target Date", visible: false, required: false },
    { id: 27, name: "Min. Experience", visible: false, required: false },
    { id: 28, name: "Max. Experience", visible: false, required: false },
    { id: 29, name: "Job Opening Status", visible: true, required: true },
    { id: 30, name: "Job Owner", visible: false, required: false },
    { id: 31, name: "Hiring Manager", visible: false, required: false },
    { id: 32, name: "Interview Scorecard", visible: false, required: false },
    { id: 33, name: "Hiring Team Members", visible: false, required: false },
    { id: 34, name: "Enable Job Application", visible: false, required: false },
];
export const personalDetailsFields = [
    { id: 1, name: "First Name*", visible: true, required: true, extension: true },
    { id: 2, name: "Last Name", visible: true, required: false, extension: true },
    { id: 3, name: "Email", visible: true, required: false, extension: true },
    { id: 4, name: "Phone Number", visible: true, required: false, extension: true },
    { id: 5, name: "Gender", visible: true, required: false, extension: false },
    { id: 6, name: "Birth Date", visible: false, required: false, extension: false },
    { id: 7, name: "Full Address", visible: false, required: false, extension: false },
    { id: 8, name: "City", visible: false, required: false, extension: false },
    { id: 9, name: "Street", visible: false, required: false, extension: false },
    { id: 10, name: "Suburb", visible: false, required: false, extension: false },
    { id: 11, name: "State", visible: false, required: false, extension: false },
    { id: 12, name: "Country", visible: false, required: false, extension: false },
    { id: 13, name: "Postal Code", visible: false, required: false, extension: false },
    { id: 14, name: "Willing to Relocate", visible: false, required: false, extension: false },
];

export const professionalDetailsFields = [
    { id: 15, name: "Current Employer", visible: true, required: false, extension: true },
    { id: 16, name: "Current Job Title", visible: true, required: false, extension: true },
    { id: 17, name: "Experience in Years", visible: true, required: false, extension: true },
    { id: 18, name: "Current Salary", visible: false, required: false, extension: false },
    { id: 19, name: "Expected Salary", visible: false, required: false, extension: false },
    { id: 20, name: "Employment Status", visible: false, required: false, extension: false },
    { id: 21, name: "Notice Period", visible: false, required: false, extension: false },
    { id: 22, name: "Available From", visible: false, required: false, extension: false },
];

export const educationalDetailsFields = [
    { id: 23, name: "Institute / School", visible: true, required: false, extension: true },
    { id: 24, name: "Educational Qualification", visible: true, required: false, extension: true },
    { id: 25, name: "Specialisation", visible: true, required: false, extension: true },
    { id: 26, name: "Duration", visible: false, required: false, extension: false },
    { id: 27, name: "Currently Pursuing", visible: false, required: false, extension: false },
    { id: 28, name: "Educational Summary", visible: false, required: false, extension: false },
];

export const workHistoryFields = [
    { id: 29, name: "Job Title", visible: true, required: false, extension: true },
    { id: 30, name: "Company", visible: true, required: false, extension: true },
    { id: 31, name: "Employment Type", visible: false, required: false, extension: false },
    { id: 32, name: "Industry", visible: false, required: false, extension: false },
    { id: 33, name: "Work Arrangement Type", visible: false, required: false, extension: false },
    { id: 34, name: "I currently work here", visible: false, required: false, extension: false },
    { id: 35, name: "Work Duration", visible: false, required: false, extension: false },
    { id: 36, name: "Work Summary", visible: false, required: false, extension: false },
];

export const resumeAndSkillsFields = [
    { id: 37, name: "Resume", visible: true, required: true, extension: true },
    { id: 38, name: "Skills", visible: true, required: false, extension: true },
];

export const socialLinksFields = [
    { id: 39, name: "LinkedIn Profile", visible: true, required: false, extension: true },
    { id: 40, name: "Facebook Profile", visible: false, required: false, extension: false },
    { id: 41, name: "X Profile", visible: false, required: false, extension: false },
    { id: 42, name: "Github Profile", visible: false, required: false, extension: false },
    { id: 43, name: "Website", visible: false, required: false, extension: false },
];

export const candidateSummaryFields = [
    { id: 44, name: "Candidate Summary", visible: true, required: false, extension: true },
];
export const companyDetailsFields = [
    { id: 45, name: "Company Name*", visible: true, required: true, extension: true },
    { id: 46, name: "Industry*", visible: true, required: true, extension: true },
    { id: 47, name: "Company Type", visible: true, required: false, extension: true },
    { id: 48, name: "Website*", visible: true, required: true, extension: true },
    { id: 49, name: "LinkedIn Profile", visible: false, required: false, extension: false },
    { id: 50, name: "Company Size", visible: false, required: false, extension: false },
    { id: 51, name: "Facebook Profile", visible: false, required: false, extension: false },
    { id: 52, name: "Existing Contacts", visible: false, required: false, extension: false },
    { id: 53, name: "X Profile", visible: false, required: false, extension: false },
];

export const locationFields = [
    { id: 54, name: "Full Address", visible: true, required: false, extension: true },
    { id: 55, name: "City", visible: true, required: false, extension: true },
    { id: 56, name: "State", visible: true, required: false, extension: true },
    { id: 57, name: "Country*", visible: true, required: true, extension: true },
    { id: 58, name: "Postal Code", visible: false, required: false, extension: false },
];

export const accountManagementBillingFields = [
    { id: 59, name: "Account Status*", visible: true, required: true, extension: true },
    { id: 60, name: "Account Owner*", visible: true, required: true, extension: true },
    { id: 61, name: "Source", visible: true, required: false, extension: true },
    { id: 62, name: "Billing Terms", visible: false, required: false, extension: false },
    { id: 63, name: "Tax / VAT ID", visible: false, required: false, extension: false },
    { id: 64, name: "EST. Revenue", visible: false, required: false, extension: false },
];

export const contactDetailsFields = [
    { id: 65, name: "First Name", visible: true, required: false, extension: true },
    { id: 66, name: "Last Name", visible: true, required: false, extension: true },
    { id: 67, name: "Title", visible: true, required: false, extension: true },
    { id: 68, name: "Contact Type", visible: false, required: false, extension: false },
    { id: 69, name: "Contact Stage", visible: false, required: false, extension: false },
];

export const contactCommunicationFields = [
    { id: 70, name: "Email", visible: true, required: true, extension: true },
    { id: 71, name: "Phone Number", visible: true, required: false, extension: true },
    { id: 72, name: "Alt. Email", visible: false, required: false, extension: false },
];

export const contactSocialLinksFields = [
    { id: 73, name: "LinkedIn Profile", visible: true, required: false, extension: true },
    { id: 74, name: "X Profile", visible: false, required: false, extension: false },
    { id: 75, name: "Facebook Profile", visible: false, required: false, extension: false },
    { id: 76, name: "Website", visible: false, required: false, extension: false },
];

export const contactAddressInfoFields = [
    { id: 77, name: "Full Address", visible: true, required: false, extension: true },
    { id: 78, name: "City", visible: true, required: false, extension: true },
    { id: 79, name: "State", visible: true, required: false, extension: true },
    { id: 80, name: "Country", visible: true, required: false, extension: true },
    { id: 81, name: "Postal Code", visible: false, required: false, extension: false },
];

export const contactRelationshipFields = [
    { id: 82, name: "Department", visible: true, required: false, extension: true },
    { id: 83, name: "Manager", visible: true, required: false, extension: true },
];
export const RecordDetailsFields = [
    { id: 101, name: "Contact Owner", visible: true, required: false, extension: true },
    { id: 102, name: "Source", visible: true, required: false, extension: true },
];
// src/data/SettingData.js

export const dealDetailsFields = [
    { id: 300, name: "Deal Name", visible: true, required: true, extension: true },
    { id: 301, name: "Deal Stage", visible: true, required: true, extension: true },
    { id: 302, name: "Deal Amount", visible: true, required: false, extension: true },
    { id: 303, name: "Close Date", visible: true, required: false, extension: true },
    { id: 304, name: "Owner", visible: true, required: false, extension: true },
    { id: 305, name: "Deal Type", visible: false, required: false, extension: false },
];

export const associatedWithFields = [
    { id: 306, name: "Company Name", visible: true, required: false, extension: true },
    { id: 307, name: "Contact Name", visible: true, required: false, extension: true },
    { id: 308, name: "Candidate Name", visible: false, required: false, extension: false },
    { id: 309, name: "Job", visible: false, required: false, extension: false },
];

export const meetingTypeFields = [
    { id: 1, name: "Internal Meeting", isCustom: false },
    { id: 2, name: "Client Meeting", isCustom: false }
]
export const NoteTypeFields = [
    { id: 1, name: "Call", isCustom: false },
    { id: 2, name: "To Do", isCustom: false }
]
export const TaskTypeFields = [
    { id: 1, name: "Follow Up", isCustom: false },
    { id: 2, name: "Phone", isCustom:true ,isSaved:true }
]
export const ContactStageFields = [
    { id: 1, name: "Acquisition", isCustom: true, isSaved:true, isGrab:true },
    { id: 2, name: "Engagement", isCustom:true ,isSaved:true,isGrab:true },
    { id: 3, name: "Client", isCustom:true ,isSaved:true,isGrab:true },
]