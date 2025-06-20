import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, FileText, AlertTriangle, User } from "lucide-react";

interface Claim {
  id: string;
  type: string;
  status: string;
  amount: number;
  submittedDate: string;
  lastUpdate: string;
}

interface ClaimTrackerProps {
  claims: Claim[];
}

const ClaimTracker = ({ claims }: ClaimTrackerProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "under-review":
        return <Clock className="h-5 w-5 text-amber-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "under-review":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case "submitted":
        return 25;
      case "under-review":
        return 50;
      case "manual-review":
        return 75;
      case "accepted":
      case "rejected":
        return 100;
      default:
        return 0;
    }
  };

  const claimStages = [
    { name: "Submitted", description: "Claim received and initial validation complete" },
    { name: "Document Review", description: "AI analysis of uploaded documents" },
    { name: "Assessment", description: "Claim evaluation and verification" },
    { name: "Decision", description: "Final determination and settlement" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Claims</CardTitle>
          <CardDescription>
            Monitor the progress of your insurance claims in real-time
          </CardDescription>
        </CardHeader>
      </Card>

      {claims.map((claim) => (
        <Card key={claim.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(claim.status)}
                <div>
                  <CardTitle className="text-lg">{claim.id}</CardTitle>
                  <CardDescription>{claim.type} Claim</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(claim.status)}>
                  {claim.status.replace('-', ' ').toUpperCase()}
                </Badge>
                <p className="text-sm text-gray-500 mt-1">
                  Amount: ${claim.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Tracker */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{getProgressValue(claim.status)}% Complete</span>
              </div>
              <Progress value={getProgressValue(claim.status)} className="w-full" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                {claimStages.map((stage, index) => {
                  const isCompleted = getProgressValue(claim.status) > (index * 25);
                  const isCurrent = getProgressValue(claim.status) === ((index + 1) * 25);
                  
                  return (
                    <div key={index} className={`p-3 rounded-lg border ${
                      isCompleted ? 'bg-green-50 border-green-200' :
                      isCurrent ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : isCurrent ? (
                          <Clock className="h-4 w-4 text-blue-600" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                        )}
                        <span className={`text-sm font-medium ${
                          isCompleted ? 'text-green-800' :
                          isCurrent ? 'text-blue-800' :
                          'text-gray-600'
                        }`}>
                          {stage.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{stage.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Claim Updates Feed */}
            <div className="space-y-3">
              <h4 className="font-medium">Recent Updates</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{claim.lastUpdate}</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Documents uploaded and verified</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Claim submitted successfully</p>
                    <p className="text-xs text-gray-500">{claim.submittedDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Intervention Notice */}
            {claim.status === "under-review" && (
              <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <User className="h-5 w-5 text-amber-600 mr-3" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-800">
                    Manual Review Required
                  </p>
                  <p className="text-xs text-amber-700">
                    Your claim requires additional review by our specialists. 
                    Expected completion: 2-3 business days.
                  </p>
                </div>
                <Badge className="bg-amber-100 text-amber-800">N</Badge>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              <div className="text-sm text-gray-500">
                Submitted: {claim.submittedDate}
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClaimTracker;