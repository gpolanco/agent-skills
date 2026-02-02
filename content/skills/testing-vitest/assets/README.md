# Testing Vitest Skill - Assets

This directory contains templates and example files for the testing-vitest skill.

---

## Test Examples

### Component Test Example

Location: `component-test-example.tsx`

A complete example of testing a React component with user interactions, loading states, and accessibility checks.

### Integration Test Example

Location: `integration-test-example.ts`

Example of testing a complete feature flow including server actions, database queries, and error handling.

### Hook Test Example

Location: `hook-test-example.ts`

Example of testing custom React hooks with state management and side effects.

---

## Templates

These examples serve as templates when generating new tests. The `generate-test.js` script uses simplified versions of these patterns.

---

## Usage

Review these examples to understand best practices, then use the generator script to create your own tests:

```bash
node scripts/generate-test.js --type=component --file=src/components/ui/button.tsx
```
