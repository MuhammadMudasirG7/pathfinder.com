import React from 'react'
import ReuseableContactStage from '../../TabComponents/ContactStage/ReuseableContactStage'
import { meetingTypeFields } from '../SettingData'

export default function MeetingType() {
  return (
    <div>
        <ReuseableContactStage title="Meeting Type" btnText="Add Meeting Type" placeholder="Add new meeting type" initialFields={meetingTypeFields} />
    </div>
  )
}
