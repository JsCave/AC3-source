import React, { useState } from 'react';
import { X, ChevronRight, CheckCircle2, Send, ArrowLeft, CheckSquare } from 'lucide-react';
import { useCall } from '../context/CallContext';

// Options config map
const REASON_CATEGORIES = [
  {
    id: 'order-related',
    label: 'Order Related',
    subOptions: [
      { id: 'damaged', label: 'Damaged' },
      { id: 'wrong-item', label: 'Wrong Item' },
      { id: 'defective', label: 'Defective' },
    ],
  },
  {
    id: 'non-order-related',
    label: 'Non-Order Related',
    subOptions: [
      { id: 'feedback', label: 'Feedback' },
      { id: 'suggestion', label: 'Suggestion' },
    ],
  },
  {
    id: 'general-inquiry',
    label: 'General Inquiry',
    subOptions: [
      { id: 'pre-order', label: 'Pre-Order Questions' },
    ],
  },
];

export default function AfterWorkView({ isOpen = true, onClose }) {
  const { status, setStatus, lastAction, triggerAction } = useCall();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubOption, setSelectedSubOption] = useState(null);

  // View Step: 'reason' -> 'email'
  const [step, setStep] = useState('reason');

  // Email form state
  const [emailData, setEmailData] = useState({
    recipient: '',
    subject: '',
    body: '',
  });

  const activeCategoryObj = REASON_CATEGORIES.find((cat) => cat.id === selectedCategory);
  const activeSubOptionObj = activeCategoryObj?.subOptions.find((s) => s.id === selectedSubOption);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    setSelectedSubOption(null); // Reset sub-option when primary selection changes
  };

  const handleReasonSubmit = () => {
    if (!selectedCategory || !selectedSubOption) return;

    // Auto-fill email subject and body based on selected reason
    setEmailData({
      recipient: '',
      subject: `Follow-up: ${activeCategoryObj?.label} - ${activeSubOptionObj?.label || ''}`,
      body: `Hi,\n\nRegarding your recent inquiry (${activeCategoryObj?.label} > ${activeSubOptionObj?.label}):\n\n`,
    });

    // Transition to full page
    setStep('email');
  };

  const handleSendEmail = (e) => {
    e.preventDefault();

    if (triggerAction) {
      triggerAction(`Sent Email for ACW Reason: ${selectedCategory} > ${selectedSubOption}`);
    }

    if (setStatus) {
      setStatus('Available');
    }

    

    if (onClose) onClose();
  };

  const handleResolve = () => {
    if (triggerAction) {
      triggerAction(`Resolved ACW Reason: ${selectedCategory} > ${selectedSubOption}`);
    }

    if (setStatus) {
      setStatus('Available');
    }

   

    if (onClose) onClose();
  };

  if (!isOpen) return null;

  /* =========================================================
     VIEW 2: Full Page View for Email (80/20 Layout)
     Positioned directly underneath the main App Navbar (top-16, z-40)
     ========================================================= */
  if (step === 'email') {
    return (
      <div className="fixed top-16 inset-x-0 bottom-0 z-40 bg-slate-50 flex flex-col overflow-y-auto animate-in fade-in duration-200">
        <main className="flex-1 w-full max-w-7xl mx-auto p-6 flex flex-col">
          
          {/* Top Bar Navigation Actions */}
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => setStep('reason')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Reason Selection</span>
            </button>

            {onClose && (
              <button 
                type="button"
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 80% / 20% Main Grid */}
          <div className="grid grid-cols-10 gap-6 items-start">
            
            {/* LEFT 80% - Email Form */}
            <form onSubmit={handleSendEmail} className="col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-8 space-y-6">
              {/* Recipient Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Recipient Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="customer@example.com"
                  value={emailData.recipient}
                  onChange={(e) => setEmailData({ ...emailData, recipient: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  required
                  placeholder="Subject..."
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              {/* Message Body */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Email Body
                </label>
                <textarea
                  rows={10}
                  required
                  placeholder="Type your email content here..."
                  value={emailData.body}
                  onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                  className="w-full px-4 py-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-y"
                />
              </div>

              {/* Bottom Actions Bar */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('reason')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition rounded-lg hover:bg-slate-100"
                >
                  Back
                </button>

                <div className="flex items-center gap-3">
                  {onClose && (
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition"
                    >
                      Close without sending
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition active:scale-95 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send & Close</span>
                  </button>
                </div>
              </div>
            </form>

            {/* RIGHT 20% - Selected Contact Reason & Resolve Button */}
            <aside className="col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6 sticky top-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Contact Reason
                </span>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block">Category</span>
                    <p className="text-sm font-bold text-slate-800">
                      {activeCategoryObj?.label || 'Not selected'}
                    </p>
                  </div>

                  <div className="border-t border-slate-200 pt-2.5">
                    <span className="text-[11px] font-semibold text-slate-400 block">Detail Reason</span>
                    <p className="text-sm font-semibold text-slate-700">
                      {activeSubOptionObj?.label || 'Not selected'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Orange Resolve Button */}
              <button
                type="button"
                onClick={handleResolve}
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckSquare className="w-4 h-4" />
                <span>Resolve</span>
              </button>
            </aside>

          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     VIEW 1: Centered Modal View for Selecting Reason
     Positioned under the Navbar backdrop (top-16, z-40)
     ========================================================= */
  return (
    <div className="fixed top-16 inset-x-0 bottom-0 z-40 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="w-full max-w-2xl bg-white max-h-[85vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-800">After Call Work Reason</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select a category and specific reason for this call</p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content Body - 2 Column Layout */}
        <div className="flex-1 overflow-hidden flex min-h-[320px]">
          
          {/* Column 1: Primary Reason Categories */}
          <div className="w-1/2 p-4 border-r border-slate-200 overflow-y-auto bg-slate-50/50 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Primary Reason
            </span>

            {REASON_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/80 shadow-sm ring-1 ring-blue-600'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-100/80'
                  }`}
                >
                  <span className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                    {cat.label}
                  </span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-400'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Column 2: Sub-options */}
          <div className="w-1/2 p-4 overflow-y-auto bg-white space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Details
            </span>

            {activeCategoryObj ? (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-2 duration-150">
                {activeCategoryObj.subOptions.map((sub) => {
                  const isSelected = selectedSubOption === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubOption(sub.id)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-sm'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-sm">{sub.label}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-xs text-slate-400">
                  Select a contact reason on the left to view options
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition"
            >
              Cancel
            </button>
          )}
          <button
            disabled={!selectedCategory || !selectedSubOption}
            onClick={handleReasonSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-lg shadow-sm transition active:scale-95 flex items-center gap-1.5"
          >
            <span>Submit Selection</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}