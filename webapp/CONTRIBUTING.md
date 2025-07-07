## Contributing Guide

## Project Overview

Built with **Next.js** App Router + **shadcn/ui** components.

## Project Structure

### Core Directories

- **`app/`** - Next.js App Router pages and layouts
  - `app/page.jsx` - Landing page 
  - `app/layout.jsx` - Root layout 
  - `app/workspace/` - Main dashboard area **(PRIMARY DEVELOPMENT AREA)**

- **`components/`** - UI components
  - `components/ui/` - shadcn/ui components
  - `components/` (root) - Custom and feature-specific components

- **`lib/`** - Utility functions and shared logic
- **`public/`** - Static assets

### UI Component Guidelines

- **all necessary shadcn/ui components** already exist in `components/ui/`, noneed to add new component there
- **Feature-specific or one-off components** go in root `components/` directory

## Development Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Getting Started

1. clone the forked repo
2. install dependencies:
   ```bash
   npm install
   ```
3. start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - start development server with turbopack
- `npm run build` - build the application for production
- `npm run start` - start the production server
- `npm run lint` - run eslint to check code quality

## Development Guidelines

### Critical Rules

- **DON'T PUSH BUGGY CODE** - fix issues before submitting
- **RESPECT EXISTING STRUCTURE** - keep the codebase clean and consistent


### Code Quality Standards

#### Naming Conventions
- use **clear, descriptive names** for functions and variables
- names should describe what they do
- add comments when the purpose isn't obvious

#### Function Design
- break complex tasks into **smaller, reusable functions**
- keep functions focused on one thing

#### Comments and Documentation
- comment complex logic so others can understand it
- add `//TODO` flags for incomplete stuff or future improvements

#### Code Organization
- **DON'T OVERCOMPLICATE THE CODE, KEEP IT SIMPLE**

### Component Development

#### When to Create Components

**Add to `components/` (root):**
- Feature-specific components
- One-off components that won't be reused
- Page-specific components

#### Available shadcn/ui Components

the project includes a comprehensive set of shadcn/ui components:
- forms: `input`, `textarea`, `select`, `checkbox`, `radio-group`, `form`
- navigation: `navigation-menu`, `menubar`, `breadcrumb`, `pagination`
- feedback: `alert`, `alert-dialog`, `dialog`, `tooltip`, `sonner`
- data Display: `table`, `card`, `badge`, `avatar`, `separator`
- layout: `sidebar`, `sheet`, `tabs`, `accordion`, `collapsible`
- interactive: `button`, `dropdown-menu`, `context-menu`, `popover`
- and many more...

check out these docs to see how each component works:
https://ui.shadcn.com/docs/components

## Contribution Workflow

### 1. Before You Start
- check out the [Next.js App Router docs](https://nextjs.org/docs/app)

### 2. Making Changes
- create a new branch from `main`
- make changes in the `app/workspace` directory
- follow the coding standards above
- test your changes

### 3. Submitting Changes
- make sure your code follows the project conventions
- write clear commit messages
- create a pull request with description
- link related issues if any

### 4. Pull Request Guidelines
- **Title:** Clear, descriptive title
- **Description:** Explain what you changed and why
- **Screenshots (Optional):** Include screenshots for UI changes

## Learning Resources

### Next.js App Router
- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app/building-your-application/routing)
- [React Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### shadcn/ui
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Component Examples](https://ui.shadcn.com/docs/components)

### React & JavaScript
- [React Documentation](https://react.dev/)
- [JavaScript Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)


**Remember:** keep it clean and follow existing patterns. ask if unsure.

happy coding!