import React from 'react';
import { useCall } from '../context/CallContext';

// استيراد الصور المحلية من جهازك
import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';

export default function NoCalls() {
  const { status, lastAction } = useCall();

  // تنظيف النص وتحويله للحروف الصغيرة لمنع الأخطاء الإملائية والمسافات
  const currentStatus = status ? status.trim().toLowerCase() : '';

  // الشروط المطلوبة لعرص الصفحة: (Offline أو Available أو Missed/Missed call)
  const isAllowedStatus = ['offline', 'available', 'missed', 'missed call'].includes(currentStatus);

  // إذا لم تكن الحالة ضمن الحالات المسموحة (مثل incoming call أو On contact)، لا تعرض المربعات
  if (!isAllowedStatus) {
    return (
      <div className="p-6 text-center text-gray-500 font-bold text-lg">
        {currentStatus === 'incoming call' ? 'مكالمة واردة الآن...' : 'جاري انتظار المكالمات...'}
      </div>
    );
  }

  // مصفوفة البيانات للمربعات الأربعة
  const cards = [
    { id: 1, title: 'Learn And Be Curious ', image: img1 },
    { id: 2, title: 'Ask CS Assistant', image: img2 },
    { id: 3, title: 'Dive Deep ', image: img3 },
    { id: 4, title: ' insist on highest Standard', image: img4 },
  ];

  return (
    <div className="p-6">
      {/* عرض حالة الموظف والحدث الأخير للمتابعة */}
      <div className="mb-4 text-sm text-gray-500">
        الحالة الحالية: <span className="font-bold">{status}</span> | آخر إجراء: <span className="font-bold">{lastAction || 'لا يوجد'}</span>
      </div>

      {/* Grid لـ 3 عناصر بالصف، والعنصر الرابع ينزل للأسفل تلقائياً */}
      <div className="grid grid-cols-3 gap-8">
        {cards.map((card) => (
          <div
            key={card.id}
            /* h-80 يعطي ارتفاعاً كبيراً ومناسباً للمربع (320px) */
            className="flex flex-col items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-md h-80 hover:shadow-lg transition"
          >
            {/* حاوية الصورة تأخذ 75% من المساحة العمودية */}
            <div className="w-full h-[75%] flex items-center justify-center overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* العنوان في المساحة المتبقية (25%) مع محاذاة في المنتصف وبولد */}
            <div className="h-[25%] flex items-center justify-center">
              <span className="font-bold text-gray-800 text-xl text-center">
                {card.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}