import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, FileText, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AuthDividerSignUp({page ='signup'}) {
  const [currentSide, setCurrentSide] = useState<'left' | 'right' | null>(null);
  const navigate = useNavigate();

  const handleClick = (side: 'left' | 'right') => {
    if (side === 'left') {
      navigate('/user-auth'); 
    } else {
      navigate('/insurer-auth');
    }
  };

  return (
    <motion.div className="relative w-full h-screen flex flex-col sm:flex-row overflow-hidden">

      {/* Sliding Overlay */}
      <motion.div
        className="absolute top-0 bottom-0 w-1/2 z-0"
        animate={{
          left: currentSide === 'left' ? 0 : currentSide === 'right' ? '50%' : '0%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          background: 'linear-gradient(to bottom right, #0047AB, #10B981)',
        }}
      />

      {/* Left side - Illustration */}
      <div
        onMouseEnter={() => setCurrentSide('left')}
        onMouseLeave={() => setCurrentSide(null)}
        onClick={()=>handleClick('left')}
        className="flex-1 z-10 h-full relative p-12 text-white flex flex-col justify-center items-center"
      >
        <div className="mb-8 grid grid-cols-3 gap-4">
          {/* Icons */}
          {['Auto', 'Health', 'Life'].map((label, idx) => (
            <div
              key={label}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center"
            >
              <svg className="w-12 h-12 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    idx === 0
                      ? 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                      : idx === 1
                      ? 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                      : 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                  }
                />
              </svg>
              <span className="text-white text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">Your Insurance, Simplified</h2>
        <h1 className="text-4xl font-bold mb-4">{page == 'signup' ? 'Sign up as policy holder' : 'Sign in as policy holder'}</h1>
        <p className="text-blue-100 text-center">Track claims, upload documents, and get instant updates on your policies</p>
      </div>

      {/* Right side - Insurer */}
      <div
        onMouseEnter={() => setCurrentSide('right')}
        onMouseLeave={() => setCurrentSide(null)}
        onClick={()=>handleClick('right')}
        className="flex-1 z-10 h-full relative p-12 text-white flex flex-col justify-center items-center"
      >
        <div className="max-w-sm text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
            <Building2 className="w-20 h-20 text-white mx-auto mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {[Shield, FileText, CheckCircle, Building2].map((Icon, idx) => (
                <div key={idx} className="bg-white/20 rounded-lg p-3 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Secure Insurance Platform</h2>
          <h1 className="text-4xl font-bold mb-4">{page == 'signup' ? 'Sign up as insurer' : 'Sign in as insurer'}</h1>
          <p className="text-blue-100 mb-6">
            Join our network of trusted insurance providers and streamline your operations with AI-powered auditing
          </p>
          <div className="space-y-2 text-center">
            {[
              'Advanced document verification',
              'Real-time claim processing',
              'Regulatory compliance tools',
            ].map((text, idx) => (
              <div key={idx} className="flex justify-center items-center text-blue-100">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
