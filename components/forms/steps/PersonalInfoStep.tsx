"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROVINCES } from "@/lib/constants";
import { formatSIN, formatPhone, formatPostalCode } from "@/lib/utils";

interface PersonalInfoStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  errors: Record<string, string>;
  isLoading?: boolean;
}

export default function PersonalInfoStep({ data, onUpdate, errors, isLoading }: PersonalInfoStepProps) {
  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'sinNumber') {
      formattedValue = formatSIN(value);
    } else if (field === 'phoneNumber') {
      formattedValue = formatPhone(value);
    } else if (field === 'postalCode') {
      formattedValue = formatPostalCode(value);
    }
    
    onUpdate(field, formattedValue);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">*Full Name (as per passport)</Label>
          <Input
            id="fullName"
            value={data.fullName || ""}
            onChange={(e) => handleInputChange('fullName', e.target.value.toUpperCase())}
            placeholder="FULL NAME"
            className={`uppercase ${errors.fullName ? 'border-red-500' : ''}`}
            disabled={isLoading}
            required
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="dateOfBirth">*Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth || ""}
            onChange={(e) => onUpdate('dateOfBirth', e.target.value)}
            className={errors.dateOfBirth ? 'border-red-500' : ''}
            disabled={isLoading}
            required
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="sinNumber">*Social Insurance Number</Label>
          <Input
            id="sinNumber"
            value={data.sinNumber || ""}
            onChange={(e) => handleInputChange('sinNumber', e.target.value)}
            placeholder="123-456-789"
            maxLength={11}
            className={errors.sinNumber ? 'border-red-500' : ''}
            disabled={isLoading}
            required
          />
          {errors.sinNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.sinNumber}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="phoneNumber">*Phone Number</Label>
          <Input
            id="phoneNumber"
            value={data.phoneNumber || ""}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="(123) 456-7890"
            className={errors.phoneNumber ? 'border-red-500' : ''}
            disabled={isLoading}
            required
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>
      </div>
      
      <h4 className="text-md font-medium mt-6 mb-3">*Current Address</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="address">*Street Address</Label>
          <Input
            id="address"
            value={data.address || ""}
            onChange={(e) => onUpdate('address', e.target.value.toUpperCase())}
            placeholder="STREET ADDRESS"
            className={`uppercase ${errors.address ? 'border-red-500' : ''}`}
            disabled={isLoading}
            required
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="city">*City</Label>
          <Input
            id="city"
            value={data.city || ""}
            onChange={(e) => onUpdate('city', e.target.value.toUpperCase())}
            placeholder="CITY"
            className={`uppercase ${errors.city ? 'border-red-500' : ''}`}
            disabled={isLoading}
            required
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="province">*Province</Label>
          <Select onValueChange={(value) => onUpdate('province', value)} disabled={isLoading}>
            <SelectTrigger className={errors.province ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select Province" />
            </SelectTrigger>
            <SelectContent>
              {PROVINCES.map((province) => (
                <SelectItem key={province.value} value={province.value}>
                  {province.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.province && (
            <p className="text-red-500 text-sm mt-1">{errors.province}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="postalCode">*Postal Code</Label>
          <Input
            id="postalCode"
            value={data.postalCode || ""}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            placeholder="A1A 1A1"
            className={`uppercase ${errors.postalCode ? 'border-red-500' : ''}`}
            maxLength={7}
            disabled={isLoading}
            required
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
          )}
        </div>
      </div>
    </div>
  );
}