import { Prisma } from "@prisma/client";

// Database Types
export type Recruiter = Prisma.RecruiterGetPayload<{}>;
export type ApplicationToken = Prisma.ApplicationTokenGetPayload<{}>;
export type Application = Prisma.ApplicationGetPayload<{
  include: {
    documents: true;
    token: true;
    recruiter: true;
  };
}>;
export type ApplicationDocument = Prisma.ApplicationDocumentGetPayload<{}>;

// Form Data Types
export interface PersonalInfoData {
  fullName: string;
  dateOfBirth: string;
  sinNumber: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface EmergencyContactData {
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
}

export interface LegalStatusData {
  workEligibility: "citizen" | "permanent_resident" | "work_permit" | "student_visa";
  workPermitExpiry?: string;
  hasReliableTransport: boolean;
  hasDriversLicense: boolean;
  licenseClass?: string;
  hasVehicle: boolean;
}

export interface WorkHistoryData {
  previousExperience: string;
  availableShifts: string[];
  physicalLimitations?: string;
  safetyEquipment?: string[];
}

export interface JobPreferencesData {
  jobTypes: string[];
  wageExpectation: string;
  startDate: string;
  isStudent: boolean;
  classSchedule?: ClassScheduleItem[];
}

export interface ClassScheduleItem {
  day: string;
  startTime: string;
  endTime: string;
}

export interface DocumentUploadData {
  documents: UploadedDocument[];
}

export interface UploadedDocument {
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  documentType: "resume" | "cover_letter" | "id_document" | "work_permit" | "certification" | "other";
}

export interface AptitudeTestData {
  answers: string[];
  agreesToTerms: boolean;
  digitalSignature: string;
}

export interface ApplicationFormData
  extends PersonalInfoData,
    EmergencyContactData,
    LegalStatusData,
    WorkHistoryData,
    JobPreferencesData,
    DocumentUploadData,
    AptitudeTestData {}

// Form Step Types
export interface FormStep {
  number: number;
  title: string;
  description: string;
  isValid?: boolean;
  isCompleted?: boolean;
}

export interface FormProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  isValid: boolean;
}

// Token Related Types
export interface TokenData {
  id: string;
  token: string;
  applicantEmail: string;
  recruiterEmail: string;
  expiresAt: Date;
  isExpired: boolean;
  isUsed: boolean;
}

export interface TokenGenerationRequest {
  applicantEmail: string;
  expiresAt?: string;
}

export interface GeneratedTokenResponse {
  id: string;
  token: string;
  applicationUrl: string;
  expiresAt: Date;
  emailSent: boolean;
}

// Dashboard Types
export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  tokensGenerated: number;
  tokensUsed: number;
  tokensExpired: number;
}

export interface ApplicationSummary {
  id: string;
  fullName: string;
  email: string;
  submittedAt: Date;
  status: ApplicationStatus;
  aptitudeScore: number;
  recruiterNotes?: string;
}

export interface TokenSummary {
  id: string;
  token: string;
  applicantEmail: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date;
  isExpired: boolean;
  isUsed: boolean;
  applicationId?: string;
}

// Application Status
export type ApplicationStatus = "pending" | "reviewing" | "approved" | "rejected" | "on_hold";

// User Session Types
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthSession {
  user: SessionUser;
  expires: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Filter and Sort Types
export interface ApplicationFilters {
  status?: ApplicationStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  recruiterEmail?: string;
}

export interface SortOption {
  field: string;
  direction: "asc" | "desc";
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: SortOption;
  filters?: ApplicationFilters;
}

// File Upload Types
export interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

export interface UploadResult {
  success: boolean;
  file?: UploadedDocument;
  error?: string;
}

// Component Props Types
export interface FormStepProps {
  data: Partial<ApplicationFormData>;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  errors: Record<string, string>;
  isLoading?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

// Error Types
export interface FormError {
  field: string;
  message: string;
}

export interface ValidationError {
  errors: FormError[];
  message: string;
}

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  requiresAuth?: boolean;
}

// Theme and UI Types
export type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface AlertProps {
  variant?: "default" | "destructive" | "warning" | "success";
  title?: string;
  children: React.ReactNode;
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Database Query Types
export type IncludeApplicationRelations = {
  documents?: boolean;
  token?: boolean;
  recruiter?: boolean;
};

export type ApplicationWithRelations = Prisma.ApplicationGetPayload<{
  include: IncludeApplicationRelations;
}>;

export type RecruiterWithRelations = Prisma.RecruiterGetPayload<{
  include: {
    tokens?: boolean;
    applications?: boolean;
  };
}>;

// Email Types
export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
  path?: string;
}

// Search and Filter Types
export interface SearchParams {
  query?: string;
  status?: ApplicationStatus[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

// Chart and Analytics Types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface AnalyticsData {
  applicationsOverTime: ChartData;
  statusDistribution: ChartData;
  aptitudeScoreDistribution: ChartData;
  jobTypePreferences: ChartData;
}

// Export all types for easy importing
export type {
  Prisma,
};