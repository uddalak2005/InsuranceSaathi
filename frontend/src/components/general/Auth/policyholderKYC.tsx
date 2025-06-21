"use client"

import type React from "react"
import { useState } from "react"
// import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, MapPin, Phone, FileText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {PolicyHolderKYCRoute} from '../../../utils/API/PolicyHolderRoutes'
import { useEffect } from "react"

export default function PolicyHolderSignup() {
  const navigate = useNavigate();
  const [userDat,setuserDat] = useState({
    name:'',
    phone : '',
    email : ''
  });
  const [formData, setFormData] = useState({
    dob: '',
    address: '',
    aadhar: '',
    pan : '',
    identityDocument: null as File | null,
  });

  // const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  useEffect(() => {
    setuserDat(JSON.parse(localStorage.getItem("user_dets")));
    console.log(JSON.parse(localStorage.getItem("user_dets")));
  }, [])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setFormData((prev) => ({ ...prev, identityDocument: file }));
  //     setUploadedFile(file.name);
  //   }
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting data:", formData);
    // Proceed to API call or navigation
    try{
      const data = await PolicyHolderKYCRoute(formData);
      console.log("Data in : ", data);
      localStorage.setItem("user_dets",JSON.stringify(data.data));
      console.log("Updated user data : ", localStorage.getItem("user_dets"));
    navigate('/policyHolder-dashboard');
  }
  catch(err){
    console.log(err);
  }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen bg-[#F9FAFB] py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#0047AB] to-[#10B981] rounded-full mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-2">Join as a PolicyHolder</h1>
            <p className="text-gray-600">Create your account to manage your insurance policies seamlessly</p>
          </div>

          {/* Personal Info */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#10B981]/10 to-[#10B981]/5">
              <CardTitle className="text-[#1F2937] flex items-center">
                <User className="w-5 h-5 mr-2 text-[#10B981]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" value={userDat ? userDat.name : ''} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-[#10B981]" /> Address *
                </Label>
                <Input id="address" value={formData.address} onChange={handleChange} required />
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#0047AB]/10 to-[#0047AB]/5">
              <CardTitle className="text-[#1F2937] flex items-center">
                <Phone className="w-5 h-5 mr-2 text-[#0047AB]" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <Input id="mobileNumber" type="tel" value={userDat ? userDat.phone : ''} onChange={handleChange} required readOnly />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" value={userDat?.email} onChange={handleChange} required readOnly/>
              </div>
            </CardContent>
          </Card>
  
          {/* Identity Verification */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-[#10B981]/10 to-[#10B981]/5">
            <CardTitle className="text-[#1F2937] flex items-center">
              <FileText className="w-5 h-5 mr-2 text-[#10B981]" />
              Identity Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <label htmlFor="aadhar" className="block text-sm font-medium text-gray-700">
                Aadhar Number
              </label>
              <input
                type="text"
                id="aadhar"
                name="aadhar"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#10B981] focus:border-[#10B981]"
                placeholder="Enter your 12-digit Aadhar number"
                maxLength={12}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="pan" className="block text-sm font-medium text-gray-700">
                PAN Number
              </label>
              <input
                type="text"
                id="pan"
                name="pan"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 uppercase focus:ring-[#10B981] focus:border-[#10B981]"
                placeholder="Enter your PAN number"
                maxLength={10}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              className="w-full md:w-auto px-12 bg-gradient-to-r from-[#0047AB] to-[#10B981] hover:from-[#0047AB]/90 hover:to-[#10B981]/90 text-white font-medium py-3 text-lg"
            >
              Create My Account
            </Button>
          </div>

          <div className="text-center mt-6 text-gray-600">
            Already have an account? <span className="text-[#10B981] font-medium hover:text-[#10B981]/80 cursor-pointer">Sign in here</span>
          </div>
        </div>
      </div>
    </form>
  );
}