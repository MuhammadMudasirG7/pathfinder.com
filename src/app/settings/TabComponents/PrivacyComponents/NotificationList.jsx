"use client"
import React, { useState } from 'react'
import HeaderNotification from '../NotificationComponents/HeaderNotification';

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([
    {
      id: 'signin',
      title: 'New Sign-in to account alert',
      description: 'Receive email alerts whenever your account is signed in from a new device, browser, or location',
      checked: false,
    },
    {
      id: 'thirdparty',
      title: 'Third-party app access alert',
      description: 'Receive email alerts whenever your account is accessed from a new third-party app or location. Example: IMAP/POP clients such as mail apps and calendar apps',
      checked: true,
    },
    {
      id: 'newsletter',
      title: 'Newsletter Subscription',
      description: 'Receive marketing communication regarding pathfinder products, services, and events from pathfinder and its regional partners.',
      checked: false,
    },
  ]);

  const handleToggle = (id) => {
    setNotifications(notifications.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <div className="max-w-4xl mx-auto border border-gray-200 rounded-lg bg-white shadow-sm font-sans">
      
      {/* Header */}
      <HeaderNotification title="Notifications" />

      {/* Items Container */}
      <div>
        {notifications.map((item, index) => (
          <div 
            key={item.id} 
            className={`px-6 py-5 flex items-center justify-between gap-6 ${
              index !== notifications.length - 1 ? 'border-b border-gray-200' : ''
            }`}
          >
            {/* Text Content */}
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-gray-800">{item.title}</h3>
              <p className="text-[12px] text-gray-500 leading-relaxed pr-4">
                {item.description}
              </p>
            </div>

            {/* Toggle Switch */}
            <div 
              onClick={() => handleToggle(item.id)} 
              className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                item.checked ? "bg-purple-600 justify-end" : "bg-gray-300 justify-start"
              }`}
            >
              <div className="bg-white w-3.5 h-3.5 rounded-full shadow-sm"></div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}