import { createContext, useContext, useState, useEffect } from 'react';

const CallContext = createContext(null);

export function CallProvider({ children }) {
  const [status, setStatus] = useState('Offline');
  const [lastAction, setLastAction] = useState('');
  const [workFlow, setWorkFlow] = useState(0);
  const [askLead, setAskLead] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [isOnHold, setIsOnHold] = useState(false);
  const [showEndCallConfirm, setShowEndCallConfirm] = useState(false);

  // 1. العداد يعمل باستمرار
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. إعادة ضبط الثواني عند تغير الحالة OR تغير وضع الـ Hold
  useEffect(() => {
    setSeconds(0);
  }, [status, isOnHold]); // <--- تم إضافة isOnHold هنا

  // 3. منطق المكالمة الواردة والمفقودة
  useEffect(() => {
    if (status === 'Available' && seconds >= 3) {
      setStatus('Incoming call');
    }

    if (status === 'Incoming call' && seconds >= 20) {
      setStatus('Missed call');
    }
  }, [seconds, status]);

  const formatTime = (totalSeconds) => {
    const safeSeconds = Math.max(0, totalSeconds || 0);
    const mins = Math.floor(safeSeconds / 60).toString().padStart(2, '0');
    const secs = (safeSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const triggerAction = (actionName) => {
    setLastAction(actionName);
  };

  const handleToggleHold = () => {
    setIsOnHold((prev) => !prev);
  };

  const handleConfirmEndCall = () => {
    setShowEndCallConfirm(false);
    setIsOnHold(false);
    setStatus('After call work');
  };

  return (
    <CallContext.Provider
      value={{
        status,
        setStatus,
        lastAction,
        triggerAction,
        seconds,
        setSeconds,
        formatTime,
        isOnHold,
        setIsOnHold,
        handleToggleHold,
        showEndCallConfirm,
        setShowEndCallConfirm,
        handleConfirmEndCall,
        workFlow,
        setWorkFlow,
        askLead,
        setAskLead,
      }}
    >
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}