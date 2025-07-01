"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { JOB_TYPES } from "@/lib/constants";

interface JobPreferencesStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  errors: Record<string, string>;
  isLoading?: boolean;
}

export default function JobPreferencesStep({ data, onUpdate, errors, isLoading }: JobPreferencesStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Job Preferences & Availability</h3>
      
      <div>
        <Label>*Preferred Job Types</Label>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
          {JOB_TYPES.map((jobType) => (
            <label key={jobType.value} className="flex items-center space-x-2">
              <Checkbox
                checked={(data.jobTypes || []).includes(jobType.value)}
                onCheckedChange={(checked) => {
                  const currentTypes = data.jobTypes || [];
                  if (checked) {
                    onUpdate('jobTypes', [...currentTypes, jobType.value]);
                  } else {
                    onUpdate('jobTypes', currentTypes.filter((t: string) => t !== jobType.value));
                  }
                }}
                disabled={isLoading}
              />
              <span className="text-sm">{jobType.label}</span>
            </label>
          ))}
        </div>
        {errors.jobTypes && (
          <p className="text-red-500 text-sm mt-1">{errors.jobTypes}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="wageExpectation">*Wage Expectation</Label>
          <Input
            id="wageExpectation"
            value={data.wageExpectation || ""}
            onChange={(e) => onUpdate('wageExpectation', e.target.value)}
            placeholder="e.g. $15/hour"
            className={errors.wageExpectation ? 'border-red-500' : ''}
            disabled={isLoading}
            required
          />
          {errors.wageExpectation && (
            <p className="text-red-500 text-sm mt-1">{errors.wageExpectation}</p>
          )}
        </div>

        <div>
          <Label htmlFor="startDate">*Preferred Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={data.startDate || ""}
            onChange={(e) => onUpdate('startDate', e.target.value)}
            className={errors.startDate ? 'border-red-500' : ''}
            disabled={isLoading}
            required
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="isStudent"
            checked={data.isStudent || false}
            onCheckedChange={(checked) => onUpdate('isStudent', checked)}
            disabled={isLoading}
          />
          <Label htmlFor="isStudent">I am currently a student</Label>
        </div>
      </div>
    </div>
  );
}