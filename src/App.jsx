import { useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Navbar from './components/NavBar';
import { CallProvider } from './context/CallContext';
export default function App() {
  // حالة تمثل هل المستخدم مسجل دخوله أم لا (يمكن جلبها من API أو LocalStorage)
  const [isAvail, setIsAvail] = useState(true);
  const [userName, setUserName] = useState('أحمد');

  return (
    <CallProvider>
    <HashRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        
<Navbar />

        {/* محتوى الصفحات */}
        <div className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
    </CallProvider>
  );
}