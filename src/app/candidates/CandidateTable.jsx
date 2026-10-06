import React from 'react'
import TableHeader from './FormComponents/TableHeader'

function CandidateTable({onOpen,candidates,onDelete}) {
  return (
    <div>
       <TableHeader onOpen={onOpen} candidates={candidates} onDelete={onDelete}  /> 
    </div>
  )
}

export default CandidateTable