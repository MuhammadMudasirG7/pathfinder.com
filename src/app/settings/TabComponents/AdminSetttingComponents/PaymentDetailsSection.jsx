'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

function CheckoutForm({ setIsUpdateModalOpen, onCardSaved }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [country, setCountry] = useState('NZ');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cardNumber || !expiryDate || !cvc || !cardName) {
      setErrorMessage('Please fill in all the card details.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    // Simulate saving mock card details
    setTimeout(() => {
      const mockCardData = {
        cardLast4: cardNumber.slice(-4) || '4242',
        cardBrand: 'VISA',
        expiryMonth: expiryDate.split('/')[0] || '12',
        expiryYear: expiryDate.split('/')[1] || '28',
        cardholderName: cardName,
        billingCountry: country,
      };

      onCardSaved(mockCardData);
      setIsUpdateModalOpen(false);
      setLoading(false);
      alert('Payment details updated successfully!');
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-xs">
          {errorMessage}
        </div>
      )}

      <div className="border border-gray-200 rounded-sm">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h4 className="text-[13px] font-medium text-[#142142]">Payment Details</h4>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            
            {/* Card Number */}
            <div className="md:col-span-6 space-y-1">
              <label className="block text-[13px] text-[#142142]">Card Number</label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                maxLength={19}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-[#142142] font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>

            {/* Expiry Date */}
            <div className="md:col-span-3 space-y-1">
              <label className="block text-[13px] text-[#142142]">Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                maxLength={5}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-[#142142] font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>

            {/* Security Code */}
            <div className="md:col-span-3 space-y-1">
              <label className="block text-[13px] text-[#142142]">Security Code</label>
              <input
                type="password"
                placeholder="CVC"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                maxLength={4}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-[#142142] font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[13px] text-[#142142]">Name on the Card</label>
              <input
                type="text"
                placeholder="John D"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-[#142142] font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[13px] text-[#142142]">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-[#142142] font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white cursor-pointer"
              >
                <option value="NZ">New Zealand</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="PK">Pakistan</option>
                <option value="AU">Australia</option>
                <option value="CA">Canada</option>
                <option value="AE">United Arab Emirates</option>
                <option value="IN">India</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <p className="text-[13px] text-[#142142]">
        By providing your card information, you allow Pathfinder ATS CRM to charge your card for future payments in accordance with their terms.
      </p>

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setIsUpdateModalOpen(false)}
          className="px-4 py-1.5 text-[13px] font-medium border border-gray-300 text-[#142142] hover:bg-gray-50 rounded transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#6b46c1] hover:bg-[#553c9a] text-white text-[13px] font-medium px-4 py-1.5 rounded transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default function PaymentDetailsSection() {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [savedCard, setSavedCard] = useState(null);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 font-sans text-[13px] text-[#142142]">
      
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
        
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-[13px] font-medium text-[#142142]">Payment Details</h2>
        </div>

        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <div className="md:col-span-6 space-y-1.5">
              <label className="block text-[13px] text-[#142142]">Card Number</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={savedCard ? `•••• •••• •••• ${savedCard.cardLast4}` : 'No card saved'}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-[#142142] font-sans bg-gray-50 pr-24"
                />
                <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
                  <span className="text-[11px] font-black italic tracking-tighter text-blue-800 uppercase">
                    {savedCard ? savedCard.cardBrand : 'VISA'}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-[13px] text-[#142142]">Expiry Date</label>
              <input
                type="text"
                readOnly
                value={savedCard ? `${String(savedCard.expiryMonth).padStart(2, '0')} / ${String(savedCard.expiryYear).slice(-2)}` : '-- / --'}
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-[#142142] font-sans bg-gray-50"
              />
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-[13px] text-[#142142]">Security Code</label>
              <input
                type="text"
                readOnly
                value="•••"
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-[#142142] font-sans bg-gray-50"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[13px] text-[#142142]">Name on the Card</label>
              <input
                type="text"
                readOnly
                value={savedCard?.cardholderName || 'Not provided'}
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-[#142142] font-sans bg-gray-50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[13px] text-[#142142]">Country</label>
              <input
                type="text"
                readOnly
                value={savedCard?.billingCountry || 'Not provided'}
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] text-[#142142] font-sans bg-gray-50"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-2">
            <p className="text-[13px] text-[#142142] max-w-xl">
              By providing your card information, you allow Pathfinder ATS CRM to charge your card for future payments in accordance with their terms.
            </p>
            <button
              onClick={() => setIsUpdateModalOpen(true)}
              className="bg-[#6b46c1] hover:bg-[#553c9a] text-white text-[13px] font-medium px-6 py-2 rounded-md transition-colors whitespace-nowrap self-end md:self-auto cursor-pointer"
            >
              Update
            </button>
          </div>

        </div>

      </div>

      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full overflow-hidden text-[13px] text-[#142142] font-sans">
            
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h3 className="text-[13px] font-medium text-[#142142]">Update Credit Card Details</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <CheckoutForm 
              setIsUpdateModalOpen={setIsUpdateModalOpen} 
              onCardSaved={(newCard) => setSavedCard(newCard)} 
            />

          </div>
        </div>
      )}

    </div>
  );
}