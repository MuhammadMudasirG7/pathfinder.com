import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function BillingDetailsSection() {
  const [companyName, setCompanyName] = useState('Acme Limited');
  const [billingEmail, setBillingEmail] = useState(''); // 'Not available' if empty

  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const [tempCompanyName, setTempCompanyName] = useState(companyName);
  const [tempEmail, setTempEmail] = useState(billingEmail);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50">
      
      {/* Main Outer Container Box */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-[14px] font-sans font-medium text-[#142142]">Billing Details</h2>
        </div>

        {/* Row 1: Company Legal Name */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div>
            <div className="text-[13px] font-sans text-[#142142] mb-0.5">Company Legal Name</div>
            <div className="text-[13px] font-sans text-[#142142]">{companyName}</div>
          </div>
          <button 
            onClick={() => {
              setTempCompanyName(companyName);
              setIsCompanyModalOpen(true);
            }}
            className="bg-[#6b46c1] hover:bg-[#553c9a] text-white text-[12px] font-medium font-sans cursor-pointer px-4 py-2 rounded-md transition-colors"
          >
            Update
          </button>
        </div>

        {/* Row 2: Billing Email */}
        <div className="flex justify-between items-center px-6 py-4">
          <div>
            <div className="text-[13px] font-sans text-[#142142] mb-0.5">Billing Email</div>
            <div className="text-[13px] font-sans text-[#142142]">
              {billingEmail ? billingEmail : 'Not available'}
            </div>
          </div>
          <button 
            onClick={() => {
              setTempEmail(billingEmail);
              setIsEmailModalOpen(true);
            }}
            className="bg-[#6b46c1] hover:bg-[#553c9a] text-white text-[12px] font-medium font-sans cursor-pointer px-4 py-2 rounded-md transition-colors"
          >
            Update
          </button>
        </div>

      </div>

      {/* --- UPDATE COMPANY LEGAL NAME MODAL --- */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-6 font-sans">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-sm font-bold text-gray-900">Update Company Legal Name</h3>
              <button onClick={() => setIsCompanyModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Section Box */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-700">Company Name</span>
                <span className="bg-emerald-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                  Current
                </span>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-900">{companyName}</div>
              </div>
            </div>

            {/* New Input Section Box */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-700">New Company Name</span>
              </div>
              <div className="p-4 space-y-1">
                <label className="block text-xs font-medium text-gray-600">Company Name</label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={tempCompanyName}
                  onChange={(e) => setTempCompanyName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCompanyModalOpen(false)}
                className="px-4 py-2 text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempCompanyName.trim()) {
                    setCompanyName(tempCompanyName);
                    setIsCompanyModalOpen(false);
                  }
                }}
                className="bg-[#6b46c1] hover:bg-[#553c9a] text-white text-xs font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- UPDATE BILLING EMAIL MODAL --- */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-6 font-sans">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-sm font-bold text-gray-900">Update Billing Email</h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current Section Box */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-700">Billing Email</span>
              </div>
              <div className="p-4">
                <div className="text-sm text-gray-900">
                  {billingEmail ? billingEmail : 'Not available'}
                </div>
              </div>
            </div>

            {/* New Input Section Box */}
            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-700">New Billing Email</span>
              </div>
              <div className="p-4 space-y-1">
                <label className="block text-xs font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  placeholder="Add Billing Email"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEmailModalOpen(false)}
                className="px-4 py-2 text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setBillingEmail(tempEmail);
                  setIsEmailModalOpen(false);
                }}
                className="bg-[#6b46c1] hover:bg-[#553c9a] text-white text-xs font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}