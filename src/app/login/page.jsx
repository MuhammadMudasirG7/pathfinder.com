'use client';
import React from 'react';


import { useRouter } from 'next/navigation';
import LoginLeft from '../candidates/authComponents/LoginLeft';
import AuthBannerRight from '../candidates/authComponents/AuthBannerRight';

export default function LoginPage() {
    const router = useRouter();

    return (
        <main className="flex h-screen w-full bg-white overflow-hidden">
            <LoginLeft 
                onSwitchToSignup={() => router.push('/signup')} 
                onForgotClick={() => router.push('/forgot-password')} 
            />
            <AuthBannerRight />
        </main>
    );
}