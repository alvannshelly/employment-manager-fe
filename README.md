# Employee Management Frontend

A modern web application for managing company employee information, built with Next.js 15 and TypeScript.

## Core Features

✅ **Employee Dashboard**

- View all active employees
- Card-based layout with key information
- Status indicators
- Direct report counts

✅ **Employee Details**

- Modal-based detailed view
- Direct reports listing
- Edit capabilities
- Status management

✅ **Search and Filtering**

- Name search with debouncing
- Position filtering
- Hire date range filtering
- Pagination support

✅ **Employee Management**

- Create new employees
- Edit existing employees
- Deactivate employees
- Manage direct reports

## Enhanced Features 🌟

### Modern UI/UX 🌟

- Responsive design
- Dark mode support
- Loading states
- Error handling
- Form validation
- Modal interactions

### Advanced Form Handling 🌟

- Form validation with Yup
- React Hook Form integration
- Date formatting
- Error messages
- Loading states

### State Management 🌟

- Custom hooks
- Axios for API calls
- Error handling
- Loading states
- Data caching

### Performance Optimizations 🌟

- Debounced search
- Pagination
- Configurable page size
- Optimized re-renders
- Error boundaries

## Technical Details

### Dependencies

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Axios
- React Hook Form
- Yup Validation
- HeadlessUI
- Heroicons

### Project Structure

```bash
src/
├── api/ # API integration
├── app/ # Next.js app router
├── components/ # React components
├── hooks/ # Custom hooks
├── types/ # TypeScript types
└── utils/ # Utility functions
```

## Component Documentation

### Employee List

- Main dashboard component
- Manages employee data
- Implements search and filtering
- Handles pagination

### Employee Card

- Individual employee display
- Shows key information
- Handles deactivation
- Opens detailed view

### Employee Details

- Modal-based detailed view
- Shows complete employee information
- Manages direct reports
- Enables editing

### Forms

- Add Employee Form
- Edit Employee Form
- Search and Filter Forms
- Form validation

## Getting Started

1. Prerequisites:

   - Node.js 18+
   - npm/yarn/pnpm

2. Installation:

```bash
npm install
or
yarn install
or
pnpm install
```

3. Environment Setup:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

4. Run the development server:

```bash
npm run dev
or
yarn dev
or
pnpm dev
```

5. Access the application at `http://localhost:3000`

## Development Notes

### API Integration

- Axios instance with base configuration
- Error handling middleware
- Response type definitions
- Environment-based URLs

### State Management

- Custom hooks for data fetching
- Loading states
- Error handling
- Data caching

### Styling

- Tailwind CSS for styling
- Responsive design
- Dark mode support
- Custom components

### Form Handling

- React Hook Form for form state
- Yup for validation
- Custom input components
- Error messages

## Testing

### Component Testing

- Jest for unit testing
- React Testing Library
- Mock API responses
- Event handling

### Test Categories

✅ Component Rendering

- Initial state
- Loading states
- Error states
- Data display

✅ User Interactions

- Form submissions
- Search functionality
- Filtering
- Pagination

✅ API Integration

- Data fetching
- Error handling
- Loading states
- Cache management

### Running Tests

#### Run all tests

```bash
npm test
```

#### Run with coverage

```bash
npm test -- --coverage
```
