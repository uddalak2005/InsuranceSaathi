import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {PolicyHolderSignUpRoute} from "../../../utils/API/PolicyHolderRoutes"

export default function PolicyHolderAuth() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async (e : any) => {
    console.log("Sending request");
    e.preventDefault();
    try {
      const data = await PolicyHolderSignUpRoute(formData);
      console.log('Signup success:', data);
      localStorage.setItem("user_dets",JSON.stringify(data.newUserRecord));
      localStorage.setItem("JWT",data.token);
      console.log("User details set : ", localStorage.getItem("user_dets") , "Token set: ", localStorage.getItem("JWT" ));
      navigate("/user-kyc");

    } catch (error) {
      alert('Signup failed!');
    }
  };


  return (
    <div className="min-h-screen bg-[#F9FAFB] lg:grid lg:grid-cols-2">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-[#0047AB] lg:via-[#0047AB] lg:to-[#10B981] lg:p-12">
        <div className="max-w-md text-center">
          <div className="mb-8 grid grid-cols-3 gap-4">
            {/* Car Insurance Icon */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center">
              <svg className="w-12 h-12 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="text-white text-xs font-medium">Auto</span>
            </div>

            {/* Health Insurance Icon */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center">
              <svg className="w-12 h-12 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-white text-xs font-medium">Health</span>
            </div>

            {/* Life Insurance Icon */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col items-center">
              <svg className="w-12 h-12 text-white mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span className="text-white text-xs font-medium">Life</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Insurance, Simplified</h2>
          <p className="text-blue-100">Track claims, upload documents, and get instant updates on your policies</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-10 h-10 mr-6 bg-gradient-to-r from-[#0047AB] to-[#10B981] rounded-full mb-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              {/* Trust Badge */}
              <div className="inline-flex items-center bg-[#10B981]/10 text-[#10B981] px-3 py-1 rounded-full text-xs font-medium mb-1">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Secure & Trusted
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#1F2937]">Welcome, PolicyHolder</h1>
            <p className="mt-2 text-gray-600">Get aunthenticated</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* Username */}
        <div>
          <Label htmlFor="name" className="text-[#1F2937] font-medium">
            Username
          </Label>
          <Input
          id="name"
          name="name" // ✅ This must match the key in formData
          type="text"
          placeholder="john_doe"
          className="mt-1 border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]"
          value={formData.name}
          onChange={handleChange}
          required
        />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-[#1F2937] font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            className="mt-1 border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone" className="text-[#1F2937] font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91XXXXXXXXXX"
            className="mt-1 border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="text-[#1F2937] font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="mt-1 border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Confirm Password (not part of formData) */}
        <div>
          <Label htmlFor="confirmPassword" className="text-[#1F2937] font-medium">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            className="mt-1 border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]"
            value={confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-[#0047AB] to-[#10B981] hover:from-[#0047AB]/90 hover:to-[#10B981]/90 text-white font-medium py-3"
      >
        Proceed to KYC
      </Button>
    </form>
        </div>
      </div>
    </div>
  )
}
