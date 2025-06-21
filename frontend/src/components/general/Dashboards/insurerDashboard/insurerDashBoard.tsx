import React, { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
// import type { ClaimData } from './types';
import { useEffect } from 'react';

interface InsurerDashboardProps {
  onClaimSelect: (claim : any) => void;
  onViewChange: (view: 'dashboard' | 'processing' | 'appeals') => void;
}

export const InsurerDashboard: React.FC<InsurerDashboardProps> = ({
  onClaimSelect,
  onViewChange,
}) => {

  const [ClaimsData,setClaimsData] = useState([]);

   useEffect(() => {
      const fetchClaimHistory = async() => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}claim/getAllClaims`, {
          method : 'GET',
          headers : {
            'token' : localStorage.getItem("JWT")
          }
        });
        if(response.ok){
        const data = await response.json();
        setClaimsData(data.data);
        console.log("Claims fetched");
        console.log(data.data);
        }
        else{
          console.log("Response error : ", response.status);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchClaimHistory();
    
    }, [])

    const getRandomPriority = () => {
      const random = Math.random();
      if (random < 0.33) return "medium";
      if (random < 0.66) return "high";
      return "low";
    }

    // const getrandomScore = () => {
    //   const random = Math.random();
    //   if(random<0.50) return Math.floor(Math.random() * (55 - 11 + 1)) + 11;
    //   if(random>0.50) return Math.floor(Math.random() * (99 - 55 + 1)) + 55;

    // }
    
  // const mockClaims: ClaimData[] = [
  //   {
  //     id: 'CLM-001',
  //     policyNumber: 'POL-12345',
  //     claimantName: 'John Smith',
  //     claimType: 'Auto Accident',
  //     amount: 15000,
  //     dateSubmitted: '2024-06-15',
  //     status: 'new',
  //     priority: 'high',
  //   },
  //   {
  //     id: 'CLM-002',
  //     policyNumber: 'POL-67890',
  //     claimantName: 'Sarah Johnson',
  //     claimType: 'Property Damage',
  //     amount: 8500,
  //     dateSubmitted: '2024-06-14',
  //     status: 'processing',
  //     priority: 'medium',
  //   },
  //   {
  //     id: 'CLM-003',
  //     policyNumber: 'POL-11111',
  //     claimantName: 'Mike Davis',
  //     claimType: 'Medical',
  //     amount: 25000,
  //     dateSubmitted: '2024-06-13',
  //     status: 'ai-review',
  //     priority: 'high',
  //     aiRiskScore: 0.75,
  //   },
  // ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Instantiated":
        return "bg-blue-300 text-blue-800 border-blue-200";
      case "UnderReview":
        return "bg-yellow-300 text-yellow-800 border-yellow-200";
      case "Submitted":
        return "bg-gray-300 text-gray-800 border-gray-200";
      case "Escalated":
        return "bg-purple-300 text-purple-800 border-purple-200";
      case "Settled":
        return "bg-green-300 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-300 text-red-800 border-red-200";
      default:
        return "bg-slate-300 text-slate-800 border-slate-200";
    }
  };


  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">New Claims</p>
              <p className="text-2xl font-bold text-blue-400">{ClaimsData.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">In Processing</p>
              <p className="text-2xl font-bold text-yellow-400">{ClaimsData.filter((item) => item.claim.status === "Submitted").length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Approved Today</p>
              <p className="text-2xl font-bold text-green-400">{ClaimsData.filter((item)=> item.claim.status === "Accepted").length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Flagged</p>
              <p className="text-2xl font-bold text-red-400">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-400">Recent Claims</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {ClaimsData.map((claim, index) => (
              <div
                key={`CLM - 00${index+1}`}
                className="bg-white shadow-sm text-base p-4 rounded-lg border hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => {
                  onClaimSelect(claim);
                  onViewChange('processing');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-500">{`CLM - 00${index+1}`}</span>
                      <span className="text-sm text-gray-400">{claim.insuranceDetails.ownerName ? claim.insuranceDetails.ownerName : claim.insuranceDetails.policyHolderName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-300">{claim.claim.policyType}</span>
                      <span className="text-sm text-gray-400">${6500 + 2000*(index+1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${getPriorityColor(getRandomPriority())}`}>
                      {`${getRandomPriority().toUpperCase()} PRIORITY`}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(claim.claim.status)}`}>
                      {claim.claim.status.toUpperCase()}
                    </span>
                    {claim.aiRiskScore && (
                      <span className="text-sm text-purple-400">
                        Risk: {(claim.aiRiskScore * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onViewChange('processing')}
          className="bg-blue-600 hover:bg-blue-700 p-6 rounded-lg transition-colors text-left"
        >
          <TrendingUp className="h-8 w-8 text-white mb-2" />
          <h3 className="text-lg font-semibold text-white">View Processing Flow</h3>
          <p className="text-blue-200">Monitor claim processing stages</p>
        </button>
        
        <button
          onClick={() => onViewChange('appeals')}
          className="bg-orange-600 hover:bg-orange-700 p-6 rounded-lg transition-colors text-left"
        >
          <AlertTriangle className="h-8 w-8 text-white mb-2" />
          <h3 className="text-lg font-semibold text-white">Appeals System</h3>
          <p className="text-orange-200">Handle claim appeals and escalations</p>
        </button>
        
        <div className="bg-green-400 shadow-sm p-6 rounded-lg hover:bg-green-600">
          <CheckCircle className="h-8 w-8 text-green-800 mb-2" />
          <h3 className="text-lg font-semibold text-gray-100">AI Performance</h3>
          <p className="text-gray-100">94.2% accuracy this week</p>
        </div>
      </div>
    </div>
  );
};