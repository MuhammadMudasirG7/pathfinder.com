import React, { useState } from 'react';
import QuickVIewHeader from './QuickVIewHeader';
import { Trash2, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import AllDetails from './AllDetails';
import Activities from './Activities';
import AssignedJobs from './AssignedJobs';
import SubmittedToClients from './SubmittedToClients';
import Files from './Files';
import Folders from './Folders';
import Deals from './Deals';

export default function CandidateQuickView({ candidate, onClose ,onCreateNote }) {
  const [activeTab, setActiveTab] = useState('All Details');

  if (!candidate) return null;
  const tabsArray = ["All Details", "Activities", "Assigned Jobs", "Submitted to Clients", "Files", "Folders", "Deals"];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-[85vw] max-w-[1200px] h-screen bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">

        {/* Top Header */}
        <div className="shrink-0">
          <QuickVIewHeader candidate={candidate} onClose={onClose} onCreateNote={onCreateNote} />
        </div>

        {/* Tabs Header */}
        <div className='shrink-0 px-6 py-3 w-full bg-white border-b border-gray-300'>
          <div className='flex items-center justify-between'>
            {tabsArray.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-1 text-[13px] cursor-pointer whitespace-nowrap transition-colors ${
                  activeTab === tab ? "text-indigo-600 font-semibold" : "text-gray-600 hover:text-gray-700"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className='absolute -bottom-3 left-0 right-0 h-[2.5px] bg-indigo-600 rounded-t-md'></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Routing Pages Container (overflow-hidden taaki andar wale components apni height manage karein) */}
        <div className='flex-1 flex flex-col overflow-hidden bg-gray-50/50'>
          {activeTab === "All Details" && <AllDetails />}
          {activeTab === "Activities" && <Activities />}
          {activeTab === "Assigned Jobs" && <AssignedJobs />}
          {activeTab === "Submitted to Clients" && <SubmittedToClients />}
          {activeTab === "Files" && <Files />}
          {activeTab === "Folders" && <Folders />}
          {activeTab === "Deals" && <Deals />}
        </div>

      </div>
    </div>
  );
}