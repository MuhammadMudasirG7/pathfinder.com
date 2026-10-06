"use client"
import React from 'react'
import HeaderNotification from '../NotificationComponents/HeaderNotification'

export default function LoginSecurity() {
  return (
    <div>
      <HeaderNotification title="Login Security" />
      <div className='p-4 border border-gray-200'>
        <div className='flex flex-col border-b border-gray-200 p-2'>
          <span className='text-[13px] font-medium leading-[18px] text-[#142142]'>New Device Verification</span>
          <span className='text-[12px] font-medium leading-[18px] text-[#5C657C] mt-1'>Require additional verification step for logins from a new device or browser.</span>
          <span className='text-[12px] cursor-pointer font-medium leading-[18px] mt-1 text-violet-700 hover:underline font-sans'>Learn More</span>
        </div>
        <div className='flex flex-col p-2 mt-2'>
          <span className='text-[13px] font-medium leading-[18px] text-[#142142]'>Two-Step Verification</span>
          <span className='text-[12px] font-medium leading-[18px] text-[#5C657C] mt-1'>Require a verification code when you log in with a password.</span>
          <span className='text-[12px] cursor-pointer font-medium leading-[18px] mt-1 text-violet-700 hover:underline font-sans'>Learn More</span>
        </div>
      </div>
    </div>
  )
}
