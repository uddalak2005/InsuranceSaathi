import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, FileText, AlertTriangle, User } from "lucide-react";
import { useEffect, useState } from "react";
import axios from 'axios'
import {
  ScanLine,
  Workflow,
  ArrowBigUpDash,
} from "lucide-react";

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

  const [ClaimsData, setClaimsData] = useState([]);

  //Claim History fetch
  useEffect(() => {
    const fetchClaimHistory = async() => {
    try {
      const response = await fetch("http://192.168.128.12:3000/claim/getAllClaims", {
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



  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted":
        return <FileText className="h-5 w-5 text-gray-600" />;
  
      case "UnderReview":
        return <ScanLine className="h-5 w-5 text-amber-500" />;
  
      case "Instantiated":
        return <Workflow className="h-5 w-5 text-blue-500" />;
  
      case "Settled":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
  
      case "Rejected":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
  
      case "Escalated":
        return <ArrowBigUpDash className="h-5 w-5 text-purple-600" />;
  
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Instantiated":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "UnderReview":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Submitted":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "Escalated":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Settled":
        return "bg-green-100 text-green-800 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getProgressValue = (status: string) => {
    switch (status) {
      case "Instantiated":
        return 10;
      case "UnderReview":
        return 30;
      case "Submitted":
        return 50;
      case "Escalated":
        return 75;
      case "Settled":
      case "Rejected":
        return 100;
      default:
        return 0;
    }
  };

  const handleSubmit = async(id: string) => {
    const updated = ClaimsData.map((item) => {
      if (item.claim.insurerIrdai === id) {
        return {
          ...item,
          claim: {
            ...item.claim,
            status: "Submitted",
          },
        };
      }
      return item;
    });
  
    setClaimsData(updated);
    var uid : any;
    for(var j=0;j<ClaimsData.length;j++){
      if(ClaimsData[j].claim.insurerIrdai === id){
        uid = ClaimsData[j].claim._id;
        console.log(uid);
      }
    }
    const res = await fetch(`http://192.168.128.12:3000/claim/submit/${uid}`, {
      method : 'POST',
      headers : {
        'token' : localStorage.getItem("JWT")
      }
    });
  };


  //Claim History fetch
useEffect(() => {
  const fetchClaimHistory = async() => {
  try {
    const response = await fetch("http://192.168.128.12:3000/claim/getAllClaims", {
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



const claimStages = [
  {
    name: "Instantiated",
    description: "Documents have been instantiated and queued for AI analysis",
  },
  {
    name: "UnderReview",
    description: "AI analysis of uploaded documents is underway",
  },
  {
    name: "Submitted",
    description: "Claim submitted and is being supervised by the company",
  },
  {
    name: "Escalated",
    description: "Claim has been escalated and is under manual review",
  },
  {
    name: "Settled",
    description: "Claim evaluation and verification has been successfully completed",
  },
  {
    name: "Rejected",
    description: "Claim was reviewed but ultimately rejected",
  },
];

  const [expandedClaimId, setExpandedClaimId] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedClaimId(prev => (prev === id ? null : id));
  };

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

      {ClaimsData.map((claim) => {
        const isExpanded = expandedClaimId === claim.claim.insurerIrdai;

        return (
          <Card key={claim.claim.insurerIrdai}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(claim.claim.status)}
                  <div>
                    <CardTitle className="text-lg">{claim.claim.insurerIrdai}</CardTitle>
                    <CardDescription>{claim.claim.policyType} Claim</CardDescription>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(claim.claim.status)}>
                    {claim.claim.status.toUpperCase()}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">Amount: $10,000</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Progress Tracker */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{getProgressValue(claim.claim.status)}% Complete</span>
                </div>
                <Progress value={getProgressValue(claim.claim.status)} className="w-full" />

                {/* Stage Statuses */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  {claimStages.map((stage, index) => {
                    const progress = getProgressValue(claim.claim.status);
                    const isCompleted = progress >= ((index + 1) * 20);
                    const isCurrent = progress >= (index * 20) && progress < ((index + 1) * 20);

                    return (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border ${
                          isCompleted
                            ? "bg-green-50 border-green-200"
                            : isCurrent
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : isCurrent ? (
                            <Clock className="h-4 w-4 text-blue-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              isCompleted
                                ? "text-green-800"
                                : isCurrent
                                ? "text-blue-800"
                                : "text-gray-600"
                            }`}
                          >
                            {stage.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{stage.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Section */}
              {isExpanded && (
                <>
                  {/* Updates */}
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
                          <p className="text-sm font-medium">
                            Documents uploaded and verified
                          </p>
                          <p className="text-xs text-gray-500">1 day ago</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Claim {claim.claim.status} successfully
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(claim.claim.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Manual Review Alert */}
                  {claim.claim.status === "UnderReview" && (
                    <div className="flex items-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <User className="h-5 w-5 text-amber-600 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-amber-800">
                          Manual Review Required
                        </p>
                        <p className="text-xs text-amber-700">
                          Your claim requires additional review by our specialists.
                          Expected completion: 2–3 business days.
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-800">N</Badge>
                    </div>
                  )}

                  <div className="text-sm text-gray-500 pt-4 border-t">
                    Submitted: {new Date(claim.claim.createdAt).toLocaleString()}
                  </div>
                </>
              )}

              {/* Expand/Collapse Button */}
              <div className="flex w-[20%] p-4 justify-between pt-2">
                <Button variant="outline" size="lg" className="mx-2" onClick={() => toggleExpanded(claim.claim.insurerIrdai)}>
                  {isExpanded ? "Hide Details" : "View Details"}
                </Button>

                <Button variant="outline" className="mx-2" size="lg">
                  AI Prediction
                </Button>

                <Button 
                onClick={() => handleSubmit(claim.claim.insurerIrdai)}
                variant="outline" className="mx-2 bg-black text-white text-base" size="lg">
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ClaimTracker;