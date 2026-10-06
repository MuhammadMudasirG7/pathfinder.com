"use client"
import React, { useState } from 'react'
import { Clock } from 'lucide-react'

export default function TimePickerDropdown({ time = "08:00 AM", setTime = () => {}, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);

  const parts = time.split(' ');
  const timePart = parts[0] || "08:00";
  const modifier = parts[1] || "AM";
  
  const timeSubParts = timePart.split(':');
  const currentHour = timeSubParts[0] || "08";
  const currentMinute = timeSubParts[1] || "00";

  const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  const ampmList = ['AM', 'PM'];

  const handleToggle = () => {
    if (disabled) return; // Agar disabled hai toh dropdown open nahi hoga
    setIsOpen(!isOpen);
  };

  const handleSelect = (hour, minute, ampm) => {
    if (disabled) return;
    setTime(`${hour}:${minute} ${ampm}`);
    setIsOpen(false); // Option select karne ke baad dropdown close karne ke liye
  };

  return (
    <div className="relative inline-block">
      
      {/* Clickable Box */}
      <div 
        onClick={handleToggle}
        className={`flex items-center gap-2 border border-gray-300 px-1 py-2.5 rounded text-xs text-gray-800 font-medium shadow-sm transition-all ${
          disabled 
            ? "cursor-not-allowed " 
            : "cursor-pointer bg-white hover:shadow-[0_0_4px_rgb(99,102,241,0.42)]"
        }`}
      >
        <span>{currentHour}:{currentMinute} {modifier}</span>
        <Clock size={14} className="text-gray-400" />
      </div>

      {/* Dropdown Box (Will only open if disabled is false) */}
      {isOpen && !disabled && (
        <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-300 rounded-lg shadow-xl p-2 z-50">
          
          {/* Top Selected Preview */}
          <div className="grid grid-cols-3 gap-1 mb-2 border-b border-gray-200 pb-2">
            <div className="bg-blue-600 text-white text-center py-1 text-xs font-bold rounded">{currentHour}</div>
            <div className="bg-blue-600 text-white text-center py-1 text-xs font-bold rounded">{currentMinute}</div>
            <div className="bg-blue-600 text-white text-center py-1 text-xs font-bold rounded">{modifier}</div>
          </div>

          {/* Scrollable Columns */}
          <div className="flex text-center text-xs text-gray-700">
            
            {/* Hours */}
            <div className="w-1/3 h-40 overflow-y-auto hide-scrollbar">
              {hours.map((h) => (
                <div 
                  key={h}
                  onClick={() => handleSelect(h, currentMinute, modifier)}
                  className={`py-1.5 cursor-pointer rounded ${currentHour === h ? 'bg-blue-50 font-bold text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  {h}
                </div>
              ))}
            </div>

            {/* Minutes */}
            <div className="w-1/3 h-40 overflow-y-auto hide-scrollbar">
              {minutes.map((m) => (
                <div 
                  key={m}
                  onClick={() => handleSelect(currentHour, m, modifier)}
                  className={`py-1.5 cursor-pointer rounded ${currentMinute === m ? 'bg-blue-50 font-bold text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  {m}
                </div>
              ))}
            </div>

            {/* AM/PM */}
            <div className="w-1/3 h-40 overflow-y-auto hide-scrollbar">
              {ampmList.map((a) => (
                <div 
                  key={a}
                  onClick={() => handleSelect(currentHour, currentMinute, a)}
                  className={`py-1.5 cursor-pointer rounded ${modifier === a ? 'bg-blue-50 font-bold text-blue-600' : 'hover:bg-gray-100'}`}
                >
                  {a}
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Hide Scrollbars CSS */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}