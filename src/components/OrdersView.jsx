import React, { useState, useMemo } from 'react';
import { useCall } from '../context/CallContext';
import { ItemCard } from './ItemCard';
import { AccountOptions } from './AccountOptions'; // Import your AccountOptions component
import { User } from 'lucide-react';

import ordersData from '../data/orders.json';

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

  const dayName = days[d.getDay()];
  const monthName = months[d.getMonth()];
  const dayNum = d.getDate();

  return `${dayName}, ${monthName} ${dayNum}`;
};

// Helper function to pick N random items without modifying original array
const getRandomItems = (array, count = 6) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function OrdersView() {
  const { status, lastAction, workFlow, setWorkFlow } = useCall();
  const [searchQuery, setSearchQuery] = useState('');
  const [finalSearch, setFinalSearch] = useState('');
  
  // Track which order is selected
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Track state for "Find More" vs "Close" toggle
  const [showAccountOptions, setShowAccountOptions] = useState(false);

  const currentStatus = status ? status.trim().toLowerCase() : '';
  const isAllowedStatus = ['on contact'].includes(currentStatus);

  // 1. Process images and dynamic dates
  // 2. Select 6 random items every time component renders or workflow triggers
  const orders = useMemo(() => {
    const formatted = ordersData.map((order) => ({
      ...order,
      image: imageMap[order.imageKey] || phone,
      updateItems: order.updateItems
        ? order.updateItems.map((item) => ({
            date: getRelativeDateString(item.offsetDays),
            info: item.info
          }))
        : []
    }));

    // Pick 6 random items from JSON
    return getRandomItems(formatted, 6);
  }, []);

  // Search filtering logic
  const filteredOrders = useMemo(() => {
    if (!finalSearch.trim()) return orders;
    const q = finalSearch.toLowerCase();
    return orders.filter(
      (o) => o.name.toLowerCase().includes(q) || o.status.toLowerCase().includes(q)
    );
  }, [finalSearch, orders]);

  const handleCardClick = (id) => {
    setSelectedOrderId(selectedOrderId === id ? null : id);
  };

  if (isAllowedStatus && workFlow === 4) {
    // Get the currently selected order object if any
    const selectedOrder = filteredOrders.find(o => o.id === selectedOrderId);

    // Row 1 items (First 3 of randomized list)
    const row1Orders = filteredOrders.slice(0, 3);
    // Row 2 items (Next 3 of randomized list)
    const row2Orders = filteredOrders.slice(3, 6);

    const isRow1Selected = row1Orders.some(order => order.id === selectedOrderId);
    const isRow2Selected = row2Orders.some(order => order.id === selectedOrderId);

    return (
      <div className="p-6 flex flex-col w-full gap-6">
        
        {/* ==================== ROW 1 (3 items) ==================== */}
        <div className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {row1Orders.map((order) => {
              const isSelected = selectedOrderId === order.id;

              return (
                <div 
                  key={order.id}
                  onClick={() => handleCardClick(order.id)}
                  className={`flex items-center gap-4 p-10 border shadow-sm cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-200 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'
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

                  {/* Right: Name and Status */}
                  <div className="flex flex-col gap-1">
                    <span className="text-black font-normal text-base line-clamp-2">
                      {order.name}
                    </span>
                    <span className="text-blue-600 font-bold text-sm">
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full-width details box for Row 1 */}
          {isRow1Selected && (
            <ItemCard 
              selectedOrder={selectedOrder} 
              onClose={() => setSelectedOrderId(null)} 
            />
          )}
        </div>

        {/* ==================== ROW 2 (Full-width row or remaining items) ==================== */}
        <div className="flex flex-col gap-4 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {row2Orders.map((order) => {
              const isSelected = selectedOrderId === order.id;

              return (
                <div 
                  key={order.id}
                  onClick={() => handleCardClick(order.id)}
                  className={`flex items-center gap-4 p-10 border shadow-sm cursor-pointer transition-all ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-200 bg-sky-50' : 'border-slate-200 bg-white hover:border-slate-300'
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

                  {/* Right: Name and Status */}
                  <div className="flex flex-col gap-1">
                    <span className="text-black font-normal text-base line-clamp-2">
                      {order.name}
                    </span>
                    <span className="text-blue-600 font-bold text-sm">
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full-width details box for Row 2 */}
          {isRow2Selected && (
            <ItemCard
              selectedOrder={selectedOrder} 
              onClose={() => setSelectedOrderId(null)} 
            />
          )}
        </div>

        {/* ==================== FIND MORE / CLOSE TOGGLE ==================== */}
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex justify-start">
            {!showAccountOptions ? (
              <button
                type="button"
                onClick={() => setShowAccountOptions(true)}
                className="bg-slate-200 hover:bg-slate-300 active:scale-95 text-black font-medium py-2 px-4 rounded-lg transition-all text-sm cursor-pointer"
              >
                Find More
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowAccountOptions(false)}
                className="text-blue-600 hover:text-blue-800 font-bold text-sm transition-colors cursor-pointer py-1"
              >
                Close
              </button>
            )}
          </div>

          {/* Show AccountOptions when toggled */}
          {showAccountOptions && (
            <div className="w-full pt-2">
              <AccountOptions />
            </div>
          )}
        </div>

      </div>
    );
  }

  return null;
}