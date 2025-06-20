import React, { useState } from 'react';
import { ArrowLeft, Scale, FileText, CheckCircle, XCircle, AlertTriangle, Gavel } from 'lucide-react';

interface AppealsSystemProps {
  onBack: () => void;
}

export const AppealsSystem: React.FC<AppealsSystemProps> = ({ onBack }) => {
  const [selectedAppeal, setSelectedAppeal] = useState<any>(null);

  const mockAppeals = [
    {
      id: 'APP-001',
      originalClaimId: 'CLM-005',
      claimantName: 'Robert Wilson',
      claimType: 'Auto Accident',
      originalAmount: 22000,
      appealDate: '2024-06-12',
      status: 'under-review',
      appealReason: 'Disagree with damage assessment',
      priority: 'high',
      daysRemaining: 12
    },
    {
      id: 'APP-002',
      originalClaimId: 'CLM-008',
      claimantName: 'Lisa Chen',
      claimType: 'Property Damage',
      originalAmount: 18500,
      appealDate: '2024-06-10',
      status: 'pending',
      appealReason: 'New evidence provided',
      priority: 'medium',
      daysRemaining: 18
    },
    {
      id: 'APP-003',
      originalClaimId: 'CLM-012',
      claimantName: 'Marcus Johnson',
      claimType: 'Medical',
      originalAmount: 35000,
      appealDate: '2024-06-08',
      status: 'escalated',
      appealReason: 'Policy interpretation dispute',
      priority: 'high',
      daysRemaining: 5
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'under-review': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'escalated': return 'bg-purple-500';
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

  const handleAppealDecision = (appealId: string, decision: 'accept' | 'reject' | 'escalate') => {
    console.log(`Appeal ${appealId} decision: ${decision}`);
    // Update appeal status
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="h-6 w-px bg-gray-600" />
          <div className="flex items-center space-x-3">
            <Scale className="h-8 w-8 text-orange-400" />
            <h2 className="text-xl font-semibold text-black">Appeals System</h2>
          </div>
        </div>
      </div>

      {/* Appeals Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-400">
          <div className="flex items-center">
            <Scale className="h-8 w-8 text-blue-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Active Appeals</p>
              <p className="text-2xl font-bold text-blue-400">12</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-400">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-purple-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Escalated</p>
              <p className="text-2xl font-bold text-purple-400">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-400">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Resolved This Week</p>
              <p className="text-2xl font-bold text-green-400">8</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-400">
          <div className="flex items-center">
            <Gavel className="h-8 w-8 text-orange-400" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">Legal Review</p>
              <p className="text-2xl font-bold text-orange-400">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appeals List */}
      <div className="bg-white rounded-lg border border-gray-400">
        <div className="px-6 py-4 border-b border-gray-400">
          <h3 className="text-lg font-semibold text-black">Pending Appeals</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {mockAppeals.map((appeal) => (
              <div
                key={appeal.id}
                className="bg-gray-100 p-4 rounded-lg border border-gray-500 hover:border-orange-500 transition-colors cursor-pointer"
                onClick={() => setSelectedAppeal(appeal)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-black">{appeal.id}</span>
                      <span className="text-sm text-gray-800">Original: {appeal.originalClaimId}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">{appeal.claimantName}</span>
                      <span className="text-sm text-gray-800">{appeal.claimType}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">${appeal.originalAmount.toLocaleString()}</span>
                      <span className="text-sm text-gray-800">Appeal Date: {appeal.appealDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getPriorityColor(appeal.priority)}`}>
                        {appeal.priority.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-800">
                        {appeal.daysRemaining} days left
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-black ${getStatusColor(appeal.status)}`}>
                      {appeal.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    <strong>Reason:</strong> {appeal.appealReason}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Appeal Details */}
{selectedAppeal && (
  <div className="bg-white rounded-lg border border-gray-300">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          Appeal Details - {selectedAppeal.id}
        </h3>
        <button
          onClick={() => setSelectedAppeal(null)}
          className="text-gray-500 hover:text-black transition-colors"
        >
          <XCircle className="h-6 w-6" />
        </button>
      </div>
    </div>
    <div className="p-6 space-y-6">
      {/* Appeal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Appeal Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Appeal ID:</span>
              <span className="text-gray-800">{selectedAppeal.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Original Claim:</span>
              <span className="text-gray-800">{selectedAppeal.originalClaimId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Appeal Date:</span>
              <span className="text-gray-800">{selectedAppeal.appealDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Days Remaining:</span>
              <span className={`${selectedAppeal.daysRemaining <= 7 ? 'text-red-600' : 'text-gray-800'}`}>
                {selectedAppeal.daysRemaining}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Claimant Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="text-gray-800">{selectedAppeal.claimantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Claim Type:</span>
              <span className="text-gray-800">{selectedAppeal.claimType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Amount:</span>
              <span className="text-gray-800">${selectedAppeal.originalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Priority:</span>
              <span className={getPriorityColor(selectedAppeal.priority)}>
                {selectedAppeal.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Appeal Reason */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Appeal Reason</h4>
        <p className="text-gray-600">{selectedAppeal.appealReason}</p>
      </div>

      {/* Documents Recheck */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Document Recheck Status
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">New Evidence Review</span>
            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">In Progress</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Policy Verification</span>
            <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">Completed</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Legal Review</span>
            <span className="px-2 py-1 bg-yellow-400 text-black text-xs rounded">Pending</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => handleAppealDecision(selectedAppeal.id, 'accept')}
          className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg text-white font-medium transition-colors"
        >
          Accept Appeal
        </button>
        <button
          onClick={() => handleAppealDecision(selectedAppeal.id, 'reject')}
          className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg text-white font-medium transition-colors"
        >
          Reject Appeal
        </button>
        <button
          onClick={() => handleAppealDecision(selectedAppeal.id, 'escalate')}
          className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-lg text-white font-medium transition-colors"
        >
          Escalate to Legal
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};