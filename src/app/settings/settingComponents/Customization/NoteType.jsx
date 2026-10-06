import React from 'react'
import ReuseableContactStage from '../../TabComponents/ContactStage/ReuseableContactStage'
import { NoteTypeFields } from '../SettingData'

export default function NoteType() {
  return (
    <div>
        <ReuseableContactStage title="Note Type" btnText="Add Note Type" initialFields={NoteTypeFields} placeholder="Add new note type" />
    </div>
  )
}
