'use client';
import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginLeft({ onSwitchToSignup, onForgotClick }) {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '', recoveryCode: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    
    // States: 'credentials' (Normal Login), 'recovery-login' (Email + Code to get new password)
    const [loginStep, setLoginStep] = useState('credentials'); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Normal Login Submit
    const handleCredentialsSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                const locationResponse = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                );
                const locationData = await locationResponse.json();
                const city = locationData.address.city || locationData.address.municipality || '';
                const country = locationData.address.country || '';
                const location = `${city}, ${country}`;

                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        location: location
                    }),
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    router.push('/');
                } else {
                    setErrorMsg(data.message || 'Incorrect email or password.');
                }
                setLoading(false);
            }, (error) => {
                setErrorMsg("Location permission allow karein.");
                setLoading(false);
            });
        } catch (error) {
            setErrorMsg('Network error, connection check karein.');
            setLoading(false);
        }
    };

    // Recovery Code Submit (Email + Code -> Send New Password)
    const handleRecoveryLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const response = await fetch('/api/auth/security/recovery-code/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    recoveryCode: formData.recoveryCode
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccessMsg('Naya password aapki email par bhej diya gaya hai!');
                setTimeout(() => {
                    setLoginStep('credentials');
                    setSuccessMsg('');
                }, 4000);
            } else {
                setErrorMsg(data.message || 'Invalid email or recovery code.');
            }
        } catch (error) {
            setErrorMsg('Network error, connection check karein.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full px-3.5 py-2 border border-gray-300 rounded bg-white text-sm text-gray-900 focus:border-[#6332c5] focus:ring-1 focus:ring-[#6332c5] outline-none transition-all";
    const labelStyle = "block text-xs font-semibold text-gray-700 mb-1";

    return (
        <div className='w-1/2 flex flex-col justify-center px-15 py-10 bg-white'>
            <div className='flex items-center gap-5'>
                <img src="/logo.jfif" alt="logo" className='h-10 w-10 object-contain' />
                <span className='font-bold text-gray-700 text-2xl'>Pathfinder ATS CRM</span>
            </div>

            {errorMsg && (
                <div className="flex items-center justify-between p-3.5 text-xs text-red-700 bg-red-50/80 border border-red-200 rounded-lg mt-4">
                    <span>{errorMsg}</span>
                    <button type="button" onClick={() => setErrorMsg('')} className="text-gray-400 font-bold text-sm">×</button>
                </div>
            )}

            {successMsg && (
                <div className="p-3.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg mt-4">
                    <span>{successMsg}</span>
                </div>
            )}

            {loginStep === 'credentials' ? (
                <form onSubmit={handleCredentialsSubmit} className='mt-8 space-y-4'>
                    <h2 className='font-bold text-gray-700 text-[16px] mb-2'>Sign In</h2>

                    <div>
                        <label className={labelStyle}>Email *</label>
                        <input
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your work email address"
                            type="email"
                            required
                            className={inputStyle}
                        />
                    </div>

                    <div className='relative'>
                        <label className={labelStyle}>Password *</label>
                        <input
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            required
                            className={`${inputStyle} pr-8`}
                        />
                        <button type='button' className='absolute right-2 bottom-3 text-gray-600' onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {/* Sir ke kehne par: Forgot Password ke opposite side par Recovery Code ka link */}
                    <div className='flex justify-between items-center text-[13px] font-medium'>
                        <span
                            onClick={() => { setLoginStep('recovery-login'); setErrorMsg(''); }}
                            className='text-[#6332c5] cursor-pointer hover:underline font-semibold flex items-center gap-1'
                        >
                            <KeyRound size={14} /> Recovery Code
                        </span>
                        <span
                            onClick={onForgotClick}
                            className='text-gray-600 cursor-pointer hover:text-gray-900'
                        >
                            Forgot password?
                        </span>
                    </div>

                    <div>
                        <button
                            type='submit'
                            disabled={loading}
                            className='rounded text-sm font-bold hover:bg-indigo-600 cursor-pointer flex items-center justify-center mx-auto w-[95%] text-white px-3.5 py-2.5 bg-indigo-700 disabled:opacity-50 transition-all'
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <p className='text-sm text-gray-700 flex items-center justify-center mt-4'>
                        Don't have an account? <span onClick={onSwitchToSignup} className='text-indigo-600 hover:underline cursor-pointer font-bold ml-1'>Sign up</span>
                    </p>
                </form>
            ) : (
                /* --- RECOVERY CODE LOGIN / PASSWORD RESET SCREEN --- */
                <div className='mt-8 bg-white border border-gray-100 shadow-sm rounded-xl p-8 flex flex-col items-center text-center'>
                    <div className='w-16 h-16 bg-[#6332c5]/10 text-[#6332c5] rounded-full flex items-center justify-center mb-4'>
                        <KeyRound size={32} />
                    </div>

                    <h2 className='font-bold text-gray-800 text-xl mb-2'>Recover via Recovery Code</h2>
                    <p className='text-xs text-gray-500 max-w-xs mb-6 leading-relaxed'>
                        Enter your email and backup recovery code. A new password will be generated and sent to your email.
                    </p>

                    <form onSubmit={handleRecoveryLoginSubmit} className='w-full space-y-4 text-left'>
                        <div>
                            <label className={labelStyle}>Email Address *</label>
                            <input
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                type="email"
                                required
                                className={inputStyle}
                            />
                        </div>

                        <div>
                            <label className={labelStyle}>Recovery Code *</label>
                            <input
                                name='recoveryCode'
                                value={formData.recoveryCode}
                                onChange={handleChange}
                                placeholder="XXXX-XXXX"
                                type="text"
                                required
                                className='w-full text-center tracking-widest font-mono px-3.5 py-2 border border-gray-300 rounded bg-white text-sm text-gray-900 focus:border-[#6332c5] focus:ring-1 focus:ring-[#6332c5] outline-none'
                            />
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='rounded text-sm font-bold hover:bg-indigo-600 cursor-pointer w-full text-white py-2.5 bg-indigo-700 disabled:opacity-50 transition-all shadow-md mt-2'
                        >
                            {loading ? 'Processing...' : 'Send New Password'}
                        </button>
                    </form>

                    <button
                        onClick={() => {
                            setLoginStep('credentials');
                            setErrorMsg('');
                            setSuccessMsg('');
                        }}
                        className='text-xs font-semibold text-indigo-600 hover:underline mt-6 cursor-pointer'
                    >
                        Back to sign in
                    </button>
                </div>
            )}
        </div>
    );
}