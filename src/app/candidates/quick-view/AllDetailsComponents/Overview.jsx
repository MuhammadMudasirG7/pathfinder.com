import { Trash2, Edit2 } from 'lucide-react'
import React from 'react'

function Overview({ candidate }) {
    const icons = [{ icon: <Trash2 size={14} /> }, { icon: <Edit2 size={14} /> }]

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
            {/* Overview Box */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs">
                <h2 className="text-sm font-semibold text-slate-900 mb-5">Overview</h2>

                <div className="space-y-3 text-xs text-gray-500">
                    {/* Row 1: Job Title & Employer */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span>
                            Current Job Title:{' '}
                            <span className="font-semibold text-slate-800">
                                {candidate?.jobTitle || 'Senior Frontend Engineer'}
                            </span>
                        </span>
                        <span className="text-gray-300 mx-1">|</span>
                        <span>
                            Current Employer:{' '}
                            <span className="font-semibold text-slate-800">
                                {candidate?.company || 'Acme Talent Systems'}
                            </span>
                        </span>
                    </div>

                    {/* Row 2: Experience, Notice Period, Salary */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span>
                            Experience:{' '}
                            <span className="font-semibold text-slate-800">
                                {candidate?.experience || '7 Year'}
                            </span>
                        </span>
                        <span className="text-gray-300 mx-1">|</span>
                        <span>
                            Notice Period:{' '}
                            <span className="font-semibold text-slate-800">
                                {candidate?.noticePeriod || '4 Weeks'}
                            </span>
                        </span>
                        <span className="text-gray-300 mx-1">|</span>
                        <span>
                            Expected Salary:{' '}
                            <span className="font-semibold text-slate-800">
                                {candidate?.expectedSalary || '135000'}
                            </span>
                        </span>
                    </div>

                    {/* Row 3: Primary Skills */}
                    <div className="flex items-center gap-2 pt-1">
                        <span>Primary Skills:</span>
                        {/* Dynamic skill badges yahan add kar sakte hain baad mein */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Empty Space for skills */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Box */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-2xs flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-slate-900">Summary</h2>
                        <div className="flex items-center gap-2 text-gray-400">
                            {icons.map((item, index) => (
                                <button
                                    key={index}
                                    className="p-1 hover:text-slate-700 cursor-pointer transition-colors"
                                >
                                    {item.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                        {candidate?.summary ||
                            'Senior frontend engineer with 7 years of experience building React and TypeScript recruiting products. Strong background in component systems, dashboard workflows, performance tuning, and translating hiring operations into polished user interfaces.'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Overview