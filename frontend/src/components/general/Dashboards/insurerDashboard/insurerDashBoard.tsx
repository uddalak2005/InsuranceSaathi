import React from 'react';
import { FileText, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import type { ClaimData } from './types';

interface InsurerDashboardProps {
  onClaimSelect: (claim: ClaimData) => void;
  onViewChange: (view: 'dashboard' | 'processing' | 'appeals') => void;
}

export const InsurerDashboard: React.FC<InsurerDashboardProps> = ({
  onClaimSelect,
  onViewChange,
}) => {
  const mockClaims: ClaimData[] = [
    {
      id: 'CLM-001',
      policyNumber: 'POL-12345',
      claimantName: 'John Smith',
      claimType: 'Auto Accident',
      amount: 15000,
      dateSubmitted: '2024-06-15',
      status: 'new',
      priority: 'high',
    },
    {
      id: 'CLM-002',
      policyNumber: 'POL-67890',
      claimantName: 'Sarah Johnson',
      claimType: 'Property Damage',
      amount: 8500,
      dateSubmitted: '2024-06-14',
      status: 'processing',
      priority: 'medium',
    },
    {
      id: 'CLM-003',
      policyNumber: 'POL-11111',
      claimantName: 'Mike Davis',
      claimType: 'Medical',
      amount: 25000,
      dateSubmitted: '2024-06-13',
      status: 'ai-review',
      priority: 'high',
      aiRiskScore: 0.75,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'ai-review': return 'bg-purple-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'appeal': return 'bg-orange-500';
      default: return 'bg-gray-500';
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
              <p className="text-2xl font-bold text-blue-400">24</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">In Processing</p>
              <p className="text-2xl font-bold text-yellow-400">18</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md p-6 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Approved Today</p>
              <p className="text-2xl font-bold text-green-400">12</p>
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
            {mockClaims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white shadow-sm p-4 rounded-lg border hover:border-blue-500 transition-colors cursor-pointer"
                onClick={() => {
                  onClaimSelect(claim);
                  onViewChange('processing');
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-500">{claim.id}</span>
                      <span className="text-sm text-gray-400">{claim.claimantName}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-300">{claim.claimType}</span>
                      <span className="text-sm text-gray-400">${claim.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-medium ${getPriorityColor(claim.priority)}`}>
                      {claim.priority.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(claim.status)}`}>
                      {claim.status.replace('-', ' ').toUpperCase()}
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