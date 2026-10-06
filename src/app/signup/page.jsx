'use client';
import React from 'react';

import { useRouter } from 'next/navigation';
import SignupFormLeft from '../candidates/authComponents/SignupFormLeft';
import AuthBannerRight from '../candidates/authComponents/AuthBannerRight';

export default function SignupPage() {
    const router = useRouter();

    return (
        <main className="flex h-screen w-full bg-white overflow-hidden">
            <SignupFormLeft onSwitchToLogin={() => router.push('/login')} />
            <AuthBannerRight />
        </main>
    );
}