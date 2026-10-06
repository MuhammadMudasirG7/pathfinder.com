import React from 'react'
import ReuseableContactStage from '../../TabComponents/ContactStage/ReuseableContactStage'
import { TaskTypeFields } from '../SettingData'

export default function TaskType() {
  return (
    <div>
        <ReuseableContactStage title="Task Type" btnText="Add Task Type" placeholder="Add new task type" initialFields={TaskTypeFields} />
    </div>
  )
}
