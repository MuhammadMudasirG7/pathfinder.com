'use client';

import React, { useRef, useState } from 'react';

export default function VerifyOtp({ email, onSuccess, onBack }) {
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const inputRefs = useRef([]);

    const handleOtpChange = (index, value) => {
       if (value < 0 || value > 9) {
         return;
       }
       const newOTP = [...otpValues]
       newOTP[index] = value
       setOtpValues(newOTP)

       if (value && index < 5) {
         inputRefs.current[index + 1].focus()
       }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && otpValues[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResendOtp = async () => {
        setResending(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setSuccessMsg('New OTP sent successfully!');
            } else {
                setErrorMsg(data.message || 'Failed to resend OTP.');
            }
        } catch (error) {
            console.log("RESEND OTP ERROR:", error);
            setErrorMsg('Network error.');
        } finally {
            setResending(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalOtp = otpValues.join('');

        if (finalOtp.length !== 6) {
            setErrorMsg('Please enter a complete 6-digit OTP.');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: finalOtp })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                onSuccess();
            } else {
                setErrorMsg(data.message || 'Invalid OTP!');
            }
        } catch (error) {
            console.log("VERIFY OTP ERROR:", error);
            setErrorMsg('Network error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    Email Verification
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                    Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
                </p>
            </div>

            {errorMsg && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    {errorMsg}
                </div>
            )}

            {successMsg && (
                <div className="p-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg">
                    {successMsg}
                </div>
            )}

            <div className="flex justify-between gap-2">
                {otpValues.map((value, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-12 h-12 text-center text-lg font-bold border border-gray-200 rounded-lg outline-none focus:border-[#6332c5]"
                    />
                ))}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#6332c5] text-white font-bold rounded-lg text-sm cursor-pointer disabled:opacity-50"
            >
                {loading ? 'Verifying...' : 'Verify'}
            </button>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <button
                    type="button"
                    onClick={onBack}
                    className="cursor-pointer hover:underline"
                >
                    &larr; Back
                </button>

                <p>
                    Didn't receive code?{' '}
                    <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={resending}
                        className="text-[#6332c5] font-semibold cursor-pointer hover:underline disabled:opacity-50"
                    >
                        {resending ? 'Sending...' : 'Resend'}
                    </button>
                </p>
            </div>
        </form>
    );
}