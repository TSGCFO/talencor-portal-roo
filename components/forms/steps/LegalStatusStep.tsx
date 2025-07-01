"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

interface LegalStatusStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  errors: Record<string, string>;
  isLoading?: boolean;
}

export default function LegalStatusStep({ data, onUpdate, errors, isLoading }: LegalStatusStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Legal Status & Transportation</h3>
      
      <div>
        <Label>*Work Eligibility Status</Label>
        <RadioGroup 
          value={data.workEligibility || ""} 
          onValueChange={(value) => onUpdate('workEligibility', value)}
          className="mt-2"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="citizen" id="citizen" />
            <Label htmlFor="citizen">Canadian Citizen</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="permanent_resident" id="pr" />
            <Label htmlFor="pr">Permanent Resident</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="work_permit" id="workpermit" />
            <Label htmlFor="workpermit">Work Permit</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="student_visa" id="student" />
            <Label htmlFor="student">Student Visa</Label>
          </div>
        </RadioGroup>
        {errors.workEligibility && (
          <p className="text-red-500 text-sm mt-1">{errors.workEligibility}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label>Transportation</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasReliableTransport"
                checked={data.hasReliableTransport || false}
                onCheckedChange={(checked) => onUpdate('hasReliableTransport', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="hasReliableTransport">I have reliable transportation</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasDriversLicense"
                checked={data.hasDriversLicense || false}
                onCheckedChange={(checked) => onUpdate('hasDriversLicense', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="hasDriversLicense">I have a driver&apos;s license</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasVehicle"
                checked={data.hasVehicle || false}
                onCheckedChange={(checked) => onUpdate('hasVehicle', checked)}
                disabled={isLoading}
              />
              <Label htmlFor="hasVehicle">I have access to a vehicle</Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}