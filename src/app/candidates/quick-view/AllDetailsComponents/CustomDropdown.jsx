import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

function CustomDropdown({ label, options, selected, onSelect, showCheckbox = false, leftIcon = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {label && <label className='text-gray-500 font-medium mb-1 block text-[12px]'>{label}</label>}
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center justify-between border border-gray-200 rounded bg-white hover:border-gray-300 px-3 py-1.5 cursor-pointer shadow-sm'
            >
                <div className='flex items-center gap-2 overflow-hidden'>
                    {leftIcon && <span className='text-purple-600 flex-shrink-0'>{leftIcon}</span>}
                    <span className='text-gray-800 font-medium text-[13px] truncate'>{selected}</span>
                </div>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className='absolute mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md z-50 shadow-lg max-h-[220px] overflow-y-auto py-1'>
                    {options.map((option) => {
                        const isSelected = selected === option;
                        return (
                            <div 
                                key={option} 
                                onClick={() => { onSelect(option); setIsOpen(false); }}
                                className={`px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors ${isSelected ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                {showCheckbox && (
                                    <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${isSelected ? "text-white bg-purple-600 border-purple-600" : "bg-white border border-gray-300"}`}>
                                        {isSelected ? <Check size={11} strokeWidth={3} /> : ""}
                                    </div>
                                )}
                                <span className='text-[13px]'>{option}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default CustomDropdown;