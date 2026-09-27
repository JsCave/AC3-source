import { useCall } from '../context/CallContext';
import NoCalls from '../components/NoCalls';
import ActiveCallView from '../components/ActiveCallView';

export default function Home() {
  const { status, lastAction } = useCall();

  // 1. الشرط الأول: حالة Offline أو Available أو Missed
  if (['Offline', 'Available', 'Missed call'].includes(status)) {
    return <NoCalls/>;
  }

  // 2. إذا كان الأكشن هو إنهاء المكالمة
 /* if (lastAction === 'End Call Confirmed') {
    return <AfterCallReport />;
  }*/

  // 3. إذا كانت المكالمة نشطة
  if (status === 'On contact') {
    return <ActiveCallView />;
  }

  // المكون الافتراضي
  return <div></div>;
}