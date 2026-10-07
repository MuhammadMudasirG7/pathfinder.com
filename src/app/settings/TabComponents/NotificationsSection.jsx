"use client"

import { BellRing } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import HeaderNotification from './NotificationComponents/HeaderNotification';
import DaysOff from './NotificationComponents/DaysOff';
import EmailNotifiy from './NotificationComponents/EmailNotifiy';
import TimePickerDropdown from '@/components/TimePickerDropdown';


function NotificationsSection() {

  const [fromTime, setFromTime] = useState('08:00 AM');
  const [toTime, setToTime] = useState('05:00 AM');
  // 🛠️ Yahan initial state ko boolean ensure kar liya hai
  const [checked, setChecked] = useState(false);

  const getNotification = async () => {
    try {
      const response = await fetch("/api/auth/notification")
      const data = await response.json()
      if (data.success && data.notification?.doNotDisturb) {
        // 🛠️ `Boolean()` ya `!!` lagane se value kabhi undefined nahi hogi (controlled/uncontrolled error khatam)
        setChecked(Boolean(data.notification.doNotDisturb.enabled))
        setFromTime(data.notification.doNotDisturb.fromTime || '08:00 AM')
        setToTime(data.notification.doNotDisturb.toTime || '05:00 AM')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getNotification()
  }, [])

  const updateNotification = async (status) => {
    try {
      const response = await fetch("/api/auth/notification", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          enabled: status,
          fromTime: fromTime,
          toTime: toTime
        })
      })

      const data = await response.json()

      if (data.success) {
        console.log("Notification Setting Updated Successfully")
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='p-6 space-y-5 '>
      <div>
        <HeaderNotification title="Do Not Disturb" />
        <div className='border border-gray-200 px-5 p-4'>
          {checked ? (
            <div className=''>
              <div className='flex items-center gap-3 '>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    const newCheck = !checked;
                    setChecked(newCheck);
                    updateNotification(newCheck);
                  }}
                  className="w-3.5 h-3.5 bg-white border border-gray-200 rounded cursor-pointer"
                />
                <span className='text-[12px] text-gray-800 font-sans'>Do not notify me from:</span>
                <TimePicker time={fromTime} setTime={setFromTime} />
                <span className='text-sm text-gray-800'>To</span>
                <TimePicker time={toTime} setTime={setToTime} />
                <span className='text-[12px] font-sans text-gray-600 font-medium'>Notifications paused from {fromTime} to {toTime}</span>
              </div>
              <div className='flex items-center justify-end pt-5'>
                <button 
                  onClick={() => {
                    setChecked(false);
                    updateNotification(false);
                  }} 
                  className='flex items-center cursor-pointer gap-3 rounded px-3 py-1.5 bg-indigo-700 hover:bg-indigo-600 text-white'
                >
                  <BellRing size={14} />
                  <span className='text-[12px] mb-1 font-medium font-sans'>Resume Notifications</span>
                </button>
              </div>
            </div>
          ) : (
            <div className='p-5 flex items-center gap-3'>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  const newCheck = !checked;
                  setChecked(newCheck);
                  updateNotification(newCheck);
                }}
                className="w-3.5 h-3.5 bg-white border border-gray-200 rounded cursor-pointer"
              />
              <div className='cursor-not-allowed flex items-center gap-3.5'>
                <span className='text-[12px]  text-gray-800 font-sans'>Do not notify me from:</span>
                <TimePickerDropdown disabled={true} time={fromTime} setTime={setFromTime} />
                <span className='text-sm text-gray-800'>To</span>
                <TimePickerDropdown disabled={true} time={toTime} setTime={setToTime} />
              </div>

            </div>
          )}
        </div>
      </div>

      <DaysOff />
      <EmailNotifiy />

    </div>
  )
}

export default NotificationsSection