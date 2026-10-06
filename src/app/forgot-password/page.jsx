'use client';
import { Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';

function ForgotPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);

    const getMaskedEmail = (inputEmail) => {
        if (!inputEmail.includes('@')) return 'mu***********90@gmail.com';
        const [name, domain] = inputEmail.split('@');
        if (name.length <= 2) return `${name}***@${domain}`;
        return `${name.slice(0, 2)}***********${name.slice(-2)}@${domain}`;
    };

    // Step 1: Send Email & OTP
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setStep(2);
            } else {
                alert(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong with the server');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length < 6) {
            alert('Please enter complete 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: enteredOtp }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                // Token cookie backend khud set kar dega, hum sirf set-password page par bhej denge
                router.push('/set-password');
            } else {
                alert(data.message || 'Invalid OTP');
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong with verification');
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
                        <button 
                            type="button"
                            onClick={() => {
                                if (step === 2) setStep(1);
                                else router.push('/login');
                            }} 
                            className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium cursor-pointer"
                        >
                            &lt; Back to login
                        </button>
                    </div>

                    {/* STEP 1: Enter Email */}
                    {step === 1 && (
                        <>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                                <p className="text-xs text-gray-500 mt-1">Enter your email below to recover password.</p>
                            </div>

                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email *</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter Your Work Email Address"
                                        required
                                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg bg-white text-sm text-gray-900 focus:border-[#6332c5] focus:ring-1 focus:ring-[#6332c5] outline-none transition-all placeholder:text-gray-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-[#d6cbef] hover:bg-[#c4b5e8] text-[#4a239c] font-bold rounded-lg text-sm transition duration-200 cursor-pointer disabled:opacity-50 mt-2 shadow-sm"
                                >
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                        </>
                    )}

                    {/* STEP 2: OTP Verification */}
                    {step === 2 && (
                        <>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Email Verification</h2>
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    We've sent a 6-digit verification code to <span className="font-semibold text-gray-800">{getMaskedEmail(email)}</span>. Please enter the code below to verify your identity.
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="flex items-center justify-between gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(e.target.value, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg focus:border-[#6332c5] focus:ring-1 focus:ring-[#6332c5] outline-none bg-white text-gray-800 shadow-sm"
                                        />
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-[#d6cbef] hover:bg-[#c4b5e8] text-[#4a239c] font-bold rounded-lg text-sm transition duration-200 cursor-pointer disabled:opacity-50 shadow-sm"
                                >
                                    {loading ? 'Verifying...' : 'Verify'}
                                </button>

                                <div className="text-center text-xs text-gray-500">
                                    Didn't get a code? <button type="button" onClick={() => handleEmailSubmit({ preventDefault: () => {} })} className="text-[#6332c5] font-semibold hover:underline cursor-pointer">Resend</button>
                                </div>
                            </form>
                        </>
                    )}

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

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <ForgotPasswordForm />
        </Suspense>
    );
}