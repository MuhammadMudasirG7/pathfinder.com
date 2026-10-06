"use client"

import React, { useState, useRef, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Shield, Filter, MoreVertical, Plus, Eye, Edit, Ban } from 'lucide-react'
import CreateRoleModal from '../../TabComponents/jobFieldsComponents/CreateRoleModal'

export default function RolesandPermissions() {
    const [roles, setRoles] = useState([])
    const [activeMenuId, setActiveMenuId] = useState(null)
    const [menuPosition, setMenuPosition] = useState(null)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false) // Create Custom Role Modal State
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)     // View System Roles Modal State
    const menuRef = useRef(null)

    // Backend se roles fetch karne ke liye
    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = async () => {
        try {
            const res = await fetch('/api/roles')
            const data = await res.json()
            if (data.success) {
                // MongoDB _id ko id mein map karna ya directly use karna
                const formattedRoles = data.roles.map(role => ({
                    ...role,
                    id: role._id // PrimeReact ya internal mapping ke liye
                }))
                setRoles(formattedRoles)
            }
        } catch (error) {
            console.error("Error fetching roles:", error)
        }
    }

    // Baahar click karne par menu close karne ke liye
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuId(null)
                setMenuPosition(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const roleNameTemplate = (row) => (
        <span className="font-semibold text-gray-900 text-xs">{row.name}</span>
    )

    const descriptionTemplate = (row) => (
        <span className="text-gray-600 text-xs">{row.description}</span>
    )

    const createdByTemplate = (row) => (
        <div className="flex flex-col text-[11px]">
            <span className="text-gray-900 font-medium">{row.creator}</span>
            <span className="text-gray-500">{row.date}</span>
        </div>
    )

    const usersCountTemplate = (row) => (
        <span className="px-2.5 py-1 bg-[#7c3aed] text-white rounded-md text-[10px] font-bold inline-block">
            {row.usersCount}
        </span>
    )

    const actionsTemplate = (row) => (
        <div className="flex justify-end pr-2">
            <button 
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    if (activeMenuId === row.id) {
                        setActiveMenuId(null)
                        setMenuPosition(null)
                    } else {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setActiveMenuId(row.id)
                        setMenuPosition({
                            top: rect.bottom + 4,
                            left: rect.right - 112 // 112px width (w-28) ko adjust karne ke liye
                        })
                    }
                }}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${activeMenuId === row.id ? 'border border-gray-200 bg-white shadow-xs' : 'hover:bg-gray-100 text-gray-400'}`}
            >
                <MoreVertical size={16} />
            </button>
        </div>
    )

    const renderHeader = () => (
        <div className='flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200'>
            <div className='flex items-center gap-2.5'>
                <Shield size={16} className='text-gray-500' />
                <span className='text-xs font-bold text-gray-800'>{roles.length} custom roles</span>
            </div>
            <button className='h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors'>
                <Filter size={13} className='text-gray-500' />
            </button>
        </div>
    )

    return (
        <div className='p-6 font-sans max-w-7xl mx-auto bg-gray-50/25 min-h-screen relative'>
            
            {/* Fixed Position Popup Dropdown */}
            {activeMenuId && menuPosition && (
                <div 
                    ref={menuRef} 
                    style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                    className="fixed w-28 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 text-left"
                >
                    <button 
                        onClick={() => { console.log("Edit:", activeMenuId); setActiveMenuId(null); }}
                        className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <Edit size={13} className="text-gray-500" />
                        Edit
                    </button>
                    <button 
                        onClick={() => { console.log("Disable:", activeMenuId); setActiveMenuId(null); }}
                        className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <Ban size={13} className="text-gray-500" />
                        Disable
                    </button>
                    <button 
                        onClick={() => { console.log("View:", activeMenuId); setActiveMenuId(null); }}
                        className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <Eye size={13} className="text-gray-500" />
                        View
                    </button>
                </div>
            )}

            {/* Create Custom Role Modal */}
            <CreateRoleModal 
                isOpen={isCreateModalOpen} 
                onClose={() => {
                    setIsCreateModalOpen(false)
                    fetchRoles() // Modal close hone par list refresh ho jaye gi
                }} 
                isViewMode={false}
            />

            {/* View System Roles Modal */}
            <CreateRoleModal 
                isOpen={isViewModalOpen} 
                onClose={() => setIsViewModalOpen(false)} 
                isViewMode={true}
                onCreateCustomRoleClick={() => {
                    setIsViewModalOpen(false)      // View modal band hoga
                    setIsCreateModalOpen(true)     // Create modal khul jaye ga
                }}
            />

            {/* Top Buttons */}
            <div className='flex items-center justify-end gap-3 mb-5'>
                <button 
                    onClick={() => setIsViewModalOpen(true)}
                    className='bg-white border border-gray-200 px-4 rounded-lg py-2 flex items-center text-gray-700 gap-2 cursor-pointer hover:bg-gray-50 transition-colors shadow-xs'
                >
                    <Eye size={16} className="text-gray-500" />
                    <span className='text-xs font-semibold'>View System Roles</span>
                </button>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className='bg-[#7c3aed] px-4 rounded-lg py-2 flex items-center text-white gap-2 cursor-pointer hover:bg-[#6d28d9] transition-colors shadow-xs'
                >
                    <Plus size={16} />
                    <span className='text-xs font-semibold'>Create Custom Role</span>
                </button>
            </div>

            {/* Main Table Card */}
            <div className='border border-gray-200 rounded-xl bg-white shadow-xs'>
                {renderHeader()}

                <DataTable 
                    className='text-xs custom-table' 
                    value={roles} 
                    paginator 
                    rows={20} 
                    rowsPerPageOptions={[5, 10, 20]} 
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate='Showing {first} to {last} of {totalRecords} results'
                >
                    <Column body={roleNameTemplate} header="Custom Role Name" />
                    <Column body={descriptionTemplate} header="Description" />
                    <Column body={createdByTemplate} header="Created By" />
                    <Column body={usersCountTemplate} header="Users" />
                    <Column body={actionsTemplate} header="Actions" className="text-right" />
                </DataTable>
            </div>
        </div>
    )
}