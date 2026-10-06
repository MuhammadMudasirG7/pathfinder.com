'use client';
import { Layers, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function SetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // URL se token nikalne ka behtar tareeqa
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSetPassword = async (e) => {
        e.preventDefault();

        console.log("Frontend Token being sent:", token);

        if (!token) {
            alert('Authorization token is missing from the URL!');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    newPassword, 
                    confirmPassword, 
                    token 
                }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                alert('Password Reset Successfully!');
                router.push('/login');
            } else {
                alert(data.message || 'Failed to reset password');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong with the server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex h-screen w-full bg-white overflow-hidden">
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-10 overflow-y-auto">
                <div className="max-w-md w-full mx-auto space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#6332c5] rounded-xl flex items-center justify-center text-white shadow-md">
                            <Layers className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-gray-800 text-xl">Pathfinder ATS CRM</span>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Please enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleSetPassword} className="space-y-4">
                        <div className="relative">
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password *</label>
                            <input
                                type={showPass ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter Password"
                                required
                                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-white text-sm text-gray-900 focus:border-[#6332c5] focus:ring-1 focus:ring-[#6332c5] outline-none transition-all placeholder:text-gray-400 pr-10"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 cursor-pointer">
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                            <input
                                type={showConfirmPass ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                required
                                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-white text-sm text-gray-900 focus:border-[#6332c5] focus:ring-1 focus:ring-[#6332c5] outline-none transition-all placeholder:text-gray-400 pr-10"
                            />
                            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 cursor-pointer">
                                {showConfirmPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[#d6cbef] hover:bg-[#c4b5e8] text-[#4a239c] font-bold rounded-lg text-sm transition duration-200 cursor-pointer disabled:opacity-50 mt-2 shadow-sm"
                        >
                            {loading ? 'Setting password...' : 'Set password'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Banner */}
            <div className="hidden lg:flex w-1/2 p-6 bg-white items-center justify-center">
                <div className="w-full h-full bg-[#6d28d9] rounded-3xl flex flex-col items-center justify-between p-12 text-white relative overflow-hidden shadow-xl">
                    <div></div>
                    <div className="flex flex-col items-center text-center space-y-6 max-w-sm">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                            <Layers className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold tracking-tight">Introducing new features</h3>
                            <p className="text-xs text-purple-200 leading-relaxed px-4">
                                Customise your search! Define keywords and our system will intelligently parse resumes to find the perfect matches, faster.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 pb-2">
                        <ChevronLeft size={18} className="text-white/70" />
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        <ChevronRight size={18} className="text-white/70" />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function SetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <SetPasswordForm />
        </Suspense>
    );
}