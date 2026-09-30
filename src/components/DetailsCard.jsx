import React from 'react';

export function DetailsCard({ DStatus }) {
  // Fallback defaults if props aren't fully passed
  const detailsData = {
    orderNumber: DStatus?.orderNumber || '#98342176',
    sellerName: DStatus?.sellerName || 'Global Direct Store',
    asin: DStatus?.asin || 'B09V3HMVF2',
    orderType: DStatus?.orderType || 'Standard Purchase',
  };

  return (
    <div className="w-full flex flex-col gap-6 text-xs text-black p-6">
      
      {/* Header */}
      <span className="font-bold text-black text-sm">Order Details</span>

      {/* 4-Column Layout for Single Row Headers & Single Row Info */}
      <div className="grid grid-cols-4 gap-4  p-4 ">
        
        {/* Headers Row */}
        <span className="font-medium text-slate-500 text-[11px]">Order Number</span>
        <span className="font-medium text-slate-500 text-[11px]">Seller Name</span>
        <span className="font-medium text-slate-500 text-[11px]">ASIN</span>
        <span className="font-medium text-slate-500 text-[11px]">Order Type</span>

        {/* Info Row (Directly underneath) */}
        <span className="font-bold text-black font-mono text-xs">{detailsData.orderNumber}</span>
        <span className="font-bold text-black text-xs">{detailsData.sellerName}</span>
        <span className="font-bold text-black font-mono text-xs">{detailsData.asin}</span>
        <span className="font-bold text-black text-xs">{detailsData.orderType}</span>

      </div>


    </div>
  );
}