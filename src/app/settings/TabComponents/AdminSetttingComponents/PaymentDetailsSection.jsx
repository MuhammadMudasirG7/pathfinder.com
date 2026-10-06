'use client';

import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ setIsUpdateModalOpen, onCardSaved }) {
  const stripe = useStripe();
  const elements = useElements();

  const [cardName, setCardName] = useState('');
  const [country, setCountry] = useState('NZ');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Individual field error states for real-time validation
  const [numberError, setNumberError] = useState('');
  const [expiryError, setExpiryError] = useState('');
  const [cvcError, setCvcError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (numberError || expiryError || cvcError) {
      setErrorMessage('Please fix the card errors before submitting.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/auth/payment/setup', { method: 'POST' });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to initialize payment setup.');
      }

      const clientSecret = data.clientSecret;
      const cardElement = elements.getElement(CardNumberElement);

      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardName,
            address: { country: country }
          }
        }
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      const saveRes = await fetch('/api/auth/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: setupIntent.payment_method,
          cardholderName: cardName,
          billingCountry: country
        })
      });

      const saveData = await saveRes.json();
      if (!saveData.success) {
        throw new Error(saveData.error || 'Failed to save payment method in database.');
      }

      onCardSaved(saveData.data);
      setIsUpdateModalOpen(false);
      alert('Payment details updated successfully!');
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const elementStyles = {
    base: {
      color: '#142142',
      fontFamily: 'sans-serif',
      fontSize: '13px',
      '::placeholder': { color: '#aab7c4' },
    },
    invalid: { color: '#fa755a' },
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
              <div className={`border rounded px-3 py-2.5 bg-white focus-within:ring-1 focus-within:ring-indigo-500 ${numberError ? 'border-red-500' : 'border-gray-300'}`}>
                <CardNumberElement 
                  options={{ style: elementStyles, showIcon: true }} 
                  onChange={(e) => setNumberError(e.error ? e.error.message : '')}
                />
              </div>
              {numberError && <p className="text-red-500 text-[11px] mt-1">{numberError}</p>}
            </div>

            {/* Expiry Date */}
            <div className="md:col-span-3 space-y-1">
              <label className="block text-[13px] text-[#142142]">Expiry Date</label>
              <div className={`border rounded px-3 py-2.5 bg-white focus-within:ring-1 focus-within:ring-indigo-500 ${expiryError ? 'border-red-500' : 'border-gray-300'}`}>
                <CardExpiryElement 
                  options={{ style: elementStyles }} 
                  onChange={(e) => setExpiryError(e.error ? e.error.message : '')}
                />
              </div>
              {expiryError && <p className="text-red-500 text-[11px] mt-1">{expiryError}</p>}
            </div>

            {/* Security Code */}
            <div className="md:col-span-3 space-y-1">
              <label className="block text-[13px] text-[#142142]">Security Code</label>
              <div className={`border rounded px-3 py-2.5 bg-white focus-within:ring-1 focus-within:ring-indigo-500 ${cvcError ? 'border-red-500' : 'border-gray-300'}`}>
                <CardCvcElement 
                  options={{ style: elementStyles }} 
                  onChange={(e) => setCvcError(e.error ? e.error.message : '')}
                />
              </div>
              {cvcError && <p className="text-red-500 text-[11px] mt-1">{cvcError}</p>}
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
          disabled={loading || !stripe}
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

  useEffect(() => {
    const fetchSavedCard = async () => {
      try {
        const res = await fetch('/api/auth/payment');
        const result = await res.json();
        if (result.success && result.data && result.data.length > 0) {
          setSavedCard(result.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch payment method:', err);
      }
    };
    fetchSavedCard();
  }, []);

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

            <Elements stripe={stripePromise}>
              <CheckoutForm 
                setIsUpdateModalOpen={setIsUpdateModalOpen} 
                onCardSaved={(newCard) => setSavedCard(newCard)} 
              />
            </Elements>

          </div>
        </div>
      )}

    </div>
  );
}