"use client"

import React from 'react'
import { X, ListFilter } from 'lucide-react'

export default function AdvancedFilterDrawer({ isOpen, onClose }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 flex justify-start">
            <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-sm font-bold text-gray-900">Advanced Filter</h2>
                        <p className="text-[11px] text-gray-700">Users</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-5 text-[11px] flex-1">
                    <div>
                        <h3 className="text-xs font-bold text-[#7c3aed] mb-4">Roles & Permissions</h3>
                        <div className="space-y-4">
                            {[
                                { title: "Super Admin", type: "System Role" },
                                { title: "Administrator", type: "System Role" },
                                { title: "Standard User", type: "System Role" },
                                { title: "Collaborator", type: "System Role" },
                                { title: "Regional Auditor", type: "Custom Role" },
                                { title: "Talent Pipeline Manager", type: "Custom Role" },
                                { title: "External vendor Coordinator", type: "Custom Role" }
                            ].map((role, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-700">{role.title}</p>
                                        <p className="text-[11px] text-gray-700">{role.type}</p>
                                    </div>
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed] cursor-pointer" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0 space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium px-2">
                        <span className="text-gray-700">Total Matches</span>
                        <span className="text-gray-900 font-bold">5 Users</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-2">
                            <ListFilter size={14} />
                            Reset All Filters
                        </button>
                        <button onClick={onClose} className="flex-1 px-4 py-2 bg-[#7c3aed] text-white rounded-lg font-semibold hover:bg-[#6d28d9] cursor-pointer">
                            Apply & View
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}