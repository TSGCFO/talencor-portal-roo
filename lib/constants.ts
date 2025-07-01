// Application Constants
export const APP_NAME = "TalentCore Staffing Portal";
export const APP_DESCRIPTION = "Secure employment application portal for TalentCore Staffing Solutions";

// Canadian Provinces
export const PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "YT", label: "Yukon" },
];

// Work Eligibility Options
export const WORK_ELIGIBILITY_OPTIONS = [
  { value: "citizen", label: "Canadian Citizen" },
  { value: "permanent_resident", label: "Permanent Resident" },
  { value: "work_permit", label: "Work Permit" },
  { value: "student_visa", label: "Student Visa" },
];

// Available Shifts
export const SHIFT_OPTIONS = [
  { value: "day", label: "Day Shift (8 AM - 4 PM)" },
  { value: "evening", label: "Evening Shift (4 PM - 12 AM)" },
  { value: "night", label: "Night Shift (12 AM - 8 AM)" },
  { value: "rotating", label: "Rotating Shifts" },
  { value: "weekend", label: "Weekends Only" },
  { value: "flexible", label: "Flexible Hours" },
];

// Job Types
export const JOB_TYPES = [
  { value: "warehouse", label: "Warehouse Operations" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "construction", label: "Construction" },
  { value: "hospitality", label: "Hospitality & Service" },
  { value: "retail", label: "Retail" },
  { value: "administrative", label: "Administrative" },
  { value: "customer_service", label: "Customer Service" },
  { value: "healthcare", label: "Healthcare Support" },
  { value: "cleaning", label: "Cleaning & Janitorial" },
  { value: "food_service", label: "Food Service" },
  { value: "security", label: "Security" },
  { value: "general_labor", label: "General Labor" },
];

// Safety Equipment Options
export const SAFETY_EQUIPMENT = [
  { value: "hard_hat", label: "Hard Hat" },
  { value: "safety_glasses", label: "Safety Glasses" },
  { value: "steel_toe_boots", label: "Steel Toe Boots" },
  { value: "high_vis_vest", label: "High Visibility Vest" },
  { value: "work_gloves", label: "Work Gloves" },
  { value: "ear_protection", label: "Ear Protection" },
  { value: "respirator", label: "Respirator/Dust Mask" },
  { value: "fall_protection", label: "Fall Protection Harness" },
];

// Driver's License Classes
export const LICENSE_CLASSES = [
  { value: "G", label: "Class G (Regular Vehicle)" },
  { value: "G2", label: "Class G2 (Probationary)" },
  { value: "M", label: "Class M (Motorcycle)" },
  { value: "A", label: "Class A (Transport Truck)" },
  { value: "B", label: "Class B (School Bus)" },
  { value: "C", label: "Class C (Regular Bus)" },
  { value: "D", label: "Class D (Taxi/Emergency)" },
  { value: "E", label: "Class E (School Bus Restricted)" },
  { value: "F", label: "Class F (Regular Bus Restricted)" },
];

// Emergency Contact Relationships
export const EMERGENCY_RELATIONSHIPS = [
  { value: "spouse", label: "Spouse/Partner" },
  { value: "parent", label: "Parent" },
  { value: "child", label: "Child" },
  { value: "sibling", label: "Sibling" },
  { value: "friend", label: "Friend" },
  { value: "other_family", label: "Other Family Member" },
  { value: "other", label: "Other" },
];

// Document Types
export const DOCUMENT_TYPES = [
  { value: "resume", label: "Resume" },
  { value: "cover_letter", label: "Cover Letter" },
  { value: "id_document", label: "Government ID" },
  { value: "work_permit", label: "Work Permit" },
  { value: "certification", label: "Certification" },
  { value: "other", label: "Other" },
];

// File Upload Constraints
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain",
  ],
  ALLOWED_EXTENSIONS: [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".gif", ".txt"],
};

