import { GET } from '@/app/api/health/route'
import { checkDatabaseConnection } from '@/lib/db'

// Mock the database connection check
jest.mock('@/lib/db', () => ({
  checkDatabaseConnection: jest.fn(),
}))

const mockedCheckDatabaseConnection = checkDatabaseConnection as jest.MockedFunction<typeof checkDatabaseConnection>

describe('/api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset environment variables
    delete process.env.npm_package_version
    delete process.env.NODE_ENV
  })

  describe('GET', () => {
    it('should return healthy status when database is connected', async () => {
      mockedCheckDatabaseConnection.mockResolvedValue(true)
      
      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.status).toBe('healthy')
      expect(data.timestamp).toBeDefined()
      expect(data.version).toBe('0.1.0')
      expect(data.environment).toBe('development')
      expect(mockedCheckDatabaseConnection).toHaveBeenCalledTimes(1)
    })

    it('should return unhealthy status when database is disconnected', async () => {
      mockedCheckDatabaseConnection.mockResolvedValue(false)
      
      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(503)
      expect(data.status).toBe('unhealthy')
      expect(data.error).toBe('Database connection failed')
      expect(data.timestamp).toBeDefined()
      expect(mockedCheckDatabaseConnection).toHaveBeenCalledTimes(1)
    })

    it('should return unhealthy status when database check throws error', async () => {
      mockedCheckDatabaseConnection.mockRejectedValue(new Error('Connection failed'))
      
      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(503)
      expect(data.status).toBe('unhealthy')
      expect(data.error).toBe('Internal server error')
      expect(data.timestamp).toBeDefined()
    })

    it('should use environment variables when available', async () => {
      process.env.npm_package_version = '1.2.3'
      process.env.NODE_ENV = 'production'
      mockedCheckDatabaseConnection.mockResolvedValue(true)
      
      const response = await GET()
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.version).toBe('1.2.3')
      expect(data.environment).toBe('production')
    })

    it('should include proper timestamp format', async () => {
      mockedCheckDatabaseConnection.mockResolvedValue(true)
      
      const response = await GET()
      const data = await response.json()
      
      expect(data.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    })
  })
})