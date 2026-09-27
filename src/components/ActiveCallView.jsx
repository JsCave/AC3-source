import React, { useState } from 'react';
import { useCall } from '../context/CallContext';

export default function ActiveCallView() {
  const { status, lastAction,workFlow } = useCall();
  const [searchQuery, setSearchQuery] = useState('');

  const currentStatus = status ? status.trim().toLowerCase() : '';
  const currentWorkFlow = workFlow ? workFlow.trim().toLowerCase() : '';

  // الشروط المطلوبة لعرض الصفحة
  const isAllowedStatus = ['on contact'].includes(currentStatus);
  const isworkFlow = currentWorkFlow<1;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
  };

  if (isAllowedStatus && isworkFlow) {
    return (
      <div className="p-6 flex justify-start w-full">
        <form onSubmit={handleSearch} className="flex items-center gap-3 w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-800 text-sm bg-white"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-black font-bold px-6 py-2 rounded-lg transition-all shadow-sm flex items-center justify-center whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </div>
    );
  }

  return null;
}