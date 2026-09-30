import React, { useState } from 'react';
import { useCall } from '../context/CallContext';
import { User, ChevronRight, Info, CheckCircle, CreditCard, RotateCcw, Package } from 'lucide-react';
import phone from '../assets/phone.jpg';
import tea from '../assets/tea.png';
import anker from '../assets/anker.png';
import boiler from '../assets/boiler.png';
import play from '../assets/play.png';
import makeup from '../assets/makeup.png';
import { DeliveryCard } from './DeliveryCard';
import { PaymentCard } from './PaymentCard';
import { ReturnCard } from './ReturnCard';
import { DetailsCard } from './DetailsCard';
import { Action } from './Action';

export function ItemCard({ selectedOrder, onClose }) {
  if (!selectedOrder) return null;

  // State to track which detail row is expanded
  const [activeDetailRow, setActiveDetailRow] = useState(null);

  // State to track which action button view is currently active (e.g., 'refund')
  const [activeAction, setActiveAction] = useState(null);

  const handleRowClick = (id) => {
    setActiveDetailRow(activeDetailRow === id ? null : id);
  };

  // The 4 requested rows
// Check selectedOrder.return explicitly
  // Only shows return tab if selectedOrder.return is strictly NOT false
  const isReturnable = selectedOrder?.return !== false;

  const detailRows = [
    { id: 'delivery', label: 'Delivery' },
    { id: 'payment', label: 'Payment' },
    ...(isReturnable ? [{ id: 'return', label: 'Return' }] : []),
    { id: 'item', label: 'Item' },
    { id: 'cs', label: 'Ask CS' },
  ];

  // The 4 requested action buttons
  const actionButtons = [
    { id: 'refund', label: 'Request refund or replacement' },
    { id: 'cancel', label: 'Cancel this item' },
    { id: 'photo', label: 'Check for delivery photo' },
    { id: 'sms', label: 'Change shipment updates via text' },
  ];

  return (
    <div className="w-full bg-slate-50 border border-slate-200 p-5 shadow-sm flex flex-col gap-4 animate-fadeIn">
      
      {/* Top Header: Close Button */}
      <div className="flex justify-end items-center">
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 font-bold text-sm"
        >
          ✕ Close
        </button>
      </div>

      {/* Product Info Section: 5% Photo, Content with 20px right padding */}
      <div className="flex items-center w-full pb-4 border-b border-slate-200 pl-5 pr-5">
        {/* Item Picture on Left (5% Width allocation) */}
        <div className="w-[5%] shrink-0">
          <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
            <img 
              src={selectedOrder.image} 
              alt={selectedOrder.name} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>

        {/* Content on Right */}
        <div className="w-[95%] flex flex-col gap-1 pl-4">
          <span className="text-blue-600 font-bold text-base">
            {selectedOrder.name}
          </span>
          <span className="text-black font-normal text-sm">
            {selectedOrder.status}
          </span>
        </div>
      </div>

      {/* selectedOrder.details inside a full-width sky-blue rectangle with right padding */}
      <div className="pl-5 pr-25 w-full">
        <div className="w-full bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Info icon on left */}
            <Info className="w-5 h-5 text-sky-600 shrink-0 font-extrabold" />
            {/* Details text in bold */}
            <span className="font-bold text-black text-sm leading-relaxed">
              {selectedOrder.details}
            </span>
          </div>
          {/* View Details Button at Max Right */}
          <button 
            className="bg-slate-200 border text-black font-bold text-xs px-3.5 py-2 transition-all shadow-sm shrink-0"
          >
            View Details
          </button>
        </div>
      </div>

      {/* 4 Rows container aligned with left spacer and 20px right padding */}
      <div className="flex w-full pl-5 pr-5 pt-1">
        {/* Empty 5% spacer to match the photo column */}
        <div className="w-[5%] shrink-0" />

        {/* Content container holding the 4 rows & their unique hidden panels */}
        <div className="w-[95%] flex flex-col gap-2 pl-4">
          {detailRows.map((row) => {
            const isRowActive = activeDetailRow === row.id;

            return (
              <div key={row.id} className="flex flex-col gap-2">
                {/* Row link element */}
                <div 
                  onClick={() => handleRowClick(row.id)}
                  className={`flex items-center gap-1.5 cursor-pointer group py-0.5 w-fit transition-all ${
                    isRowActive ? 'font-semibold' : ''
                  }`}
                >
                  {/* Chevron-Right Icon on Left */}
                  <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform shrink-0 ${
                    isRowActive ? 'rotate-90 text-blue-600' : ''
                  }`} />
                  
                  {/* Row Label styled like a link */}
                  <span className={`text-sm transition-colors ${
                    isRowActive ? 'text-blue-600 underline' : 'text-slate-600 group-hover:text-blue-600 group-hover:underline font-medium'
                  }`}>
                    {row.label}
                  </span>
                </div>

                {/* Unique Expandable Design for Each Tab */}
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

      {/* Blue "Details" Link positioned on the right side under the View Details button level */}
      <div className="flex w-full pl-5 pr-25 pt-1 justify-end">
        <span 
          onClick={() => console.log('Details link clicked')}
          className="text-blue-600 font-bold text-sm cursor-pointer hover:underline"
        >
          Details
        </span>
      </div>

      {/* Action Buttons Section OR Active Component Section */}
      <div className="flex w-full pl-5 pr-5 pt-2">
        <div className="w-[5%] shrink-0" />
        <div className="w-[95%] pl-4">
          
          {activeAction === 'refund' ? (
            /* Refund / Replacement Component View with close handler */
            <Action DStatus={selectedOrder} onClose={() => setActiveAction(null)} />
          ) : (
            /* Default 4 Action Buttons */
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
                  className="bg-slate-200 border text-black font-bold text-xs px-3.5 py-2 transition-all shadow-sm rounded-lg hover:bg-slate-300"
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