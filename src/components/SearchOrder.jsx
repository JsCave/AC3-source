import React, { useState } from 'react';
import { ItemCard } from './ItemCard';
import ordersData from '../data/orders.json';

// Import image assets matching OrdersView
import phone from '../assets/phone.jpg';
import tea from '../assets/tea.png';
import anker from '../assets/anker.png';
import boiler from '../assets/boiler.png';
import play from '../assets/play.png';
import makeup from '../assets/makeup.png';

const imageMap = { phone, tea, anker, boiler, play, makeup };

// Helper to get formatted date string relative to today
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

// Format raw JSON order object into card-ready data
const formatOrder = (rawOrder) => {
  if (!rawOrder) return null;
  return {
    ...rawOrder,
    image: imageMap[rawOrder.imageKey] || phone,
    updateItems: rawOrder.updateItems
      ? rawOrder.updateItems.map((item) => ({
          date: getRelativeDateString(item.offsetDays),
          info: item.info
        }))
      : []
  };
};

export function SearchOrder({ searchType, onSelectOrder }) {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Track selected order object
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Track whether the expanded ItemCard detail view is open
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Reset card views when user starts typing a new query
    if (selectedOrder) {
      setSelectedOrder(null);
      setIsExpanded(false);
    }

    if (value.trim().length > 0) {
      const matches = ordersData.filter((order) => {
        const orderNum = String(order.orderNumber);
        const cleanOrderNum = orderNum.replace(/-/g, '');
        
        return (
          orderNum.endsWith(value) ||
          cleanOrderNum.endsWith(value) ||
          String(order.id).endsWith(value)
        );
      });

      setSuggestions(matches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (rawOrder) => {
    const formatted = formatOrder(rawOrder);

    setSearchValue(formatted.orderNumber);
    setSuggestions([]);
    setShowSuggestions(false);
    
    // Set selected order and keep it closed/unfolded initially
    setSelectedOrder(formatted);
    setIsExpanded(false);

    if (onSelectOrder) {
      onSelectOrder(formatted);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);

    const directMatch = ordersData.find(
      (o) => String(o.orderNumber) === searchValue || String(o.id) === searchValue
    );

    if (directMatch) {
      handleSelectSuggestion(directMatch);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {/* Search Input Box */}
      <div className="relative w-full">
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
          <input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => searchValue.trim() && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={`Enter last 4 digits or ${searchType || 'details'}...`}
            className="flex-1 px-4 py-2 text-xs text-black border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white placeholder:text-slate-400"
          />

          <button
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-bold text-xs py-2 px-5 rounded-lg transition-all cursor-pointer shadow-sm shrink-0"
          >
            search
          </button>
        </form>

        {/* Suggestion Dropdown List */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((order) => {
              const last4 = String(order.orderNumber).slice(-4);
              return (
                <li
                  key={order.id}
                  onClick={() => handleSelectSuggestion(order)}
                  className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-xs text-slate-800 border-b last:border-b-0 border-slate-100 flex justify-between items-center"
                >
                  <div>
                    <span className="font-semibold text-black">{order.name}</span>
                    <p className="text-[10px] text-slate-500">Order #{order.orderNumber}</p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    ...{last4}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {/* No suggestions popup */}
        {showSuggestions && searchValue.trim().length > 0 && suggestions.length === 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs text-slate-500 text-center">
            No orders ending with "{searchValue}"
          </div>
        )}
      </div>

      {/* Selected Order Section */}
      {selectedOrder && (
        <div className="flex flex-col gap-4 w-full">
          {/* 1. Unfolded Summary Card (Matching OrdersView Card style) */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-4 p-6 border shadow-sm cursor-pointer transition-all ${
              isExpanded
                ? 'border-blue-500 ring-2 ring-blue-200 bg-sky-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {/* Left: Product Image */}
            <div className="w-16 h-16 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
              <img
                src={selectedOrder.image}
                alt={selectedOrder.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Name and Status */}
            <div className="flex flex-col gap-1">
              <span className="text-black font-normal text-base line-clamp-2">
                {selectedOrder.name}
              </span>
              <span className="text-blue-600 font-bold text-sm">
                {selectedOrder.status}
              </span>
            </div>
          </div>

          {/* 2. Folded Detailed View (Renders ItemCard on click) */}
          {isExpanded && (
            <ItemCard
              selectedOrder={selectedOrder}
              onClose={() => setIsExpanded(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}