import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function InsurerLogin() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] lg:grid lg:grid-cols-2">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:bg-gradient-to-br lg:from-[#0047AB] lg:to-[#0047AB]/80 lg:p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <img
              src="/placeholder.svg?height=300&width=400"
              alt="Business person reviewing insurance documents"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Streamline Your Insurance Audits</h2>
          <p className="text-blue-100">AI-powered document analysis for faster, more accurate claim processing</p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0047AB] rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#1F2937]">Welcome Back, Insurer</h1>
            <p className="mt-2 text-gray-600">Sign in to access your audit dashboard</p>
          </div>

          {/* Login Form */}
          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-[#1F2937] font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="insurer@company.com"
                  className="mt-1 border-gray-300 focus:border-[#0047AB] focus:ring-[#0047AB]"
                  required
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
                  className="mt-1 border-gray-300 focus:border-[#0047AB] focus:ring-[#0047AB]"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-gray-300 data-[state=checked]:bg-[#0047AB] data-[state=checked]:border-[#0047AB]"
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me for 30 days
                </Label>
              </div>
            </div>

            <Button type="submit" className="w-full bg-[#0047AB] hover:bg-[#0047AB]/90 text-white font-medium py-3">
              Sign In to Dashboard
            </Button>

            <div className="text-center">
              <Link href="/forgot-password" className="text-[#0047AB] hover:text-[#0047AB]/80 text-sm font-medium">
                Forgot your password?
              </Link>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              New to the platform?{" "}
              <Link href="/signup" className="text-[#0047AB] hover:text-[#0047AB]/80 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
