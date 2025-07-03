import { GET, POST } from '@/app/api/applications/route'
import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'
import { calculateAptitudeScore } from '@/lib/utils'
import { sendApplicationConfirmationEmail } from '@/lib/email'

// Mock dependencies
jest.mock('next-auth/next')
jest.mock('@/lib/db')
jest.mock('@/lib/utils', () => ({
  ...jest.requireActual('@/lib/utils'),
  calculateAptitudeScore: jest.fn(),
}))
jest.mock('@/lib/email')

const mockedGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const mockedPrisma = prisma as jest.Mocked<typeof prisma>
const mockedCalculateAptitudeScore = calculateAptitudeScore as jest.MockedFunction<typeof calculateAptitudeScore>
const mockedSendApplicationConfirmationEmail = sendApplicationConfirmationEmail as jest.MockedFunction<typeof sendApplicationConfirmationEmail>

describe('/api/applications', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockValidToken = {
    id: 'token-id',
    recruiterEmail: 'recruiter@example.com',
    usedAt: null,
    expiresAt: new Date('2024-12-31'),
    recruiter: {
      email: 'recruiter@example.com',
      name: 'John Recruiter',
    },
  }

  const mockValidApplicationData = {
    tokenId: 'token-id',
    fullName: 'John Doe',
    dateOfBirth: '1990-01-01',
    sinNumber: '046-454-286',
    phoneNumber: '(123) 456-7890',
    email: 'john@example.com',
    address: '123 Main St',
    city: 'Toronto',
    province: 'ON',
    postalCode: 'K1A 0A6',
    emergencyName: 'Jane Doe',
    emergencyPhone: '(123) 456-7891',
    emergencyRelation: 'Mother',
    workEligibility: 'citizen',
    hasReliableTransport: true,
    hasDriversLicense: true,
    hasVehicle: true,
    previousExperience: 'I have 5 years of experience in customer service.',
    availableShifts: ['day', 'evening'],
    jobTypes: ['general_labour'],
    wageExpectation: '$18-20/hour',
    startDate: '2024-02-01',
    isStudent: false,
    answers: Array(10).fill('answer'),
    agreesToTerms: true,
    digitalSignature: 'John Doe',
    documents: [
      {
        fileName: 'resume.pdf',
        fileUrl: 'https://example.com/resume.pdf',
        fileType: 'application/pdf',
        fileSize: 1024,
        documentType: 'resume',
      },
    ],
  }

  describe('POST', () => {
    const createPostRequest = (body: any) => {
      return new NextRequest('http://localhost:3000/api/applications', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      })
    }

    it('should return error when tokenId is missing', async () => {
      const request = createPostRequest({ ...mockValidApplicationData, tokenId: undefined })
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Token ID is required')
    })

    it('should return error when token is not found', async () => {
      mockedPrisma.applicationToken.findUnique.mockResolvedValue(null)
      
      const request = createPostRequest(mockValidApplicationData)
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid token')
    })

    it('should return error when token is already used', async () => {
      const usedToken = { ...mockValidToken, usedAt: new Date() }
      mockedPrisma.applicationToken.findUnique.mockResolvedValue(usedToken)
      
      const request = createPostRequest(mockValidApplicationData)
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(409)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Token has already been used')
    })

    it('should return error when token is expired', async () => {
      const expiredToken = { ...mockValidToken, expiresAt: new Date('2020-01-01') }
      mockedPrisma.applicationToken.findUnique.mockResolvedValue(expiredToken)
      
      const request = createPostRequest(mockValidApplicationData)
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(410)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Token has expired')
    })

    it('should return error when application data is invalid', async () => {
      mockedPrisma.applicationToken.findUnique.mockResolvedValue(mockValidToken)
      
      const invalidData = { ...mockValidApplicationData, fullName: 'J' } // Too short
      const request = createPostRequest(invalidData)
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid application data')
      expect(data.details).toBeDefined()
    })

    it('should successfully create application with valid data', async () => {
      mockedPrisma.applicationToken.findUnique.mockResolvedValue(mockValidToken)
      mockedCalculateAptitudeScore.mockReturnValue(8)
      
      const mockApplication = {
        id: 'app-id',
        status: 'pending',
        aptitudeScore: 8,
        submittedAt: new Date(),
        documents: [],
        token: mockValidToken,
        recruiter: mockValidToken.recruiter,
      }
      
      mockedPrisma.application.create.mockResolvedValue(mockApplication)
      mockedPrisma.applicationDocument.createMany.mockResolvedValue({ count: 1 })
      mockedPrisma.applicationToken.update.mockResolvedValue(mockValidToken)
      mockedSendApplicationConfirmationEmail.mockResolvedValue({ success: true, data: {} })
      
      const request = createPostRequest(mockValidApplicationData)
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual({
        id: 'app-id',
        status: 'pending',
        aptitudeScore: 8,
        submittedAt: mockApplication.submittedAt,
      })
      expect(data.message).toBe('Application submitted successfully')
      
      // Verify database calls
      expect(mockedPrisma.application.create).toHaveBeenCalled()
      expect(mockedPrisma.applicationDocument.createMany).toHaveBeenCalled()
      expect(mockedPrisma.applicationToken.update).toHaveBeenCalledWith({
        where: { id: 'token-id' },
        data: { usedAt: expect.any(Date) },
      })
      expect(mockedSendApplicationConfirmationEmail).toHaveBeenCalledWith(
        'john@example.com',
        'John Doe',
        'app-id'
      )
    })

    it('should handle database errors gracefully', async () => {
      mockedPrisma.applicationToken.findUnique.mockRejectedValue(new Error('Database error'))
      
      const request = createPostRequest(mockValidApplicationData)
      const response = await POST(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to submit application')
    })
  })

  describe('GET', () => {
    const createGetRequest = (searchParams: Record<string, string> = {}) => {
      const url = new URL('http://localhost:3000/api/applications')
      Object.entries(searchParams).forEach(([key, value]) => {
        url.searchParams.set(key, value)
      })
      return new NextRequest(url.toString())
    }

    const mockSession = {
      user: { email: 'recruiter@example.com', name: 'John Recruiter' },
    }

    const mockApplications = [
      {
        id: 'app-1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '(123) 456-7890',
        status: 'pending',
        submittedAt: new Date('2024-01-15'),
        documents: [
          {
            id: 'doc-1',
            fileName: 'resume.pdf',
            documentType: 'resume',
            fileSize: 1024,
          },
        ],
        token: {
          applicantEmail: 'john@example.com',
          createdAt: new Date('2024-01-14'),
        },
      },
    ]

    it('should return error when user is not authenticated', async () => {
      mockedGetServerSession.mockResolvedValue(null)
      
      const request = createGetRequest()
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return paginated applications for authenticated user', async () => {
      mockedGetServerSession.mockResolvedValue(mockSession)
      mockedPrisma.application.findMany.mockResolvedValue(mockApplications)
      mockedPrisma.application.count.mockResolvedValue(1)
      
      const request = createGetRequest()
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.applications).toEqual(mockApplications)
      expect(data.data.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      })
    })

    it('should handle pagination parameters', async () => {
      mockedGetServerSession.mockResolvedValue(mockSession)
      mockedPrisma.application.findMany.mockResolvedValue([])
      mockedPrisma.application.count.mockResolvedValue(0)
      
      const request = createGetRequest({ page: '2', limit: '10' })
      const response = await GET(request)
      const data = await response.json()
      
      expect(mockedPrisma.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        })
      )
      expect(data.data.pagination.page).toBe(2)
      expect(data.data.pagination.limit).toBe(10)
    })

    it('should filter by status', async () => {
      mockedGetServerSession.mockResolvedValue(mockSession)
      mockedPrisma.application.findMany.mockResolvedValue([])
      mockedPrisma.application.count.mockResolvedValue(0)
      
      const request = createGetRequest({ status: 'approved' })
      await GET(request)
      
      expect(mockedPrisma.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'approved',
          }),
        })
      )
    })

    it('should filter by search term', async () => {
      mockedGetServerSession.mockResolvedValue(mockSession)
      mockedPrisma.application.findMany.mockResolvedValue([])
      mockedPrisma.application.count.mockResolvedValue(0)
      
      const request = createGetRequest({ search: 'john' })
      await GET(request)
      
      expect(mockedPrisma.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { fullName: { contains: 'john', mode: 'insensitive' } },
              { email: { contains: 'john', mode: 'insensitive' } },
              { phoneNumber: { contains: 'john' } },
            ],
          }),
        })
      )
    })

    it('should handle sorting parameters', async () => {
      mockedGetServerSession.mockResolvedValue(mockSession)
      mockedPrisma.application.findMany.mockResolvedValue([])
      mockedPrisma.application.count.mockResolvedValue(0)
      
      const request = createGetRequest({ sortBy: 'fullName', sortOrder: 'asc' })
      await GET(request)
      
      expect(mockedPrisma.application.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { fullName: 'asc' },
        })
      )
    })

    it('should handle database errors gracefully', async () => {
      mockedGetServerSession.mockResolvedValue(mockSession)
      mockedPrisma.application.findMany.mockRejectedValue(new Error('Database error'))
      
      const request = createGetRequest()
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to fetch applications')
    })
  })
})