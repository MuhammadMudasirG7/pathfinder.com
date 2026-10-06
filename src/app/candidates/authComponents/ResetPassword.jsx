'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import Toast from '@/app/settings/TabComponents/UsersComponents.jsx/Toast';


export default function ResetPassword({ onSuccess, onBack }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Toast state
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            setErrorMsg('All Fields Are Required!');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match!');
            return;
        }

        if (newPassword.length < 6) {
            setErrorMsg('Password Must Be At Least 6 Characters!');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPassword, confirmPassword })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setLoading(false);
                setToast({ show: true, message: 'Password reset successfully!', type: 'success' });
                
                // Thora delay de kar onSuccess trigger karenge taaki toast user ko dikh jaye
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            } else {
                setLoading(false);
                setErrorMsg(data.message || 'Failed to reset password.');
                setToast({ show: true, message: data.message || 'Failed to reset password.', type: 'error' });
            }
        } catch (error) {
            console.log("RESET PASSWORD ERROR:", error);
            setLoading(false);
            setErrorMsg('Network error.');
            setToast({ show: true, message: 'Network error.', type: 'error' });
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                    Set Password
                </h2>

                {errorMsg && (
                    <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                        {errorMsg}
                    </div>
                )}

                {/* Password */}
                <div className="relative">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Password *
                    </label>
                    <input
                        type={showPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter Password"
                        required
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#6332c5] pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                    >
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Confirm Password *
                    </label>
                    <input
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#6332c5] pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-9 text-gray-500 cursor-pointer"
                    >
                        {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#6332c5] text-white font-bold rounded-lg text-sm cursor-pointer disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Set Password'}
                </button>

                <button
                    type="button"
                    onClick={onBack}
                    className="w-full text-xs text-gray-500 cursor-pointer hover:underline"
                >
                    Back
                </button>
            </form>

            {/* Toast Integration */}
            <Toast 
                show={toast.show} 
                message={toast.message} 
                type={toast.type} 
                onClose={() => setToast(prev => ({ ...prev, show: false }))} 
            />
        </div>
    );
}