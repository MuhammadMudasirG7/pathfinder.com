import React from 'react'
import Overview from './AllDetailsComponents/Overview'
import CandidateFormDetails from './AllDetailsComponents/CandidateFormDetails'

function AllDetails() {
  return (
    <div className='p-4 h-full overflow-y-auto max-h-[calc(100vh-100px)]'>
        <Overview />
        <CandidateFormDetails />
        
    </div>
  )
}

export default AllDetails