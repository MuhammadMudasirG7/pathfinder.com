"use client"

import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'

const permissionSections = [
    {
        title: "Dashboards",
        permissions: [
            ["Can view dashboard module", "Can view own personal dashboard"],
            ["Can manage own personal dashboard", "Can share own dashboard"],
            ["Can view all dashboards", "Can view own team's dashboard"],
            ["Can manage team dashboards", "Can view shared dashboards"]
        ]
    },
    {
        title: "Candidates",
        permissions: [
            ["Can view candidates module", "Can view own candidates"],
            ["Can create own candidates", "Can edit own candidates"],
            ["Can delete own candidates", "Can change status of own candidates"],
            ["Can submit candidates to client", "Can parse candidates resume"],
            ["Can access all files related to candidates", "Can view all candidates"]
        ]
    },
    {
        title: "Jobs",
        permissions: [
            ["Can view jobs module", "Can view own jobs"],
            ["Can create jobs", "Can edit own jobs"],
            ["Can delete own jobs", "Can change status of own jobs"],
            ["Can transfer ownership of own jobs", "Can post job to free sites"],
            ["View all jobs", "Can view own Team's Jobs"],
            ["Can edit all jobs", "Can delete all jobs"],
            ["Can change status of all jobs", "Can transfer ownership of all jobs"],
            ["Can post job in paid sites", "Can access all files related to jobs"]
        ]
    },
    {
        title: "Companies",
        permissions: [
            ["Can view companies module", "Can view own companies"],
            ["Can create companies", "Can edit own companies"],
            ["Can manage company duplicates", "Can transfer ownership of own companies"],
            ["Can view all companies", "Can edit all companies"],
            ["Can delete all companies", "Can delete own companies"],
            ["Can transfer ownership of all companies", "Can access all files related to companies"]
        ]
    },
    {
        title: "Contacts",
        permissions: [
            ["Can view contacts module", "Can view own contacts"],
            ["Can create own contacts", "Can edit own contacts"],
            ["Can delete own contacts", "Can view all contacts"],
            ["Can edit all contacts", "Can delete all contacts"],
            ["Can manage contact duplicates", "Can access all files related to contacts"]
        ]
    },
    {
        title: "Deals",
        permissions: [
            ["Can view deals module", "Can view own deals"],
            ["Can create own deals", "Can edit own deals"],
            ["Can delete own deals", "Can transfer ownership of own deals"],
            ["Can access all files related to deals", "Can view all deals"],
            ["Can view own teams deals", "Can edit all deals"],
            ["Can delete all deals", "Can transfer ownership of all deals"]
        ]
    },
    {
        title: "Reports",
        permissions: [
            ["Can manage team performance report", "Can manage average time to fill report"],
            ["Can manage advanced analytics report", "Can manage recurring revenue report"]
        ]
    },
    {
        title: "Activities",
        permissions: [
            ["Can view activities module", "Can view own activities"],
            ["Can schedule, edit, delete own interview", "Can schedule, edit, delete own meeting"],
            ["Can view all activities (system wide)", "Can view own team's activities"],
            ["Can add, edit, delete own note", "Can add, edit, delete own task"]
        ]
    },
    {
        title: "User Settings",
        permissions: [
            ["Can view own profile", "Can edit own profile"],
            ["Can view own notifications settings", "Can edit own notification settings"],
            ["Can view own privacy & security settings", "Can edit own privacy & security settings"],
            ["Can configure own email account", "Can remove own email account"],
            ["Can manage own calendar", "Can remove own calendar"],
            ["Can configure meeting apps", "Can remove meeting apps"],
            ["Can view own preferences", "Can edit own preferences"],
            ["Can view own activity history", ""]
        ]
    },
    {
        title: "Admin Settings",
        permissions: [
            ["Can access admin settings", "Can manage users"],
            ["Can manage roles & permissions", "Can manage teams"],
            ["Can manage company details", "Can manage subscription & billing"],
            ["Can manage audit logs", ""]
        ]
    },
    {
        title: "Job Settings",
        permissions: [
            ["Can manage career page settings", "Can manage application form settings"],
            ["Can manage quick apply settings", "Can manage job boards settings"]
        ]
    },
    {
        title: "Configurations",
        permissions: [
            ["Can manage candidate fields", "Can manage contact fields"],
            ["Can manage contact stage", "Can manage company fields"],
            ["Can manage job fields", "Can manage job status"],
            ["Can manage job templates", "Can manage hiring pipeline"],
            ["Can manage deals pipeline", "Can manage deals fields"],
            ["Can manage meeting type", "Can manage task type"],
            ["Can manage tags", "Can manage skill set"]
        ]
    },
    {
        title: "Data Admin",
        permissions: [
            ["Can manage data migration", "Can export data to a spreadsheet"],
            ["Can bulk delete fields", "Can manage recycle bin"]
        ]
    },
    {
        title: "Automation",
        permissions: [
            ["Can manage email triggers", ""]
        ]
    },
    {
        title: "Portal Settings",
        permissions: [
            ["Can manage client portal", ""]
        ]
    },
    {
        title: "Developer Space",
        permissions: [
            ["Can manage APIs token", ""]
        ]
    },
    {
        title: "AI Assist",
        permissions: [
            ["Can link OpenAI account with pathfinder ats crm...", ""]
        ]
    }
]

