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
import { ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";

type LifeInsuranceFormProps = {
  onSubmit: (data: any) => void;
};

export const LifeInsuranceForm = ({ onSubmit }: LifeInsuranceFormProps) => {
  const [formData, setFormData] = useState({
    uin: "",
    policyNumber: "",
    policyHolderName: "",
    dob: "",
    dateOfDeath: "",
    causeOfDeath: "",
    insurerIrdai : "",
    nominee: {
      name: "",
      relation: "",
      email: "",
      phone: "",
      govtId: "",
      accountNo: "",
      IFSC: "",
      bankName: "",
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("nominee.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        nominee: { ...prev.nominee, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    onSubmit(formData); // Send form data to parent
    console.log("Sent to parent");
  };

  return (
    <Card className="w-full mx-auto px-4 py-8 shadow-lg rounded-2xl border border-gray-200">
  <CardHeader>
    <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
      <ScrollText className="w-5 h-5 mr-2 text-[#10B981]" />
      Life Insurance Claim Form
    </CardTitle>
    <CardDescription className="mt-2 text-gray-600">
      Enter your policy, nominee, and incident details to file a claim.
    </CardDescription>
  </CardHeader>

  <CardContent className="grid gap-8">
    {/* Policy Details */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label htmlFor="uin">UIN</Label>
        <Input
          id="uin"
          name="uin"
          placeholder="e.g. 1234567890"
          value={formData.uin}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="policyNumber">Policy Number</Label>
        <Input
          id="policyNumber"
          name="policyNumber"
          placeholder="e.g. POL-00056789"
          value={formData.policyNumber}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="policyHolderName">Policy Holder Name</Label>
        <Input
          id="policyHolderName"
          name="policyHolderName"
          placeholder="Full name as on policy"
          value={formData.policyHolderName}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="dob">Date of Birth</Label>
        <Input
          id="dob"
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="dateOfDeath">Date of Death</Label>
        <Input
          id="dateOfDeath"
          type="date"
          name="dateOfDeath"
          value={formData.dateOfDeath}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="causeOfDeath">Cause of Death</Label>
        <Input
          id="causeOfDeath"
          name="causeOfDeath"
          placeholder="e.g. Cardiac arrest, accident"
          value={formData.causeOfDeath}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* Nominee Info */}
    <div>
      <h4 className="text-md font-semibold text-gray-700 mb-4">Nominee Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="nominee.name">Name</Label>
          <Input
            id="nominee.name"
            name="nominee.name"
            placeholder="Nominee full name"
            value={formData.nominee.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="nominee.relation">Relation</Label>
          <Input
            id="nominee.relation"
            name="nominee.relation"
            placeholder="e.g. Father, Spouse"
            value={formData.nominee.relation}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="nominee.email">Email</Label>
          <Input
            id="nominee.email"
            name="nominee.email"
            type="email"
            placeholder="e.g. nominee@example.com"
            value={formData.nominee.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="nominee.phone">Phone</Label>
          <Input
            id="nominee.phone"
            name="nominee.phone"
            type="tel"
            placeholder="e.g. 9876543210"
            value={formData.nominee.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="nominee.govtId">Govt ID</Label>
          <Input
            id="nominee.govtId"
            name="nominee.govtId"
            placeholder="e.g. Aadhaar, PAN, etc."
            value={formData.nominee.govtId}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="nominee.accountNo">Account No</Label>
          <Input
            id="nominee.accountNo"
            name="nominee.accountNo"
            type="text"
            placeholder="e.g. 123456789012"
            value={formData.nominee.accountNo}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="nominee.IFSC">IFSC</Label>
          <Input
            id="nominee.IFSC"
            name="nominee.IFSC"
            placeholder="e.g. SBIN0000456"
            value={formData.nominee.IFSC}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="nominee.bankName">Bank Name</Label>
          <Input
            id="nominee.bankName"
            name="nominee.bankName"
            placeholder="e.g. State Bank of India"
            value={formData.nominee.bankName}
            onChange={handleChange}
          />
        </div>
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
