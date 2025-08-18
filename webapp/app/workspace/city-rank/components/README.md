# City Rank Components

This directory contains components specific to the city ranking functionality.

## Components

### AI Chat Interface (`ai-chat-interface.jsx`)

A responsive AI chat component that provides an interactive chat experience for users to ask questions about Sri Lankan cities, attractions, and travel tips.

#### Features:
- **Floating Chat Button**: Always accessible floating button in the bottom-right corner
- **Modal Chat Interface**: Clean, modern chat modal with smooth animations
- **Quick Questions**: Pre-defined question suggestions for easy interaction
- **Follow-up Questions**: Ability to ask follow-up questions after initial response
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Error Handling**: Graceful error handling with user-friendly messages

#### Usage:
```jsx
import AIChatInterface from './components/ai-chat-interface'

// In your component
<AIChatInterface />
```

#### Props:
Currently, the component doesn't accept any props as it's designed to be self-contained.

#### API Integration:
- Connects to `http://localhost:8080/api/chat` endpoint
- Expects POST requests with `{ message: string }` payload
- Handles responses with `answer`, `content`, or `response` fields

#### Styling:
- Uses Tailwind CSS for styling
- Follows the existing design system with primary colors
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`

#### Dependencies:
- `framer-motion` for animations
- `lucide-react` for icons
- UI components from `@/components/ui/`

### Chat Interface (`chat-interface.jsx`)

Community chat component for city-specific discussions.

### Rating Form (`rating-form.jsx`)

Component for users to rate and review cities.

### City Overview (`city-overview.jsx`)

Component to display detailed city information.

## Maintenance Notes

### AI Chat Interface Updates:
1. **API Endpoint**: Update the fetch URL if the backend endpoint changes
2. **Response Format**: Modify `formatPerplexityResponse` function if API response structure changes
3. **Quick Questions**: Update the `quickQuestions` array to include relevant questions
4. **Styling**: Modify Tailwind classes to match design system updates
5. **Error Messages**: Customize error messages in the catch blocks

### Adding New Features:
1. Create new components in this directory
2. Follow the existing naming convention
3. Add proper TypeScript types if needed
4. Include error handling
5. Make components responsive
6. Add to this README with usage examples
