# 🚀 LearnPilot

> An intelligent learning platform that uses AI to automatically generate personalized educational paths, adapting to your skill level, goals, and schedule to maximize learning efficiency.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

## ✨ Features

### 🤖 AI-Powered Learning

-   **Smart Curriculum Generation**: Leverages Google's Generative AI and IQAI's Agent Development Kit
-   **Personalized Paths**: Creates custom learning sequences based on your experience level, goals, and time constraints
-   **Adaptive Difficulty**: Automatically adjusts content complexity as you progress

### 📚 Comprehensive Learning Management

-   **Interactive Dashboard**: Real-time progress tracking with visual analytics
-   **Module-Based Structure**: Organized learning with assessments and competency mapping
-   **Progress Persistence**: Your learning progress is saved across sessions
-   **Achievement System**: Earn badges and milestones as you advance

### 🎯 Personalized Experience

-   **Multiple Categories**: Frontend, Backend, Data Science, DevOps, Design, Mobile Development
-   **Flexible Pacing**: Slow, moderate, or fast learning speeds
-   **Goal-Driven Learning**: Set specific objectives and get targeted content
-   **Time-Aware Scheduling**: Adapts to your available weekly hours

## 🛠️ Tech Stack

### Frontend

-   **React 18** with TypeScript
-   **Vite** for fast development and building
-   **Tailwind CSS** for styling
-   **Radix UI** for accessible components
-   **React Router** for navigation
-   **React Query** for server state management

### Backend

-   **Express.js** server
-   **SQLite** database with Better-SQLite3
-   **CORS** enabled for cross-origin requests

### AI Integration

-   **Google Generative AI** for content generation
-   **IQAI Agent Development Kit** for curriculum design
-   **Custom AI agents** for learning path optimization

## 🚀 Quick Start

### Prerequisites

-   Node.js 18+
-   Bun (recommended) or npm/yarn

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/Damola18/learnpilot.git
    cd learnpilot
    ```

2. **Install dependencies**

    ```bash
    bun install
    # or
    npm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env
    ```

    Configure your environment variables:

    ```env
    GOOGLE_AI_API_KEY=your_google_ai_key

    # Add other required environment variables
    ```

4. **Start the development server**

    ```bash
    # Terminal 1: Start the backend server
    bun run start:server

    # Terminal 2: Start the frontend
    bun run dev
    ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
learnpilot/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   │   └── ui/             # Radix UI components
│   ├── contexts/           # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Application pages/routes
│   ├── services/           # API services and integrations
│   ├── agents/             # AI agent configurations
│   └── lib/                # Utility functions
├── server/                 # Express.js backend
│   ├── index.js           # Main server file
│   └── directStorage.js   # SQLite database operations
├── public/                 # Static assets
└── supabase/              # Supabase configuration (if used)
```

## 🎮 Usage

### Creating a Learning Path

1. **Navigate to "Create Path"** from the dashboard
2. **Fill out your profile**:

    - Domain of interest (e.g., "Frontend Development")
    - Experience level (Beginner/Intermediate/Advanced)
    - Time commitment (hours per week)

3. **Set learning goals**:

    - Define specific objectives
    - Set priority levels
    - Target competencies

4. **Configure time constraints**:

    - Timeline (weeks/months)
    - Weekly hours available
    - Preferred pace

5. **Generate & Save**: Let AI create your personalized learning path!

### Tracking Progress

-   **Dashboard Overview**: See all your active learning paths
-   **Detailed Progress**: Click on any path to view module-by-module progress
-   **Achievements**: Unlock badges as you complete milestones
-   **Analytics**: View your learning patterns and time spent

## 🔧 Available Scripts

```bash
# Development
bun run dev              # Start frontend development server
bun run start:server     # Start backend server

# Building
bun run build           # Build for production
bun run build:dev       # Build for development
bun run preview         # Preview production build

# Code Quality
bun run lint            # Run ESLint
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors

Special thanks to our amazing contributors:

-   [@Damola18](https://github.com/Damola18) - Project Lead & Core Developer
-   [@AshakaE](https://github.com/AshakaE) - Full-Stack Developer
-   [@DaWei8](https://github.com/DaWei8) - Frontend Developer

## 🙏 Acknowledgments

-   [Google Generative AI](https://ai.google.dev/) for AI capabilities
-   [IQAI](https://adk.iqai.com/) for the Agent Development Kit
-   [Radix UI](https://www.radix-ui.com/) for accessible components
-   [Tailwind CSS](https://tailwindcss.com/) for styling system

## 📞 Support

If you encounter any issues or have questions:

-   🐛 [Report a Bug](https://github.com/Damola18/learnpilot/issues)
-   💡 [Request a Feature](https://github.com/Damola18/learnpilot/issues)
