"use client"
import { useSidebar } from '@/app/candidates/hooks/SidebarContext'
import { ArrowRight, Bell, CircleQuestionMark, Plus, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import React from 'react'

export default function SettingHeader() {
  const { isCollapsed, setIsCollapsed } = useSidebar()
  return (
    <div className='p-2 border-b border-gray-200'>

      <div className='flex items-center justify-between'>

        <div className='flex items-center gap-2.5'>
          <button
            className="p-1.5 mr-4 text-gray-500 hover:bg-gray-200 rounded-full transition-colors cursor-pointer hover:text-gray-900"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </button>
           <span className='text-[15px] text-gray-400  font-medium'>Settings</span>
           <ArrowRight className='h-5 w-4 text-gray-500' />
           <span className='text-[15px] text-gray-400 font-medium'>User Settings</span>
           <ArrowRight className='h-5 w-4 text-gray-500' />
            <span className='text-[15px] text-gray-800 font-sans font-medium'>Profile</span>
        </div>
        <div className='flex items-center gap-7'>
          {[Search, Plus, CircleQuestionMark, Bell].map((Item, index) => (
            <div className='w-6 h-6 mr-4 flex items-center justify-center text-gray-500 cursor-pointer bg-slate-100 rounded-full hover:bg-gray-800 hover:text-white' key={index}>
              <Item size={14} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
