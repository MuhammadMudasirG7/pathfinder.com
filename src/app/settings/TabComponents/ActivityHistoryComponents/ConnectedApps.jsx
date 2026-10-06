import React from 'react'
import HeaderNotification from '../NotificationComponents/HeaderNotification'
import Image from 'next/image'
export default function ConnectedApps() {
  return (
    <div>
        <HeaderNotification title="Connected Apps" />
        <div className='flex flex-col items-center justify-center border border-gray-200 p-9'>
            <Image src="/connect.png" alt='connectapp' height={22} width={22} className='w-18 h-18 object-contain' />
            <span className='text-[10px] font-sans font-medium text-gray-600 mt-2'>There are no apps connected to this account</span>
        </div>
    </div>
  )
}
