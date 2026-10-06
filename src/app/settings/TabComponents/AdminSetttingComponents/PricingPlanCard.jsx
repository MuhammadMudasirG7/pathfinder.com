'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Toast from '../UsersComponents.jsx/Toast';

export default function PricingPlanCard() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [currentPlan, setBaseCurrentPlan] = useState('Starter');
  
  const [activationDate, setActivationDate] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [activeUsers, setActiveUsers] = useState('');
  const [accountId, setAccountId] = useState('');
  
  const [planCounts, setPlanCounts] = useState({ Starter: 0, Growth: 0, Professional: 0 });

  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerEmail, setNewOwnerEmail] = useState('');

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  // 1. Fetch subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const res = await fetch('/api/auth/subscription');
        const result = await res.json();
        
        if (result.success && result.data) {
          setBaseCurrentPlan(result.data.currentPlan || 'Starter');
          
          if (result.data.activationDate) {
            const formattedDate = new Date(result.data.activationDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            });
            setActivationDate(formattedDate);
          }
          
          setOwnerName(result.data.ownerName || '');
          setOwnerEmail(result.data.ownerEmail || '');
          setActiveUsers(result.data.activeUsersCount !== undefined ? result.data.activeUsersCount : 1);
          setAccountId(result.data.accountId || '');
        }

        if (result.planCounts) {
          setPlanCounts(result.planCounts);
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      }
    };

    fetchSubscriptionData();
  }, []);

  // 2. Update Plan API Handler
  const handleUpdatePlan = async (newPlanId) => {
    try {
      const res = await fetch('/api/auth/subscription', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updatePlan', currentPlan: newPlanId })
      });
      const result = await res.json();
      
      if (result.success && result.data) {
        setBaseCurrentPlan(result.data.currentPlan);
        setIsUpgradeModalOpen(false);
        triggerToast(`Plan successfully updated to ${newPlanId}!`, 'success');
        setTimeout(() => window.location.reload(), 1500);
      } else {
        triggerToast(result.error || 'Failed to update plan', 'error');
      }
    } catch (error) {
      console.error('Error updating plan:', error);
      triggerToast('Something went wrong!', 'error');
    }
  };

  // 3. Transfer Ownership API Handler
  const handleTransferOwnership = async () => {
    if (!newOwnerName || !newOwnerEmail) {
      triggerToast('Please enter both name and email!', 'error');
      return;
    }

    try {
      const res = await fetch('/api/auth/subscription', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'transferOwnership', 
          newOwnerName, 
          newOwnerEmail 
        })
      });
      const result = await res.json();
      
      if (result.success && result.data) {
        setOwnerName(result.data.ownerName);
        setOwnerEmail(result.data.ownerEmail);
        setIsTransferModalOpen(false);
        setNewOwnerName('');
        setNewOwnerEmail('');
        triggerToast('Ownership transferred successfully!', 'success');
      } else {
        triggerToast(result.error || 'Failed to transfer ownership', 'error');
      }
    } catch (error) {
      console.error('Error transferring ownership:', error);
      triggerToast('Something went wrong!', 'error');
    }
  };

  const plans = [
    { id: 'Starter', name: 'Starter', price: 69, usersCount: planCounts.Starter, active: currentPlan === 'Starter' },
    { id: 'Growth', name: 'Growth', price: 129, usersCount: planCounts.Growth, active: currentPlan === 'Growth' },
    { id: 'Professional', name: 'Professional', price: 249, usersCount: planCounts.Professional, active: currentPlan === 'Professional' }
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 relative">
      
      {/* Imported Custom Toast */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, show: false })} 
      />

      {/* Main Outer Container Box */}
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
        
        {/* Row 1: Pricing Plan Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-[14px] font-sans font-medium text-[#142142]">Pricing Plan</h2>
          <div className="border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-600 bg-white shadow-xs">
            Currency: USD
          </div>
        </div>

        {/* Row 2: Plan Details */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div>
            <div className="text-[13px] font-sans text-[#142142] tracking-wide">{currentPlan}</div>
            <button className="text-[13px] text-[#6E41E2] hover:underline mt-1 text-left font-medium block cursor-pointer">
              Plan Features
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm font-semibold text-gray-900">
              ${currentPlan === 'Starter' ? '69' : currentPlan === 'Growth' ? '129' : '249'} <span className="text-xs text-gray-500 font-normal">per user / month</span>
            </div>
            <button 
              onClick={() => setIsUpgradeModalOpen(true)}
              className="bg-[#6b46c1] hover:bg-[#553c9a] text-white text-[12px] font-medium font-sans cursor-pointer px-4 py-2 rounded-md transition-colors"
            >
              Upgrade Plan
            </button>
          </div>
        </div>

        {/* Row 3: Account Activation Date */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="text-[13px] text-[#142142] mb-0.5">Account Activation Date</div>
          <div className="text-[13px] font-sans text-[#142142]">{activationDate}</div>
        </div>

        {/* Row 4: Account Owner */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <div>
            <div className="text-[13px] text-[#142142] mb-0.5">Account Owner</div>
            <div className="text-[13px] text-[#142142]">{ownerName}</div>
          </div>
          <button 
            onClick={() => setIsTransferModalOpen(true)}
            className="bg-[#6b46c1] hover:bg-[#553c9a] text-white text-xs font-medium font-sans cursor-pointer px-4 py-2 rounded-md transition-colors"
          >
            Transfer Ownership
          </button>
        </div>

        {/* Row 5: Active Users */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="text-[13px] text-[#142142] mb-0.5">Active User(s)</div>
          <div className="text-[13px] text-[#142142] font-sans">{activeUsers}</div>
        </div>

        {/* Row 6: Account ID */}
        <div className="px-6 py-4">
          <div className="text-[13px] text-[#142142] mb-0.5 font-sans">Account ID</div>
          <div className="text-[13px] font-sans text-[#142142]">{accountId}</div>
        </div>

      </div>

      {/* --- UPGRADE MODAL --- */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-2 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-sm font-bold text-gray-900">Upgrade Subscription Plan</h3>
              <button onClick={() => setIsUpgradeModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-between items-center border border-gray-200 rounded px-4 py-3 bg-gray-50/50">
              <span className="text-xs font-semibold text-gray-700">Pricing Plan</span>
              <span className="border border-gray-200 rounded px-3 py-1 text-xs text-gray-600 bg-white">
                Currency: USD
              </span>
            </div>

            <div className="space-y-3">
              {plans.map((p) => (
                <div key={p.id} className="flex items-center justify-between border border-gray-200 rounded p-4 bg-white">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      {p.name} 
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-normal">
                        {p.usersCount} users
                      </span>
                    </div>
                    <button className="text-xs text-indigo-600 hover:underline mt-0.5 font-medium cursor-pointer">
                      Plan Features
                    </button>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-sm font-semibold text-gray-900">
                      ${p.price} <span className="text-xs text-gray-500 font-normal">per user / month</span>
                    </div>
                    {p.active ? (
                      <span className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-md">
                        Active
                      </span>
                    ) : (
                      <button
                        onClick={() => handleUpdatePlan(p.id)}
                        className="bg-[#6b46c1] hover:bg-[#553c9a] text-white text-xs font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
                      >
                        Upgrade
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="px-4 py-2 text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TRANSFER OWNERSHIP MODAL --- */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-sm font-bold text-gray-900">Transfer Account Ownership</h3>
              <button onClick={() => setIsTransferModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-700">Current Account Owner</span>
              </div>
              <div className="p-4 space-y-0.5">
                <div className="text-sm font-bold text-gray-900">{ownerName}</div>
                <div className="text-xs text-gray-500">{ownerEmail}</div>
              </div>
            </div>

            <div className="border border-gray-200 rounded overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-700">New Account Owner</span>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Account Owner</label>
                  <input
                    type="text"
                    placeholder="Add Name"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Add Email"
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleTransferOwnership}
                className="bg-[#6b46c1] hover:bg-[#553c9a] text-white text-xs font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
              >
                Transfer Ownership
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}