import React, { useState } from 'react';
import { SearchOrder } from './SearchOrder';

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
      setBoughtStatus(null);
      setSelectedItemDetail(null);
    }
  };

  const handleBoughtClick = (status) => {
    if (boughtStatus === status) {
      setBoughtStatus(null);
      setSelectedItemDetail(null);
    } else {
      setBoughtStatus(status);
      setSelectedItemDetail(null);
    }
  };

  const handleDetailClick = (detail) => {
    setSelectedItemDetail(selectedItemDetail === detail ? null : detail);
  };

  const issues = [
    'An item or order',
    'A payment or charge',
    'A subscription',
    'A gift card',
    'An account'
  ];

  const boughtOptions = [
    'Yes',
    "No, it's in my cart",
    "No, it's a gift"
  ];

  const detailOptions = [
    'Item Name',
    'Order ID',
    'Shipping ID'
  ];

  return (
    <div className="w-full flex flex-col gap-5 p-4">
      {/* STEP 1: Main Issue */}
      <div className="flex flex-col gap-3 w-full">
        <h3 className="text-black font-bold text-base tracking-tight">
          What's the issue related to?
        </h3>

        <div className="w-full flex flex-row items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {issues.map((issue) => (
            <button
              key={issue}
              type="button"
              onClick={() => handleIssueClick(issue)}
              className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                selectedIssue === issue
                  ? 'bg-slate-400 ring-2 ring-slate-400'
                  : 'bg-slate-200 hover:bg-slate-300'
              }`}
            >
              {issue}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 2: Follow-up for "An item or order" */}
      {selectedIssue === 'An item or order' && (
        <div className="flex flex-col gap-3 pt-1 w-full">
          <h3 className="text-black font-bold text-base tracking-tight">
            Did you buy the item?
          </h3>

          <div className="w-full flex flex-row items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {boughtOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleBoughtClick(status)}
                className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                  boughtStatus === status
                    ? 'bg-slate-400 ring-2 ring-slate-400'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Follow-up for "Yes" */}
      {selectedIssue === 'An item or order' && boughtStatus === 'Yes' && (
        <div className="flex flex-col gap-3 pt-1 w-full">
          <div className="w-full flex flex-row items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {detailOptions.map((detail) => (
              <button
                key={detail}
                type="button"
                onClick={() => handleDetailClick(detail)}
                className={`py-2 px-4 text-xs font-medium text-black rounded-lg transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                  selectedItemDetail === detail
                    ? 'bg-slate-400 ring-2 ring-slate-400'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
              >
                {detail}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 4: Render SearchOrder Component */}
      {selectedItemDetail && (
        <div className="pt-2 w-full">
          <SearchOrder searchType={selectedItemDetail} />
        </div>
      )}
    </div>
  );
}