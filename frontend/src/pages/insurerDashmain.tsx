import { useState } from 'react';
import { InsurerDashboard } from '../components/general/Dashboards/insurerDashboard/insurerDashBoard';
import { ClaimProcessingFlow } from '../components/general/Dashboards/insurerDashboard/ClaimProcessingFlow';
import { AppealsSystem } from '../components/general/Dashboards/insurerDashboard/AppealSystem';
// import type { ClaimData } from '../components/general/Dashboards/insurerDashboard/types';

const InsurerDashMain = () => {
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'processing' | 'appeals'>('dashboard');


  return (
    <div className="min-h-screen bg-[#F9FAFB] text-white">
      {/* Header */}
      <header className="bg-white shadow-md  px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-400">
            InsuranceSaathi
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-blue-400 font-bold border-2 border-blue-400 text-white'
                  : 'bg-white text-blue-400 font-bold border-2 border-blue-400 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('processing')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === 'processing'
                  ? 'bg-blue-400 font-bold border-2 border-blue-400 text-white'
                  : 'bg-white text-blue-400 font-bold border-2 border-blue-400 hover:bg-gray-100'
              }`}
            >
              Processing Flow
            </button>
            <button
              onClick={() => setActiveView('appeals')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeView === 'appeals'
                  ? 'bg-blue-400 border-2 border-blue-400 text-white'
                  : 'bg-white text-blue-400 font-bold border-2 border-blue-400 hover:bg-gray-100'
              }`}
            >
              Appeals
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {activeView === 'dashboard' && (
          <InsurerDashboard
            onClaimSelect={setSelectedClaim}
            onViewChange={setActiveView}
          />
        )}
        {activeView === 'processing' && (
          <ClaimProcessingFlow
            selectedClaim={selectedClaim}
            onBack={() => setActiveView('dashboard')}
          />
        )}
        {activeView === 'appeals' && (
          <AppealsSystem
            onBack={() => setActiveView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};

export default InsurerDashMain;