# IWB (Intelligent Workspace Builder) 2025

A modern, intelligent workspace platform built with **Ballerina** backend services and **Next.js** frontend, featuring AI-powered chat functionality, job management, meetups, city guides, and more.

## 🚀 Features

### Core Functionality
- **AI-Powered Chat Assistant** - Intelligent travel and workspace guidance
- **Job Management System** - Browse and filter job opportunities
- **Meetups Platform** - Create, manage, and discover events
- **City Guide** - Interactive travel recommendations and local insights
- **User Management** - Authentication and profile management
- **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS

### Technical Highlights
- **Modular Architecture** - Clean separation of concerns
- **Real-time Chat** - Interactive AI-powered assistance
- **Responsive Design** - Mobile-first approach
- **Type Safety** - Full TypeScript support
- **Performance Optimized** - Next.js 15 with Turbopack

## 🏗️ Project Structure

```
iwb/
├── service/                 # Ballerina Backend Service
│   ├── modules/
│   │   ├── chat/           # Chat functionality
│   │   ├── city_guide/     # City guide services
│   │   ├── jobs/           # Job management
│   │   ├── meetups/        # Meetup platform
│   │   ├── users/          # User management
│   │   └── utils/          # Shared utilities
│   ├── resources/          # Database schemas
│   ├── tests/              # Backend tests
│   └── service.bal         # Main service entry point
│
├── webapp/                  # Next.js Frontend Application
│   ├── app/                # Next.js App Router
│   │   ├── workspace/      # Main workspace pages
│   │   │   ├── city-guide/ # City guide interface
│   │   │   ├── jobs/       # Job browsing
│   │   │   ├── meetups/    # Meetup management
│   │   │   └── places/     # Places discovery
│   │   ├── auth/           # Authentication pages
│   │   └── profile/        # User profile
│   ├── components/         # Reusable UI components
│   │   └── ui/            # Base UI components
│   ├── lib/               # Utility functions and hooks
│   │   ├── chat.js        # Chat API utilities
│   │   ├── useChat.js     # Chat state management
│   │   ├── chatComponents.jsx # Reusable chat UI
│   │   └── cityGuideData.js # City data
│   ├── hooks/             # Custom React hooks
│   └── public/            # Static assets
│
└── README.md              # This file
```

## 🛠️ Technology Stack

### Backend (Ballerina)
- **Ballerina** - Cloud-native programming language
- **HTTP Services** - RESTful API endpoints
- **Database Integration** - SQL operations and data management
- **CORS Support** - Cross-origin resource sharing
- **Error Handling** - Comprehensive error management

### Frontend (Next.js)
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **NextAuth.js** - Authentication

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **Ballerina** 2201.12.7+
- **npm** or **yarn**

### Backend Setup

1. **Navigate to service directory:**
   ```bash
   cd service
   ```

2. **Install Ballerina dependencies:**
   ```bash
   bal build
   ```

3. **Run the Ballerina service:**
   ```bash
   bal run
   ```
   
   The service will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to webapp directory:**
   ```bash
   cd webapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   The application will be available at `http://localhost:3000`

## 📡 API Endpoints

### Chat Service
- `POST /api/chat` - Send messages to AI assistant

### Jobs Service
- `GET /api/jobs` - Get filtered job listings
  - Query params: `positionType`, `minSalary`, `maxSalary`, `category`

### Meetups Service
- `GET /api/meetups` - Get all meetups
- `GET /api/meetups/{eventId}` - Get specific meetup
- `DELETE /api/meetups/{eventId}` - Delete meetup
- `POST /event/create` - Create new meetup

### City Guide Service
- `POST /api/chat` - City guide chat functionality

## 🎨 Key Features

### AI Chat Assistant
The platform features an intelligent chat assistant that provides:
- **Travel Recommendations** - Personalized city and destination guidance
- **Interactive Responses** - Follow-up questions and quick actions
- **Error Handling** - Graceful fallbacks with helpful tips
- **Real-time Processing** - Instant responses with loading states

### Modular Architecture
The chat functionality has been modularized for reusability:
- **`lib/chat.js`** - API utilities and text formatting
- **`lib/useChat.js`** - Custom React hook for state management
- **`lib/chatComponents.jsx`** - Reusable UI components
- **`lib/cityGuideData.js`** - Data management

### Responsive Design
- **Mobile-first** approach
- **Tailwind CSS** for consistent styling
- **Framer Motion** for smooth animations
- **Radix UI** for accessible components

## 🔧 Development

### Code Organization
- **Separation of Concerns** - Backend and frontend clearly separated
- **Modular Components** - Reusable chat components
- **Type Safety** - Full TypeScript support
- **Clean Architecture** - Well-structured file organization

### Available Scripts

#### Backend (Ballerina)
```bash
bal build          # Build the service
bal run           # Run the service
bal test          # Run tests
```

#### Frontend (Next.js)
```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## 🧪 Testing

### Backend Testing
```bash
cd service
bal test
```

### Frontend Testing
```bash
cd webapp
npm run test
```

## 🚀 Deployment

### Backend Deployment
1. Build the Ballerina service:
   ```bash
   cd service
   bal build
   ```

2. Deploy the generated JAR file to your server

### Frontend Deployment
1. Build the Next.js application:
   ```bash
   cd webapp
   npm run build
   ```

2. Deploy to Vercel, Netlify, or your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in each module

## 🔮 Roadmap

- [ ] Enhanced AI capabilities
- [ ] Real-time notifications
- [ ] Advanced job matching
- [ ] Mobile app development
- [ ] Integration with external APIs
- [ ] Performance optimizations

---

**Built with ❤️ using Ballerina and Next.js**
