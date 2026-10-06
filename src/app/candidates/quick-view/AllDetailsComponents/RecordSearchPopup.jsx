import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const RecordSearchPopup = ({ checkedRecord, setCheckedRecord }) => {
    const [recordOpen, setRecordOpen] = useState(false);
    const popupRef = useRef(null);
    const sections = ['Contacts', 'Company', 'Jobs', 'Deals'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setRecordOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className='relative inline-block w-auto mt-2' ref={popupRef}>
            {/* Associated with 1 record box with Chevron Down Button */}
            <div
                onClick={() => setRecordOpen(!recordOpen)}
                className='flex items-center gap-2 px-3 py-1.5 bg-white rounded cursor-pointer text-[13px] hover:border-gray-400 shadow-sm select-none w-fit'
            >
                <span className='text-gray-800 font-medium'>Associated with 1 record</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-200 ${recordOpen ? "rotate-180" : ""}`} />
            </div>

            {/* Popup Box (Opens upwards with bottom-full) */}
            {recordOpen && (
                <div className='fixed right-5 top-25 mb-2 z-[9999] w-[320px] bg-white border border-gray-300 rounded-md shadow-2xl p-3'>
                    <div className='relative mb-3'>
                        <Search size={15} className='absolute left-2.5 top-2.5 text-gray-400' />
                        <input
                            type="text"
                            placeholder='Search By Records Name'
                            className='text-[12px] w-full pl-8 pr-2 py-1.5 border border-gray-300 outline-none rounded focus:border-indigo-500'
                        />
                    </div>
                    <div className='text-xs text-gray-700 max-h-[250px] overflow-y-auto space-y-3'>
                        <div>
                            <span className='font-bold text-gray-800 block mb-1'>Candidates</span>
                            <div className='flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded cursor-pointer' onClick={() => setCheckedRecord(!checkedRecord)}>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checkedRecord ? 'bg-violet-600 border-violet-600 text-white' : 'border-gray-300 bg-white'}`}>
                                    {checkedRecord && <span className='text-[10px] font-bold'>✓</span>}
                                </div>
                                <span className='font-medium'>John Smith</span>
                            </div>
                        </div>
                        {sections.map((sec) => (
                            <div key={sec} className='bg-gray-50 p-2 rounded border border-gray-100'>
                                <h2 className='font-bold text-[12px] text-gray-700'>{sec}</h2>
                                <span className='text-[11px] text-gray-500'>No {sec} Associated</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecordSearchPopup;