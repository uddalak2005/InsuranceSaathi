import React, { useState } from 'react';
import { ArrowLeft, Bot, FileCheck, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { AIRiskEvaluation } from './AiRiskEval';
import { FraudDetection } from './FraudDetection';
import { DocumentCheck } from './DocumentCheck';
import { DecisionArea } from './DecisionArea';

interface ClaimProcessingFlowProps {
  selectedClaim : any;
  onBack: () => void;
}

export const ClaimProcessingFlow: React.FC<ClaimProcessingFlowProps> = ({
  selectedClaim,
  onBack,
}) => {
  const [currentStage, setCurrentStage] = useState<string>('initial');
  // const [processStages, setProcessStages] = useState<ProcessStage[]>([
  //   { id: 'ai-risk', name: 'AI Risk Evaluation', status: 'pending', type: 'automated' },
  //   { id: 'fraud-detection', name: 'Fraud Detection', status: 'pending', type: 'automated' },
  //   { id: 'document-check', name: 'Document Check', status: 'pending', type: 'manual' },
  //   { id: 'decision', name: 'Decision Area', status: 'pending', type: 'manual' },
  // ]);

    const processStages = [
      { id: 'ai-risk', name: 'AI Risk Evaluation', status: 'pending', type: 'automated' },
      { id: 'fraud-detection', name: 'Fraud Detection', status: 'pending', type: 'automated' },
      { id: 'document-check', name: 'Document Check', status: 'pending', type: 'manual' },
      { id: 'decision', name: 'Decision Area', status: 'pending', type: 'manual' },
    ]

  // const mockClaim = selectedClaim;

  // const getRandomAmount = () => {
  //   return Math.floor(Math.random()*(10000 - 5000))+5000;
  // }

  const getRandomPriority = () => {
    const random = Math.random();
    if (random < 0.33) return "medium";
    if (random < 0.66) return "high";
    return "low";
  }



  const getStageIcon = (type: string, status: string) => {
    if (status === 'completed') return <CheckCircle className="h-6 w-6 text-green-400" />;
    if (status === 'failed') return <XCircle className="h-6 w-6 text-red-400" />;
    if (status === 'processing') return <div className="h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />;
    
    switch (type) {
      case 'automated': return <Bot className="h-6 w-6 text-purple-400" />;
      case 'manual': return <FileCheck className="h-6 w-6 text-blue-400" />;
      default: return <AlertTriangle className="h-6 w-6 text-yellow-400" />;
    }
  };

  const getStageStatus = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'processing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
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
      <h2 className="text-xl font-semibold text-black">
        Processing Flow - {"CLM - 001"}
      </h2>
    </div>
  </div>

  {/* Claim Summary */}
  <div className="bg-white border border-gray-300 p-6 rounded-lg">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <p className="text-sm text-gray-400">Claimant</p>
        <p className="font-semibold text-black">{selectedClaim.insuranceDetails.ownerName || selectedClaim.insuranceDetails.policyHolderName }</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Type</p>
        <p className="font-semibold text-black">{selectedClaim.claim.policyType}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Amount</p>
        <p className="font-semibold text-black">${'####'}</p>
      </div>
      <div>
        <p className="text-sm text-gray-400">Priority</p>
        <p className={`font-semibold ${
          getRandomPriority() === 'high' ? 'text-red-400' :
          getRandomPriority() === 'medium' ? 'text-yellow-400' : 'text-green-400'
        }`}>
          {getRandomPriority().toUpperCase()}
        </p>
      </div>
    </div>
  </div>

  {/* Processing Flow */}
  <div className="bg-white shadow-sm rounded-lg">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700">Processing Stages</h3>
    </div>
    <div className="p-6">

      {/* Flow Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-0">
        {processStages.map((stage, index) => (
          <div key={stage.id} className="flex flex-col items-center relative">
            <div
              className={`w-full p-4 rounded-lg border-2 transition-all cursor-pointer ${
                currentStage === stage.id
                  ? 'border-blue-500 bg-gray-200'
                  : 'border-gray-200 bg-white hover:border-gray-200'
              }`}
              onClick={() => setCurrentStage(stage.id)}
            >
              <div className="flex items-center justify-between mb-2">
                {getStageIcon(stage.type, stage.status)}
                <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStageStatus(stage.status)}`}>
                  {stage.status.toUpperCase()}
                </span>
              </div>
              <h4 className="font-medium text-black text-sm">{stage.name}</h4>
              <p className="text-xs text-gray-400 mt-1">
                {stage.type === 'automated' ? 'AI Process' : 'Manual Review'}
              </p>
            </div>

            {/* Connector between stages (only on xl and up) */}
            {index < processStages.length - 1 && (
              <div className="hidden xl:flex w-full justify-center items-center mt-2">
                <div className="w-3/4 h-0.5 bg-gray-300 relative">
                  <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detailed Stage View */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 mt-6">
        {currentStage === 'ai-risk' && <AIRiskEvaluation/>}
        {currentStage === 'fraud-detection' && <FraudDetection/>}
        {currentStage === 'document-check' && <DocumentCheck/>}
        {currentStage === 'decision' && <DecisionArea claim={selectedClaim} />}
        {currentStage === 'initial' && (
          <div className="text-center py-8">
            <Bot className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">
              Ready to Process Claim
            </h3>
            <p className="text-gray-400">
              Select a processing stage to view details and take action.
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

  );
};