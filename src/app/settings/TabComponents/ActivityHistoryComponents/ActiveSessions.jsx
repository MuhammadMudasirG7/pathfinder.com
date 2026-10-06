import React from 'react'
import HeaderNotification from '../NotificationComponents/HeaderNotification'
import ActiveComponet from './ActiveComponet'
import ActivityHis from './ActivityHis'

export default function ActiveSessions() {
    
    return (
        <div className=''>
            <HeaderNotification title="Active Sessions" />
            <div className='border border-gray-200 flex flex-col py-8 space-y-4 bg-white'>
                <ActiveComponet />
            </div>
        </div>
    )
}
