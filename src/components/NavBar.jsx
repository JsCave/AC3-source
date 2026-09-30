import React, { useState, useEffect, useRef } from 'react';
import { Play, Clock, ChevronDown, ChevronRight, LogOut, RefreshCw, PhoneIncoming, Mail, PhoneOff, Grid3x3, Pause, ArrowRight } from 'lucide-react';
import { useCall } from '../context/CallContext';

export default function Navbar() {
  const { 
    status, 
    showEndCallConfirm, 
    setShowEndCallConfirm, 
    handleConfirmEndCall,
    triggerAction ,
  } = useCall();

  const currentStatus = status ? status.trim().toLowerCase() : '';

  const isIncomingCall = currentStatus === 'incoming call';
  const isOnContact = currentStatus === 'on contact';
  const isAfterCallWork = currentStatus === 'after call work';

  // 1. After call work status
  if (isAfterCallWork) {
    return <AfterCallWorkNavbar />;
  }

  // 2. Active call status (On contact)
  if (isOnContact) {
    return (
      <div className="relative z-50">
        <OnContactNavbar 
          onInitiateEndCall={() => {
            triggerAction('Initiate End Call');
            setShowEndCallConfirm(true);
          }}
        />

        {/* End call confirmation banner */}
        {showEndCallConfirm && (
          <div className="bg-slate-800 text-white px-6 py-2 shadow-md border-t border-slate-700 flex items-center justify-between animate-in slide-in-from-top duration-200">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-medium text-slate-300">Confirm ending active call?</span>
              <button
                onClick={() => {
                  triggerAction('End Call Confirmed');
                  handleConfirmEndCall();
                }}
                className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs px-4 py-1.5 rounded shadow transition active:scale-95 flex items-center gap-1.5"
              >
                <span>End call</span>
              </button>
            </div>
            <button 
              onClick={() => {
                triggerAction('Cancel End Call');
                setShowEndCallConfirm(false);
              }}
              className="text-xs text-slate-400 hover:text-white underline transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }

  // 3. Incoming call status
  if (isIncomingCall) {
    return <IncomingCallNavbar />;
  }

  // 4. Default status
  return <DefaultNavbar />;
}

/* ==========================================
   1. Default Navbar
   ========================================== */
function DefaultNavbar() {
  const { seconds, formatTime, status, setStatus, triggerAction } = useCall();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const startRef = useRef(null);
  const statusRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (startRef.current && !startRef.current.contains(event.target)) setIsStartOpen(false);
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
        setIsSubMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="px-6 py-2 shadow-md sticky top-0 z-50 flex justify-between items-center bg-slate-900 border-b border-slate-800 text-white transition-all duration-300">
      <div className="relative flex items-center space-x-3" ref={statusRef}>
        <div className="flex items-center space-x-3 px-3 py-1 rounded-lg border border-slate-800/80 bg-slate-900/50">
          <Clock className="w-5 h-5 text-white" />
          <div className="flex flex-col text-left">
            <button 
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="text-xs text-white font-medium flex items-center gap-1.5 hover:text-gray-300 transition focus:outline-none"
            >
              <span>Status:</span>
              <span className="text-white font-bold flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  status === 'Available' ? 'bg-emerald-500' : (status === 'Missed call' || status === 'Missed') ? 'bg-red-500 animate-ping' : 'bg-red-500'
                }`}></span>
                {status}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStatusOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className="text-sm font-mono font-bold text-gray-300 tracking-wider">
              {formatTime ? formatTime(seconds) : '00:00'}
            </div>
          </div>

          {isStatusOpen && (
            <div className="absolute left-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-xl py-1 z-50 text-white">
              <div className="relative" onMouseEnter={() => setIsSubMenuOpen(true)} onMouseLeave={() => setIsSubMenuOpen(false)}>
                <button 
                  onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                  className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center justify-between transition"
                >
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-amber-400" />
                    <span>Change status</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {isSubMenuOpen && (
                  <div className="absolute left-full top-0 w-40 bg-slate-800 border border-slate-700 rounded-md shadow-2xl py-1 z-50">
                    <button 
                      onClick={() => { 
                        setStatus('Available'); 
                        triggerAction('Status Change: Available');
                        setIsStatusOpen(false); 
                      }} 
                      className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center space-x-2 transition"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                      <span className="font-semibold">Available</span>
                    </button>
                    <button 
                      onClick={() => { 
                        setStatus('Offline'); 
                        triggerAction('Status Change: Offline');
                        setIsStatusOpen(false); 
                      }} 
                      className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-red-600 hover:text-white flex items-center space-x-2 transition"
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                      <span className="font-semibold">Offline</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-700 my-1"></div>
              <button 
                onClick={() => { 
                  triggerAction('Logout');
                  alert('Logged out'); 
                  setIsStatusOpen(false); 
                }} 
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white flex items-center space-x-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative" ref={startRef}>
        <button onClick={() => setIsStartOpen(!isStartOpen)} className="flex flex-col items-center group focus:outline-none text-white">
          <div className="w-8 h-8 bg-emerald-500 group-hover:bg-emerald-600 rounded-full flex items-center justify-center shadow-md transition duration-200">
            <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
          </div>
          <div className="flex items-center space-x-1 mt-0.5 group-hover:text-emerald-500 transition">
            <span className="text-xs font-semibold tracking-wide">Start working</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStartOpen ? 'rotate-180 text-emerald-500' : ''}`} />
          </div>
        </button>

        {isStartOpen && (
          <div className="absolute right-0 mt-2 min-w-max bg-slate-800 border border-slate-700 rounded-md shadow-xl py-1 z-50 text-white">
            <button 
              onClick={() => { 
                setStatus('Available'); 
                triggerAction('Accept New Contact');
                setIsStartOpen(false); 
              }} 
              className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-emerald-600 hover:text-white flex items-center space-x-2 transition whitespace-nowrap"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
              <span>Accept a new contact</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ==========================================
   2. Incoming Call Navbar
   ========================================== */
function IncomingCallNavbar() {
  const { seconds, formatTime, setStatus, triggerAction } = useCall();

  return (
    <nav className="px-6 py-2 shadow-sm sticky top-0 z-50 flex justify-between items-center bg-slate-100 border-b border-slate-200 text-slate-800 transition-all duration-300">
      <div className="flex flex-col text-left">
        <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">Incoming call</span>
        <div className="text-sm font-mono font-bold text-slate-900 tracking-wider">
          {formatTime ? formatTime(seconds) : '00:00'}
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
        <button 
          onClick={() => {
            triggerAction('Accept Call');
            setStatus('On contact');
          }} 
          className="flex flex-col items-center group focus:outline-none"
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-emerald-500 opacity-75 animate-ping"></div>
            <div className="relative w-10 h-10 bg-emerald-500 group-hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-transform active:scale-95">
              <PhoneIncoming className="w-5 h-5 animate-bounce" />
            </div>
          </div>
          <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition mt-1 tracking-wide">
            Accept call
          </span>
        </button>
      </div>

      <div className="flex flex-col items-center opacity-80">
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
          <Play className="w-4 h-4 text-white fill-white translate-x-0.5" />
        </div>
        <span className="text-xs font-semibold text-slate-800 mt-0.5 tracking-wide">Start working</span>
      </div>
    </nav>
  );
}

/* ==========================================
   3. On Contact Navbar
   ========================================== */
function OnContactNavbar({ onInitiateEndCall }) {
  const { seconds, formatTime, isOnHold, handleToggleHold, triggerAction,setAskLead } = useCall();
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const resourcesRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setIsResourcesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showPinkHoldBadge = isOnHold && seconds >= 120;

  return (
    <nav className="sticky top-0 z-50 flex h-16 shadow-sm border-b border-slate-200">
      {/* Left: 20% Dark Blue */}
      <div className="w-1/5 bg-slate-900 border-r border-slate-800 flex items-center px-5 text-white shrink-0">
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-white shrink-0" />
          <div className="flex flex-col text-left">
            <div className="text-xs text-white font-medium flex items-center gap-1.5">
              <span>Status:</span>
              <span className="text-white font-bold flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="whitespace-nowrap">On contact</span>

                {showPinkHoldBadge && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-pink-700 bg-pink-100 border border-pink-300 rounded-full animate-bounce">
                    Hold
                  </span>
                )}
              </span>
            </div>
            <div className="text-sm font-mono font-bold text-gray-300 tracking-wider">
              {formatTime ? formatTime(seconds) : '00:00'}
            </div>
          </div>
        </div>
      </div>

      {/* Right: 80% Light Grey */}
      <div className="w-4/5 bg-slate-100 flex items-center justify-between px-6 relative">
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-7">
          {/* Email Button */}
          <button 
            onClick={() => {
              triggerAction('Email');
              alert('Email action');
            }} 
            className="flex flex-col items-center group focus:outline-none" 
            title="Send Email"
          >
            <div className="w-10 h-10 bg-slate-600 group-hover:bg-slate-700 border border-slate-500 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-95">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition mt-1">Email</span>
          </button>

          {/* Hold / Resume Button */}
          <button 
            onClick={() => {
              triggerAction(isOnHold ? 'Resume' : 'Hold');
              handleToggleHold();
            }} 
            className="flex flex-col items-center group focus:outline-none" 
            title={isOnHold ? "Resume Call" : "Put on Hold"}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-95 ${
              isOnHold ? 'bg-emerald-600 group-hover:bg-emerald-700 text-white' : 'bg-slate-600 group-hover:bg-slate-700 border border-slate-500 text-white'
            }`}>
              {isOnHold ? <Play className="w-5 h-5 text-white fill-white translate-x-0.5" /> : <Pause className="w-5 h-5 text-white fill-white" />}
            </div>
            <span className={`text-xs font-medium transition mt-1 ${isOnHold ? 'text-emerald-700 font-bold' : 'text-slate-700 group-hover:text-slate-900'}`}>
              {isOnHold ? 'Resume' : 'Hold'}
            </span>
          </button>

          {/* Transfer Button */}
          <button 
            onClick={() => {
              triggerAction('Transfer');
              alert('Transfer call action');
            }} 
            className="flex flex-col items-center group focus:outline-none" 
            title="Transfer Call"
          >
            <div className="w-10 h-10 bg-slate-600 group-hover:bg-slate-700 border border-slate-500 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-95">
              <ArrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-0.5" />
            </div>
            <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition mt-1">Transfer</span>
          </button>

          {/* End Call Button */}
          <button 
            onClick={onInitiateEndCall} 
            className="flex flex-col items-center group focus:outline-none" 
            title="End Call"
          >
            <div className="w-10 h-10 bg-red-600 group-hover:bg-red-700 rounded-full flex items-center justify-center shadow-md shadow-red-600/30 transition-all active:scale-95">
              <PhoneOff className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-medium text-red-600 group-hover:text-red-700 transition mt-1">End call</span>
          </button>
        </div>

        {/* Resources Dropdown */}
        <div className="relative ml-auto" ref={resourcesRef}>
          <button onClick={() => setIsResourcesOpen(!isResourcesOpen)} className="flex flex-col items-center group focus:outline-none" title="Resources">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-95 ${
              isResourcesOpen ? 'bg-slate-700 text-white' : 'bg-slate-600 group-hover:bg-slate-700 border border-slate-500 text-white'
            }`}>
              <Grid3x3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 transition mt-0.5 tracking-wide">Resources</span>
          </button>

          {isResourcesOpen && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="absolute -top-1.5 right-3.5 w-3 h-3 bg-white border-t border-l border-slate-200 rotate-45"></div>
              <div className="relative z-10 flex flex-col gap-3">
                {/* Top Row: Create follow-up & Create ticket */}
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2">
                  <a 
                    href="#create-follow-up" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      triggerAction('Create Follow-up');
                      alert('Create follow-up clicked'); 
                      setIsResourcesOpen(false); 
                    }} 
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1"
                  >
                    <span>Create follow-up</span>
                  </a>
                  <a 
                    href="#create-ticket" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      triggerAction('Create Ticket');
                      alert('Create ticket clicked'); 
                      setIsResourcesOpen(false); 
                    }} 
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1"
                  >
                    <span>Create ticket</span>
                  </a>
                </div>

                {/* Bottom Row: Ask & Report abuse */}
                <div className="pt-0.5 flex items-center justify-between gap-4">
                  <a 
                    href="#ask" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      setAskLead(true)
                      setIsResourcesOpen(false); 
                    }} 
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1"
                  >
                    <span>Ask Lead</span>
                  </a>
                  <a 
                    href="#report-abuse" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      triggerAction('Report Abuse');
                      alert('Report abuse clicked'); 
                      setIsResourcesOpen(false); 
                    }} 
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors flex items-center gap-1"
                  >
                    <span>Report abuse</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ==========================================
   4. After Call Work Navbar
   ========================================== */
function AfterCallWorkNavbar() {
  const { seconds, formatTime, setStatus, triggerAction } = useCall();

  return (
    <nav className="px-6 py-2 shadow-md sticky top-0 z-50 flex justify-between items-center bg-slate-900 border-b border-slate-800 text-white transition-all duration-300">
      <div className="flex items-center space-x-3 px-3 py-1 rounded-lg border border-slate-800/80 bg-slate-900/50">
        <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
        <div className="flex flex-col text-left">
          <div className="text-xs text-white font-medium flex items-center gap-1.5">
            <span>Status:</span>
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              After call work
            </span>
          </div>
          <div className="text-sm font-mono font-bold text-amber-300 tracking-wider">
            {formatTime ? formatTime(seconds) : '00:00'}
          </div>
        </div>
      </div>

      <button 
        onClick={() => {
          triggerAction('Finish ACW Early');
          setStatus('Available');
        }}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow transition active:scale-95 flex items-center gap-1.5"
      >
        <span>Finish & Go Available</span>
      </button>
    </nav>
  );
}