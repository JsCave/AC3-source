import React, { useState } from 'react';
import { useCall } from '../context/CallContext';
import { ChevronRight, Info, ArrowLeft } from 'lucide-react';

import { DeliveryCard } from './DeliveryCard';
import { PaymentCard } from './PaymentCard';
import { ReturnCard } from './ReturnCard';
import { DetailsCard } from './DetailsCard';
import { Action } from './Action';

// Helper to format date strings relative to today
const getRelativeDateString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
};

export function ItemCard({ selectedOrder, onClose }) {
  if (!selectedOrder) return null;

  // State to track which detail row is expanded
  const [activeDetailRow, setActiveDetailRow] = useState(null);

  // State to track which action button view is currently active
  const [activeAction, setActiveAction] = useState(null);

  // State to toggle between Item Details View and Order Notes View
  const [showNotes, setShowNotes] = useState(false);

  const handleRowClick = (id) => {
    setActiveDetailRow(activeDetailRow === id ? null : id);
  };

  // Only show return tab if selectedOrder.return is strictly NOT false
  const isReturnable = selectedOrder?.return !== false;

  const detailRows = [
    { id: 'delivery', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
    ...(isReturnable ? [{ id: 'return', label: 'Return' }] : []),
    { id: 'item', label: 'Item' },
    { id: 'cs', label: 'Ask CS' },
  ];

  // Action buttons list
  const actionButtons = [
    { id: 'refund', label: 'Request refund or replacement' },
    { id: 'cancel', label: 'Cancel this item' },
    { id: 'photo', label: 'Check for delivery photo' },
    { id: 'sms', label: 'Change shipment updates via text' },
  ];

  // Strictly get notes array ONLY from selectedOrder.notes in JSON
  const orderNotes = selectedOrder?.notes || [];

  // Render Table-style Notes View if "Details" link or button is clicked
  if (showNotes) {
    return (
      <div className="w-full bg-slate-50 border border-slate-200 p-5 shadow-sm flex flex-col gap-4 animate-fadeIn">
        {/* Top Header: Back & Close Buttons */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <button
            onClick={() => setShowNotes(false)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold text-xs cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Item Details
          </button>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
          >
            ✕ Close
          </button>
        </div>

        {/* Display Notes Table if JSON has notes; otherwise display empty state */}
        {orderNotes.length > 0 ? (
          <div className="w-full border-t border-b border-slate-200 divide-y divide-slate-200">
            {orderNotes.map((note, index) => (
              <div
                key={note.id || index}
                className="py-3 px-2 flex justify-between items-center hover:bg-slate-100/60 transition-colors"
              >
                <span className="text-sm font-medium text-black">
                  {note.info || note.content || note.text}
                </span>
                {note.offsetDays !== undefined && (
                  <span className="text-xs text-slate-500 shrink-0 ml-4">
                    {getRelativeDateString(note.offsetDays)}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 text-sm font-medium">
            No notes available for this order.
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="flex justify-start pt-1">
          <button
            onClick={() => setShowNotes(false)}
            className="bg-slate-200 hover:bg-slate-300 border text-black font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
          >
            ← Back to Item Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 border border-slate-200 p-5 shadow-sm flex flex-col gap-4 animate-fadeIn">
      {/* Top Header: Close Button */}
      <div className="flex justify-end items-center">
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
        >
          ✕ Close
        </button>
      </div>

      {/* Product Info Section */}
      <div className="flex items-center w-full pb-4 border-b border-slate-200 pl-5 pr-5">
        <div className="w-[5%] shrink-0">
          <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
            <img
              src={selectedOrder.image}
              alt={selectedOrder.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="w-[95%] flex flex-col gap-1 pl-4">
          <span className="text-blue-600 font-bold text-base">
            {selectedOrder.name}
          </span>
          <span className="text-black font-normal text-sm">
            {selectedOrder.status}
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="pl-5 pr-25 w-full">
        <div className="w-full bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-sky-600 shrink-0 font-extrabold" />
            <span className="font-bold text-black text-sm leading-relaxed">
              {selectedOrder.details}
            </span>
          </div>
          <button
            
            className="bg-slate-200 hover:bg-slate-300 border text-black font-bold text-xs px-3.5 py-2 transition-all shadow-sm shrink-0 cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Detail Rows Container */}
      <div className="flex w-full pl-5 pr-5 pt-1">
        <div className="w-[5%] shrink-0" />

        <div className="w-[95%] flex flex-col gap-2 pl-4">
          {detailRows.map((row) => {
            const isRowActive = activeDetailRow === row.id;

            return (
              <div key={row.id} className="flex flex-col gap-2">
                <div
                  onClick={() => handleRowClick(row.id)}
                  className={`flex items-center gap-1.5 cursor-pointer group py-0.5 w-fit transition-all ${
                    isRowActive ? 'font-semibold' : ''
                  }`}
                >
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform shrink-0 ${
                      isRowActive ? 'rotate-90 text-blue-600' : ''
                    }`}
                  />

                  <span
                    className={`text-sm transition-colors ${
                      isRowActive
                        ? 'text-blue-600 underline'
                        : 'text-slate-600 group-hover:text-blue-600 group-hover:underline font-medium'
                    }`}
                  >
                    {row.label}
                  </span>
                </div>

                {isRowActive && (
                  <div className="w-full p-4 flex flex-col gap-3 my-1">
                    {row.id === 'delivery' && (
                      <DeliveryCard DStatus={selectedOrder} />
                    )}

                    {row.id === 'payment' && (
                      <PaymentCard DStatus={selectedOrder} />
                    )}

                    {row.id === 'return' && (
                      <ReturnCard DStatus={selectedOrder} />
                    )}

                    {row.id === 'item' && (
                      <DetailsCard DStatus={selectedOrder} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Blue "Details" Link */}
      <div className="flex w-full pl-5 pr-25 pt-1 justify-end">
        <span
          onClick={() => setShowNotes(true)}
          className="text-blue-600 font-bold text-sm cursor-pointer hover:underline"
        >
          Details
        </span>
      </div>

      {/* Action Buttons Section */}
      <div className="flex w-full pl-5 pr-5 pt-2">
        <div className="w-[5%] shrink-0" />
        <div className="w-[95%] pl-4">
          {activeAction === 'refund' ? (
            <Action DStatus={selectedOrder} onClose={() => setActiveAction(null)} />
          ) : (
            <div className="flex flex-wrap gap-2.5">
              {actionButtons.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => {
                    if (btn.id === 'refund') {
                      setActiveAction('refund');
                    } else {
                      console.log(`${btn.label} clicked`);
                    }
                  }}
                  className="bg-slate-200 border text-black font-bold text-xs px-3.5 py-2 transition-all shadow-sm rounded-lg hover:bg-slate-300 cursor-pointer"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}