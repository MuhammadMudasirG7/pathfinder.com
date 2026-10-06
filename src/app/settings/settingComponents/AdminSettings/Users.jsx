"use client"

import React, { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Users, Filter, MoreVertical, UserRoundPlus, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react'
import InviteUserDrawer from '../../TabComponents/UsersComponents.jsx/InviteUserDrawer'
import AdvancedFilterDrawer from '../../TabComponents/UsersComponents.jsx/AdvancedFilterDrawer'

export default function TailwindUserTable() {
    const [users, setUsers] = useState([])
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    
    // Delete Confirmation Modal state
    const [deleteModal, setDeleteModal] = useState({ show: false, userId: null, userName: '' })
    const [isDeleting, setIsDeleting] = useState(false)
    
    // Toast notification state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const [activeMenuId, setActiveMenuId] = useState(null)
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
    const menuRef = useRef(null)
    const buttonRefs = useRef({})

    // Helper to show custom toast
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type })
        setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }))
        }, 3000)
    }

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/auth/users')
            const data = await response.json()
            if (data.success) {
                setUsers(data.users)
            }
        } catch (error) {
            console.log("Error fetching users:", error)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    // Outside click handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenuId(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // --- Action Handlers ---
    const confirmDeleteUser = (user) => {
        setDeleteModal({ show: true, userId: user.id, userName: user.name })
        setActiveMenuId(null)
    }

    const handleDeleteUser = async () => {
        if (!deleteModal.userId) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/auth/users/${deleteModal.userId}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (res.ok && data.success) {
                showToast("User deleted successfully!", "success");
                fetchUsers();
                setDeleteModal({ show: false, userId: null, userName: '' });
            } else {
                showToast(data.message || "Failed to delete user", "error");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            showToast("Something went wrong!", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleResendInvite = async (userId) => {
        try {
            const res = await fetch(`/api/auth/users/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'resend' }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                showToast("Invite email resent successfully!", "success");
                setActiveMenuId(null);
            } else {
                showToast(data.message || "Failed to resend invite", "error");
            }
        } catch (error) {
            console.error("Error resending invite:", error);
            showToast("Something went wrong!", "error");
        }
    };

    const handleCopyInviteLink = async (userId) => {
        try {
            const res = await fetch(`/api/auth/users/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'copy-link' }),
            });
            const data = await res.json();

            if (res.ok && data.success && data.inviteLink) {
                navigator.clipboard.writeText(data.inviteLink);
                showToast("Invite link copied to clipboard!", "success");
                setActiveMenuId(null);
            } else {
                showToast(data.message || "Failed to generate link", "error");
            }
        } catch (error) {
            console.error("Error copying link:", error);
            showToast("Something went wrong!", "error");
        }
    };

    const handleDisableUser = async (userId) => {
        try {
            const res = await fetch(`/api/auth/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'disable' }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                showToast("User disabled & logged out successfully!", "success");
                fetchUsers();
                setActiveMenuId(null);
            } else {
                showToast(data.message || "Failed to disable user", "error");
            }
        } catch (error) {
            console.error("Error disabling user:", error);
            showToast("Something went wrong!", "error");
        }
    };

    const handleReactivateUser = async (userId) => {
        try {
            const res = await fetch(`/api/auth/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reactivate' }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                showToast("User reactivated successfully!", "success");
                fetchUsers();
                setActiveMenuId(null);
            } else {
                showToast(data.message || "Failed to reactivate user", "error");
            }
        } catch (error) {
            console.error("Error reactivating user:", error);
            showToast("Something went wrong!", "error");
        }
    };

    // Pagination calculations
    const indexOfLastRow = currentPage * rowsPerPage
    const indexOfFirstRow = indexOfLastRow - rowsPerPage
    const currentRows = users.slice(indexOfFirstRow, indexOfLastRow)
    const totalPages = Math.ceil(users.length / rowsPerPage) || 1

    const handleRowsChange = (e) => {
        setRowsPerPage(Number(e.target.value))
        setCurrentPage(1)
    }

    const userTemplate = (row) => (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs shrink-0">
                <span className='text-[10px]'>{row.initials}</span>
            </div>
            <div className="flex flex-col">
                <span className="font-semibold text-gray-600 text-[10px]">{row.name}</span>
                <span className='text-[9px] text-gray-500'>{row.email}</span>
            </div>
        </div>
    )

    const toggleMenu = (e, rowId) => {
        e.stopPropagation()
        if (activeMenuId === rowId) {
            setActiveMenuId(null)
        } else {
            const rect = buttonRefs.current[rowId]?.getBoundingClientRect()
            if (rect) {
                setMenuPosition({
                    top: rect.bottom + window.scrollY + 4,
                    left: rect.right - 176
                })
            }
            setActiveMenuId(rowId)
        }
    }

    const Actions = (row) => {
        const isOpen = activeMenuId === row.id
        const status = (row.status || '').toLowerCase()
        const isActive = status === 'active'
        const isPending = status === 'pending'
        const isExpired = status === 'link_expired' || status === 'expired'

        return (
            <div className="flex justify-end pr-2">
                <button
                    type="button"
                    ref={(el) => (buttonRefs.current[row.id] = el)}
                    className="p-1 rounded-full hover:bg-gray-100 cursor-pointer focus:outline-none"
                    onClick={(e) => toggleMenu(e, row.id)}
                >
                    <MoreVertical size={16} className="text-gray-400 hover:text-gray-600" />
                </button>

                {isOpen && createPortal(
                    <div 
                        ref={menuRef}
                        style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
                        className="fixed w-44 bg-white border border-gray-200 rounded-lg shadow-2xl py-1.5 z-[999999] text-left"
                    >
                        <button 
                            disabled={!isActive}
                            className={`w-full text-left px-4 py-1.5 text-[11px] ${isActive ? 'text-gray-700 hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
                            onClick={() => { console.log('Edit', row.id); setActiveMenuId(null); }}
                        >
                            Edit
                        </button>

                        <button 
                            disabled={!(isPending || isExpired)}
                            className={`w-full text-left px-4 py-1.5 text-[11px] ${(isPending || isExpired) ? 'text-gray-700 hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
                            onClick={() => handleResendInvite(row.id)}
                        >
                            Resend Invite
                        </button>

                        <button 
                            disabled={!(isPending || isExpired)}
                            className={`w-full text-left px-4 py-1.5 text-[11px] ${(isPending || isExpired) ? 'text-gray-700 hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
                            onClick={() => handleCopyInviteLink(row.id)}
                        >
                            Copy Invite Link
                        </button>

                        <button 
                            disabled={isExpired}
                            className="w-full text-left px-4 py-1.5 text-[11px] text-red-600 hover:bg-red-50 cursor-pointer"
                            onClick={() => confirmDeleteUser(row)}
                        >
                            Delete User
                        </button>

                        <button 
                            disabled={!isActive}
                            className={`w-full text-left px-4 py-1.5 text-[11px] ${isActive ? 'text-red-600 hover:bg-red-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
                            onClick={() => handleDisableUser(row.id)}
                        >
                            Disable User
                        </button>

                        <button 
                            disabled={isActive}
                            className={`w-full text-left px-4 py-1.5 text-[11px] ${!isActive ? 'text-emerald-600 hover:bg-emerald-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
                            onClick={() => handleReactivateUser(row.id)}
                        >
                            Reactivate User
                        </button>

                        <div className="border-t border-gray-100 my-1"></div>

                        <button 
                            className="w-full text-left px-4 py-1.5 text-[11px] text-gray-800 font-medium hover:bg-gray-50 cursor-pointer"
                            onClick={() => { console.log('View User Details', row.id); setActiveMenuId(null); }}
                        >
                            View User Details
                        </button>

                        <button 
                            disabled={!isActive}
                            className={`w-full text-left px-4 py-1.5 text-[11px] ${isActive ? 'text-gray-700 hover:bg-gray-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed'}`}
                            onClick={() => { console.log('Unlock User', row.id); setActiveMenuId(null); }}
                        >
                            Unlock User
                        </button>
                    </div>,
                    document.body
                )}
            </div>
        )
    }

    return (
        <div className='p-2 font-sans max-w-7xl mx-auto bg-gray-50/25 relative'>
            
            {/* Custom Toast Notification Popup */}
            {toast.show && (
                <div className="fixed top-5 right-5 z-[9999999] flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 shadow-xl rounded-xl text-xs font-medium animate-bounce transition-all">
                    {toast.type === 'success' ? (
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : (
                        <AlertCircle size={16} className="text-red-500 shrink-0" />
                    )}
                    <span className="text-gray-700">{toast.message}</span>
                </div>
            )}

            {/* Professional Center Delete Confirmation Modal */}
            {deleteModal.show && createPortal(
                <div className="fixed inset-0 z-[99999999] flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 transform transition-all scale-100">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                                <AlertTriangle size={20} />
                            </div>
                            <button 
                                onClick={() => setDeleteModal({ show: false, userId: null, userName: '' })}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <h3 className="text-base font-bold text-gray-900 mb-1">Delete User</h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                            Are you sure you want to delete <span className="font-semibold text-gray-700">"{deleteModal.userName}"</span>? This action cannot be undone and will permanently remove their access from the system.
                        </p>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setDeleteModal({ show: false, userId: null, userName: '' })}
                                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleDeleteUser}
                                className="px-4 py-2 rounded-xl bg-red-600 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <div className='flex items-center justify-end mb-5'>
                <button
                    onClick={() => setIsInviteOpen(true)}
                    className='bg-[#7c3aed] px-4 rounded-lg py-2 flex items-center text-white gap-2 cursor-pointer hover:bg-[#6d28d9] transition-colors shadow-xs'
                >
                    <UserRoundPlus size={16} />
                    <span className='text-xs font-semibold'>Invite User</span>
                </button>
            </div>

            <div className='border border-gray-200 rounded-xl bg-white shadow-xs'>
                {/* Header */}
                <div className='flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 rounded-t-xl'>
                    <div className='flex items-center gap-2.5'>
                        <Users size={14} className='text-gray-500' />
                        <span className='text-[11px] font-bold text-gray-800'>{users.length} total users</span>
                    </div>
                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className='h-8 w-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors'
                    >
                        <Filter size={13} className='text-gray-500' />
                    </button>
                </div>

                {/* Table Container */}
                <div className="w-full overflow-x-auto">
                    <table className='w-full text-left text-[10px] text-nowrap'>
                        <thead className='bg-gray-50 text-gray-500 border-b border-gray-200'>
                            <tr>
                                <th className='px-6 py-3 font-semibold'>User</th>
                                <th className='px-6 py-3 font-semibold'>Role</th>
                                <th className='px-6 py-3 font-semibold'>Status</th>
                                <th className='px-6 py-3 font-semibold'>Job Title</th>
                                <th className='px-6 py-3 font-semibold'>Teams</th>
                                <th className='px-6 py-3 font-semibold'>Last Activity</th>
                                <th className='px-6 py-3 font-semibold text-right'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100'>
                            {currentRows.length > 0 ? (
                                currentRows.map((row) => (
                                    <tr key={row.id} className='hover:bg-gray-50/50 transition-colors'>
                                        <td className='px-6 py-2.5'>{userTemplate(row)}</td>
                                        <td className='px-6 py-2.5'>
                                            <span className='px-2.5 py-1 bg-[#7c3aed] text-white rounded-md text-[10px] font-medium'>{row.role}</span>
                                        </td>
                                        <td className='px-6 py-2.5'>
                                            <span className='px-2.5 py-1 bg-[#7c3aed] text-white rounded-md text-[10px] font-medium'>{row.status}</span>
                                        </td>
                                        <td className='px-6 py-2.5 text-gray-700'>{row.job}</td>
                                        <td className='px-6 py-2.5 text-gray-700'>{row.team}</td>
                                        <td className='px-6 py-2.5'>
                                            <div className='flex flex-col text-[11px]'>
                                                <span className="text-gray-700">{row.timeAgo}</span>
                                                <span className="text-gray-500">{row.date}</span>
                                            </div>
                                        </td>
                                        <td className='px-6 py-2.5 text-right'>{Actions(row)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className='text-center py-6 text-gray-500'>No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Paginator */}
                <div className='flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-white text-[11px] text-gray-500 rounded-b-xl'>
                    <div className='flex items-center gap-4'>
                        <span>Showing {users.length > 0 ? indexOfFirstRow + 1 : 0} to {Math.min(indexOfLastRow, users.length)} of {users.length} results</span>
                        
                        <select 
                            value={rowsPerPage} 
                            onChange={handleRowsChange}
                            className='border border-gray-200 rounded px-2 py-1 text-xs bg-white outline-none cursor-pointer text-gray-700'
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    <div className='flex items-center gap-1.5'>
                        <span className="mr-3 font-medium text-gray-600">Page {currentPage} of {totalPages}</span>
                        
                        <button 
                            onClick={() => setCurrentPage(1)} 
                            disabled={currentPage === 1}
                            className='p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
                        >
                            <ChevronsLeft size={14} />
                        </button>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                            disabled={currentPage === 1}
                            className='p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
                        >
                            <ChevronLeft size={14} />
                        </button>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                            disabled={currentPage === totalPages}
                            className='p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
                        >
                            <ChevronRight size={14} />
                        </button>
                        <button 
                            onClick={() => setCurrentPage(totalPages)} 
                            disabled={currentPage === totalPages}
                            className='p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer'
                        >
                            <ChevronsRight size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <InviteUserDrawer isOpen={isInviteOpen} onClose={() => { setIsInviteOpen(false); fetchUsers(); }} />
            <AdvancedFilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
        </div>
    )
}