"use client"
import React, { useState } from 'react'
import { X, Search, ChevronRight } from 'lucide-react'
import { toast } from 'react-toastify'

export default function ProvidersModal({ isOpen, onClose, onBack, onGoogleConnect }) {
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null;

  const providers = [
    { id: 'microsoft-exchange', name: 'Microsoft Exchange' },
    { id: 'google', name: 'Google' },
    { id: 'icloud', name: 'iCloud' },
    { id: 'microsoft', name: 'Microsoft' },
    { id: 'aol', name: 'AOL Mail' },
    { id: 'imap', name: 'IMAP' },
  ];

  const filteredProviders = providers.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-xl p-6 relative animate-in fade-in zoom-in duration-200">

        {/* Header with Back and Close */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <button 
            onClick={onBack}
            className="text-xs font-semibold text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Back
          </button>
          <h3 className="text-base font-bold text-gray-800">
            Select your provider
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by provider name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Providers List */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => {
                if (provider.id === 'google') {
                  onGoogleConnect();
                } else {
                  toast.info(`${provider.name} integration coming soon!`);
                }
              }}
              className="flex items-center justify-between p-3.5 border border-gray-100 hover:border-purple-200 rounded-lg hover:bg-purple-50/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-md">
                  {provider.id === 'google' ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold text-gray-500">{provider.name[0]}</span>
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-800">
                  {provider.name}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}