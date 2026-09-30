import React, { useState, useMemo } from 'react';
import { useCall } from '../context/CallContext';
import { ItemCard } from './ItemCard';
import { AccountOptions } from './AccountOptions'; 
import { User, X, Send } from 'lucide-react';

import ordersData from '../data/orders.json';

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

const getRandomItems = (array, count = 6) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export default function OrdersView() {
  const { status, lastAction, workFlow, setWorkFlow, askLead, setAskLead } = useCall();
  const [searchQuery, setSearchQuery] = useState('');
  const [finalSearch, setFinalSearch] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const currentStatus = status ? status.trim().toLowerCase() : '';
  const isAllowedStatus = ['on contact'].includes(currentStatus);

  const orders = useMemo(() => {
    const formatted = ordersData.map((order) => ({
      ...order,
      image: imageMap[order.image] || phone,
      updateItems: order.updateItems
        ? order.updateItems.map((item) => ({
            date: getRelativeDateString(item.offsetDays),
            info: item.info
          }))
        : []
    }));

    return getRandomItems(formatted, 6);
  }, []);

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
    const selectedOrder = filteredOrders.find(o => o.id === selectedOrderId);

    const row1Orders = filteredOrders.slice(0, 3);
    const row2Orders = filteredOrders.slice(3, 6);

    const isRow1Selected = row1Orders.some(order => order.id === selectedOrderId);
    const isRow2Selected = row2Orders.some(order => order.id === selectedOrderId);

    return (
      <div className="p-6 flex flex-col w-full gap-6 relative">
        
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
                  <div className="w-16 h-16 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                    <img 
                      src={order.image} 
                      alt={order.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

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

          {isRow1Selected && (
            <ItemCard 
              selectedOrder={selectedOrder} 
              onClose={() => setSelectedOrderId(null)} 
            />
          )}
        </div>

        {/* ==================== ROW 2 (3 items) ==================== */}
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
                  <div className="w-16 h-16 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200">
                    <img 
                      src={order.image} 
                      alt={order.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

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

          {showAccountOptions && (
            <div className="w-full pt-2">
              <AccountOptions />
            </div>
          )}
        </div>

        {/* ==================== BOTTOM RIGHT FLOATING CHAT ==================== */}
        {askLead && (
          <div className="fixed bottom-6 right-6 w-80 bg-white border border-slate-200 rounded-lg shadow-xl flex flex-col z-50 overflow-hidden transition-all">
            {/* Header */}
            <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-sm">Ask Lead</span>
              </div>
              <button 
                onClick={() => setAskLead(false)}
                className="text-slate-400 hover:text-white transition-colors p-1"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Content Body */}
            <div className="p-4 h-48 overflow-y-auto bg-slate-50 flex flex-col gap-2 text-sm text-slate-600">
              <div className="bg-white border border-slate-200 p-2.5 rounded-lg max-w-[85%] self-start shadow-2xs">
                Hello! How can I assist you with this lead?
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-2 border-t border-slate-200 bg-white flex items-center gap-2">
              <input 
                type="text"
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 text-sm border border-slate-200 rounded-md px-3 py-1.5 focus:outline-none focus:border-blue-500"
              />
              <button 
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
                aria-label="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  return null;
}