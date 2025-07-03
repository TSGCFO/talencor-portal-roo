"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

// Import form steps
import PersonalInfoStep from "@/components/forms/steps/PersonalInfoStep";
import ContactInfoStep from "@/components/forms/steps/ContactInfoStep";
import LegalStatusStep from "@/components/forms/steps/LegalStatusStep";
import WorkHistoryStep from "@/components/forms/steps/WorkHistoryStep";
import JobPreferencesStep from "@/components/forms/steps/JobPreferencesStep";
import DocumentUploadStep from "@/components/forms/steps/DocumentUploadStep";
import AptitudeTestStep from "@/components/forms/steps/AptitudeTestStep";

interface TokenData {
  id: string;
  token: string;
  applicantEmail: string;
  recruiterName: string;
  expiresAt: string;
  isValid: boolean;
}

interface FormData {
  // Personal Information
  fullName: string;
  dateOfBirth: string;
  sinNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  
  // Emergency Contact
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  
  // Legal Status
  workEligibility: string;
  workPermitExpiry?: string;
  hasReliableTransport: boolean;
  hasDriversLicense: boolean;
  licenseClass?: string;
  hasVehicle: boolean;
  
  // Work History
  previousExperience: string;
  availableShifts: string[];
  physicalLimitations?: string;
  safetyEquipment?: string[];
  
  // Job Preferences
  jobTypes: string[];
  wageExpectation: string;
  startDate: string;
  isStudent: boolean;
  classSchedule?: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
  
  // Aptitude Test
  answers: string[];
  agreesToTerms: boolean;
  digitalSignature: string;
  
  // Documents
  documents: Array<{
    id?: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    documentType: string;
  }>;
}

const FORM_STEPS = [
  { number: 1, title: "Personal Information", description: "Basic personal details" },
  { number: 2, title: "Contact & Emergency", description: "Contact and emergency information" },
  { number: 3, title: "Legal Status & Transport", description: "Work eligibility and transportation" },
  { number: 4, title: "Work History & Physical", description: "Experience and physical requirements" },
  { number: 5, title: "Job Preferences", description: "Job types and availability" },
  { number: 6, title: "Document Upload", description: "Required documents" },
  { number: 7, title: "Aptitude Test & Agreement", description: "Assessment and terms" },
];

export default function ApplicationFormPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    fullName: "",
    dateOfBirth: "",
    sinNumber: "",
    phoneNumber: "",
    email: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    
    // Emergency Contact
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    
    // Legal Status
    workEligibility: "",
    hasReliableTransport: false,
    hasDriversLicense: false,
    hasVehicle: false,
    
    // Work History
    previousExperience: "",
    availableShifts: [],
    
    // Job Preferences
    jobTypes: [],
    wageExpectation: "",
    startDate: "",
    isStudent: false,
    
    // Aptitude Test
    answers: [],
    agreesToTerms: false,
    digitalSignature: "",
    
    // Documents
    documents: [],
  });

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/validate-token?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setTokenData(data.data);
        setFormData(prev => ({ ...prev, email: data.data.applicantEmail }));
      } else {
        setError(data.error || "Invalid or expired token");
      }
    } catch {
      setError("Failed to validate token");
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user updates field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateCurrentStep = (): boolean => {
    // Basic validation - you would implement comprehensive validation here
    setValidationErrors({});
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(FORM_STEPS.length, prev + 1));
    }
  };

  const previousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const submitApplication = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tokenId: tokenData?.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - show confirmation and redirect
        alert("Application submitted successfully! You will be contacted by a recruiter soon.");
        router.push("/");
      } else {
        setError(data.error || "Failed to submit application");
      }
    } catch {
      setError("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      data: formData,
      onUpdate: updateFormData,
      onNext: nextStep,
      onPrevious: previousStep,
      errors: validationErrors,
      isLoading: isSubmitting,
    };

    switch (currentStep) {
      case 1:
        return <PersonalInfoStep {...stepProps} />;
      case 2:
        return <ContactInfoStep {...stepProps} />;
      case 3:
        return <LegalStatusStep {...stepProps} />;
      case 4:
        return <WorkHistoryStep {...stepProps} />;
      case 5:
        return <JobPreferencesStep {...stepProps} />;
      case 6:
        return <DocumentUploadStep {...stepProps} />;
      case 7:
        return <AptitudeTestStep {...stepProps} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4" />
          <p className="text-gray-600">Validating access token...</p>
        </div>
      </div>
    );
  }

  if (error || !tokenData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "This application link is invalid or has expired."}
              </p>
              <Link href="/">
                <Button>Return to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progress = (currentStep / FORM_STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TalentCore Staffing</h1>
              <p className="text-sm text-gray-600">Employment Application Form</p>
            </div>
            <Link href="/">
              <Button variant="outline">Exit Application</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {FORM_STEPS.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="w-full" />
            
            <div className="mt-2">
              <h2 className="text-lg font-semibold text-gray-900">
                {FORM_STEPS[currentStep - 1]?.title}
              </h2>
              <p className="text-sm text-gray-600">
                {FORM_STEPS[currentStep - 1]?.description}
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              {renderCurrentStep()}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={previousStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              Previous
            </Button>
            
            {currentStep < FORM_STEPS.length ? (
              <Button 
                onClick={nextStep}
                disabled={isSubmitting}
              >
                Next
              </Button>
            ) : (
              <Button 
                onClick={submitApplication}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner h-4 w-4 mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Information Box */}
          <Card className="mt-8 border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-blue-800 mb-3">Application Information</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Applicant:</strong> {tokenData.applicantEmail}</p>
                <p><strong>Recruiter:</strong> {tokenData.recruiterName}</p>
                <p><strong>Expires:</strong> {new Date(tokenData.expiresAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}