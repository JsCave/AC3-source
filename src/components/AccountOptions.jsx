import React, { useState } from 'react';
import { SearchOrder } from './SearchOrder'; // Import the SearchOrder component

export function AccountOptions() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [boughtStatus, setBoughtStatus] = useState(null);
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  const handleIssueClick = (issue) => {
    if (selectedIssue === issue) {
      setSelectedIssue(null);
      setBoughtStatus(null);
      setSelectedItemDetail(null);
    } else {
      setSelectedIssue(issue);
      setBoughtStatus(null); // Reset sub-selections
      setSelectedItemDetail(null);
    }
  };

  const handleBoughtClick = (status) => {
    if (boughtStatus === status) {
      setBoughtStatus(null);
      setSelectedItemDetail(null);
    } else {
      setBoughtStatus(status);
      setSelectedItemDetail(null); // Reset step 3 selection
    }
  };

  const handleDetailClick = (detail) => {
    setSelectedItemDetail(selectedItemDetail === detail ? null : detail);
  };

  return (
    <div className="w-fit flex flex-col gap-5 p-4">
      
      {/* ==================== STEP 1: Main Issue ==================== */}
      <div className="flex flex-col gap-3">
        {/* Black Header Title */}
        <h3 className="text-black font-bold text-base tracking-tight">
          What's the issue related to?
        </h3>

        {/* Fixed Buttons taking only necessary width */}
        <div className="w-fit flex flex-row items-center gap-2 overflow-x-auto">
          
          {/* Button 1 */}
          <button
            type="button"
            onClick={() => handleIssueClick('An item or order')}
            className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
              selectedIssue === 'An item or order'
                ? 'bg-slate-400 ring-2 ring-slate-400'
                : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            An item or order
          </button>

          {/* Button 2 */}
          <button
            type="button"
            onClick={() => handleIssueClick('A payment or charge')}
            className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
              selectedIssue === 'A payment or charge'
                ? 'bg-slate-400 ring-2 ring-slate-400'
                : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            A payment or charge
          </button>

          {/* Button 3 */}
          <button
            type="button"
            onClick={() => handleIssueClick('A subscription')}
            className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
              selectedIssue === 'A subscription'
                ? 'bg-slate-400 ring-2 ring-slate-400'
                : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            A subscription
          </button>

          {/* Button 4 */}
          <button
            type="button"
            onClick={() => handleIssueClick('A gift card')}
            className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
              selectedIssue === 'A gift card'
                ? 'bg-slate-400 ring-2 ring-slate-400'
                : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            A gift card
          </button>

          {/* Button 5 */}
          <button
            type="button"
            onClick={() => handleIssueClick('An account')}
            className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
              selectedIssue === 'An account'
                ? 'bg-slate-400 ring-2 ring-slate-400'
                : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            An account
          </button>

        </div>
      </div>

      {/* ==================== STEP 2: Follow-up for "An item or order" ==================== */}
      {selectedIssue === 'An item or order' && (
        <div className="flex flex-col gap-3 pt-1">
          {/* Header */}
          <h3 className="text-black font-bold text-base tracking-tight">
            Did you buy the item?
          </h3>

          {/* 3 Sub-Option Buttons */}
          <div className="w-fit flex flex-row items-center gap-2 overflow-x-auto">
            
            {/* Option 1 */}
            <button
              type="button"
              onClick={() => handleBoughtClick('Yes')}
              className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                boughtStatus === 'Yes'
                  ? 'bg-slate-400 ring-2 ring-slate-400'
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
            >
              Yes
            </button>

            {/* Option 2 */}
            <button
              type="button"
              onClick={() => handleBoughtClick("No, it's in my cart")}
              className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                boughtStatus === "No, it's in my cart"
                  ? 'bg-slate-400 ring-2 ring-slate-400'
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
            >
              No, it's in my cart
            </button>

            {/* Option 3 */}
            <button
              type="button"
              onClick={() => handleBoughtClick("No, it's a gift")}
              className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                boughtStatus === "No, it's a gift"
                  ? 'bg-slate-400 ring-2 ring-slate-400'
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
            >
              No, it's a gift
            </button>

          </div>
        </div>
      )}

      {/* ==================== STEP 3: Follow-up for "Yes" ==================== */}
      {selectedIssue === 'An item or order' && boughtStatus === 'Yes' && (
        <div className="flex flex-col gap-3 pt-1">
          {/* Option Buttons */}
          <div className="w-fit flex flex-row items-center gap-2 overflow-x-auto">
            
            {/* Detail Button 1 */}
            <button
              type="button"
              onClick={() => handleDetailClick('Item Name')}
              className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                selectedItemDetail === 'Item Name'
                  ? 'bg-slate-400 ring-2 ring-slate-400'
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
            >
              Item Name
            </button>

            {/* Detail Button 2 */}
            <button
              type="button"
              onClick={() => handleDetailClick('Order ID')}
              className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                selectedItemDetail === 'Order ID'
                  ? 'bg-slate-400 ring-2 ring-slate-400'
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
            >
              Order ID
            </button>

            {/* Detail Button 3 */}
            <button
              type="button"
              onClick={() => handleDetailClick('Shipping ID')}
              className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                selectedItemDetail === 'Shipping ID'
                  ? 'bg-slate-400 ring-2 ring-slate-400'
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
            >
              Shipping ID
            </button>

          </div>
        </div>
      )}

      {/* ==================== STEP 4: Render SearchOrder Component ==================== */}
      {selectedItemDetail && (
        <div className="pt-2 w-full">
          <SearchOrder searchType={selectedItemDetail} />
        </div>
      )}

    </div>
  );
}