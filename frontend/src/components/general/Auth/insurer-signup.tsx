"use client"

import type React from "react"

import { useState, useEffect } from "react"
// import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Building2, FileText, Shield, CheckCircle } from "lucide-react"
import {InsurerKYCRoute} from "../../../utils/API/InsurerRoutes"
import { cookieUtils } from "../../../utils/lib/utils"
import { useNavigate } from "react-router-dom"

export default function InsurerSignup() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  
  // Debug cookies on component mount
  useEffect(() => {
    console.log('InsurerSignup component mounted');
    cookieUtils.logAll();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file.name)
    }
  }

  const navigate = useNavigate();
  const [onboardingFormData, setOnboardingFormData] = useState({
    irdai: '',
    cin : '',
    pan: '',
    tan : '',
    companyCode : '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("OnBoarding data :", onboardingFormData);
    
    // Debug cookies before making the request
    console.log('Cookies before KYC submission:');
    cookieUtils.logAll();
    
    try {
        const OnBoardingResponse = await InsurerKYCRoute(onboardingFormData);
        if(OnBoardingResponse.status >=200 && OnBoardingResponse.status<300){
          console.log("OnBoarding successfull!");
          navigate("/insurer-dashboard");
        }
        else{
          console.log("onBoarding failed! - ", OnBoardingResponse );
        }
      }
     catch (error: any) {
      // Handle specific error codes/messages if needed
      if (error.response?.status === 401) {
        console.error('401 Unauthorized - Cookie issue detected');
        console.error('Response headers:', error.response?.headers);
        console.error('Current cookies:', cookieUtils.getAll());
        alert("Authentication failed. Please try signing up again.")
      } else {
        alert("Something went wrong during onboarding.")
      }
      console.error("Onboarding error:", error)
    }
  }
  

  return (
    <div className="min-h-screen bg-[#F9FAFB] lg:grid lg:grid-cols-5">
      {/* Left Sidebar - Illustration */}
      <div className="hidden lg:flex lg:col-span-2 lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-[#0047AB] lg:to-[#0047AB]/80 lg:p-12">
        <div className="max-w-sm text-center">
          <div className="mb-8 relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6">
              <Building2 className="w-20 h-20 text-white mx-auto mb-4" />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="bg-white/20 rounded-lg p-3 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Secure Insurance Platform</h2>
          <p className="text-blue-100 mb-6">
            Join our network of trusted insurance providers and streamline your operations with AI-powered auditing
          </p>
          <div className="space-y-2 text-left">
            <div className="flex items-center text-blue-100">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Advanced document verification</span>
            </div>
            <div className="flex items-center text-blue-100">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Real-time claim processing</span>
            </div>
            <div className="flex items-center text-blue-100">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">Regulatory compliance tools</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="lg:col-span-3 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Register as an Insurer</h1>
            <p className="text-gray-600">Join our platform to access advanced insurance auditing tools</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#0047AB]/5 to-[#0047AB]/10">
              <CardTitle className="text-[#0047AB] flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-12">

              {/* Onboarding Form */}
              <form className="space-y-6" name="OnboardingForm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>
    <Label htmlFor="irdai" className="text-[#1F2937] font-medium">IRDAI Number *</Label>
    <Input
      id="irdai"
      value={onboardingFormData.irdai}
      onChange={(e) =>
        setOnboardingFormData({ ...onboardingFormData, irdai: e.target.value })
      }
      placeholder="IRDAI Number"
      className="mt-1 border-gray-300 focus:border-[#0047AB] focus:ring-[#0047AB]"
      required
    />
  </div>

  <div>
    <Label htmlFor="phone" className="text-[#1F2937] font-medium">Contact Number *</Label>
    <Input
      id="phone"
      value={onboardingFormData.phone}
      onChange={(e) =>
        setOnboardingFormData({ ...onboardingFormData, phone: e.target.value })
      }
      placeholder="Contact Number"
      className="mt-1 border-gray-300 focus:border-[#0047AB] focus:ring-[#0047AB]"
      required
    />
  </div>

  <div>
    <Label htmlFor="cin" className="text-[#1F2937] font-medium">CIN *</Label>
    <Input
      id="cin"
      value={onboardingFormData.cin}
      onChange={(e) =>
        setOnboardingFormData({ ...onboardingFormData, cin: e.target.value })
      }
      placeholder="CIN"
      className="mt-1 border-gray-300 focus:border-[#0047AB] focus:ring-[#0047AB]"
      required
    />
  </div>

  <div>
    <Label htmlFor="pan" className="text-[#1F2937] font-medium">PAN *</Label>
    <Input
      id="pan"
      value={onboardingFormData.pan}
      onChange={(e) =>
        setOnboardingFormData({ ...onboardingFormData, pan: e.target.value })
      }
      placeholder="PAN"
      className="mt-1 border-gray-300 focus:border-[#0047AB] focus:ring-[#0047AB]"
      required
    />
  </div>

  <div>
    <Label htmlFor="tan" className="text-[#1F2937] font-medium">TAN *</Label>
    <Input
      id="tan"
      value={onboardingFormData.tan}
      onChange={(e) =>
        setOnboardingFormData({ ...onboardingFormData, tan: e.target.value })
      }
      placeholder="TAN"
      className="mt-1 border-gray-300 focus:border-[#0047AB] focus:ring-[#0047AB]"
      required
    />
  </div>

  <div>
    <Label htmlFor="companyCode" className="text-[#1F2937] font-medium">Company Code *</Label>
    <Input
      id="companyCode"
      value={onboardingFormData.companyCode}
      onChange={(e) =>
        setOnboardingFormData({ ...onboardingFormData, companyCode: e.target.value })
      }
      placeholder="Company Code"
      className="mt-1 border-gray-300 focus:border-[#0047AB] focus:ring-[#0047AB]"
      required
    />
  </div>
</div>

                {/* Document Upload Section */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-[#1F2937] mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-[#0047AB]" />
                    Registration Documents
                  </h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0047AB] transition-colors">
                    <input
                      type="file"
                      id="documents"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="documents" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-1">
                        {uploadedFile ? (
                          <span className="text-[#10B981] font-medium">{uploadedFile}</span>
                        ) : (
                          "Upload registration documents (PDF, DOC)"
                        )}
                      </p>
                      <p className="text-sm text-gray-500">
                        Include business license, insurance authority registration
                      </p>
                    </label>
                  </div>
                </div>
              </form>

              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-[#0047AB] hover:bg-[#0047AB]/90 text-white font-medium py-3 text-lg"
                  onClick={handleSubmit}
                >
                  Register Company
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <div className="text-[#0047AB] hover:text-[#0047AB]/80 font-medium">
                Sign in here
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
