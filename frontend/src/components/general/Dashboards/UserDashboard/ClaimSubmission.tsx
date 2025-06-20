import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText , Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClaimSubmission = () => {
  const [claimType, setClaimType] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState<File[]>([]);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const { toast } = useToast();

  const handleDocUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedDocs(prev => [...prev, ...files]);
    
    // Simulate risk score calculation
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 10; // Random score between 10-50 (low risk)
      setRiskScore(score);
    }, 1500);
  };

  const removeDocument = (index: number) => {
    setUploadedDocs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitClaim = () => {
    if (!claimType || uploadedDocs.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and upload documents.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitProgress(0);

    const interval = setInterval(() => {
      setSubmitProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSubmitting(false);
          toast({
            title: "Claim Submitted Successfully",
            description: "Your claim has been submitted and is now under review. Claim ID: CLM-2024-003",
          });
          return 100;
        }
        return prev + 20;
      });
    }, 500);
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return "text-green-600 bg-green-100";
    if (score <= 60) return "text-amber-600 bg-amber-100";
    return "text-red-600 bg-red-100";
  };

  const getRiskScoreLabel = (score: number) => {
    if (score <= 30) return "Low Risk";
    if (score <= 60) return "Medium Risk";
    return "High Risk";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit New Claim</CardTitle>
          <CardDescription>
            Complete the form below to submit your insurance claim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="claim-type">Claim Type *</Label>
              <Select onValueChange={setClaimType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto-accident">Auto Accident</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="property-damage">Property Damage</SelectItem>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incident-date">Incident Date *</Label>
              <Input type="date" id="incident-date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description of Incident *</Label>
            <Textarea 
              id="description" 
              placeholder="Please provide a detailed description of what happened..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimated-amount">Estimated Claim Amount</Label>
            <Input type="number" id="estimated-amount" placeholder="Enter amount in USD" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Claim Documents</CardTitle>
          <CardDescription>
            Upload all relevant documents to support your claim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-4" />
            <div className="space-y-2">
              <Label htmlFor="claim-docs" className="text-base font-medium cursor-pointer hover:text-blue-700">
                Upload Documents
              </Label>
              <p className="text-sm text-gray-500">
                Photos, receipts, police reports, medical records, etc.
              </p>
              <Input
                id="claim-docs"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleDocUpload}
                className="hidden"
              />
              <Button asChild variant="outline" className="mt-2">
                <label htmlFor="claim-docs" className="cursor-pointer">
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
                    onClick={() => removeDocument(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {riskScore !== null && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  AI Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Risk Score</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-2xl font-bold text-gray-900">{riskScore}</span>
                      <Badge className={getRiskScoreColor(riskScore)}>
                        {getRiskScoreLabel(riskScore)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Progress value={riskScore} className="w-24 mb-2" />
                    <p className="text-xs text-gray-500">Risk Level</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-sm">
                    <strong>Assessment:</strong> Based on the uploaded documents and claim details, 
                    this claim shows {getRiskScoreLabel(riskScore).toLowerCase()} indicators. 
                    {riskScore <= 30 && "Expected processing time: 3-5 business days."}
                    {riskScore > 30 && riskScore <= 60 && "Additional verification may be required."}
                    {riskScore > 60 && "Manual review will be conducted."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={handleSubmitClaim} 
          disabled={isSubmitting}
          className="bg-blue-700 hover:bg-blue-800"
        >
          {isSubmitting ? "Submitting..." : "Submit Claim"}
        </Button>
      </div>

      {isSubmitting && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing claim submission...</span>
                <span>{submitProgress}%</span>
              </div>
              <Progress value={submitProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClaimSubmission;