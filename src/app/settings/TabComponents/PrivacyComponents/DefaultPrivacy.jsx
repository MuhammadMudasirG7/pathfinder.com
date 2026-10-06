'use client';

import React, { useEffect, useState } from 'react';
import HeaderNotification from '../NotificationComponents/HeaderNotification';
import { X, Eye, EyeOff } from 'lucide-react';

export default function DefaultPrivacy() {
    const [email, setEmail] = useState("");

    // Modals States
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isCodesModalOpen, setIsCodesModalOpen] = useState(false);

    // Password Form States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Visibility Toggles
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Recovery Codes State
    const [recoveryCodes, setRecoveryCodes] = useState([]);

    const [loading, setLoading] = useState(false);
    const [codesLoading, setCodesLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const getProfile = async () => {
        try {
            const response = await fetch("/api/auth/profile");
            const data = await response.json();
            if (data.success) {
                setEmail(data.user.email);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => { getProfile(); }, []);

    // Change Password Handler
    const handleChangePasswordSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (newPassword !== confirmPassword) {
            setErrorMsg("New passwords do not match.");
            return;
        }

        if (newPassword.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();
            if (data.success) {
                setSuccessMsg("Password changed successfully!");
                setTimeout(() => {
                    setIsPasswordModalOpen(false);
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setSuccessMsg("");
                }, 1500);
            } else {
                setErrorMsg(data.message || "Failed to change password.");
            }
        } catch (err) {
            setErrorMsg("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Show / Generate Recovery Codes Handler
    // Show / Generate Recovery Codes Handler
    const handleShowCodes = async () => {
        try {
            setCodesLoading(true);
            const res = await fetch("/api/auth/security/recovery-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            // Check karein ke response text kya aa raha hai agar JSON na ho
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error("Non-JSON Response:", text);
                alert("API route error! Check console for details.");
                return;
            }

            const data = await res.json();
            if (data.success) {
                setRecoveryCodes(data.recoveryCodes);
                setIsCodesModalOpen(true);
            } else {
                alert(data.message || "Failed to load recovery codes.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("Something went wrong!");
        } finally {
            setCodesLoading(false);
        }
    };

    // Copy Codes Handler
    const handleCopyCodes = () => {
        const codesText = recoveryCodes.join("\n");
        navigator.clipboard.writeText(codesText);
        alert("Recovery codes copied to clipboard!");
    };

    // Download Codes Handler
    const handleDownloadCodes = () => {
        const codesText = recoveryCodes.join("\n");
        const blob = new Blob([codesText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "recovery-codes.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <HeaderNotification title="Default Security" />
            <div className='border border-gray-200 px-3 py-3'>
                <div className='flex flex-col border-b border-gray-200 p-2'>
                    <span className='text-[13px] font-medium leading-[18px] text-[#142142]'>Primary Email</span>
                    <span className='text-[12px] font-medium leading-[18px] text-[#5C657C]'>{email}</span>
                </div>
                <div className='flex items-center justify-between border-b border-gray-200 p-2'>
                    <div className='flex flex-col'>
                        <span className='text-[13px] font-medium leading-[18px] text-[#142142]'>Password</span>
                        <span className='text-[12px] font-medium leading-[18px] text-[#5C657C]'>*#0!x%&</span>
                    </div>
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className='px-2 py-1 cursor-pointer text-[#FFFFFF] bg-[#6e41e2] text-[12px] rounded hover:bg-[#5b34bc] transition-colors'
                    >
                        Change Password
                    </button>
                </div>
                <div className='flex items-center justify-between p-2'>
                    <div className='flex flex-col space-y-1.5'>
                        <span className='text-[13px] font-medium leading-[18px] text-[#142142] font-sans'>Recovery Codes</span>
                        <span className='text-[12px] font-medium leading-[18px] text-[#5C657C] font-sans'>If you lose access to your password or verification methods, you will be able to log in <br /> with a recovery code.</span>
                        <span className='text-[12px] cursor-pointer font-medium leading-[18px] text-violet-700 hover:underline font-sans'>Learn More About Recovery Codes</span>
                    </div>
                    <button
                        onClick={handleShowCodes}
                        disabled={codesLoading}
                        className='px-2 py-1 flex items-center justify-center cursor-pointer text-[#FFFFFF] bg-[#6e41e2] text-[12px] rounded font-sans disabled:opacity-50'
                    >
                        {codesLoading ? "Loading..." : "Show Codes"}
                    </button>
                </div>
            </div>

            {/* Change Password Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-100">
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                            <div>
                                <h3 className="text-base font-semibold text-zinc-900">Change Password</h3>
                                <p className="text-xs text-zinc-500 mt-0.5">Enter your current password before choosing a new one.</p>
                            </div>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleChangePasswordSubmit} className="space-y-4 pt-4">
                            {errorMsg && <div className="p-2.5 text-xs text-red-600 bg-red-50 rounded-lg">{errorMsg}</div>}
                            {successMsg && <div className="p-2.5 text-xs text-emerald-600 bg-emerald-50 rounded-lg">{successMsg}</div>}

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-zinc-700">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 pr-10"
                                    />
                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600">
                                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-zinc-700">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 pr-10"
                                    />
                                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600">
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-[11px] text-zinc-400">Use at least 6 characters.</p>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-zinc-700">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 pr-10"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600">
                                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 text-xs font-medium text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
                                    Cancel
                                </button>
                                <button type="submit" disabled={loading} className="px-4 py-2 text-xs font-medium text-white bg-[#6e41e2] hover:bg-[#5b34bc] rounded-xl transition-colors shadow-sm disabled:opacity-50">
                                    {loading ? "Updating..." : "Change Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Recovery Codes Modal */}
            {isCodesModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                    <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-100">
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                            <div>
                                <h3 className="text-base font-semibold text-zinc-900">Recovery Codes</h3>
                                <p className="text-xs text-zinc-500 mt-0.5">Store these codes somewhere safe. Each code should only be used once.</p>
                            </div>
                            <button onClick={() => setIsCodesModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                            {recoveryCodes.map((code, index) => (
                                <div key={index} className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-center font-mono text-xs font-semibold text-zinc-800">
                                    {code}
                                </div>
                            ))}
                        </div>

                        <div className="p-3 mb-6 bg-amber-50 border border-amber-200/60 rounded-xl text-xs text-amber-800">
                            Generating new codes invalidates all previously generated recovery codes.
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                            <button
                                type="button"
                                onClick={handleShowCodes}
                                className="px-4 py-2 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-200"
                            >
                                Generate New Codes
                            </button>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleDownloadCodes}
                                    className="px-4 py-2 text-xs font-medium text-zinc-700 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
                                >
                                    Download
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCopyCodes}
                                    className="px-4 py-2 text-xs font-medium text-white bg-[#6e41e2] hover:bg-[#5b34bc] rounded-xl transition-colors shadow-sm"
                                >
                                    Copy Codes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}