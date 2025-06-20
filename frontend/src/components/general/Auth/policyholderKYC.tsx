"use client"

import type React from "react"
import { useState } from "react"
// import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, User, MapPin, Phone, Shield, FileText, Heart, Car, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {PolicyHolderKYCRoute} from '../../../utils/API/PolicyHolderRoutes'

export default function PolicyHolderSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    address: '',
    mobileNumber: '',
    email: '',
    insuranceType: '',
    password: '',
    confirmPassword: '',
    identityDocument: null as File | null,
  });

  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, identityDocument: file }));
      setUploadedFile(file.name);
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, insuranceType: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }


    console.log("Submitting data:", formData);
    // Proceed to API call or navigation
    PolicyHolderKYCRoute(formData);
    navigate('/policyHolder-dashboard');
  };

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
                <Input id="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
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
                <Input id="mobileNumber" type="tel" value={formData.mobileNumber} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
            </CardContent>
          </Card>

          {/* Insurance Preference */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#F59E0B]/10 to-[#F59E0B]/5">
              <CardTitle className="text-[#1F2937] flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#F59E0B]" />
                Insurance Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Label htmlFor="insuranceType">Preferred Insurance Type *</Label>
              <Select onValueChange={handleSelectChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary insurance interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car"><Car className="w-4 h-4 mr-2" /> Car Insurance</SelectItem>
                  <SelectItem value="health"><Heart className="w-4 h-4 mr-2" /> Health Insurance</SelectItem>
                  <SelectItem value="life"><Shield className="w-4 h-4 mr-2" /> Life Insurance</SelectItem>
                  <SelectItem value="home"><Home className="w-4 h-4 mr-2" /> Home Insurance</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#10B981]/10 to-[#10B981]/5">
              <CardTitle className="text-[#1F2937] flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#10B981]" />
                Identity Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#10B981]">
                <input
                  type="file"
                  id="identityDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="identityDocument" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    {uploadedFile ? <span className="text-[#10B981] font-medium">{uploadedFile}</span> : "Upload Identity Document"}
                  </p>
                  <p className="text-sm text-gray-500">Aadhar Card, PAN Card, Driver's License, or Passport</p>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-[#DC2626]/10 to-[#DC2626]/5">
              <CardTitle className="text-[#1F2937] flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#DC2626]" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
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