// src/pages/Contact.jsx (Page Component)
import AmazonButton from '../components/AmazonButton';

export default function Contact() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">تواصل معنا</h1>
      <p className="my-4">أرسل لنا رسالة وسنرد عليك فوراً.</p>

      {/* إعادة استخدام الـ Component الفرعي داخل الصفحة */}
      <AmazonButton text="إرسال الرسالة" />
    </div>
  );
}