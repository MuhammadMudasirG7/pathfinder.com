import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import AddNote from './AddNote'

// Dynamic Dates Calculate karne ka Helper
const getDateOptions = () => {
    const today = new Date()
    const getdateAndmonth = (date) => date.toLocaleDateString('en-US',{day:'numeric',month:'short'})
 
    const getDayName  = (date) => date.toLocaleDateString('en-US',{weekday:'long'})

const getBussinessDays = (startDate,daystoadd) => {
       const current = new Date(startDate)
       let added = 0
       while (added < daystoadd) {
        current.setDate(current.getDate() + 1)
        const day = current.getDate()
        if (day !==0 && day !==6) added++
       }
       return current
}
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
  const bDay1 = getBussinessDays(today,1)
  const bDay2 = getBussinessDays(today,2)
  const bDay3 = getBussinessDays(today,3)

  const week1 = new Date(today); week1.setDate(today.getDate() + 7)
  const week2 = new Date(today); week2.setDate(today.getDate() + 14)

  const month1 = new Date(today); month1.setMonth(today.getMonth() + 1)
  const month3 = new Date(today); month3.setMonth(today.getMonth() + 3)
  const month6 = new Date(today); month6.setMonth(today.getMonth() + 6)

  return [
    {label: "Today"},
    {label: `tomorrow (${getDayName(tomorrow)})`},
    {label: `In 1 bussiness day (${getDayName(bDay1)})`},
    {label:`In 2 bussiness day (${getDayName(bDay2)})`},
    {label:`In 3 bussiness day (${getDayName(bDay3)})`},
    {label:`In 1 weak (${getdateAndmonth(week1)})`},
    {label:`In 2 weaks (${getdateAndmonth(week2)})`},
    {label:`In 1 month (${getdateAndmonth(month1)})`},
    {label:`In 3 months (${getdateAndmonth(month3)})`},
    {label:`In 6 months (${getdateAndmonth(month6)})`},
    {label:"custom date", isCustom:true}
  ]
}

export default function SimpleFollowUpSelector() {
  const dateOptions = getDateOptions()
  const [selectedOption, setSelectedOption] = useState("In 1 week (1 Sept)")
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (label) => {
    setSelectedOption(label)
    setIsOpen(false) 
  }

  return (
    <div className='relative flex items-center justify-center gap-3'>
      <span className='font-medium text-[13px]'>{AddNote ? "task to follow up" : ""}</span>
      <button className='flex items-center gap-2.5  text-[15px]' type='button' onClick={() => setIsOpen(!isOpen)}>
        <span className='text-violet-700 text-[13px]'>{selectedOption}</span>
        <span>
            {isOpen ? <ChevronDown size={14} />: <ChevronUp size={14} />}
        </span>
      </button>
      {isOpen && (
        <div className='absolute left-28 bottom-full bg-white w-72 text-[13px] border border-gray-300 p-2 gap-3'>
            {dateOptions.map((item,index) => (
                <React.Fragment key={index}>
                    {item.isCustom && <div className='border-t border-slate-200 my-1'></div>}
                    <div onClick={() => handleSelect(item.label)} className={`px-3 py-1.5 mt-1 text-[12px] cursor-pointer transition-colors ${selectedOption === item.label ? "bg-gray-500 font-bold" : "hover:bg-gray-300"}`}>
                        {item.label}
                    </div>
                </React.Fragment>
            ))}
        </div>
      )}
      
    </div>
  )
}