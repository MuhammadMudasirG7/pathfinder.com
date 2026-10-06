"use client"
import React from 'react'
import DefaultPrivacy from './PrivacyComponents/DefaultPrivacy'
import LoginSecurity from './PrivacyComponents/LoginSecurity'
import VerificationMethods from './PrivacyComponents/VerificationMethods'
import NotificationsList from './PrivacyComponents/NotificationList'



export default function PrivacySecurityTab() {
  return (
    <div className='p-4 space-y-5'>
        <DefaultPrivacy />
        <LoginSecurity />
        <VerificationMethods />
        <NotificationsList />
    </div>
  )
}
