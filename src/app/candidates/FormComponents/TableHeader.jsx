import { Bell, Briefcase, ChevronDown, CircleQuestionMark, FileOutput, Mail, Plus, Search, Trash, UserRoundPlus, PanelLeftOpen, PanelLeftClose } from 'lucide-react'
import React from 'react';

import CanDataTable from './DataTable'
import { useSidebar } from '../hooks/SidebarContext';

export default function TableHeader({ onOpen, candidates, onDelete}) {
    const { isCollapsed, setIsCollapsed } = useSidebar();
    return (
        <div>
            {/* TableHeader */}
            <div className='border border-gray-300 rounded-t-xl bg-white overflow-hidden'>
                <div className='flex items-center justify-between px-5 py-2'>
                    <div className="flex items-center gap-4">
                        {/* Sidebar Collapse Toggle Button */}
                        <button 
                            className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-full transition-colors cursor-pointer hover:text-gray-900" 
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                        </button>
                        <h2 className='font-bold text-[16px] tracking-wide text-gray-600'>Candidates</h2>
                    </div>

                    <div className='flex items-center gap-3'>
                        {[Search, Plus, CircleQuestionMark, Bell].map((Icon, index) => (
                            <div className='p-2 bg-gray-100 rounded-full text-gray-700 cursor-pointer hover:bg-gray-800 hover:text-white transition-colors' key={index}>
                                <Icon size={14} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* TableCenter */}
            <div>
                <div className='border-x border-b border-gray-300 rounded-b-xl p-4 bg-white'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center gap-2 bg-[#6332c5] text-white rounded-lg px-3 py-2 shadow-sm'>
                                <span className='bg-black/30 text-white text-[11px] rounded-md px-1.5 py-0.5 font-bold'>20</span>
                                <span className='font-bold tracking-wide text-[13px]'>My Candidates</span>
                            </div>
                            <div className='flex items-center p-2 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 cursor-pointer'>
                                <ChevronDown size={16} />
                            </div>
                        </div>

                        <div>
                            <button type='button' onClick={onOpen} className='flex items-center gap-2 px-4 py-2 bg-[#6332c5] text-white font-semibold rounded-lg text-sm shadow-sm hover:opacity-90 transition-opacity cursor-pointer'>
                                <UserRoundPlus size={18} />
                                <span>Add Candidates</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <CanDataTable data={candidates} onDelete={onDelete} />
                    </div>
                </div>
            </div>
        </div>
    )
}