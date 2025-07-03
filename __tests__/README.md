# TalentCore Portal - Testing Guide

## Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD (no watch mode)
npm run test:ci
```

### Running Specific Tests

```bash
# Run utility tests only
npm test utils.test.ts

# Run API tests only
npm test -- --testPathPattern=api

# Run component tests only
npm test -- --testPathPattern=components
```

## Test Structure

```
__tests__/
├── lib/
│   ├── utils.test.ts           # Core utility functions
│   └── validations.test.ts     # Schema validation tests
├── components/
│   └── ui/
│       ├── button.test.tsx     # Button component tests
│       ├── input.test.tsx      # Input component tests
│       └── card.test.tsx       # Card component tests
├── api/
│   ├── health.test.ts          # Health check API tests
│   ├── validate-token.test.ts  # Token validation API tests
│   └── applications.test.ts    # Applications API tests
├── test-coverage-report.md     # Detailed coverage analysis
└── README.md                   # This file
```

## Coverage Requirements

- **Minimum Coverage**: 85% for branches, functions, lines, and statements
- **Target Areas**: All business logic, API endpoints, form validation, and UI components
- **Coverage Reports**: Generated in `coverage/` directory

## Testing Best Practices

### 1. Test Organization
- Group related tests using `describe()` blocks
- Use descriptive test names that explain the expected behavior
- Follow the AAA pattern: Arrange, Act, Assert

### 2. Mocking Strategy
- Mock external dependencies (database, APIs, file system)
- Use realistic test data that matches production scenarios
- Mock at the module level for consistency

### 3. Test Data
- Use factory functions for generating test data
- Include edge cases and error scenarios
- Test both valid and invalid inputs

## Configuration Files

### `jest.config.js`
- Main Jest configuration
- Coverage thresholds and reporting
- Module path mapping for absolute imports

### `jest.setup.js`
- Global test environment setup
- Mock implementations for external dependencies
- Testing utilities and helpers

## Troubleshooting

### Common Issues

1. **Module Resolution Errors**
   - Check `moduleNameMapping` in `jest.config.js`
   - Ensure path aliases match `tsconfig.json`

2. **Mock Issues**
   - Verify mocks in `jest.setup.js`
   - Check mock implementations match actual API

3. **Coverage Issues**
   - Review `collectCoverageFrom` patterns
   - Exclude test files and configuration

### Debug Tips

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test file with debug info
npm test -- --testPathPattern=utils.test.ts --verbose

# Check coverage for specific files
npm run test:coverage -- --collectCoverageOnlyFrom=lib/utils.ts
```

## Integration with Development Workflow

### Pre-commit Hooks
Consider adding test runs to git hooks:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:ci"
    }
  }
}
```

### CI/CD Pipeline
Use `npm run test:ci` in your CI/CD pipeline for:
- Consistent test execution
- Coverage reporting
- No interactive prompts

## Future Testing Enhancements

1. **E2E Testing**: Add Cypress or Playwright for complete user workflows
2. **Visual Testing**: Implement screenshot comparison for UI consistency
3. **Performance Testing**: Add load testing for API endpoints
4. **Accessibility Testing**: Ensure WCAG compliance

For detailed coverage analysis, see [test-coverage-report.md](./test-coverage-report.md).