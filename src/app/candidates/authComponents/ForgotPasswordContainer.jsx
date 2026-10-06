'use client';

import React, { useState } from 'react';
import { Layers } from 'lucide-react';

import ForgotPasswordEmail from './ForgotPasswordEmail';
import VerifyOtp from './VerifyOtp';
import ResetPassword from './ResetPassword';

export default function ForgotPasswordContainer({ onBackToLogin }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');

    const handleBack = () => {
        if (step === 3) {
            setStep(2);
        } else if (step === 2) {
            setStep(1);
        } else {
            onBackToLogin();
        }
    };

    return (
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-10 bg-white">
            <div className="max-w-md w-full mx-auto space-y-6">
                
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#6332c5] rounded-xl flex items-center justify-center text-white">
                        <Layers className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-gray-800 text-xl">
                        Pathfinder ATS CRM
                    </span>
                </div>

                {/* Back Button */}
                <button
                    type="button"
                    onClick={handleBack}
                    className="text-xs text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
                >
                    &lt; Back to login
                </button>

                {/* Step 1 - Email */}
                {step === 1 && (
                    <ForgotPasswordEmail
                        email={email}
                        setEmail={setEmail}
                        onSuccess={() => setStep(2)}
                    />
                )}

                {/* Step 2 - OTP */}
                {step === 2 && (
                    <VerifyOtp
                        email={email}
                        onSuccess={() => setStep(3)}
                        onBack={() => setStep(1)}
                    />
                )}

                {/* Step 3 - Reset Password */}
                {step === 3 && (
                    <ResetPassword
                        onSuccess={onBackToLogin}
                        onBack={() => setStep(2)}
                    />
                )}

            </div>
        </div>
    );
}