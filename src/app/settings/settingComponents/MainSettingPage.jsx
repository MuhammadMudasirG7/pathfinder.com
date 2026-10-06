import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation' // Next.js router hooks
import SettingHeader from './SettingHeader'
import { settingsGroups } from './SettingData'
import ProfileSection from '../TabComponents/ProfileSection'
import NotificationsSection from '../TabComponents/NotificationsSection'
import PrivacySecurityTab from '../TabComponents/PrivacySecurityTab'
import EmailTab from '../TabComponents/EmailTab'
import CalendarTab from '../TabComponents/CalenderTab'
import MeetingTab from '../TabComponents/MeetingTab'
import ActivityHistory from '../TabComponents/ActivityHistory'
import CompanyDetails from './AdminSettings/CompanyDetails'
import AuditLog from './AdminSettings/AuditLog'
import PrimeUserTable from './AdminSettings/Users'
import RolesandPermissions from './AdminSettings/RolesandPermissions'
import TeamsView from './AdminSettings/Teams'
import JobFields from './Customization/JobFields'
import CandidateFields from './Customization/CandidateFields'
import CompanyFields from './Customization/CompanyFields'
import ContactFields from './Customization/ContactFields'
import JobStatus from './Customization/JobStatus'
import DealFields from './Customization/DealFields'
import ContactStage from './Customization/ContactStage'
import NoteType from './Customization/NoteType'
import MeetingType from './Customization/MeetingType'
import TaskType from './Customization/TaskType'
import HiringPipeline from './Customization/HiringPipeline'
import SubscriptionBilling from './AdminSettings/SubscriptionBilling'

function MainSettingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // URL ya query param se active tab uthayega, warna default 'profile'
  const tabFromUrl = searchParams.get('tab') || 'profile'
  const [activeTab, setActiveTab] = useState(tabFromUrl)

  // Jab bhi URL change ho, state update ho jaye
  useEffect(() => {
    const currentTab = searchParams.get('tab')
    if (currentTab) {
      setActiveTab(currentTab)
    }
  }, [searchParams])

  // Tab change handler jo URL ko update karega bina page refresh kiye
  const handleTabClick = (tabId) => {
    setActiveTab(tabId)
    router.push(`/settings?tab=${tabId}`, { scroll: false })
  }

  return (
    <div className='h-[calc(100vh-2rem)] border border-gray-200 rounded-2xl flex flex-col mr-3.5 bg-white shadow-sm overflow-hidden'>
      <SettingHeader />

      <div className='p-3 flex-1 min-h-0 overflow-hidden'>
        <div className='flex flex-1 h-full border border-gray-200 rounded-xl overflow-hidden'>
          <div className='w-52 border-r border-gray-200 overflow-y-auto shrink-0'>

            {settingsGroups.map((group, groupIndex) => (
              <div key={groupIndex} className='font-sans text-sm px-2 py-2'>
                <p className='px-[8px] text-[#142142] text-[16px] font-[500] leading-[18px] py-[10px]'>{group.groupName}</p>
                <div className='space-y-3'>
                  {group.items.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => handleTabClick(item.id)} 
                      className={`text-[14px] leading-[18px] py-[6px] px-[10px] cursor-pointer rounded text-[#5C657C] ${activeTab === item.id ? "bg-gray-50 text-gray-800" : "hover:bg-gray-50"}`}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className='flex-1 overflow-y-auto pr-2'>
            {activeTab === 'profile' && <ProfileSection />}
            {activeTab === 'notifications' && <NotificationsSection />}
            {activeTab === 'privacy-security' && <PrivacySecurityTab />}
            {activeTab === 'email' && <EmailTab />}
            {activeTab === 'calendar' && <CalendarTab />}
            {activeTab === 'meeting-apps' && < MeetingTab />}
            {activeTab === 'activity-history' && <ActivityHistory />}
            {activeTab === 'company-details' && <CompanyDetails />}
            {activeTab === 'audit-log' && <AuditLog />}
            {activeTab === 'users' && <PrimeUserTable />}
            {activeTab === 'roles-permissions' && <RolesandPermissions />}
            {activeTab === 'teams' && <TeamsView />}
            {activeTab === 'job-fields' && <JobFields />}
            {activeTab === 'candidate-fields' && <CandidateFields />}
            {activeTab === 'company-fields' && <CompanyFields />}
            {activeTab === 'contact-fields' && <ContactFields />}
            {activeTab === 'job-status' && <JobStatus />}
            {activeTab === 'deal-fields' && <DealFields />}
            {activeTab === 'meeting-type' && <MeetingType />}
            {activeTab === 'note-type' && <NoteType />}
            {activeTab === 'task-type' && <TaskType />}
            {activeTab === 'contact-stage' && <ContactStage />}
            {activeTab === 'hiring-pipeline' && <HiringPipeline />}
            {activeTab === 'subscription-billing' && <SubscriptionBilling />}
            {activeTab !== 'profile' && activeTab !== 'hiring-pipeline' && activeTab !== 'task-type' && activeTab !== 'meeting-type' && activeTab !== 'note-type' && activeTab !== 'contact-stage' && activeTab !== 'notifications' && activeTab !== "privacy-security" && activeTab !== "email" && activeTab !== 'calendar' && activeTab !== 'meeting-apps' && activeTab !== 'activity-history' && activeTab !== 'company-details' &&
              activeTab !== 'users' && activeTab !== 'subscription-billing' && activeTab !== 'deal-fields' && activeTab !== 'job-status' && activeTab !== 'roles-permissions' && activeTab !== 'teams' && activeTab !== 'audit-log' && activeTab !== 'candidate-fields' && activeTab !== 'job-fields' && activeTab !== 'company-fields' && activeTab !== 'contact-fields' && (
                <div className='flex flex-col items-center justify-center h-64 text-gray-400 font-medium'>
                  <p className='text-lg font-semibold text-gray-700 capitalize'>
                    {activeTab.replace(/-/g, ' ')} Settings
                  </p>
                  <p className='text-sm text-gray-400 mt-1'>Content for this section is coming soon...</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainSettingPage