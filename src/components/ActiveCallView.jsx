import React, { useState } from 'react';
import { useCall } from '../context/CallContext';
import { User } from 'lucide-react';
import OrdersView from './OrdersView';

export default function ActiveCallView() {
  const { status, lastAction,workFlow,setWorkFlow } = useCall();
  const [searchQuery, setSearchQuery] = useState('');
  const [finalSearch, setFinalSearch] = useState('');

  const currentStatus = status ? status.trim().toLowerCase() : '';
  const currentWorkFlow = workFlow;

  // الشروط المطلوبة لعرض الصفحة
  const isAllowedStatus = ['on contact'].includes(currentStatus);
  const isworkFlow = currentWorkFlow<1;
  console.log(isAllowedStatus)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
  };
//view of search for account and verification sms
  if (isAllowedStatus && workFlow<4) {
    return (
      <div className="p-6 flex flex-col justify-start w-full gap-6">
        <span>{workFlow}</span>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex items-center gap-3 w-full max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type search text..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-slate-800 text-sm bg-white"
          />
          <button
            type="submit"
            onClick={() =>{ if(workFlow===0){setWorkFlow((prev) => prev + 1)}else{setWorkFlow(1);setFinalSearch(searchQuery)}}} 
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-black font-bold px-6 py-2 rounded-lg transition-all shadow-sm flex items-center justify-center whitespace-nowrap"
          >
            Search
          </button>
        </form>



{workFlow === 1 && (
  <div 
    onClick={() => setWorkFlow((prev) => prev + 1)} 
    className="flex items-center gap-5 p-6 w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-md cursor-pointer hover:border-orange-500 transition-all"
  >
    {/* Larger Grey circle with larger User icon */}
    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
      <User size={62} />
    </div>

    {/* Text content */}
    <div className="flex flex-col gap-1">
      <span className="text-black font-bold text-2xl">
        M******
      </span>
      <span className="text-slate-800 font-medium text-base">
        {finalSearch || "01111"}
      </span>
      <span className="text-blue-600 font-bold text-sm">
        Active
      </span>
    </div>
  </div>
)}

{workFlow === 2 && (
  <div className="flex flex-col gap-5 p-6 w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-md">
    {/* Random text in a normal font */}
    <div className="text-slate-700 text-base leading-relaxed">
      Send confirmation To Customer.
    </div>

    {/* Orange button with black bold text */}
    <button
      type="button"
      onClick={() => setWorkFlow((prev) => prev + 1)}
      className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-black font-bold py-2 px-4 rounded-lg transition-all shadow-sm flex items-center justify-center self-start text-sm"
    >
      Send Confirmation
    </button>
  </div>
)}

{workFlow === 3 && (
  <div className="flex flex-col gap-5 p-6 w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-md">
    {/* Random text in a normal font */}
    <div className="text-slate-700 text-base leading-relaxed">
      Confirmation sent to<br />SMS<br />Email<br />Apps Notifications.
    </div>

    {/* Orange button with black bold text */}
    <button
      type="button"
      onClick={() => setWorkFlow((prev) => prev + 1)}
      className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-black font-bold py-2 px-4 rounded-lg transition-all shadow-sm flex items-center justify-center self-start text-sm"
    >
      Verify Confirmation
    </button>
  </div>
)}



      </div>
    );
  }
if(isAllowedStatus && workFlow===4){return <OrdersView />}

  return null;
}