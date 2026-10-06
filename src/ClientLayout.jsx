"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import SidebarDrawer from "./app/candidates/SidebarDrawer";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = 
    pathname === "/auth-login-signup" || 
    pathname === "/login" || 
    pathname === "/signup" || 
    pathname === "/forgot-password" || 
    pathname === "/set-password";

  // Background user status checker for logged-in users
  useEffect(() => {
    // Agar user auth pages par hai toh status check karne ki zaroorat nahi
    if (isAuthPage) return;

    const checkUserStatus = async () => {
      try {
        const res = await fetch('/api/auth/check-status');
        const data = await res.json();
        
       
        if (!res.ok || !data.success) {
          router.push('/login');
        }
      } catch (error) {
        console.error("Status check error:", error);
      }
    };

    // Har 5 seconds ke baad background mein status check karega
    const interval = setInterval(checkUserStatus, 5000);

    return () => clearInterval(interval);
  }, [isAuthPage, router]);

  if (isAuthPage) {
    return (
      <main className="flex-1 flex flex-col overflow-hidden w-full h-screen">
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden w-full">
      <SidebarDrawer />
      <main className="flex-1 flex flex-col overflow-hidden mt-6">
        {children}
      </main>
    </div>
  );
}