// Application Status Options
export const APPLICATION_STATUS = [
  { value: "pending", label: "Pending Review", color: "bg-yellow-100 text-yellow-800" },
  { value: "reviewing", label: "Under Review", color: "bg-blue-100 text-blue-800" },
  { value: "approved", label: "Approved", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" },
  { value: "on_hold", label: "On Hold", color: "bg-gray-100 text-gray-800" },
];

// Form Steps
export const FORM_STEPS = [
  { number: 1, title: "Personal Information", description: "Basic personal details" },
  { number: 2, title: "Contact & Emergency", description: "Contact and emergency information" },
  { number: 3, title: "Legal Status & Transport", description: "Work eligibility and transportation" },
  { number: 4, title: "Work History & Physical", description: "Experience and physical requirements" },
  { number: 5, title: "Job Preferences", description: "Job types and availability" },
  { number: 6, title: "Document Upload", description: "Required documents" },
  { number: 7, title: "Aptitude Test & Agreement", description: "Assessment and terms" },
];

// Aptitude Test Questions
export const APTITUDE_QUESTIONS = [
  {
    id: 1,
    question: "If you arrive at work and find your supervisor is not available, what should you do?",
    options: [
      "Wait until they return",
      "Start your usual tasks and inform them when they arrive",
      "Go home",
      "Ask other employees what to do"
    ],
    correct: 1
  },
  {
    id: 2,
    question: "You notice a safety hazard in your work area. What is your first priority?",
    options: [
      "Continue working carefully around it",
      "Report it immediately to your supervisor",
      "Fix it yourself if possible",
      "Ask a coworker to handle it"
    ],
    correct: 1
  },
  {
    id: 3,
    question: "A customer is upset about a service issue. How should you respond?",
    options: [
      "Tell them it's not your fault",
      "Listen actively and try to help resolve the issue",
      "Direct them to speak with someone else",
      "Explain why the problem occurred"
    ],
    correct: 1
  },
  {
    id: 4,
    question: "You are asked to complete a task you haven't done before. What should you do?",
    options: [
      "Attempt it on your own first",
      "Ask for proper training and guidance",
      "Refuse the task",
      "Watch others do it first"
    ],
    correct: 1
  },
  {
    id: 5,
    question: "You realize you made a mistake that could affect quality. What should you do?",
    options: [
      "Hope no one notices",
      "Report it immediately to your supervisor",
      "Try to fix it quietly",
      "Blame it on equipment malfunction"
    ],
    correct: 1
  },
  {
    id: 6,
    question: "Your shift is ending but there's still work to be completed. What should you do?",
    options: [
      "Leave on time as scheduled",
      "Stay late without authorization",
      "Inform your supervisor about the remaining work",
      "Ask a coworker to finish it"
    ],
    correct: 2
  },
  {
    id: 7,
    question: "You witness a coworker violating safety procedures. What should you do?",
    options: [
      "Ignore it if they seem experienced",
      "Politely remind them of proper procedures",
      "Report them immediately",
      "Do nothing unless asked"
    ],
    correct: 1
  },
  {
    id: 8,
    question: "You receive conflicting instructions from two supervisors. What should you do?",
    options: [
      "Follow the first instruction received",
      "Follow the instruction from the higher-ranking supervisor",
      "Clarify with both supervisors to resolve the conflict",
      "Choose the easier task"
    ],
    correct: 2
  },
  {
    id: 9,
    question: "A piece of equipment is not working properly. What should you do?",
    options: [
      "Try to repair it yourself",
      "Use it carefully despite the problem",
      "Report the issue and stop using the equipment",
      "Ask a coworker to check it"
    ],
    correct: 2
  },
  {
    id: 10,
    question: "You are running late for work due to transportation issues. What should you do?",
    options: [
      "Just arrive late without explanation",
      "Call ahead to inform your supervisor",
      "Skip work for the day",
      "Make up an excuse when you arrive"
    ],
    correct: 1
  }
];

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  INVALID_POSTAL_CODE: "Please enter a valid postal code",
  INVALID_SIN: "Please enter a valid SIN number",
  MIN_AGE: "You must be at least 16 years old",
  FILE_TOO_LARGE: "File size must be less than 10MB",
  INVALID_FILE_TYPE: "Invalid file type",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: "/api/auth/signin",
    SIGNOUT: "/api/auth/signout",
    SESSION: "/api/auth/session",
  },
  APPLICATIONS: {
    BASE: "/api/applications",
    BY_ID: (id: string) => `/api/applications/${id}`,
  },
  TOKENS: {
    GENERATE: "/api/generate-link",
    VALIDATE: "/api/validate-token",
    BASE: "/api/tokens",
    BY_ID: (id: string) => `/api/tokens/${id}`,
  },
  UPLOAD: "/api/upload",
  HEALTH: "/api/health",
};

// Default Values
export const DEFAULT_VALUES = {
  TOKEN_EXPIRY_DAYS: 7,
  PAGINATION_LIMIT: 20,
  MAX_UPLOAD_SIZE: 10 * 1024 * 1024, // 10MB
  SESSION_TIMEOUT: 24 * 60 * 60, // 24 hours in seconds
};