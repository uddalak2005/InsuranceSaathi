// import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import {PolicyHolderSignInRoute} from "../../../utils/API/PolicyHolderRoutes"
import { useNavigate } from "react-router-dom"

export default function PolicyHolderLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      const response = await PolicyHolderSignInRoute(formData)
      
      // Assuming success means a token or user object exists in response
      if (response.status >=200 && response.status<300) {
        console.log("Login successful:", response)
          navigate("/policyHolder-dashboard");
      } else {
        console.error("Unexpected response:", response)
        alert("Login failed. Please check your credentials.")
      }
    } catch (error: any) {
      // Handle specific error codes/messages if needed
      if (error.response?.status === 401) {
        alert("Invalid credentials")
      } else {
        alert("Something went wrong during login.")
      }
      console.error("Login error:", error)
    }
  }
  

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
          {/* ... unchanged header code ... */}

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-[#1F2937] font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="mt-1 border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-[#1F2937] font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="mt-1 border-gray-300 focus:border-[#10B981] focus:ring-[#10B981]"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.remember}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, remember: !!checked }))
                  }
                  className="border-gray-300 data-[state=checked]:bg-[#10B981] data-[state=checked]:border-[#10B981]"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Keep me signed in
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0047AB] to-[#10B981] hover:from-[#0047AB]/90 hover:to-[#10B981]/90 text-white font-medium py-3"
            >
              Access My Dashboard
            </Button>

            <div className="text-center">
              <div className="text-[#0047AB] hover:text-[#0047AB]/80 text-sm font-medium">
                Forgot your password?
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              New policyholder?{" "}
              <div className="text-[#10B981] hover:text-[#10B981]/80 font-medium">
                Create account
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
