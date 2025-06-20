import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, AlertTriangle, CheckCircle, Scale, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AppealSection = () => {
  const [selectedClaim, setSelectedClaim] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState<File[]>([]);
  const [appealSubmitted, setAppealSubmitted] = useState(false);
  const [appealProgress, setAppealProgress] = useState(0);
  const { toast } = useToast();

  const rejectedClaims = [
    {
      id: "CLM-2024-001",
      type: "Auto Accident",
      rejectionReason: "Insufficient documentation of damages",
      rejectionDate: "2024-01-20",
      appealDeadline: "2024-02-20"
    },
    {
      id: "CLM-2023-045",
      type: "Property Damage",
      rejectionReason: "Pre-existing condition not covered",
      rejectionDate: "2023-12-15",
      appealDeadline: "2024-01-15"
    }
  ];

  const activeAppeals = [
    {
      id: "APP-2024-001",
      claimId: "CLM-2023-042",
      status: "under-review",
      submittedDate: "2024-01-10",
      expectedDecision: "2024-02-15"
    }
  ];

  const handleDocUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedDocs(prev => [...prev, ...files]);
  };

  const handleSubmitAppeal = () => {
    if (!selectedClaim) {
      toast({
        title: "Missing Information",
        description: "Please select a claim to appeal.",
        variant: "destructive",
      });
      return;
    }

    setAppealProgress(0);
    const interval = setInterval(() => {
      setAppealProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAppealSubmitted(true);
          toast({
            title: "Appeal Submitted Successfully",
            description: "Your appeal has been submitted. Appeal ID: APP-2024-002",
          });
          return 100;
        }
        return prev + 25;
      });
    }, 500);
  };

  const getAppealStatusColor = (status: string) => {
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

  return (
    <div className="space-y-6">
      {/* Active Appeals */}
      {activeAppeals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="h-5 w-5 mr-2 text-blue-700" />
              Active Appeals
            </CardTitle>
            <CardDescription>
              Track the progress of your submitted appeals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeAppeals.map((appeal) => (
                <div key={appeal.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{appeal.id}</p>
                      <p className="text-sm text-gray-500">
                        Original Claim: {appeal.claimId}
                      </p>
                    </div>
                    <Badge className={getAppealStatusColor(appeal.status)}>
                      {appeal.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Appeal Progress</span>
                      <span>60% Complete</span>
                    </div>
                    <Progress value={60} className="w-full" />
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Submitted</p>
                      <p className="font-medium">{appeal.submittedDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expected Decision</p>
                      <p className="font-medium">{appeal.expectedDecision}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-600 mr-2" />
                      <p className="text-sm text-blue-800">
                        Under specialist review - Additional documentation being evaluated
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit New Appeal */}
      <Card>
        <CardHeader>
          <CardTitle>Submit New Appeal</CardTitle>
          <CardDescription>
            Appeal a rejected claim with additional evidence and documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="claim-select">Select Rejected Claim to Appeal *</Label>
            <select 
              id="claim-select" 
              className="w-full p-2 border rounded-md"
              value={selectedClaim}
              onChange={(e) => setSelectedClaim(e.target.value)}
            >
              <option value="">Choose a claim...</option>
              {rejectedClaims.map((claim) => (
                <option key={claim.id} value={claim.id}>
                  {claim.id} - {claim.type}
                </option>
              ))}
            </select>
          </div>

          {selectedClaim && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-4">
                {(() => {
                  const claim = rejectedClaims.find(c => c.id === selectedClaim);
                  return claim ? (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                        <span className="font-medium text-red-800">Rejection Details</span>
                      </div>
                      <p className="text-sm text-red-700">
                        <strong>Reason:</strong> {claim.rejectionReason}
                      </p>
                      <p className="text-sm text-red-700">
                        <strong>Rejected on:</strong> {claim.rejectionDate}
                      </p>
                      <p className="text-sm text-red-700">
                        <strong>Appeal deadline:</strong> {claim.appealDeadline}
                      </p>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="appeal-reason">Reason for Appeal *</Label>
            <Textarea 
              id="appeal-reason" 
              placeholder="Explain why you believe the original decision should be reconsidered..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-evidence">Additional Evidence/Information</Label>
            <Textarea 
              id="new-evidence" 
              placeholder="Describe any new evidence or information that supports your appeal..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appeal Documents Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Appeal Documents</CardTitle>
          <CardDescription>
            Submit additional evidence to support your appeal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-4" />
            <div className="space-y-2">
              <Label htmlFor="appeal-docs" className="text-base font-medium cursor-pointer hover:text-blue-700">
                Upload Additional Evidence
              </Label>
              <p className="text-sm text-gray-500">
                New receipts, medical records, expert opinions, witness statements, etc.
              </p>
              <Input
                id="appeal-docs"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleDocUpload}
                className="hidden"
              />
              <Button asChild variant="outline" className="mt-2">
                <label htmlFor="appeal-docs" className="cursor-pointer">
                  Choose Files
                </label>
              </Button>
            </div>
          </div>

          {uploadedDocs.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Uploaded Documents</h4>
              {uploadedDocs.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-blue-700" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setUploadedDocs(prev => prev.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Save as Draft</Button>
        <Button 
          onClick={handleSubmitAppeal}
          disabled={appealProgress > 0 && appealProgress < 100}
          className="bg-blue-700 hover:bg-blue-800"
        >
          {appealProgress > 0 && appealProgress < 100 ? "Submitting..." : "Submit Appeal"}
        </Button>
      </div>

      {appealProgress > 0 && appealProgress < 100 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing appeal submission...</span>
                <span>{appealProgress}%</span>
              </div>
              <Progress value={appealProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {appealSubmitted && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-green-800">Appeal Submitted Successfully</p>
                <p className="text-sm text-green-700">
                  Your appeal will be reviewed within 10-15 business days. You'll receive updates via email and in your dashboard.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppealSection;
