# BookCraft - Digital Book Creator

## Overview

BookCraft is a React-based digital book creation platform with a drag-and-drop editor and realistic page-flipping viewer. The application allows users to create interactive digital books using pre-designed templates and view them with smooth page-turning animations. The platform features a modern UI built with shadcn/ui components and Tailwind CSS, providing an intuitive book creation experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React with TypeScript**: The client application is built using React 18 with TypeScript for type safety and better development experience. The application uses functional components with hooks for state management.

**UI Framework**: Utilizes shadcn/ui components built on top of Radix UI primitives for consistent, accessible design patterns. The component library provides a complete set of UI elements including dialogs, buttons, forms, and navigation components.

**Styling**: Tailwind CSS with custom design tokens for BookCraft branding. CSS variables are used for theming support with a neutral color scheme as the base. Custom BookCraft colors are defined for primary branding elements.

**Routing**: Client-side routing implemented with Wouter, a lightweight routing library. The application has three main routes: landing page, editor, and viewer.

**State Management**: React Query (TanStack Query) for server state management and caching. Local state is managed with React hooks, and browser localStorage is used for persisting book projects.

**Animations**: Framer Motion for smooth page transitions and realistic book flipping animations. The viewer component provides an immersive reading experience with page-turning effects.

### Backend Architecture

**Express.js Server**: Node.js backend using Express with TypeScript. The server provides API endpoints and serves the React application in production.

**Development Setup**: Vite for fast development builds and hot module replacement. The development server integrates with the Express backend for a seamless development experience.

**Storage Interface**: Abstracted storage layer with in-memory implementation for development. The IStorage interface defines CRUD operations for users and can be extended for book projects.

**Middleware**: Custom logging middleware for API requests, request parsing for JSON and URL-encoded data, and error handling middleware for consistent error responses.

### Data Storage Solutions

**Local Storage**: Browser localStorage is used for persisting book projects on the client side. The LocalStorage class provides methods for creating, saving, retrieving, and deleting book projects.

**Database Schema**: Drizzle ORM schema defines a projects table with PostgreSQL support. Projects contain title, pages (stored as JSONB), and timestamp fields. The schema is configured for use with Neon Database.

**In-Memory Storage**: MemStorage class provides a simple in-memory implementation of the storage interface for development and testing purposes.

### Authentication and Authorization

Currently, the application does not implement authentication. The storage interface includes basic user management methods (getUser, getUserByUsername, createUser) that can be extended when authentication is added.

## External Dependencies

**UI Components**: 
- Radix UI primitives for accessible component foundations
- shadcn/ui for pre-built component library
- Lucide React for consistent iconography

**Development Tools**:
- Vite for build tooling and development server
- Replit plugins for development environment integration
- esbuild for production server bundling

**Database and ORM**:
- Drizzle ORM for type-safe database operations
- Neon Database (PostgreSQL) for cloud database hosting
- Drizzle Kit for database migrations and schema management

**Styling and Animation**:
- Tailwind CSS for utility-first styling
- Framer Motion for animations and transitions
- class-variance-authority for component variant management

**State Management**:
- TanStack React Query for server state and caching
- React Hook Form with Zod resolvers for form management

**Utilities**:
- clsx and tailwind-merge for conditional class names
- date-fns for date manipulation
- nanoid for unique ID generation
- cmdk for command palette functionality