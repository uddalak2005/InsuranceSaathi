import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Shield, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PolicySection = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      startAnalysis();
    }
  };

  const startAnalysis = () => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setAnalysisComplete(true);
          toast({
            title: "Policy Analysis Complete",
            description: "Your policy coverage has been successfully analyzed.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const coverageData = [
    { type: "Auto Liability", covered: true, limit: "$500,000", deductible: "$500" },
    { type: "Collision", covered: true, limit: "$50,000", deductible: "$1,000" },
    { type: "Comprehensive", covered: true, limit: "$50,000", deductible: "$500" },
    { type: "Medical Payments", covered: true, limit: "$10,000", deductible: "$0" },
    { type: "Uninsured Motorist", covered: false, limit: "N/A", deductible: "N/A" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-700" />
            Know Your Policy
          </CardTitle>
          <CardDescription>
            Upload your policy document to get AI-powered coverage analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!uploadedFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <div className="space-y-2">
                <Label htmlFor="policy-upload" className="text-lg font-medium cursor-pointer hover:text-blue-700">
                  Upload Policy Document
                </Label>
                <p className="text-sm text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                <Input
                  id="policy-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button asChild className="mt-4">
                  <label htmlFor="policy-upload" className="cursor-pointer">
                    Choose File
                  </label>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-700 mr-3" />
                <div className="flex-1">
                  <p className="font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>

              {analysisProgress > 0 && analysisProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analyzing policy...</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                </div>
              )}

              {analysisComplete && (
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-800 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      AI Coverage Analysis Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {coverageData.map((coverage, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center space-x-3">
                            {coverage.covered ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">{coverage.type}</span>
                          </div>
                          <div className="text-right text-sm">
                            <Badge variant={coverage.covered ? "default" : "destructive"}>
                              {coverage.covered ? "Covered" : "Not Covered"}
                            </Badge>
                            {coverage.covered && (
                              <div className="mt-1 text-gray-600">
                                <div>Limit: {coverage.limit}</div>
                                <div>Deductible: {coverage.deductible}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PolicySection;