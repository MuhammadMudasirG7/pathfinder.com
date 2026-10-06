"use client"
import React from 'react'
import { X, ChevronRight, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'

export default function ConnectModal({ isOpen, onClose, onOpenProviders, onGoogleConnect, isConnectingGoogle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Popup Content */}
        <div className="flex flex-col items-center text-center pt-2 pb-2">
          <div className="w-14 h-14 bg-[#7c3aed] rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-md">
            P
          </div>

          <h3 className="text-base font-bold text-gray-800 mb-1">
            Welcome
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            Connect an email account to continue with Pathfinder.
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            {/* Google Button */}
            <button
              onClick={onGoogleConnect}
              disabled={isConnectingGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isConnectingGoogle ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              {isConnectingGoogle ? "Connecting to Google..." : "Continue with Google"}
            </button>

            {/* Microsoft Button */}
            <button
              onClick={() => toast.info("Microsoft integration coming soon!")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              Continue with Microsoft
            </button>
          </div>

          {/* View All Providers Link */}
          <button
            onClick={onOpenProviders}
            className="mt-5 text-xs text-purple-600 hover:text-purple-700 font-semibold cursor-pointer flex items-center gap-1"
          >
            View all providers <ChevronRight className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>
    </div>
  )
}