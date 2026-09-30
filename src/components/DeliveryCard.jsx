import React, { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';

export function DeliveryCard({ DStatus, shippingAddress: customAddress, updateItems: customUpdates, phoneNumber: customPhone }) {
  
  // Helper function to calculate a formatted date relative to Today using offsetDays
  const getDynamicDateFromToday = (offsetDays = 0, includeTime = false) => {
    const date = new Date();
    date.setDate(date.getDate() - offsetDays); // Subtracting offset (e.g. 0 = Today, 3 = 3 days ago)

    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });

    if (includeTime) {
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      return `${formattedDate} (${formattedTime})`;
    }

    return formattedDate;
  };

  // Compute dynamic dates from JSON offsets (fallback to 0 if missing)
  const orderDateStr = getDynamicDateFromToday(DStatus?.orderOffsetDays ?? 0);
  const cancelDateStr = getDynamicDateFromToday(DStatus?.cancelOffsetDays ?? 0);
  const shippedDateStr = getDynamicDateFromToday(DStatus?.shippedOffsetDays ?? 0);
  const outDateStr = getDynamicDateFromToday(DStatus?.outOffsetDays ?? 0);
  const deliverDateStr = getDynamicDateFromToday(DStatus?.deliverOffsetDays ?? 0, true);

  // Dynamic Timeline steps definition
  const steps = [
    { title: `Ordered ${orderDateStr}`, date: orderDateStr, completed: DStatus?.orderStatus },
    { title: `Cancelled ${cancelDateStr}`, date: cancelDateStr, completed: DStatus?.cancelStatus },
    { title: `Shipped ${shippedDateStr}`, date: shippedDateStr, completed: DStatus?.shippedStatus },
    { title: `Out for delivery`, date: outDateStr, completed: DStatus?.outStatus },
    { title: `Delivered ${deliverDateStr}`, date: deliverDateStr, completed: DStatus?.DeliverStatus },
  ];

  // Helper to get formatted date string for Return status
  const getOffsetDateString = (offsetDays) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - offsetDays);
    return targetDate.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Dynamic return status evaluation
  const renderReturnStatus = () => {
    if (DStatus?.returnable === false) {
      return <span className="font-semibold text-rose-600 pt-1">No</span>;
    }

    const eligibleOffset = DStatus?.EligbleEnd;

    if (eligibleOffset !== undefined) {
      const formattedEndDate = getOffsetDateString(eligibleOffset);

      if (eligibleOffset <= 0) {
        return (
          <span className="font-semibold text-emerald-600 pt-1">
            Yes, till {formattedEndDate}
          </span>
        );
      } else {
        return (
          <span className="font-semibold text-rose-600 pt-1">
            No, Ended {formattedEndDate}
          </span>
        );
      }
    }

    return <span className="font-semibold text-slate-500 pt-1">N/A</span>;
  };

  // Addresses & Phone fallbacks
  const shippingAddress = customAddress || DStatus?.shippingAddress || {
    street: '13 شارع الشارع امام السوبر ماركت',
    city: 'Cairo',
    country: 'Egypt',
  };

  const phoneNumber = customPhone || DStatus?.phone || '+20 101 234 5678';

  // Default updates list handling
  const updateItems = customUpdates || DStatus?.updateItems || [
    { offsetDays: 0, info: 'Order on way - Out for delivery with local courier.<br/>Delivered to Household' },
    { offsetDays: 1, info: 'Package arrived at regional sorting facility.' },
    { offsetDays: 2, info: 'Package picked up from origin facility and shipped.' },
  ];

  const parseDateString = (dateStr) => {
    if (!dateStr) return 0;
    const cleanStr = dateStr.includes(',') ? dateStr.split(',')[1].trim() : dateStr;
    const currentYear = new Date().getFullYear();
    const timestamp = Date.parse(`${cleanStr} ${currentYear}`);
    return isNaN(timestamp) ? 0 : timestamp;
  };

  const sortedUpdateItems = [...updateItems].sort((a, b) => {
    if (a.offsetDays !== undefined && b.offsetDays !== undefined) {
      return b.offsetDays - a.offsetDays;
    }
    return parseDateString(a.date) - parseDateString(b.date);
  });

  const groupedUpdateItems = sortedUpdateItems.reduce((acc, item) => {
    const existingGroup = acc.find((g) => 
      (item.offsetDays !== undefined && g.offsetDays === item.offsetDays) || 
      (item.date && g.date === item.date)
    );

    const infosToAdd = item.info ? item.info.split(/<br\s*\/?>/i).map((s) => s.trim()) : [];

    if (existingGroup) {
      existingGroup.infos.push(...infosToAdd);
    } else {
      acc.push({
        date: item.date,
        offsetDays: item.offsetDays,
        infos: infosToAdd,
      });
    }

    return acc;
  }, []);

  const itemData = {
    name: DStatus?.name || 'Wireless Noise-Canceling Headphones',
    image: DStatus?.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80',
    shippingCompany: DStatus?.shippingCompany || 'AMZL',
    trackingNumber: DStatus?.trackingNumber || 'AEG18763542',
  };

  const activeSteps = steps.filter((step) => step.completed);
  const [showAddress, setShowAddress] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [expandedUpdate, setExpandedUpdate] = useState(null);

  const maskPhoneNumber = (phone) => {
    if (!phone) return '••••••••••';
    if (phone.length <= 6) return '••••••••';
    return `${phone.slice(0, 7)} ••• ••••`;
  };

  return (
    <div className="w-full flex flex-col gap-6 text-xs text-slate-600 p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full">
        
        {/* ================= 1. LEFT COLUMN ================= */}
        <div className="flex flex-col gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-4">
          
          {/* Dynamic Timeline */}
          <div className="flex flex-col pl-2 py-1">
            {activeSteps.map((step, index) => {
              const isLast = index === activeSteps.length - 1;

              return (
                <div key={index} className="flex items-start group">
                  <div className="flex flex-col items-center mr-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 bg-white border-2 border-emerald-600 text-emerald-600">
                      <Check className="w-3.5 h-3.5 stroke-3" />
                    </div>
                    {!isLast && (
                      <div className="w-0.5 h-7 my-0.5 bg-emerald-600" />
                    )}
                  </div>

                  <div className="flex flex-col pt-0.5 pb-3">
                    <span className="font-bold text-slate-800 text-sm">
                      {step.title}
                    </span>
                    <span className="text-slate-500 font-medium text-xs">
                      {step.date}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Shipping Address */}
          {shippingAddress && (
            <div className="p-3 flex flex-col gap-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                Shipping Address
              </span>

              <div className="text-slate-600 font-medium pl-5 flex flex-col gap-0.5">
                {showAddress ? (
                  <div className="flex flex-col animate-fadeIn">
                    <span>{shippingAddress.street}</span>
                    <span>{shippingAddress.city}</span>
                    <span>{shippingAddress.country}</span>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <span>{shippingAddress.street ? `${shippingAddress.street.slice(0, 8)}••••••` : '••••••••'}</span>
                    <span>{shippingAddress.city ? `${shippingAddress.city.slice(0, 2)}•••••` : '•••••'}</span>
                    <span>{shippingAddress.country}</span>
                  </div>
                )}
              </div>

              <div className="pl-5 pt-1">
                <button
                  onClick={() => setShowAddress(!showAddress)}
                  className="text-blue-600 hover:underline font-semibold flex items-center gap-1 text-xs"
                >
                  {showAddress ? 'Hide address' : 'Show address'}
                </button>
              </div>
            </div>
          )}

          {/* Dynamic Shipping Updates */}
          {DStatus?.outStatus && groupedUpdateItems && groupedUpdateItems.length > 0 && (
            <div className="p-3 flex flex-col gap-2">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                Shipping Updates
              </span>

              <div className="flex flex-col gap-2 pl-2">
                {groupedUpdateItems.map((group, index) => {
                  const isExpanded = expandedUpdate === index;

                  return (
                    <div key={index} className="flex flex-col border-b border-slate-100 last:border-0 pb-1">
                      <div 
                        onClick={() => setExpandedUpdate(isExpanded ? null : index)}
                        className="flex justify-between items-center cursor-pointer py-1 group"
                      >
                        <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">
                          {group.offsetDays !== undefined ? getOffsetDateString(group.offsetDays) : group.date}
                        </span>
                        <ChevronRight className={`w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform ${
                          isExpanded ? 'rotate-90 text-blue-600' : ''
                        }`} />
                      </div>

                      {isExpanded && (
                        <div className="p-2.5 bg-slate-50 rounded-lg text-slate-600 my-1 animate-fadeIn flex flex-col gap-1.5">
                          {group.infos.map((infoText, infoIndex) => (
                            <div key={infoIndex} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                              <span className="text-xs leading-relaxed">{infoText}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* ================= 2. MIDDLE COLUMN ================= */}
        <div className="flex flex-col gap-4 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-4">
          <div className="flex flex-col gap-1 p-3">
            <span className="font-bold text-slate-800 text-sm">Who's shipping it</span>
            <span className="font-semibold text-slate-700 pt-1">{itemData.shippingCompany}</span>
            <span className="text-slate-500 text-[11px]">Tracking: {itemData.trackingNumber}</span>
          </div>

          <div className="flex flex-col gap-1 p-3">
            <span className="font-bold text-slate-800 text-sm">Eligible for return?</span>
            {renderReturnStatus()}
          </div>

          <div className="flex flex-col gap-1 p-3">
            <span className="font-bold text-slate-800 text-sm">Phone Number</span>
            <span className="font-semibold text-slate-700 pt-1">
              {showPhone ? phoneNumber : maskPhoneNumber(phoneNumber)}
            </span>
            <button
              onClick={() => setShowPhone(!showPhone)}
              className="text-blue-600 hover:underline font-semibold flex items-center gap-1 text-xs mt-1 w-fit"
            >
              {showPhone ? 'Hide number' : 'Show number'}
            </button>
          </div>
        </div>

        {/* ================= 3. RIGHT COLUMN ================= */}
        <div className="flex flex-col gap-3 p-3">
          <span className="font-bold text-slate-800 text-sm">What's in the shipment</span>
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            <img 
              src={itemData.image} 
              alt={itemData.name} 
              className="w-14 h-14 object-cover rounded-md border border-slate-200 shrink-0"
            />
            <span className="font-semibold text-slate-800 text-xs leading-relaxed">
              {itemData.name}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}