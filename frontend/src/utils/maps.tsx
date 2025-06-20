export type ProgressItem = {
    step: string;
    title: string;
    description: string;
    color: string;
  }
  
export const progress_line : ProgressItem[] = [
    {
      step: "01",
      title: "File Claim",
      description: "Submit your claim with required documents through our intuitive platform",
      color: "bg-blue-600",
    },
    {
      step: "02",
      title: "AI Evaluation",
      description: "Our AI system analyzes documents, assesses risk, and detects potential fraud",
      color: "bg-green-600",
    },
    {
      step: "03",
      title: "Review Process",
      description: "Human experts review AI recommendations and make final decisions",
      color: "bg-orange-600",
    },
    {
      step: "04",
      title: "Payout / Appeal",
      description: "Receive payout or initiate automated appeals process if needed",
      color: "bg-purple-600",
    },
    {
      step: "05",
      title: "Feedback",
      description: "Provide feedback to continuously improve our AI algorithms",
      color: "bg-indigo-600",
    },
  ]


  export type serviceItem = {
    title:string,
    description : string,
    features : string[],
  }


  export const services : serviceItem[] = [
    {
      title: "Automated Auditing",
      description:
        "AI-powered document verification and risk assessment with real-time processing and validation.",
      features: [
        "Document OCR & Analysis",
        "Risk Score Calculation",
        "Compliance Checking",
        "Fraud Pattern Detection",
      ],
    },
    {
      title: "Policy Holder Dashboard",
      description:
        "Intuitive interface for policy holders to manage claims, track progress, and access resources.",
      features: ["Claim Status Tracking", "Document Upload", "Success Score Visibility", "Communication Hub"],
    },
    {
      title: "Insurer Dashboard",
      description:
        "Comprehensive management tools for insurance companies to oversee operations and analytics.",
      features: ["Claims Management", "Analytics & Reporting", "Team Collaboration", "Workflow Automation"],
    },
    {
      title: "Communication Bridge",
      description: "Seamless communication platform connecting all parties with transparency and efficiency.",
      features: ["Real-time Messaging", "Status Notifications", "Document Sharing", "Automated Updates"],
    },
  ]