const systemTabs = ["Super Admin", "Admin", "Standard User", "Collaborator"]

export default function CreateRoleModal({ isOpen, onClose, isViewMode = false, onCreateCustomRoleClick }) {
    const [activeTab, setActiveTab] = useState("Admin")

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0 bg-white">
                    <h2 className="text-sm font-bold text-gray-800">
                        {isViewMode ? "System Roles" : "Create Custom Role"}
                    </h2>
                    
                    <div className="flex items-center gap-3">
                        {isViewMode && (
                            <button 
                                onClick={onCreateCustomRoleClick}
                                className="bg-[#7c3aed] px-3 py-1.5 rounded-lg flex items-center text-white gap-1.5 cursor-pointer hover:bg-[#6d28d9] transition-colors shadow-xs text-xs font-semibold"
                            >
                                <Plus size={14} />
                                <span>Create Custom Role</span>
                            </button>
                        )}
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-lg"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 flex-1 overflow-y-auto space-y-6">
                    
                    {/* View Mode Tabs & Description */}
                    {isViewMode ? (
                        <div className="space-y-4 border-b border-gray-200 pb-4">
                            {/* Tabs Header */}
                            <div className="flex items-center gap-6 border-b border-gray-200">
                                {systemTabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-2 text-xs font-semibold relative cursor-pointer transition-colors ${
                                            activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7c3aed]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Description text */}
                            <p className="text-xs text-gray-600">
                                This role is system-defined and cannot be edited or deleted. If custom roles with specific permissions are required, a new role can be created.
                            </p>
                        </div>
                    ) : (
                        /* Inputs Row (Srf Create mode mein show hon gay) */
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Role Name *</label>
                                <input 
                                    type="text" 
                                    placeholder="Add Custom Role Name" 
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7c3aed]" 
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Role Description *</label>
                                <input 
                                    type="text" 
                                    placeholder="Add Custom Role Description" 
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#7c3aed]" 
                                />
                            </div>
                        </div>
                    )}

                    {/* Dynamic Sections Loop */}
                    {permissionSections.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-50/75 px-4 py-2.5 border-b border-gray-200">
                                <h3 className="text-xs font-bold text-gray-800">{section.title}</h3>
                            </div>
                            <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-6 text-xs text-gray-700">
                                {section.permissions.map((pair, pIndex) => (
                                    <React.Fragment key={pIndex}>
                                        {/* Left Column Item */}
                                        <label className={`flex items-center justify-between ${isViewMode ? 'cursor-default opacity-80' : 'cursor-pointer'}`}>
                                            <span>{pair[0]}</span>
                                            <input 
                                                type="checkbox" 
                                                defaultChecked={isViewMode ? true : false}
                                                disabled={isViewMode} 
                                                className={`rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed] w-4 h-4 ${isViewMode ? 'cursor-default accent-[#7c3aed]' : 'cursor-pointer'}`} 
                                            />
                                        </label>

                                        {/* Right Column Item */}
                                        {pair[1] ? (
                                            <label className={`flex items-center justify-between ${isViewMode ? 'cursor-default opacity-80' : 'cursor-pointer'}`}>
                                                <span>{pair[1]}</span>
                                                <input 
                                                    type="checkbox" 
                                                    defaultChecked={isViewMode ? true : false}
                                                    disabled={isViewMode} 
                                                    className={`rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed] w-4 h-4 ${isViewMode ? 'cursor-default accent-[#7c3aed]' : 'cursor-pointer'}`} 
                                                />
                                            </label>
                                        ) : (
                                            <div></div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    ))}

                </div>

                {/* Modal Footer (Srf Create mode mein show hoga, View mode mein ghaib) */}
                {!isViewMode && (
                    <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => { console.log("Role Saved"); onClose(); }}
                            className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg text-xs font-semibold hover:bg-[#6d28d9] cursor-pointer transition-colors shadow-xs"
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}