# 🚀 StackPilot: Production-Grade Android Architect

StackPilot is a state-of-the-art AI-powered platform designed to help Android developers find, configure, and implement the perfect architectural components for their features. Built with a focus on premium aesthetics and developer productivity.

![StackPilot Dashboard](https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?q=80&w=2070&auto=format&fit=crop)

## ✨ Core Features

- **🎯 Intelligent Recommendations**: Get the best-fit Android dependencies (Retrofit, Room, Koin, etc.) based on your specific feature requirements and project context (Kotlin/Gradle versions).
- **🏗️ Structured Setup Steps**: Automated generation of implementation steps, including Gradle dependencies, plugin configurations, and example usage code.
- **⚡ Demo Mode**: A built-in presentation mode that allows for instant "Pro" upgrades, perfect for showcasing the application without real financial transactions.
- **🛡️ Secure Architecture**: Robust backend sanitization, JWT authentication via Clerk, and protected API routes.
- **💎 Premium UI/UX**: A stunning dark-themed interface featuring glassmorphism, smooth Framer Motion animations, and responsive design.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS (Custom Glassmorphic Design System)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Auth**: Clerk (Pro-grade Authentication)

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB (Atlas)
- **AI Engine**: OpenRouter (Llama 3 8B / Gemini Models)
- **Payments**: Stripe (Integrated with Webhooks)
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Clerk Account
- OpenRouter API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SathtikBose/StackPilot.git
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   # Create a .env file with:
   # MONGO_URI, CLERK_SECRET_KEY, OPENROUTER_API_KEY, STRIPE_SECRET_KEY, CLIENT_URL
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   # Create a .env file with:
   # VITE_CLERK_PUBLISHABLE_KEY, VITE_API_URL
   npm run dev
   ```

## 🎥 Presentation / Demo Mode

StackPilot includes a dedicated **Demo Mode** for college presentations and showcases.

- To enable: Set `DEMO_MODE=true` in your server environment variables.
- Effect: The "Upgrade Now" button will instantly grant "Pro" status without requiring a real credit card, showing off the premium user flow seamlessly.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the architecture or design system.

---
Built with ❤️ by [Sathtik Bose](https://github.com/SathtikBose)
