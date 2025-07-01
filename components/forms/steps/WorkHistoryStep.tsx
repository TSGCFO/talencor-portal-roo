"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface WorkHistoryStepProps {
  data: any;
  onUpdate: (field: string, value: any) => void;
  errors: Record<string, string>;
  isLoading?: boolean;
}

export default function WorkHistoryStep({ data, onUpdate, errors, isLoading }: WorkHistoryStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Work History & Physical Capabilities</h3>
      
      <div>
        <Label htmlFor="previousExperience">*Previous Work Experience</Label>
        <Textarea
          id="previousExperience"
          value={data.previousExperience || ""}
          onChange={(e) => onUpdate('previousExperience', e.target.value)}
          placeholder="Describe your previous work experience..."
          rows={4}
          className={errors.previousExperience ? 'border-red-500' : ''}
          disabled={isLoading}
          required
        />
        {errors.previousExperience && (
          <p className="text-red-500 text-sm mt-1">{errors.previousExperience}</p>
        )}
      </div>

      <div>
        <Label htmlFor="physicalLimitations">Physical Limitations (Optional)</Label>
        <Textarea
          id="physicalLimitations"
          value={data.physicalLimitations || ""}
          onChange={(e) => onUpdate('physicalLimitations', e.target.value)}
          placeholder="Describe any physical limitations that might affect your work..."
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div>
        <Label>*Available Shifts</Label>
        <div className="mt-2 space-y-2">
          {[
            { value: "morning", label: "Morning (8 AM - 4 PM)" },
            { value: "afternoon", label: "Afternoon (4 PM - 12 AM)" },
            { value: "night", label: "Night (12 AM - 8 AM)" },
            { value: "rotating", label: "Rotating Shifts" },
            { value: "weekend", label: "Weekends Only" },
          ].map((shift) => (
            <label key={shift.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={(data.availableShifts || []).includes(shift.value)}
                onChange={(e) => {
                  const currentShifts = data.availableShifts || [];
                  if (e.target.checked) {
                    onUpdate('availableShifts', [...currentShifts, shift.value]);
                  } else {
                    onUpdate('availableShifts', currentShifts.filter((s: string) => s !== shift.value));
                  }
                }}
                disabled={isLoading}
              />
              <span className="text-sm">{shift.label}</span>
            </label>
          ))}
        </div>
        {errors.availableShifts && (
          <p className="text-red-500 text-sm mt-1">{errors.availableShifts}</p>
        )}
      </div>
    </div>
  );
}