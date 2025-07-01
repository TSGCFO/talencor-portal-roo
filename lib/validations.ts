import { z } from "zod";

// Canadian postal code validation
const POSTAL_CODE_REGEX = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;

// Canadian phone number validation (various formats)
const PHONE_REGEX = /^(\+1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}$/;

// SIN validation (Social Insurance Number)
const SIN_REGEX = /^\d{3}-\d{3}-\d{3}$/;

// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Personal Information Step Schema
export const PersonalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .regex(/^[a-zA-Z\s\-'\.]+$/, "Full name can only contain letters, spaces, hyphens, apostrophes, and periods"),
  dateOfBirth: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 16;
      }
      return age >= 16;
    }, "You must be at least 16 years old"),
  sinNumber: z
    .string()
    .regex(SIN_REGEX, "SIN must be in format XXX-XXX-XXX")
    .refine(validateSIN, "Invalid SIN number"),
  phoneNumber: z
    .string()
    .regex(PHONE_REGEX, "Please enter a valid Canadian phone number"),
  email: z
    .string()
    .regex(EMAIL_REGEX, "Please enter a valid email address"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters"),
  province: z
    .string()
    .min(2, "Please select a province"),
  postalCode: z
    .string()
    .regex(POSTAL_CODE_REGEX, "Please enter a valid Canadian postal code"),
});

// Emergency Contact Step Schema
export const EmergencyContactSchema = z.object({
  emergencyName: z
    .string()
    .min(2, "Emergency contact name must be at least 2 characters")
    .max(100, "Emergency contact name must not exceed 100 characters"),
  emergencyPhone: z
    .string()
    .regex(PHONE_REGEX, "Please enter a valid phone number"),
  emergencyRelation: z
    .string()
    .min(2, "Please specify your relationship to the emergency contact"),
});

// Legal Status Step Schema
export const LegalStatusSchema = z.object({
  workEligibility: z.enum(["citizen", "permanent_resident", "work_permit", "student_visa"], {
    errorMap: () => ({ message: "Please select your work eligibility status" }),
  }),
  workPermitExpiry: z
    .string()
    .optional()
    .refine((date, ctx) => {
      if (ctx.parent.workEligibility === "work_permit" && !date) {
        return false;
      }
      if (date && ctx.parent.workEligibility === "work_permit") {
        return new Date(date) > new Date();
      }
      return true;
    }, "Work permit expiry date is required and must be in the future"),
  hasReliableTransport: z.boolean(),
  hasDriversLicense: z.boolean(),
  licenseClass: z.string().optional(),
  hasVehicle: z.boolean(),
});

// Work History Step Schema
export const WorkHistorySchema = z.object({
  previousExperience: z
    .string()
    .min(10, "Please provide at least 10 characters describing your experience")
    .max(1000, "Experience description must not exceed 1000 characters"),
  availableShifts: z
    .array(z.string())
    .min(1, "Please select at least one available shift"),
  physicalLimitations: z
    .string()
    .max(500, "Physical limitations description must not exceed 500 characters")
    .optional(),
  safetyEquipment: z.array(z.string()).optional(),
});

// Job Preferences Step Schema
export const JobPreferencesSchema = z.object({
  jobTypes: z
    .array(z.string())
    .min(1, "Please select at least one job type"),
  wageExpectation: z
    .string()
    .min(1, "Please specify your wage expectation"),
  startDate: z
    .string()
    .refine((date) => new Date(date) >= new Date(), "Start date must be today or in the future"),
  isStudent: z.boolean(),
  classSchedule: z
    .array(z.object({
      day: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    }))
    .optional(),
});

// Document Upload Step Schema
export const DocumentUploadSchema = z.object({
  documents: z
    .array(z.object({
      fileName: z.string(),
      fileUrl: z.string(),
      fileType: z.string(),
      fileSize: z.number(),
      documentType: z.enum(["resume", "cover_letter", "id_document", "work_permit", "other"]),
    }))
    .min(1, "Please upload at least one document (resume required)"),
});

// Aptitude Test Schema
export const AptitudeTestSchema = z.object({
  answers: z
    .array(z.string())
    .length(10, "All 10 questions must be answered"),
  agreesToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms and conditions"),
  digitalSignature: z
    .string()
    .min(2, "Digital signature is required")
    .max(100, "Digital signature must not exceed 100 characters"),
});

// Complete Application Schema
export const ApplicationSchema = PersonalInfoSchema
  .merge(EmergencyContactSchema)
  .merge(LegalStatusSchema)
  .merge(WorkHistorySchema)
  .merge(JobPreferencesSchema)
  .merge(AptitudeTestSchema);

// Token Generation Schema
export const TokenGenerationSchema = z.object({
  applicantEmail: z
    .string()
    .regex(EMAIL_REGEX, "Please enter a valid email address"),
  expiresAt: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      return new Date(date) > new Date();
    }, "Expiry date must be in the future"),
});

// Login Schema
export const LoginSchema = z.object({
  email: z
    .string()
    .regex(EMAIL_REGEX, "Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

// Utility functions for validation
export function validateSIN(sin: string): boolean {
  // Remove dashes and validate Canadian SIN using Luhn algorithm
  const digits = sin.replace(/-/g, '');
  if (digits.length !== 9) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(digits[i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
    }
    sum += digit;
  }
  
  return sum % 10 === 0;
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
}

export function formatPostalCode(postalCode: string): string {
  const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  return postalCode.toUpperCase();
}

export function formatSIN(sin: string): string {
  const cleaned = sin.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return sin;
}