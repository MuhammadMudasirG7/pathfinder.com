'use client';
import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

const timeZones = ["(UTC-05:00) Eastern Time", "(UTC+00:00) UTC", "(UTC+05:00) Pakistan", "(UTC+09:00) Japan"];

export default function SignupFormLeft({ onSwitchToLogin }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', company: '', workEmail: '',
        phone: '', timeZone: '(UTC+05:00) Pakistan', accountType: '',
        password: '', confirmPassword: '', agreed: true
    });

    const [errors, setErrors] = useState({});
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!formData.firstName) newErrors.firstName = '*Please fill in this field';
        if (!formData.lastName) newErrors.lastName = '*Please fill in this field';
        if (!formData.company) newErrors.company = '*Please fill in this field';
        if (!formData.workEmail) newErrors.workEmail = '*Please fill in this field';
        if (!formData.phone) newErrors.phone = '*Please fill in this field';
        if (!formData.accountType) newErrors.accountType = '*Please fill in this field';
        if (!formData.password) newErrors.password = '*Please fill in this field';
        if (!formData.confirmPassword) newErrors.confirmPassword = '*Please fill in this field';

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '*Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            // Backend API data structure formatting
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                company: formData.company,
                email: formData.workEmail, // backend expects 'email'
                phone: formData.phone,
                timeZone: formData.timeZone,
                accountType: formData.accountType,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                termsAgreed: formData.agreed
            };

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Account successfully created, switch to login or redirect
                onSwitchToLogin();
            } else {
                setErrorMsg(data.message || 'Signup failed.');
            }
        } catch (error) {
            setErrorMsg('Network error, check connection.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = "w-full px-3.5 py-2.5 border border-gray-300 rounded-lg bg-white text-sm text-gray-900 focus:border-[#6332c5] focus:ring-1 focus:ring-[#6332c5] outline-none transition-all";
    const labelStyle = "block text-xs font-semibold text-gray-700 mb-1";
    const errorStyle = "text-xs text-red-500 mt-1 block";

    const renderInput = (label, name, type = "text", placeholder = "") => (
        <div>
            <label className={labelStyle}>{label} *</label>
            <input 
                type={type} 
                name={name} 
                placeholder={placeholder} 
                value={formData[name]} 
                onChange={handleChange} 
                className={inputStyle}
                autoComplete="off"
            />
            {errors[name] && <span className={errorStyle}>{errors[name]}</span>}
        </div>
    );

    return (
        <div className="w-full lg:w-1/2 flex flex-col justify-start px-6 sm:px-12 lg:px-20 py-10 bg-white overflow-y-auto max-h-screen">
            <div className="max-w-xl w-full mx-auto space-y-6">
                
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#6332c5] rounded-xl flex items-center justify-center text-white shadow-md">
                        <Layers className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold text-gray-800">Pathfinder ATS CRM</span>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
                    <p className="text-sm text-gray-500 mt-0.5">14-day free trial. No credit card required.</p>
                </div>

                {errorMsg && (
                    <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput("First Name", "firstName", "text", "John")}
                        {renderInput("Last Name", "lastName", "text", "Doe")}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput("Company", "company", "text", "ABC Limited")}
                        {renderInput("Work Email", "workEmail", "email", "name@company.com")}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput("Phone", "phone", "text", "123-567-8900")}
                        <div>
                            <label className={labelStyle}>Time Zone *</label>
                            <select name="timeZone" value={formData.timeZone} onChange={handleChange} className={inputStyle}>
                                {timeZones.map((tz, i) => <option key={i} value={tz}>{tz}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelStyle}>Account Type *</label>
                        <select name="accountType" value={formData.accountType} onChange={handleChange} className={inputStyle}>
                            <option value="" disabled>Please Select Account Type</option>
                            <option value="recruiter">Recruiter</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.accountType && <span className={errorStyle}>{errors.accountType}</span>}
                    </div>

                    <div className="relative">
                        <label className={labelStyle}>Password *</label>
                        <input type={showPass ? "text" : "password"} name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} className={`${inputStyle} pr-14`} autoComplete="new-password" />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-8 text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
                            {showPass ? "Hide" : "Show"}
                        </button>
                        {errors.password && <span className={errorStyle}>{errors.password}</span>}
                    </div>

                    <div className="relative">
                        <label className={labelStyle}>Confirm Password *</label>
                        <input type={showConfirmPass ? "text" : "password"} name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} className={`${inputStyle} pr-14`} autoComplete="new-password" />
                        <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3 top-8 text-xs text-gray-500 hover:text-gray-700 cursor-pointer">
                            {showConfirmPass ? "Hide" : "Show"}
                        </button>
                        {errors.confirmPassword && <span className={errorStyle}>{errors.confirmPassword}</span>}
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                        <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange} className="w-4 h-4 text-[#6332c5] border-gray-300 rounded cursor-pointer accent-[#6332c5]" />
                        <span className="text-xs text-gray-600">
                            I agree to Pathfinder ATS CRM's <a href="#" className="text-[#6332c5] underline">Terms of service</a> and <a href="#" className="text-[#6332c5] underline">Privacy Policies</a>
                        </span>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-3 px-4 bg-[#6332c5] hover:bg-[#5228a3] text-white font-semibold rounded-lg transition duration-200 text-sm cursor-pointer disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Create your account'}
                    </button>

                    <div className="text-center text-xs text-gray-500 pt-1">
                        Already have an account? <button type="button" onClick={onSwitchToLogin} className="text-[#3b5998] font-semibold hover:underline">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    );
}