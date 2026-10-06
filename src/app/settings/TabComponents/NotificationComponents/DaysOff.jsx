import React, { useEffect, useState } from 'react'
import HeaderNotification from './HeaderNotification'

function DaysOff() {
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
    const [activedays,setActivedays] = useState([])
    const getDays = async () => {
        try {
            const response = await fetch("/api/auth/notification")
            const data = await response.json()
            if (data.success) {
                setActivedays(data.notification.daysOff || [])
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getDays()   
    },[])
    const updateDays = async (newDays) => {
        try {
            const response = await fetch("/api/auth/notification",{
                method:"PUT",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    daysOff : newDays
                })
            })
            const data = await response.json()
            if (data.success) {
                console.log("DaysOff Setting updated successfully")
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleDayClick = (day) => {
        let newDays = []
        if (activedays.includes(day)) {
            newDays = activedays.filter((item) => item !== day)
        }else{
            newDays = [...activedays,day]
        }
        setActivedays(newDays)
        updateDays(newDays)
    }
  return (
      <div>
        <HeaderNotification title="Do not disturb me on my days off" />
        <div className='border border-gray-200 p-7 flex items-center gap-1'>
            {days.map((day,index) => (
                <button onClick={() => handleDayClick(day)} key={index} className={`h-9 w-14 font-sans text-sm border border-gray-200 rounded ${activedays.includes(day) ? "bg-indigo-700 text-white":"text-gray-700 hover:shadow-[0_0_3px_rgb(99,102,239,0.52)]"}`}>
                   {day}
                </button>
            ))}
        </div>
      </div>
  )
}

export default DaysOff