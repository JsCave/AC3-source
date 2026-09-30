import React from 'react';

export function Action({ DStatus, onClose }) {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="font-bold text-black text-sm">Request Refund or Replacement</span>
        
        {/* Close / Back Button */}
        <button 
          onClick={onClose}
          className="text-slate-500 hover:text-black font-semibold text-xs underline"
        >
          ← Back to actions
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-semibold text-black text-sm">Is Anything Missing?</span>
        
        {/* Radio options group */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
            <input type="radio" name="missing_item" value="yes" className="accent-blue-600" onChange={() => console.log("hi")} />
            Yes
          </label>
          <label className="flex items-center gap-2 text-xs text-black cursor-pointer">
            <input type="radio" name="missing_item" value="no" className="accent-blue-600" />
            No
          </label>
        </div>
      </div>

    </div>
  );
}