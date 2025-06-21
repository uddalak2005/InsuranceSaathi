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
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
type VehicleInsuranceFormProps = {
    onSubmit: (data: Record<string, string>) => void;
  };
  
  export const VehicleInsuranceForm = ({ onSubmit }: VehicleInsuranceFormProps) => {
    const [formData, setFormData] = useState({
      uin: "",
      regNo: "",
      drivingLicense: "",
      ownerName: "",
      email: "",
      govtId: "",
      insurerIrdai : ""
    });
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = () => {
      onSubmit(formData); // Send formData to parent
      console.log("Sent to parent");
    };
  
    return (
      <Card className="w-full mx-auto px-6 py-8 shadow-lg border border-gray-200 rounded-2xl">
  <CardHeader>
    <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
      <Car className="w-5 h-5 mr-2 text-[#10B981]" />
      Vehicle Insurance Claim Form
    </CardTitle>
    <CardDescription className="mt-2 text-gray-600">
      Fill in vehicle and policy details to initiate your motor insurance claim.
    </CardDescription>
  </CardHeader>

  <CardContent className="grid gap-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(formData).map(([key, value]) => {
        const labelMap: Record<string, string> = {
          uin: "UIN",
          regNo: "Registration Number",
          drivingLisence: "Driving License",
          ownerName: "Owner Name",
          email: "Email",
          govtId: "Govt ID",
          insurerIrdai : "Insurer IRDAI"
          
        };

        const placeholderMap: Record<string, string> = {
          uin: "e.g. 1234567890",
          regNo: "e.g. WB12AB3456",
          drivingLisence: "e.g. DL-0420110149646",
          ownerName: "Full name of vehicle owner",
          email: "e.g. user@example.com",
          govtId: "Aadhaar, PAN, or Voter ID",
          insurerIrdai : 'IRDAI'
        };

        return (
          <div key={key}>
            <Label htmlFor={key}>{labelMap[key] ?? key}</Label>
            <Input
              name={key}
              value={value}
              placeholder={placeholderMap[key] ?? ""}
              onChange={handleChange}
            />
          </div>
        );
      })}
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
