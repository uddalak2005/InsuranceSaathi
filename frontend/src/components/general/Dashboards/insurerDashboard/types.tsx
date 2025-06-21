// export type ClaimData = {
//     id: string;
//     policyNumber: string;
//     claimantName: string;
//     claimType: string;
//     amount: number;
//     dateSubmitted: string;
//     status: 'new' | 'processing' | 'ai-review' | 'fraud-check' | 'doc-check' | 'approved' | 'rejected' | 'appeal' | 'escalated';
//     priority: 'low' | 'medium' | 'high';
//     aiRiskScore?: number;
//     fraudAlerts?: string[];
//     documentIssues?: string[];
//     rejectionReason?: string;
//     appealReason?: string;
//   }
  
  export type ProcessStage = {
    id: string;
    name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    type: 'automated' | 'manual';
    result?: 'accept' | 'reject' | 'review';
    details?: string;
  }
  