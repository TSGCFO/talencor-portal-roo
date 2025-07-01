"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPhone } from "@/lib/utils";

interface ContactInfoStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  errors: Record<string, string>;
  isLoading?: boolean;
}

export default function ContactInfoStep({ data, onUpdate, errors, isLoading }: ContactInfoStepProps) {
  const handlePhoneChange = (field: string, value: string) => {
    onUpdate(field, formatPhone(value));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Contact & Emergency Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="email">*Email Address</Label>
          <Input
            id="email"
            type="email"
            value={data.email || ""}
            onChange={(e) => onUpdate('email', e.target.value.toLowerCase())}
            placeholder="email@example.com"
            className={errors.email ? 'border-red-500' : ''}
            disabled={isLoading}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <h4 className="text-md font-medium mt-6 mb-3">*Emergency Contact</h4>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="emergencyName">*Name</Label>
          <Input
            id="emergencyName"
            value={data.emergencyName || ""}
            onChange={(e) => onUpdate('emergencyName', e.target.value.toUpperCase())}
            placeholder="EMERGENCY CONTACT NAME"
            className={`uppercase ${errors.emergencyName ? 'border-red-500' : ''}`}
            disabled={isLoading}
            required
          />
          {errors.emergencyName && (
            <p className="text-red-500 text-sm mt-1">{errors.emergencyName}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="emergencyPhone">*Contact Number</Label>
          <Input
            id="emergencyPhone"
            value={data.emergencyPhone || ""}
            onChange={(e) => handlePhoneChange('emergencyPhone', e.target.value)}
            placeholder="(123) 456-7890"
            className={errors.emergencyPhone ? 'border-red-500' : ''}
            disabled={isLoading}
            required
          />
          {errors.emergencyPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="emergencyRelation">*Relationship</Label>
          <Input
            id="emergencyRelation"
            value={data.emergencyRelation || ""}
            onChange={(e) => onUpdate('emergencyRelation', e.target.value.toUpperCase())}
            placeholder="RELATIONSHIP"
            className={`uppercase ${errors.emergencyRelation ? 'border-red-500' : ''}`}
            disabled={isLoading}
            required
          />
          {errors.emergencyRelation && (
            <p className="text-red-500 text-sm mt-1">{errors.emergencyRelation}</p>
          )}
        </div>
      </div>
    </div>
  );
}