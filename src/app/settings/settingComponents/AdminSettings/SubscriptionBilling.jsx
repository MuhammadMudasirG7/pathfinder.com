import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import PricingPlanCard from '../../TabComponents/AdminSetttingComponents/PricingPlanCard';
import PaymentDetailsSection from '../../TabComponents/AdminSetttingComponents/PaymentDetailsSection';
import BillingDetailsSection from '../../TabComponents/AdminSetttingComponents/BillingDetailsSection';

export default function SubscriptionBilling() {
    const [activeTab, setActiveTab] = useState('subscription');

    // Modals state
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

    // Current Plan State
    const [currentPlan, setCurrentPlan] = useState('Starter');

    // Transfer Ownership Form State
    const [newOwnerName, setNewOwnerName] = useState('');
    const [newOwnerEmail, setNewOwnerEmail] = useState('');

    const plans = [
        { id: 'Starter', name: 'Starter', price: 69, active: currentPlan === 'Starter' },
        { id: 'Growth', name: 'Growth', price: 129, active: currentPlan === 'Growth' },
        { id: 'Professional', name: 'Professional', price: 249, active: currentPlan === 'Professional' }
    ];

    const handleTransferOwnership = (e) => {
        e.preventDefault();
        if (!newOwnerName || !newOwnerEmail) return;
        alert(`Ownership successfully transferred to ${newOwnerName} (${newOwnerEmail})`);
        setNewOwnerName('');
        setNewOwnerEmail('');
        setIsTransferModalOpen(false);
    };

    return (
        <div className="p-4 max-w-6xl mx-auto space-y-6 bg-gray-50 min-h-screen">

            {/* Top Header Actions */}
            <div className="flex justify-end items-center gap-3">
                <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md">
                    Active
                </span>
                <button className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition">
                    Cancel Subscription
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200 px-6 pt-4 gap-8">
                    <button
                        onClick={() => setActiveTab('subscription')}
                        className={`pb-3 text-sm font-semibold transition relative ${activeTab === 'subscription'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Subscription
                    </button>
                    <button
                        onClick={() => setActiveTab('billing')}
                        className={`pb-3 text-sm font-semibold transition relative ${activeTab === 'billing'
                                ? 'text-purple-600 border-b-2 border-purple-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Billing
                    </button>
                </div>

                {/* Tab Content: Subscription */}
                {activeTab === 'subscription' && (
                    <div>
                        <PricingPlanCard />
                        <PaymentDetailsSection />
                        <BillingDetailsSection />
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="p-6 text-center text-gray-500 text-sm py-12">
                        Billing history and invoices will appear here.
                    </div>
                )}
            </div>

            {/* --- MODAL 1: Upgrade Subscription Plan --- */}
            {isUpgradeModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-6">

                        <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="text-base font-bold text-gray-800">Upgrade Subscription Plan</h3>
                            <button onClick={() => setIsUpgradeModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex justify-between items-center border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                            <span className="text-xs font-semibold text-gray-700">Pricing Plan</span>
                            <span className="text-xs border border-gray-300 rounded px-2.5 py-1 text-gray-600 bg-white font-medium">
                                Currency: USD
                            </span>
                        </div>

                        {/* Plans List inside Modal */}
                        <div className="space-y-3">
                            {plans.map((p) => (
                                <div key={p.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white">
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-gray-800">{p.name}</h4>
                                        <button className="text-xs text-purple-600 hover:underline font-medium">
                                            Plan Features
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-sm font-semibold text-gray-800">
                                            ${p.price} <span className="text-xs text-gray-500 font-normal">per user / month</span>
                                        </span>
                                        {p.active ? (
                                            <span className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1">
                                                Active
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setCurrentPlan(p.id);
                                                    setIsUpgradeModalOpen(false);
                                                }}
                                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition shadow-sm"
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
                                className="px-4 py-2 text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* --- MODAL 2: Transfer Account Ownership --- */}
            {isTransferModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-6">

                        <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="text-base font-bold text-gray-800">Transfer Account Ownership</h3>
                            <button onClick={() => setIsTransferModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Current Owner Section */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                                <span className="text-xs font-bold text-gray-700">Current Account Owner</span>
                            </div>
                            <div className="p-4 space-y-1">
                                <h4 className="text-sm font-bold text-gray-800">John Doe</h4>
                                <p className="text-xs text-gray-500">john.doe@example.com</p>
                            </div>
                        </div>

                        {/* New Owner Section */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
                                <span className="text-xs font-bold text-gray-700">New Account Owner</span>
                            </div>
                            <form onSubmit={handleTransferOwnership} className="p-4 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Account Owner</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Add Name"
                                        value={newOwnerName}
                                        onChange={(e) => setNewOwnerName(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Add Email"
                                        value={newOwnerEmail}
                                        onChange={(e) => setNewOwnerEmail(e.target.value)}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsTransferModalOpen(false)}
                                className="px-4 py-2 text-xs font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                onClick={handleTransferOwnership}
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition shadow-sm"
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