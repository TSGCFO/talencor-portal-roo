import {
  PersonalInfoSchema,
  EmergencyContactSchema,
  LegalStatusSchema,
  WorkHistorySchema,
  JobPreferencesSchema,
  DocumentUploadSchema,
  AptitudeTestSchema,
  ApplicationSchema,
  TokenGenerationSchema,
  LoginSchema,
  validateSIN,
  formatPhoneNumber,
  formatPostalCode,
  formatSIN,
} from '@/lib/validations'

describe('Validations', () => {
  describe('validateSIN', () => {
    it('should validate correct SIN numbers', () => {
      expect(validateSIN('046-454-286')).toBe(true)
      expect(validateSIN('130-692-544')).toBe(true)
    })

    it('should reject invalid SIN numbers', () => {
      expect(validateSIN('123-456-789')).toBe(false)
      expect(validateSIN('000-000-000')).toBe(false)
      expect(validateSIN('invalid')).toBe(false)
    })

    it('should handle SINs without dashes', () => {
      expect(validateSIN('046454286')).toBe(false) // Should be formatted first
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format 10-digit numbers', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890')
    })

    it('should format 11-digit numbers with country code', () => {
      expect(formatPhoneNumber('11234567890')).toBe('+1 (123) 456-7890')
    })

    it('should return original for invalid lengths', () => {
      expect(formatPhoneNumber('123')).toBe('123')
    })
  })

  describe('formatPostalCode', () => {
    it('should format postal codes correctly', () => {
      expect(formatPostalCode('k1a0a6')).toBe('K1A 0A6')
      expect(formatPostalCode('K1A0A6')).toBe('K1A 0A6')
    })

    it('should handle codes with existing spaces', () => {
      expect(formatPostalCode('K1A 0A6')).toBe('K1A 0A6')
    })
  })

  describe('formatSIN', () => {
    it('should format SIN correctly', () => {
      expect(formatSIN('046454286')).toBe('046-454-286')
    })

    it('should return original for invalid lengths', () => {
      expect(formatSIN('123')).toBe('123')
    })
  })

  describe('PersonalInfoSchema', () => {
    const validPersonalInfo = {
      fullName: 'John Doe',
      dateOfBirth: '1990-01-01',
      sinNumber: '046-454-286',
      phoneNumber: '(123) 456-7890',
      email: 'john@example.com',
      address: '123 Main Street',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'K1A 0A6',
    }

    it('should validate correct personal info', () => {
      const result = PersonalInfoSchema.safeParse(validPersonalInfo)
      expect(result.success).toBe(true)
    })

    it('should reject invalid names', () => {
      const result = PersonalInfoSchema.safeParse({
        ...validPersonalInfo,
        fullName: 'J',
      })
      expect(result.success).toBe(false)
    })

    it('should reject names with numbers', () => {
      const result = PersonalInfoSchema.safeParse({
        ...validPersonalInfo,
        fullName: 'John123',
      })
      expect(result.success).toBe(false)
    })

    it('should reject users under 16', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() - 15)
      
      const result = PersonalInfoSchema.safeParse({
        ...validPersonalInfo,
        dateOfBirth: futureDate.toISOString().split('T')[0],
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid SIN', () => {
      const result = PersonalInfoSchema.safeParse({
        ...validPersonalInfo,
        sinNumber: '123-456-789',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid email', () => {
      const result = PersonalInfoSchema.safeParse({
        ...validPersonalInfo,
        email: 'invalid-email',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid postal code', () => {
      const result = PersonalInfoSchema.safeParse({
        ...validPersonalInfo,
        postalCode: 'invalid',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('EmergencyContactSchema', () => {
    const validEmergencyContact = {
      emergencyName: 'Jane Doe',
      emergencyPhone: '(123) 456-7890',
      emergencyRelation: 'Mother',
    }

    it('should validate correct emergency contact', () => {
      const result = EmergencyContactSchema.safeParse(validEmergencyContact)
      expect(result.success).toBe(true)
    })

    it('should reject short names', () => {
      const result = EmergencyContactSchema.safeParse({
        ...validEmergencyContact,
        emergencyName: 'J',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid phone numbers', () => {
      const result = EmergencyContactSchema.safeParse({
        ...validEmergencyContact,
        emergencyPhone: 'invalid',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('LegalStatusSchema', () => {
    const validLegalStatus = {
      workEligibility: 'citizen' as const,
      hasReliableTransport: true,
      hasDriversLicense: true,
      licenseClass: 'G',
      hasVehicle: true,
    }

    it('should validate correct legal status', () => {
      const result = LegalStatusSchema.safeParse(validLegalStatus)
      expect(result.success).toBe(true)
    })

    it('should require work permit expiry for work permit holders', () => {
      const result = LegalStatusSchema.safeParse({
        ...validLegalStatus,
        workEligibility: 'work_permit',
        // Missing workPermitExpiry
      })
      expect(result.success).toBe(false)
    })

    it('should accept valid work permit with future expiry', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      
      const result = LegalStatusSchema.safeParse({
        ...validLegalStatus,
        workEligibility: 'work_permit',
        workPermitExpiry: futureDate.toISOString().split('T')[0],
      })
      expect(result.success).toBe(true)
    })
  })

  describe('WorkHistorySchema', () => {
    const validWorkHistory = {
      previousExperience: 'I have 5 years of experience in customer service.',
      availableShifts: ['day', 'evening'],
      physicalLimitations: 'None',
      safetyEquipment: ['steel_toed_boots', 'hard_hat'],
    }

    it('should validate correct work history', () => {
      const result = WorkHistorySchema.safeParse(validWorkHistory)
      expect(result.success).toBe(true)
    })

    it('should reject short experience descriptions', () => {
      const result = WorkHistorySchema.safeParse({
        ...validWorkHistory,
        previousExperience: 'Short',
      })
      expect(result.success).toBe(false)
    })

    it('should require at least one available shift', () => {
      const result = WorkHistorySchema.safeParse({
        ...validWorkHistory,
        availableShifts: [],
      })
      expect(result.success).toBe(false)
    })
  })

  describe('JobPreferencesSchema', () => {
    const validJobPreferences = {
      jobTypes: ['general_labour', 'warehouse'],
      wageExpectation: '$18-20/hour',
      startDate: new Date().toISOString().split('T')[0],
      isStudent: false,
    }

    it('should validate correct job preferences', () => {
      const result = JobPreferencesSchema.safeParse(validJobPreferences)
      expect(result.success).toBe(true)
    })

    it('should require at least one job type', () => {
      const result = JobPreferencesSchema.safeParse({
        ...validJobPreferences,
        jobTypes: [],
      })
      expect(result.success).toBe(false)
    })

    it('should reject past start dates', () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)
      
      const result = JobPreferencesSchema.safeParse({
        ...validJobPreferences,
        startDate: pastDate.toISOString().split('T')[0],
      })
      expect(result.success).toBe(false)
    })
  })

  describe('DocumentUploadSchema', () => {
    const validDocuments = {
      documents: [
        {
          fileName: 'resume.pdf',
          fileUrl: 'https://example.com/resume.pdf',
          fileType: 'application/pdf',
          fileSize: 1024,
          documentType: 'resume' as const,
        },
      ],
    }

    it('should validate correct documents', () => {
      const result = DocumentUploadSchema.safeParse(validDocuments)
      expect(result.success).toBe(true)
    })

    it('should require at least one document', () => {
      const result = DocumentUploadSchema.safeParse({
        documents: [],
      })
      expect(result.success).toBe(false)
    })
  })

  describe('AptitudeTestSchema', () => {
    const validAptitudeTest = {
      answers: Array(10).fill('answer'),
      agreesToTerms: true,
      digitalSignature: 'John Doe',
    }

    it('should validate correct aptitude test', () => {
      const result = AptitudeTestSchema.safeParse(validAptitudeTest)
      expect(result.success).toBe(true)
    })

    it('should require exactly 10 answers', () => {
      const result = AptitudeTestSchema.safeParse({
        ...validAptitudeTest,
        answers: Array(9).fill('answer'),
      })
      expect(result.success).toBe(false)
    })

    it('should require terms agreement', () => {
      const result = AptitudeTestSchema.safeParse({
        ...validAptitudeTest,
        agreesToTerms: false,
      })
      expect(result.success).toBe(false)
    })

    it('should require digital signature', () => {
      const result = AptitudeTestSchema.safeParse({
        ...validAptitudeTest,
        digitalSignature: '',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('TokenGenerationSchema', () => {
    const validTokenGeneration = {
      applicantEmail: 'applicant@example.com',
    }

    it('should validate correct token generation', () => {
      const result = TokenGenerationSchema.safeParse(validTokenGeneration)
      expect(result.success).toBe(true)
    })

    it('should reject invalid emails', () => {
      const result = TokenGenerationSchema.safeParse({
        applicantEmail: 'invalid-email',
      })
      expect(result.success).toBe(false)
    })

    it('should validate with future expiry date', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      
      const result = TokenGenerationSchema.safeParse({
        ...validTokenGeneration,
        expiresAt: futureDate.toISOString(),
      })
      expect(result.success).toBe(true)
    })
  })

  describe('LoginSchema', () => {
    const validLogin = {
      email: 'user@example.com',
      password: 'password123',
    }

    it('should validate correct login', () => {
      const result = LoginSchema.safeParse(validLogin)
      expect(result.success).toBe(true)
    })

    it('should reject invalid emails', () => {
      const result = LoginSchema.safeParse({
        ...validLogin,
        email: 'invalid-email',
      })
      expect(result.success).toBe(false)
    })

    it('should reject short passwords', () => {
      const result = LoginSchema.safeParse({
        ...validLogin,
        password: 'short',
      })
      expect(result.success).toBe(false)
    })
  })
})