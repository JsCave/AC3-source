import React from 'react';
import { Check } from 'lucide-react';

export function ReturnCard({ DStatus }) {
  /**
   * Helper function to calculate date using offset days relative to current date.
   * @param {number} offsetDays - Days relative to current time (e.g. 0 = today, 1 = yesterday)
   */
  const getDynamicDate = (offsetDays = 0) => {
    try {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - Number(offsetDays || 0));

      return targetDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    }
  };

  // Steps mapped directly to return status & offset keys from JSON
  const steps = [
    {
      title: 'Initiated',
      date: getDynamicDate(DStatus?.initiatedOffsetDays ?? 4),
      completed: DStatus?.initiatedStatus ?? true,
    },
    {
      title: 'Picked up',
      date: getDynamicDate(DStatus?.pickedUpOffsetDays ?? 3),
      completed: DStatus?.pickedUpStatus ?? true,
    },
    {
      title: 'Received',
      date: getDynamicDate(DStatus?.receivedOffsetDays ?? 1),
      completed: DStatus?.receivedStatus ?? true,
    },
    {
      title: 'Processed',
      date: getDynamicDate(DStatus?.processedOffsetDays ?? 0),
      completed: DStatus?.processedStatus ?? false,
    },
  ];

  // Fallback defaults matching JSON keys
  const returnData = {
    itemName: DStatus?.name || 'Samsung Phone',
    image: DStatus?.image || 'phone',
    shippingCompany: DStatus?.rshippingCompany || DStatus?.shippingCompany || 'AMZL',
    trackingNumber: DStatus?.rtrackingNumber || DStatus?.trackingNumber || 'AEG18722542',
  };

  return (
    <div className="w-full flex flex-col gap-6 text-xs text-black p-6">
      
      {/* 1. Item Name Header */}
      <div className="flex flex-col gap-1">
        <span className="font-bold text-black text-sm">{returnData.itemName}</span>
      </div>

      {/* 2. Tracking Timeline */}
      <div className="flex flex-col pl-2 py-1">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <div key={index} className="flex items-start group">
              {/* Left: Circle & Vertical Line */}
              <div className="flex flex-col items-center mr-3">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    step.completed 
                      ? 'bg-white border-2 border-emerald-600 text-emerald-600' 
                      : 'bg-slate-200 border-2 border-slate-200 text-transparent'
                  }`}
                >
                  {step.completed && <Check className="w-3.5 h-3.5 stroke-3" />}
                </div>
                {!isLast && (
                  <div 
                    className={`w-0.5 h-7 my-0.5 ${
                      step.completed ? 'bg-emerald-600' : 'bg-slate-200'
                    }`} 
                  />
                )}
              </div>

              {/* Right: Text Information */}
              <div className="flex flex-col pt-0.5 pb-3">
                <span className={`font-bold text-sm ${step.completed ? 'text-black' : 'text-slate-400'}`}>
                  {step.title}
                </span>
                {/* Show date ONLY if completed */}
                {step.completed && (
                  <span className="text-slate-600 font-medium text-xs">
                    {step.date}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Who's shipping it? */}
      <div className="flex flex-col gap-1 pt-1">
        <span className="font-bold text-black text-sm">Who's shipping it?</span>
        <span className="font-semibold text-black pt-1">{returnData.shippingCompany}</span>
        <span className="text-slate-600 text-[11px]">Tracking ID: {returnData.trackingNumber}</span>
        
        <div className="pt-1">
          <a 
            href="#view-details" 
            onClick={(e) => { e.preventDefault(); alert('Viewing return details...'); }}
            className="text-blue-600 hover:underline font-semibold flex items-center gap-1 text-xs w-fit"
          >
            View details
          </a>
        </div>
      </div>

      {/* 4. Items in the return */}
      <div className="flex flex-col gap-3 pt-2">
        <span className="font-bold text-black text-sm">1 item in this return</span>
        
        {/* Photo and Full Name beside it */}
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <img 
            src={returnData.image} 
            alt={returnData.itemName} 
            className="w-14 h-14 object-cover rounded-md border border-slate-200 shrink-0"
          />
          <span className="font-semibold text-black text-xs leading-relaxed">
            {returnData.itemName}
          </span>
        </div>
      </div>

    </div>
  );
}