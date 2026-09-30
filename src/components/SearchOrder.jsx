import React, { useState } from 'react';
import { ItemCard } from './ItemCard';
import ordersData from '../data/orders.json';

// Import image assets matching OrdersView
import phone from '../assets/phone.jpg';
import tea from '../assets/tea.png';
import anker from '../assets/anker.png';
import boiler from '../assets/boiler.png';
import ps5_console from '../assets/ps5_console.png';
import makeup from '../assets/makeup.png';
import iphone_15 from '../assets/iphone_15.png';
import sony_headphones from '../assets/sony_headphones.png';
import nescafe_gold from '../assets/nescafe_gold.png';
import samsung_tv from '../assets/samsung_tv.png';
import delonghi_espresso from '../assets/delonghi_espresso.png';
import anker_powerbank from '../assets/anker_powerbank.png';
import atomic_habits from '../assets/atomic_habits.png';
import macbook_air from '../assets/macbook_air.png';
import dumbbell_set from '../assets/dumbbell_set.png';
import philips_shaver from '../assets/philips_shaver.png';
import logitech_mouse from '../assets/logitech_mouse.png';
import xiaomi_band8 from '../assets/xiaomi_band8.png';
import kindle_paperwhite from '../assets/kindle_paperwhite.png';
import oralb_toothbrush from '../assets/oralb_toothbrush.png';
import tplink_router from '../assets/tplink_router.png';
import pampers_pants from '../assets/pampers_pants.png';
import afia_oil from '../assets/afia_oil.png';
import  adidas_shoes from '../assets/adidas_shoes.png';
const imageMap = {
  phone,
  tea,
  anker,
  boiler,
  ps5_console,
  makeup,
  iphone_15,
  sony_headphones,
  nescafe_gold,
  samsung_tv,
  delonghi_espresso,
  anker_powerbank,
  atomic_habits,
  macbook_air,
  dumbbell_set,
  philips_shaver,
  logitech_mouse,
  xiaomi_band8,
  kindle_paperwhite,
  oralb_toothbrush,
  tplink_router,
  pampers_pants,
  afia_oil,
  adidas_shoes,
};

// Helper to pad numeric ID to 4 digits (e.g. 1 -> "0001", 16 -> "0016")
const format4DigitId = (id) => {
  if (id === undefined || id === null) return '';
  return String(id).padStart(4, '0');
};

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
    formattedId: format4DigitId(rawOrder.id),
    image: imageMap[rawOrder.image] || phone,
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

  // Store multiple selected order objects
  const [selectedOrders, setSelectedOrders] = useState([]);

  // Track ID of currently expanded order item card
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Reset view when typing a new query
    if (selectedOrders.length > 0) {
      setSelectedOrders([]);
      setExpandedOrderId(null);
    }

    if (value.trim().length > 0) {
      const query = value.toLowerCase().trim();

      const matches = ordersData.filter((order) => {
        const orderNum = String(order.orderNumber);
        const cleanOrderNum = orderNum.replace(/-/g, '');
        const itemName = (order.name || '').toLowerCase();
        const fourDigitId = format4DigitId(order.id);
        const rawId = String(order.id);

        return (
          itemName.includes(query) ||
          orderNum.endsWith(query) ||
          cleanOrderNum.endsWith(query) ||
          fourDigitId.includes(query) ||
          rawId === query
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

    setSearchValue(formatted.name);
    setSuggestions([]);
    setShowSuggestions(false);

    setSelectedOrders([formatted]);
    setExpandedOrderId(null);

    if (onSelectOrder) {
      onSelectOrder(formatted);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);

    if (!searchValue.trim()) return;

    const query = searchValue.toLowerCase().trim();

    // Filter matches on form submit (by name, order number, or 4-digit ID)
    const matches = ordersData
      .filter((order) => {
        const orderNum = String(order.orderNumber);
        const cleanOrderNum = orderNum.replace(/-/g, '');
        const itemName = (order.name || '').toLowerCase();
        const fourDigitId = format4DigitId(order.id);
        const rawId = String(order.id);

        return (
          itemName.includes(query) ||
          orderNum === searchValue ||
          cleanOrderNum === searchValue ||
          orderNum.endsWith(searchValue) ||
          cleanOrderNum.endsWith(searchValue) ||
          fourDigitId === query ||
          rawId === query
        );
      })
      .map(formatOrder);

    setSelectedOrders(matches);
    setExpandedOrderId(null);
  };

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  return (
    <div className="flex flex-col items-start gap-6 w-full">
      {/* Search Input Box constrained to compact max-width */}
      <div className="relative w-full max-w-md sm:w-[420px]">
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
          <input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => searchValue.trim() && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={`Search by item name, ID (e.g. 0001), or ${searchType || 'order number'}...`}
            className="w-full px-4 py-2 text-xs text-black border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white placeholder:text-slate-400"
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
              const fourDigitId = format4DigitId(order.id);

              return (
                <li
                  key={order.id}
                  onClick={() => handleSelectSuggestion(order)}
                  className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-xs text-slate-800 border-b last:border-b-0 border-slate-100 flex justify-between items-center gap-2"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Small preview thumbnail */}
                    <div className="w-8 h-8 rounded bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                      <img
                        src={imageMap[order.image] || phone}
                        alt={order.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold text-black truncate">{order.name}</p>
                      <p className="text-[10px] text-slate-500">
                        Order #{order.orderNumber} • ID: {fourDigitId}
                      </p>
                    </div>
                  </div>

                  <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] shrink-0">
                    ID: {fourDigitId}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {/* No suggestions popup */}
        {showSuggestions && searchValue.trim().length > 0 && suggestions.length === 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs text-slate-500 text-center">
            No matching items or orders found for "{searchValue}"
          </div>
        )}
      </div>

      {/* Selected Order Results Section */}
      {selectedOrders.length > 0 && (
        <div className="w-full flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {selectedOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;

              return (
                <React.Fragment key={order.id}>
                  {/* Summary Card */}
                  <div
                    onClick={() => toggleExpandOrder(order.id)}
                    className={`col-span-1 flex items-center gap-4 p-6 border shadow-sm cursor-pointer transition-all ${
                      isExpanded
                        ? 'border-blue-500 ring-2 ring-blue-200 bg-sky-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Left: Product Image */}
                    <div className="w-16 h-16 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                      <img
                        src={order.image}
                        alt={order.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Right: Name, Status, and 4-Digit ID */}
                    <div className="flex flex-col gap-1">
                      <span className="text-black font-normal text-base line-clamp-2">
                        {order.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-bold text-sm">
                          {order.status}
                        </span>
                        <span className="text-slate-400 text-xs font-medium">
                          (ID: {order.formattedId})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Item Card View */}
                  {isExpanded && (
                    <div className="col-span-full w-full">
                      <ItemCard
                        selectedOrder={order}
                        onClose={() => setExpandedOrderId(null)}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}