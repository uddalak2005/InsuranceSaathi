import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Shield } from "lucide-react";
import { Info } from 'lucide-react';
import { HealthInsuranceForm } from '../../forms/HealthForm';
import { LifeInsuranceForm } from '../../forms/lifeform';
import { VehicleInsuranceForm } from '../../forms/vehicleForm';

const ClaimSubmission = () => {
  const [insuranceType, setInsuranceType] = useState("Life insurance");
  const [insuranceFormData, setinsuranceFormData] = useState({});

  useEffect(()=>{
    console.log(insuranceFormData);
  },[insuranceFormData])

  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, label: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [label]: file }));
      console.log(uploadedFiles);
    }
  };

  //

  const renderForm = () => {
    switch (insuranceType) {
      case "Life insurance":
        return <LifeInsuranceForm onSubmit={(formData) => setinsuranceFormData(formData)}/>;
      case "Health insurance":
        return <HealthInsuranceForm onSubmit={(formData) => setinsuranceFormData(formData)}/>;
      case "Vehicle insurance":
        return <VehicleInsuranceForm onSubmit={(formData) => setinsuranceFormData(formData)}/>;
      default:
        return null;
    }
  };

  const fileUploadContents = () => {
    switch (insuranceType) {
      case "Life insurance":
        return [
          "insuranceClaimForm",
          "passBook",
          "policyDocument",
          "deathCert",
          "hospitalDocument",
          "fir",
        ];
        break;
      case "Health insurance":
        return [
          "policyDocs",
          "finalBill",
          "passbook",
        ];
        break;
      case "Vehicle insurance":
        return [
          "claimForm",
          "vehicleIdentity",
          "damageImage",
          "recipt"
        ];
        break;
      default:
        return null;
    }
  }

  const buildFormData = (
    formValues: Record<string, any>,
    uploadedFiles: Record<string, File>
  ): FormData => {
    const formData = new FormData();
  
    // Helper: flatten and append form values
    const appendFields = (data: any, parentKey = "") => {
      Object.entries(data).forEach(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
  
        if (value instanceof Blob) {
          formData.append(fullKey, value); // Not expected here, but safe
        } else if (typeof value === "object" && value !== null) {
          appendFields(value, fullKey); // Recursively flatten objects
        } else {
          formData.append(fullKey, String(value ?? ""));
        }
      });
    };
  
    appendFields(formValues);
  
    // Append uploaded files
    Object.entries(uploadedFiles).forEach(([label, file]) => {
      const key = label; // e.g., "Death certificate" -> "death_certificate"
      formData.append(key, file);
    });
  
    return formData;
  };


  const submitForm = async () => {
    const formData = buildFormData(insuranceFormData, uploadedFiles);
  
    console.log("Merged formData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    const routes = {
      'Health insurance': '/claim/healthInsurance',
      'Life insurance': '/claim/lifeInsurance',
      'Vehicle insurance': '/claim/vehicleInsurance',
    };
  
    // Ensure insuranceType is available from state or passed in
    const jwt = localStorage.getItem("JWT");
  
    try {
      const response = await fetch(`http://192.168.128.12:3000${routes[insuranceType]}`, {

        method: 'POST',
      
        headers: {
      
          'token': jwt || '', // ✅ if your backend is using this custom header
      
        },
      
        credentials: "include", // ✅ if using cookies for session
      
        body: formData,
      
    });
  
      const data = await response.json();
      console.log("Server response:", data);
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit form");
      }
  
      // handle success (e.g., navigate or show alert)
    } catch (error) {
      console.error("Form submission error:", error);
      alert("Something went wrong while submitting the form.");
    }
  };

  const getDocumentInfo = (type: string) => {
    switch (type) {
      case "Life insurance":
        return "Upload the policy bond or e-policy PDF issued by your insurer.";
        break;
      case "Health insurance":
        return "Upload the health policy document or insurance card (TPA).";
        break;
      case "Vehicle insurance":
        return "Upload the motor insurance certificate (Form 51) or RC with policy reference.";
        break;
      default:
        return "";
    }
  };


  return (
    <div className="space-y-6">
      <Card className='py-4 px-2'>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-700" />
          Submit claims
        </CardTitle>

        {/* Dropdown */}
        <div className="my-6">
          <label htmlFor="insuranceType" className="block text-sm font-medium text-gray-700 mb-1">
            Select Insurance Type
          </label>
          <select
            id="insuranceType"
            name="insuranceType"
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={insuranceType}
            onChange={(e) => setInsuranceType(e.target.value)}
          >
            <option>Life insurance</option>
            <option>Health insurance</option>
            <option>Vehicle insurance</option>
          </select>
        </div>

        {/* Description */}
        <CardDescription className="my-8 flex items-start text-gray-600">
          <Info className="w-4 h-4 text-red-500 mt-1 mr-2 text-base" />
          {getDocumentInfo(insuranceType)}
        </CardDescription>

                {/* Render Form */}
          
          </CardHeader>
          <div className="mt-4 p-2 h-full w-full">{renderForm()}</div>

          
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {fileUploadContents()?.map((label, index) => {
              const file = uploadedFiles[label];
              const borderColor = file ? "border-blue-500" : "border-gray-300";

              return (
                <div
                  key={index}
                  className={`border-2 border-dashed ${borderColor} rounded-lg p-8 text-center transition-all`}
                >
                  <Input
                    id={`policy-upload-${index}`}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, label)}
                    className="hidden"
                  />
                  <label htmlFor={`policy-upload-${index}`} className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium hover:text-blue-700">
                        {file ? file.name : `${label}`}
                      </p>
                      <p className="text-sm text-gray-500">PDF, DOC, or DOCX up to 10MB</p>
                      <Button asChild className="mt-4">
                        <label htmlFor={`policy-upload-${index}`} className="cursor-pointer">
                          {file ? "Change File" : "Choose File"}
                        </label>
                      </Button>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </CardContent>
            <Button
            onClick={()=>submitForm()}
            className='bg-black py-6 ml-6 px-8 ml:auto text-white font-bold hover:bg-white hover:text-black hover:font-bold hover:border-2 border-black'>
              Submit
            </Button>
      </Card>
    </div>
  );
};

export default ClaimSubmission;