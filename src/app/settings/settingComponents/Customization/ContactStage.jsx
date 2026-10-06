"use state"
import React from 'react'
import ReuseableContactStage from '../../TabComponents/ContactStage/ReuseableContactStage'
import { ContactStageFields } from '../SettingData'

export default function ContactStage() {
  return (
    <div>
        <ReuseableContactStage title="Contact Stage" btnText="Add Contact Stage" placeholder="Add new contact stage" initialFields={ContactStageFields} />
    </div>
  )
}
