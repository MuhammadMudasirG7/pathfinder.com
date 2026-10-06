"use client"

import React, { useState } from 'react'
import { X } from 'lucide-react'
import Toast from './Toast' // Apne toast component ka sahi path dein

export default function InviteUserDrawer({ isOpen, onClose }) {
    // Form fields ka state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        team: 'Select Team',
        jobTitle: '',
        contactNumber: '',
        timeZone: '(GMT +12:00) Pacific/Auckland',
        city: '',
        state: '',
        country: '',
        systemRoles: {
            superAdmin: false,
            administrator: false,
            standardUser: false,
            collaborator: false,
        },
        customRoles: {
            regionalAuditor: false,
            talentPipeline: false,
            externalVendor: false,
        }
    })

    const [loading, setLoading] = useState(false)
    
    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if (type === 'checkbox') {
            const [section, key] = name.split('.')
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [key]: checked
                }
            }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    // Backend API ke sath connect karne ka function
    const handleSendInvite = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/auth/users/invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setLoading(false);
                setToast({ show: true, message: 'User invited successfully and email sent!', type: 'success' });
                setTimeout(() => {
                    onClose(); // Thora delay ya direct band karne ke liye
                }, 1000);
            } else {
                setLoading(false);
                setToast({ show: true, message: 'Error: ' + (data.error || 'Failed to invite'), type: 'error' });
            }
        } catch (err) {
            console.error('Something went wrong:', err);
            setLoading(false);
            setToast({ show: true, message: 'Failed to send invite.', type: 'error' });
        }
    }

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 flex justify-end">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                    <h2 className="text-sm font-bold text-gray-900">Invite User</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4 text-[11px]">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">First Name *</label>
                            <input 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Add First Name" 
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Last Name *</label>
                            <input 
                                type="text" 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Add Last Name" 
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Email *</label>
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Add Email" 
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Team</label>
                            <select 
                                name="team"
                                value={formData.team}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white focus:border-[#7c3aed] cursor-pointer"
                            >
                                <option>Select Team</option>
                                <option>Sales</option>
                                <option>Default</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Job Title</label>
                            <input 
                                type="text" 
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                placeholder="Add Job Title" 
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Contact Number</label>
                            <input 
                                type="text" 
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="Add Contact Number" 
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Time Zone</label>
                            <select 
                                name="timeZone"
                                value={formData.timeZone}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white focus:border-[#7c3aed] cursor-pointer"
                            >
                                <option>(GMT +12:00) Pacific/Auckland</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">City</label>
                            <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                placeholder="Search or Enter City" 
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">State</label>
                            <input 
                                type="text" 
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                placeholder="Search or Enter State" 
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]" 
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Country</label>
                            <input 
                                type="text" 
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                placeholder="Search or Enter Country" 
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-[#7c3aed]" 
                            />
                        </div>
                    </div>

                    {/* System Roles & Permissions */}
                    <div className="pt-2">
                        <label className="block text-gray-800 font-semibold mb-2">System Roles & Permissions</label>
                        <div className="space-y-2 border border-gray-200 rounded-lg p-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="systemRoles.superAdmin"
                                    checked={formData.systemRoles.superAdmin}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed]" 
                                />
                                <span className="text-gray-700">Super Admin</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="systemRoles.administrator"
                                    checked={formData.systemRoles.administrator}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed]" 
                                />
                                <span className="text-gray-700">Administrator</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="systemRoles.standardUser"
                                    checked={formData.systemRoles.standardUser}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed]" 
                                />
                                <span className="text-gray-700">Standard User</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    name="systemRoles.collaborator"
                                    checked={formData.systemRoles.collaborator}
                                    onChange={handleChange}
                                    className="rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed]" 
                                />
                                <span className="text-gray-700">Collaborator</span>
                            </label>
                        </div>
                    </div>

                    {/* Custom Roles & Permissions */}
                    <div className="pt-2">
                        <label className="block text-gray-800 font-semibold mb-2">Custom Roles & Permissions</label>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 border-b border-gray-200 font-semibold text-gray-700">
                                <span className="col-span-5">Role Name</span>
                                <span className="col-span-7">Description</span>
                            </div>
                            
                            <div className="divide-y divide-gray-100">
                                <div className="grid grid-cols-12 px-3 py-2.5 items-center">
                                    <label className="col-span-5 flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="customRoles.regionalAuditor"
                                            checked={formData.customRoles.regionalAuditor}
                                            onChange={handleChange}
                                            className="rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed]" 
                                        />
                                        <span className="text-gray-700 font-medium">Regional Auditor</span>
                                    </label>
                                    <span className="col-span-7 text-gray-500">View only access to regional branch performance and financial logs</span>
                                </div>

                                <div className="grid grid-cols-12 px-3 py-2.5 items-center">
                                    <label className="col-span-5 flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="customRoles.talentPipeline"
                                            checked={formData.customRoles.talentPipeline}
                                            onChange={handleChange}
                                            className="rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed]" 
                                        />
                                        <span className="text-gray-700 font-medium">Talent Pipeline Manager</span>
                                    </label>
                                    <span className="col-span-7 text-gray-500">Create and edit candidate records only</span>
                                </div>

                                <div className="grid grid-cols-12 px-3 py-2.5 items-center">
                                    <label className="col-span-5 flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            name="customRoles.externalVendor"
                                            checked={formData.customRoles.externalVendor}
                                            onChange={handleChange}
                                            className="rounded border-gray-300 text-[#7c3aed] focus:ring-[#7c3aed]" 
                                        />
                                        <span className="text-gray-700 font-medium">External vendor Coordinator</span>
                                    </label>
                                    <span className="col-span-7 text-gray-500">Manage third-party job board integrations and external posting permissions</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Email Display Box */}
                    <div className="pt-2">
                        <label className="block text-gray-800 font-semibold mb-1">User Email*</label>
                        <div className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-600 min-h-[38px] flex items-center">
                            {formData.email ? formData.email : "The user's email address will be displayed here once it is entered above."}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">
                            A link will be sent to the above email to complete the login process. For security reasons, the link to sign in will expire after 72 hours.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-white sticky bottom-0">
                    <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer">Cancel</button>
                    <button 
                        onClick={handleSendInvite} 
                        disabled={loading}
                        className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg font-semibold hover:bg-[#6d28d9] cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Invite'}
                    </button>
                </div>
            </div>

            {/* Toast Integration */}
            <Toast 
                show={toast.show} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast(prev => ({ ...prev, show: false }))} 
            />
        </div>
    )
}