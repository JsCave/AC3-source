import { useCall } from '../context/CallContext';
import NoCalls from '../components/NoCalls';
import ActiveCallView from '../components/ActiveCallView';
import AfterWorkView from '../components/AfterWorkView';

export default function Home() {
  const { status, lastAction,workFlow,setWorkFlow } = useCall();
  console.log(status)
  // 1. الشرط الأول: حالة Offline أو Available أو Missed
  if (['Offline', 'Available', 'Missed call'].includes(status)) {
    return <NoCalls/>;
  }

  // 2. إذا كان الأكشن هو إنهاء المكالمة
 if (lastAction === 'End Call Confirmed') {
  setWorkFlow(0)
    //return <AfterCallReport />;
  }

  // 3. إذا كانت المكالمة نشطة
  if (status === 'On contact') {
    return <ActiveCallView />;
  }

  if (status === 'After call work') {
    
    return <AfterWorkView />;
  }

  // المكون الافتراضي
  return <div></div>;
}