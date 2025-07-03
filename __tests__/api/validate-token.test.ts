import { GET } from '@/app/api/validate-token/route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { isTokenExpired } from '@/lib/auth'

// Mock dependencies
jest.mock('@/lib/db')
jest.mock('@/lib/auth', () => ({
  isTokenExpired: jest.fn(),
}))

const mockedPrisma = prisma as jest.Mocked<typeof prisma>
const mockedIsTokenExpired = isTokenExpired as jest.MockedFunction<typeof isTokenExpired>

describe('/api/validate-token', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createRequest = (token?: string) => {
    const url = token 
      ? `http://localhost:3000/api/validate-token?token=${token}`
      : 'http://localhost:3000/api/validate-token'
    return new NextRequest(url)
  }

  const mockToken = {
    id: 'token-id',
    token: 'valid-token',
    applicantEmail: 'applicant@example.com',
    expiresAt: new Date('2024-12-31'),
    usedAt: null,
    recruiter: {
      name: 'John Recruiter',
      email: 'recruiter@example.com',
    },
    application: null,
  }

  describe('GET', () => {
    it('should return error when token is missing', async () => {
      const request = createRequest()
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Token is required')
    })

    it('should return error when token is not found', async () => {
      mockedPrisma.applicationToken.findUnique.mockResolvedValue(null)
      
      const request = createRequest('invalid-token')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid token')
      expect(mockedPrisma.applicationToken.findUnique).toHaveBeenCalledWith({
        where: { token: 'invalid-token' },
        include: {
          application: {
            select: {
              id: true,
              status: true,
              submittedAt: true,
            },
          },
          recruiter: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      })
    })

    it('should return error when token is expired', async () => {
      mockedPrisma.applicationToken.findUnique.mockResolvedValue(mockToken)
      mockedIsTokenExpired.mockReturnValue(true)
      
      const request = createRequest('expired-token')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(410)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Token has expired')
      expect(mockedIsTokenExpired).toHaveBeenCalledWith(mockToken.expiresAt)
    })

    it('should return error when token is already used', async () => {
      const usedToken = {
        ...mockToken,
        usedAt: new Date('2024-01-15'),
      }
      mockedPrisma.applicationToken.findUnique.mockResolvedValue(usedToken)
      mockedIsTokenExpired.mockReturnValue(false)
      
      const request = createRequest('used-token')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(409)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Token has already been used')
    })

    it('should return valid token data when token is valid', async () => {
      mockedPrisma.applicationToken.findUnique.mockResolvedValue(mockToken)
      mockedIsTokenExpired.mockReturnValue(false)
      
      const request = createRequest('valid-token')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual({
        id: 'token-id',
        token: 'valid-token',
        applicantEmail: 'applicant@example.com',
        recruiterName: 'John Recruiter',
        recruiterEmail: 'recruiter@example.com',
        expiresAt: mockToken.expiresAt,
        isValid: true,
        hasApplication: false,
        applicationStatus: undefined,
      })
      expect(data.message).toBe('Token is valid')
    })

    it('should indicate when token has an associated application', async () => {
      const tokenWithApplication = {
        ...mockToken,
        application: {
          id: 'app-id',
          status: 'pending',
          submittedAt: new Date('2024-01-15'),
        },
      }
      mockedPrisma.applicationToken.findUnique.mockResolvedValue(tokenWithApplication)
      mockedIsTokenExpired.mockReturnValue(false)
      
      const request = createRequest('valid-token')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.data.hasApplication).toBe(true)
      expect(data.data.applicationStatus).toBe('pending')
    })

    it('should handle database errors gracefully', async () => {
      mockedPrisma.applicationToken.findUnique.mockRejectedValue(new Error('Database error'))
      
      const request = createRequest('valid-token')
      const response = await GET(request)
      const data = await response.json()
      
      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to validate token')
    })

    it('should include timestamp in all responses', async () => {
      const request = createRequest()
      const response = await GET(request)
      const data = await response.json()
      
      expect(data.timestamp).toBeDefined()
      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })
  })
})