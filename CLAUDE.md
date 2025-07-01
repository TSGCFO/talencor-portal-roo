# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TalentCore Portal is a Next.js 15 employment application system with TypeScript, Tailwind CSS, and PostgreSQL. It features a secure token-based application flow where recruiters generate secure links for applicants to complete multi-step employment forms.

## Common Development Commands

```bash
# Development
npm run dev                 # Start development server with Turbopack
npm run build              # Build for production (includes Prisma generate/migrate)
npm start                  # Start production server
npm run lint               # Run ESLint
npm run type-check         # TypeScript type checking

# Database Operations
npm run db:generate        # Generate Prisma client
npm run db:migrate:dev     # Run database migrations (development)
npm run db:migrate:deploy  # Deploy migrations (production)
npm run db:push            # Push schema changes to database
npm run db:seed            # Seed database with initial data
npm run db:studio          # Open Prisma Studio

# Testing
npm run test               # Run Jest tests

# Background Services
npm run worker             # Start email processing worker
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router and Turbopack
- **Database**: PostgreSQL with Prisma ORM (optimized for Neon)
- **Authentication**: NextAuth.js with credentials provider
- **Styling**: Tailwind CSS with shadcn/ui components
- **Email**: Resend for application link delivery
- **File Upload**: UploadThing for document handling
- **Validation**: Zod schemas with React Hook Form

### Core Flow
1. Recruiters generate secure application tokens via dashboard
2. Email with secure link sent to applicants
3. Applicants complete 7-step application form
4. Applications stored with documents and aptitude test results
5. Recruiters review and score applications

### Database Models
- `Recruiter`: User authentication and management
- `ApplicationToken`: Secure access tokens with expiration
- `Application`: Complete application data with all form fields
- `ApplicationDocument`: File attachments and documents

### Key Directories
```
app/                    # Next.js App Router pages and API routes
├── api/               # API endpoints (applications, generate-link, etc.)
├── apply/[token]/     # Token-protected application form
├── dashboard/         # Recruiter management interface
components/            # Reusable React components
├── forms/            # Multi-step form components
├── dashboard/        # Dashboard-specific components
├── ui/               # shadcn/ui base components
lib/                   # Core utilities and configurations
├── auth.ts           # NextAuth configuration and token handling
├── db.ts             # Prisma client instance
├── email.ts          # Resend email service
├── validations.ts    # Zod schemas and validation helpers
prisma/               # Database schema and migrations
types/                # TypeScript type definitions
```

## Important Implementation Details

### Token Security
- 64-character hex tokens generated via `crypto.randomBytes(32)`
- 7-day expiration with single-use enforcement
- Validated on both form access and submission

### Form Validation
- Real-time field formatting for SIN, phone, postal codes
- Step-by-step validation prevents progression with errors
- Server-side Zod validation on all API endpoints
- Canadian-specific formatting (postal codes, phone numbers)

### File Handling
- UploadThing integration for secure document uploads
- Multiple file type support (PDF, images, documents)
- Automatic file size and type validation

### API Design
- RESTful endpoints with proper HTTP status codes
- Comprehensive error handling and logging
- Request validation using Zod schemas
- Session-based authentication for protected routes

## Environment Configuration

Essential environment variables:
```env
DATABASE_URL=          # PostgreSQL connection string (Neon optimized)
NEXTAUTH_URL=          # Application base URL
NEXTAUTH_SECRET=       # NextAuth session encryption key
RESEND_API_KEY=        # Email service API key
UPLOADTHING_SECRET=    # File upload service secret
UPLOADTHING_APP_ID=    # File upload app identifier
```

## Development Workflow

1. **Database Changes**: Update `prisma/schema.prisma` → run `npm run db:migrate:dev`
2. **Form Modifications**: Update validation schemas in `lib/validations.ts` + form components
3. **API Changes**: Ensure Zod validation matches frontend expectations
4. **UI Updates**: Use existing shadcn/ui components, extend in `components/ui/`

## Production Deployment

Configured for deployment on Render with:
- Standalone Next.js build output
- Automatic Prisma client generation and migrations in build process
- Security headers via Next.js config
- Health check endpoint at `/api/health`
- Background worker support for email processing

## Security Features

- HTTPS enforcement
- CSRF protection via Next.js
- SQL injection prevention via Prisma
- Input sanitization and validation
- Secure session management
- Token-based application access
- Environment variable protection