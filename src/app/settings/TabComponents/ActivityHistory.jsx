import React from 'react'
import ActiveSessions from './ActivityHistoryComponents/ActiveSessions'
import ActivityHis from './ActivityHistoryComponents/ActivityHis'
import ConnectedApps from './ActivityHistoryComponents/ConnectedApps'


function ActivityHistory() {
  return (
    <div className='p-3 space-y-6'>
        <ActiveSessions />
        <ActivityHis />
        <ConnectedApps />
    </div>
  )
}

export default ActivityHistory