'use client';

import React, { useState } from 'react';

export default function ForgotPasswordEmail({ email, setEmail, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                onSuccess();
            } else {
                setErrorMsg(data.message || 'Something went wrong!');
            }
        } catch (error) {
            console.log("FORGOT PASSWORD ERROR:", error);
            setErrorMsg('Network error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
                Forgot Password?
            </h2>

            {errorMsg && (
                <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg">
                    {errorMsg}
                </div>
            )}

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email *
                </label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    required
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#6332c5]"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#6332c5] text-white font-bold rounded-lg text-sm cursor-pointer disabled:opacity-50"
            >
                {loading ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
}