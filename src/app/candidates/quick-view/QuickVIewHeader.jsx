import React, { useState } from 'react';
import {
  Briefcase, Clock, User, Pencil, Phone, Mail, MapPin, MoreHorizontal, ChevronLeft, ChevronRight, X, FilePlus2, FileCheck, Calendar
} from 'lucide-react';
import AddNote from './AllDetailsComponents/AddNote';
import AddTask from './AllDetailsComponents/AddTask';
import LogCall from './AllDetailsComponents/LogCall';

function QuickVIewHeader({ candidate, onClose, onCreateNote }) {
  // Full Name construct karna
  const fullName = candidate?.firstName
    ? `${candidate.firstName} ${candidate.lastName || ''}`
    : candidate?.name || 'Candidate Name';

  // Initials calculate karne ke liye helper function
  const getInitials = (name) => {
    if (!name) return 'CN';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showCall, setShowCall] = useState(false);

  const [addNoteData, setAddNoteData] = useState({
    addNote: ''
  });

  const handleChange = (name, value) => {
    setAddNoteData((prev) => ({
      ...prev, [name]: value
    }));
  };

  return (
    <div className="w-full bg-white px-6 py-4 border-b border-gray-200 relative">
      <div className="flex items-start justify-between gap-4">

        {/* Left Section: Avatar + Details */}
        <div className="flex items-start gap-4">

          {/* Dynamic Avatar Initials */}
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-2xl font-medium text-slate-800 shrink-0">
            <span>{getInitials(fullName)}</span>
          </div>

          {/* User Details */}
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900 leading-tight">
              {fullName}
            </h2>

            {/* Social Icons Row */}
            <div className="flex items-center gap-1.5">
              <a href={candidate?.linkedin || '#'} target="_blank" rel="noreferrer" className="w-5 h-5 rounded-full bg-gray-100 text-[10px] font-medium text-gray-500 flex items-center justify-center hover:bg-gray-200 cursor-pointer">
                in
              </a>
              <span className="w-5 h-5 rounded-full bg-gray-100 text-[10px] font-medium text-gray-500 flex items-center justify-center hover:bg-gray-200 cursor-pointer">
                f
              </span>
              <span className="w-5 h-5 rounded-full bg-gray-100 text-[10px] font-medium text-gray-500 flex items-center justify-center hover:bg-gray-200 cursor-pointer">
                𝕏
              </span>
              <a href={candidate?.github || '#'} target="_blank" rel="noreferrer" className="w-5 h-5 rounded-full bg-gray-100 text-[10px] font-medium text-gray-500 flex items-center justify-center hover:bg-gray-200 cursor-pointer">
                🐙
              </a>
              <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 cursor-pointer">
                <MoreHorizontal size={12} />
              </span>
            </div>

            {/* Row 1 */}
            <div className="flex items-center gap-6 text-xs text-gray-600 pt-0.5">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-gray-100 text-gray-500">
                  <Briefcase size={12} />
                </span>
                <span className="font-medium text-slate-700">
                  {candidate?.id || candidate?.candidateId || 'N/A'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-gray-100 text-gray-500 font-bold">
                  <Clock size={12} />
                </span>
                <span>{candidate?.createdDate || candidate?.date || 'N/A'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded bg-gray-100 text-gray-500">
                  <User size={12} />
                </span>
                <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[11px] font-bold">
                  {candidate?.owner || candidate?.assignedTo || 'Unassigned'}
                </span>
                <Pencil size={11} className="text-gray-400 cursor-pointer hover:text-gray-600 ml-0.5" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-6 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-gray-100 text-gray-500">
                  <Phone size={12} />
                </span>
                <span>{candidate?.phone || 'No phone provided'}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-gray-100 text-gray-500">
                  <Mail size={12} />
                </span>
                <span>{candidate?.email || 'No email provided'}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-gray-100 text-gray-500">
                  <MapPin size={12} />
                </span>
                <span>
                  {candidate?.address || candidate?.city
                    ? `${candidate?.city || ''}, ${candidate?.country || ''}`
                    : 'Location not set'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Section: Navigation & Actions */}
        <div className="flex flex-col items-end justify-between self-stretch">

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button className="p-1 rounded border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50">
              <ChevronLeft size={14} />
            </button>
            <button className="p-1 rounded border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 mr-2">
              <ChevronRight size={14} />
            </button>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={16} />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 mt-auto">
            <button onClick={() => setShowAddNote(true)} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-slate-600 hover:bg-gray-50">
              <FilePlus2 size={14} />
            </button>
            
            <button onClick={() => setShowAddTask(true)} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-slate-600 hover:bg-gray-50">
              <FileCheck size={14} />
            </button>
            
            <button onClick={() => setShowCall(true)} className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-slate-600 hover:bg-gray-50">
              <Phone size={14} />
            </button>

            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-slate-600 hover:bg-gray-50">
              <Calendar size={14} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-slate-600 hover:bg-gray-50">
              <Mail size={14} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-slate-600 hover:bg-gray-50">
              <Pencil size={14} />
            </button>
            <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded text-slate-600 hover:bg-gray-50">
              <MoreHorizontal size={14} />
            </button>
          </div>

        </div>

      </div>

      {/* Modals Rendered Outside Action Bar Container */}
      {showAddNote && (
        <AddNote
          handleChange={handleChange}
          onClose={() => setShowAddNote(false)}
          onCreateNote={onCreateNote}
        />
      )}

      {showAddTask && (
        <AddTask 
          handleChange={handleChange} 
          onClose={() => setShowAddTask(false)} 
        />
      )}

      {showCall && (
        <LogCall 
          handleChange={handleChange} 
          onClose={() => setShowCall(false)} 
        />
      )}
    </div>
  );
}

export default QuickVIewHeader;