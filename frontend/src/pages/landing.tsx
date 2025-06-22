"use client"
import { useState } from "react"
import {useNavigate} from 'react-router-dom'
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import {
  FileText,
  Shield,
  Eye,
  TrendingUp,
  MessageSquare,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Play,
  Menu,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { progress_line } from "@/utils/maps"
import { services } from "@/utils/maps"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">InsuranceSaathi</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                How it Works
              </a>
              <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">
                Services
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </a>
              <Button 
              onClick={() =>navigate("/auth-divider-signin")}
              variant="outline" className="border-gray-300">
                Log In
              </Button>

              <Button 
              onClick={() => navigate("/auth-divider-signup")}
              className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
            </nav>

            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 md:hidden">
          <nav className="flex flex-col items-center space-y-8 py-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors text-lg">
              Features
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors text-lg">
              How it Works
            </a>
            <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors text-lg">
              Services
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors text-lg">
              Pricing
            </a>
            <Button variant="outline" className="border-gray-300 w-32">
              Log In
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 w-32">Sign Up</Button>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50"
          style={{ y: backgroundY }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-green-600/5"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(37, 99, 235, 0.05), rgba(16, 185, 129, 0.05))",
              "linear-gradient(45deg, rgba(16, 185, 129, 0.05), rgba(245, 158, 11, 0.05))",
              "linear-gradient(45deg, rgba(245, 158, 11, 0.05), rgba(37, 99, 235, 0.05))",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            AI-Powered Insurance Claims Platform
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Smarter Claims.
            <br />
            <span className="text-blue-600">Faster Payouts.</span>
            <br />
            <span className="text-green-600">Transparent Process.</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Revolutionary AI technology that automates document audits, detects fraud, and provides transparent claim
            success scores for both insurers and policy holders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" 
              onClick={() => navigate("/auth-divider-signup")}
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-gray-300">
                <Play className="mr-2 w-5 h-5" /> Watch Demo
              </Button>
            </motion.div>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              Enterprise Grade Security
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              99.9% Uptime SLA
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              24/7 Support
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful AI Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Advanced technology that transforms the insurance claims process for everyone involved
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "AI Document Audit",
                description:
                  "Automatically analyze and validate claim documents with 99.5% accuracy using advanced machine learning.",
                color: "text-blue-600",
              },
              {
                icon: TrendingUp,
                title: "Policy Management Dashboard",
                description:
                  "Comprehensive dashboard for managing policies, tracking claims, and monitoring performance metrics.",
                color: "text-green-600",
              },
              {
                icon: Shield,
                title: "Fraud Detection",
                description:
                  "Real-time fraud detection using AI pattern recognition to protect against fraudulent claims.",
                color: "text-red-600",
              },
              {
                icon: Eye,
                title: "Live Claim Tracking",
                description: "Real-time visibility into claim status with automated updates and notifications.",
                color: "text-purple-600",
              },
              {
                icon: MessageSquare,
                title: "Appeals Automation",
                description: "Streamlined appeals process with AI-assisted review and automated decision workflows.",
                color: "text-orange-600",
              },
              {
                icon: Award,
                title: "AI Claim Success Score",
                description: "Transparent scoring system that predicts claim approval likelihood for policy holders.",
                color: "text-indigo-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-gray-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4 ${feature.color}`}
                    >
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" ref={howItWorksRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, transparent process from claim filing to payout
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-gray-300 hidden md:block" />

              {progress_line.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative flex items-start mb-12 last:mb-0"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center text-white font-bold text-lg mr-6 relative z-10`}
                  >
                    {item.step}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Services Provided</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions for all stakeholders in the insurance ecosystem
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-gray-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-700">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by leading insurance companies and thousands of policy holders
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Policy Holder",
                company: "Individual Customer",
                content:
                  "ClaimAI made my claim process incredibly smooth. The transparency score gave me confidence, and I received my payout 3x faster than my previous experience.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Claims Director",
                company: "SecureLife Insurance",
                content:
                  "We've reduced claim processing time by 75% and fraud detection accuracy improved to 99.2%. The ROI has been exceptional.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Operations Manager",
                company: "TrustGuard Insurance",
                content:
                  "The AI automation has transformed our workflow. Our team can now focus on complex cases while routine claims are handled seamlessly.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-sm text-gray-500">{testimonial.company}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your needs. No hidden fees, no surprises.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$99",
                period: "/month",
                description: "Perfect for small insurance agencies",
                features: ["Up to 100 claims/month", "Basic AI document audit", "Standard support", "Basic analytics"],
                popular: false,
              },
              {
                name: "Professional",
                price: "$299",
                period: "/month",
                description: "Ideal for growing insurance companies",
                features: [
                  "Up to 1,000 claims/month",
                  "Advanced AI features",
                  "Priority support",
                  "Advanced analytics",
                  "Custom integrations",
                  "Fraud detection",
                ],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                description: "For large insurance organizations",
                features: [
                  "Unlimited claims",
                  "Full AI suite",
                  "24/7 dedicated support",
                  "Custom analytics",
                  "White-label options",
                  "SLA guarantees",
                ],
                popular: false,
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <Card className={`h-full ${plan.popular ? "border-blue-600 shadow-lg" : "border-gray-200"}`}>
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mb-2">
                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600">{plan.period}</span>
                      </div>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-900 hover:bg-gray-800"}`}
                        size="lg"
                      >
                        {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Claims Process?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of insurance professionals who trust ClaimAI to streamline their operations and improve
              customer satisfaction.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                  Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg bg-white px-8 py-4 border-gray-600 text-black hover:bg-gray-200"
                >
                  Schedule Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">ClaimAI</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Revolutionizing insurance claims with AI-powered automation and transparency.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ClaimAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
