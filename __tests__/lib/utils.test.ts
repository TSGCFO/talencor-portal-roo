import {
  cn,
  formatDate,
  formatDateTime,
  timeAgo,
  capitalize,
  slugify,
  truncate,
  formatSIN,
  formatPhone,
  formatPostalCode,
  unique,
  groupBy,
  formatFileSize,
  getFileExtension,
  isImageFile,
  isPDFFile,
  isValidEmail,
  isValidPhone,
  isValidPostalCode,
  calculateAptitudeScore,
  generateId,
  debounce,
  throttle,
  isDevelopment,
  isProduction,
  getBaseUrl,
  isError,
  getErrorMessage,
  createApiResponse,
  createApiError,
} from '@/lib/utils'

describe('utils', () => {
  describe('cn (className utility)', () => {
    it('should merge class names correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'not-included')).toBe('base conditional')
    })

    it('should handle overlapping tailwind classes', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500')
    })
  })

  describe('Date utilities', () => {
    const testDate = new Date('2024-01-15T10:30:00Z')

    describe('formatDate', () => {
      it('should format date correctly', () => {
        const result = formatDate(testDate)
        expect(result).toMatch(/January 15, 2024/)
      })

      it('should handle string dates', () => {
        const result = formatDate('2024-01-15')
        expect(result).toMatch(/January 15, 2024/)
      })
    })

    describe('formatDateTime', () => {
      it('should format date and time correctly', () => {
        const result = formatDateTime(testDate)
        expect(result).toMatch(/Jan 15, 2024/)
        expect(result).toMatch(/\d{2}:\d{2}/)
      })
    })

    describe('timeAgo', () => {
      const now = new Date()
      
      it('should return "Just now" for recent dates', () => {
        const recent = new Date(now.getTime() - 30 * 1000)
        expect(timeAgo(recent)).toBe('Just now')
      })

      it('should return minutes ago', () => {
        const minutes = new Date(now.getTime() - 5 * 60 * 1000)
        expect(timeAgo(minutes)).toBe('5 minutes ago')
      })

      it('should return hours ago', () => {
        const hours = new Date(now.getTime() - 2 * 60 * 60 * 1000)
        expect(timeAgo(hours)).toBe('2 hours ago')
      })

      it('should return days ago', () => {
        const days = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
        expect(timeAgo(days)).toBe('3 days ago')
      })
    })
  })

  describe('String utilities', () => {
    describe('capitalize', () => {
      it('should capitalize first letter', () => {
        expect(capitalize('hello')).toBe('Hello')
      })

      it('should handle empty strings', () => {
        expect(capitalize('')).toBe('')
      })

      it('should not change already capitalized strings', () => {
        expect(capitalize('Hello')).toBe('Hello')
      })
    })

    describe('slugify', () => {
      it('should create valid slugs', () => {
        expect(slugify('Hello World!')).toBe('hello-world')
      })

      it('should handle special characters', () => {
        expect(slugify('Test & Development')).toBe('test-development')
      })

      it('should handle multiple spaces', () => {
        expect(slugify('  multiple   spaces  ')).toBe('multiple-spaces')
      })
    })

    describe('truncate', () => {
      it('should truncate long strings', () => {
        expect(truncate('This is a long string', 10)).toBe('This is a ...')
      })

      it('should not truncate short strings', () => {
        expect(truncate('Short', 10)).toBe('Short')
      })

      it('should handle exact length', () => {
        expect(truncate('ExactLength', 11)).toBe('ExactLength')
      })
    })
  })

  describe('Input formatting utilities', () => {
    describe('formatSIN', () => {
      it('should format SIN correctly', () => {
        expect(formatSIN('123456789')).toBe('123-456-789')
      })

      it('should handle partial SINs', () => {
        expect(formatSIN('123')).toBe('123')
        expect(formatSIN('123456')).toBe('123-456')
      })

      it('should strip non-numeric characters', () => {
        expect(formatSIN('1a2b3c4d5e6f7g8h9i')).toBe('123-456-789')
      })
    })

    describe('formatPhone', () => {
      it('should format phone numbers correctly', () => {
        expect(formatPhone('1234567890')).toBe('(123) 456-7890')
      })

      it('should handle partial numbers', () => {
        expect(formatPhone('123')).toBe('123')
        expect(formatPhone('123456')).toBe('(123) 456')
      })
    })

    describe('formatPostalCode', () => {
      it('should format postal codes correctly', () => {
        expect(formatPostalCode('k1a0a6')).toBe('K1A 0A6')
      })

      it('should handle short codes', () => {
        expect(formatPostalCode('k1a')).toBe('K1A')
      })
    })
  })

  describe('Array utilities', () => {
    describe('unique', () => {
      it('should remove duplicates', () => {
        expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
      })

      it('should work with strings', () => {
        expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
      })
    })

    describe('groupBy', () => {
      it('should group objects by key', () => {
        const items = [
          { category: 'A', value: 1 },
          { category: 'B', value: 2 },
          { category: 'A', value: 3 },
        ]
        const result = groupBy(items, 'category')
        expect(result.A).toHaveLength(2)
        expect(result.B).toHaveLength(1)
      })
    })
  })

  describe('File utilities', () => {
    describe('formatFileSize', () => {
      it('should format bytes correctly', () => {
        expect(formatFileSize(0)).toBe('0 Bytes')
        expect(formatFileSize(1024)).toBe('1 KB')
        expect(formatFileSize(1048576)).toBe('1 MB')
      })
    })

    describe('getFileExtension', () => {
      it('should extract file extensions', () => {
        expect(getFileExtension('test.pdf')).toBe('pdf')
        expect(getFileExtension('image.JPG')).toBe('jpg')
      })
    })

    describe('isImageFile', () => {
      it('should identify image files', () => {
        expect(isImageFile('test.jpg')).toBe(true)
        expect(isImageFile('test.png')).toBe(true)
        expect(isImageFile('test.pdf')).toBe(false)
      })
    })

    describe('isPDFFile', () => {
      it('should identify PDF files', () => {
        expect(isPDFFile('test.pdf')).toBe(true)
        expect(isPDFFile('test.jpg')).toBe(false)
      })
    })
  })

  describe('Validation utilities', () => {
    describe('isValidEmail', () => {
      it('should validate email addresses', () => {
        expect(isValidEmail('test@example.com')).toBe(true)
        expect(isValidEmail('invalid-email')).toBe(false)
        expect(isValidEmail('test@')).toBe(false)
      })
    })

    describe('isValidPhone', () => {
      it('should validate phone numbers', () => {
        expect(isValidPhone('(123) 456-7890')).toBe(true)
        expect(isValidPhone('123-456-7890')).toBe(true)
        expect(isValidPhone('invalid')).toBe(false)
      })
    })

    describe('isValidPostalCode', () => {
      it('should validate Canadian postal codes', () => {
        expect(isValidPostalCode('K1A 0A6')).toBe(true)
        expect(isValidPostalCode('k1a0a6')).toBe(true)
        expect(isValidPostalCode('invalid')).toBe(false)
      })
    })
  })

  describe('calculateAptitudeScore', () => {
    it('should calculate correct scores', () => {
      const perfectAnswers = [
        'have', 'which', 'is', 'for', 'pairs', 
        '90%', '3 days', '5 toner cartridges', '$212.55', '$13.80'
      ]
      expect(calculateAptitudeScore(perfectAnswers)).toBe(10)
    })

    it('should handle partial correct answers', () => {
      const partialAnswers = [
        'have', 'wrong', 'is', 'wrong', 'pairs', 
        '90%', 'wrong', '5 toner cartridges', 'wrong', '$13.80'
      ]
      expect(calculateAptitudeScore(partialAnswers)).toBe(6)
    })

    it('should handle all wrong answers', () => {
      const wrongAnswers = Array(10).fill('wrong')
      expect(calculateAptitudeScore(wrongAnswers)).toBe(0)
    })
  })

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(id1).toHaveLength(9)
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()
    
    it('should debounce function calls', () => {
      const fn = jest.fn()
      const debouncedFn = debounce(fn, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      expect(fn).not.toHaveBeenCalled()
      
      jest.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })

  describe('throttle', () => {
    jest.useFakeTimers()
    
    it('should throttle function calls', () => {
      const fn = jest.fn()
      const throttledFn = throttle(fn, 100)
      
      throttledFn()
      throttledFn()
      throttledFn()
      
      expect(fn).toHaveBeenCalledTimes(1)
      
      jest.advanceTimersByTime(100)
      throttledFn()
      expect(fn).toHaveBeenCalledTimes(2)
    })
  })

  describe('Environment utilities', () => {
    describe('isDevelopment', () => {
      it('should return true in development', () => {
        const originalEnv = process.env.NODE_ENV
        process.env.NODE_ENV = 'development'
        expect(isDevelopment()).toBe(true)
        process.env.NODE_ENV = originalEnv
      })
    })

    describe('isProduction', () => {
      it('should return true in production', () => {
        const originalEnv = process.env.NODE_ENV
        process.env.NODE_ENV = 'production'
        expect(isProduction()).toBe(true)
        process.env.NODE_ENV = originalEnv
      })
    })
  })

  describe('Error handling utilities', () => {
    describe('isError', () => {
      it('should identify Error objects', () => {
        expect(isError(new Error('test'))).toBe(true)
        expect(isError('string')).toBe(false)
        expect(isError({})).toBe(false)
      })
    })

    describe('getErrorMessage', () => {
      it('should extract error messages', () => {
        expect(getErrorMessage(new Error('test message'))).toBe('test message')
        expect(getErrorMessage('string error')).toBe('string error')
        expect(getErrorMessage(123)).toBe('123')
      })
    })
  })

  describe('API response utilities', () => {
    describe('createApiResponse', () => {
      it('should create successful responses', () => {
        const response = createApiResponse({ id: 1 }, 'Success')
        expect(response.success).toBe(true)
        expect(response.data).toEqual({ id: 1 })
        expect(response.message).toBe('Success')
        expect(response.timestamp).toBeDefined()
      })
    })

    describe('createApiError', () => {
      it('should create error responses', () => {
        const error = createApiError('Something went wrong', 500)
        expect(error.success).toBe(false)
        expect(error.error).toBe('Something went wrong')
        expect(error.timestamp).toBeDefined()
      })
    })
  })
})