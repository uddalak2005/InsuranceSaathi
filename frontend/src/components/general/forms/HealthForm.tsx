import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";

type HealthInsuranceFormProps = {
  onSubmit: (data: any) => void;
};

export const HealthInsuranceForm = ({ onSubmit }: HealthInsuranceFormProps) => {
  const [formData, setFormData] = useState({
    uin: "",
    policyNumber: "",
    policyHolderName: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    hospitalName: "",
    totalClaimAmt: "",
    govtId: "",
    insurerIrdai : ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    console.log("Sent to parent");
  };

  return (
    <Card className="w-full px-8 py-8 mx-auto shadow-lg rounded-2xl border border-gray-200">
  <CardHeader>
    <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
      <Hospital className="w-5 h-5 mr-2 text-[#10B981]" />
      Health Insurance Claim Form
    </CardTitle>
    <CardDescription className="mt-2 text-gray-600">
      Enter your policy and hospital details to file a claim.
    </CardDescription>
  </CardHeader>

  <CardContent className="grid gap-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>UIN</Label>
        <Input
          name="uin"
          placeholder="e.g. 1234567890"
          value={formData.uin}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Policy Number</Label>
        <Input
          name="policyNumber"
          placeholder="e.g. HLT-POL-00012345"
          value={formData.policyNumber}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Policy Holder Name</Label>
        <Input
          name="policyHolderName"
          placeholder="Full name as per documents"
          value={formData.policyHolderName}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Gender</Label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
      </div>
      <div>
        <Label>Date of Birth</Label>
        <Input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Phone</Label>
        <Input
          name="phone"
          placeholder="e.g. 9876543210"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          placeholder="e.g. yourname@example.com"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>IRDAI</Label>
        <Input
          name="insurerIrdai"
          type="text"
          placeholder="e.g. 123"
          value={formData.insurerIrdai}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Hospital Name</Label>
        <Input
          name="hospitalName"
          placeholder="e.g. Apollo Hospitals, Delhi"
          value={formData.hospitalName}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Total Claim Amount</Label>
        <Input
          name="totalClaimAmt"
          type="number"
          placeholder="e.g. 50000"
          value={formData.totalClaimAmt}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Govt ID</Label>
        <Input
          name="govtId"
          placeholder="e.g. Aadhaar, PAN or Voter ID"
          value={formData.govtId}
          onChange={handleChange}
        />
      </div>
    </div>
  </CardContent>

  <div className="px-6 pb-6">
    <Button
      onClick={handleSubmit}
      className="w-full md:w-auto bg-black py-5 px-10 text-white font-semibold hover:bg-white hover:text-black hover:font-bold hover:border-2 border-black"
    >
      Submit
    </Button>
  </div>
</Card>

  );
};
