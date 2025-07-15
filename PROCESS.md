# Project Architecture & Key Design Choices

## Overview
This project is an AI-powered Job Skill Analyzer. It consists of a React frontend, a Node.js/Express backend, and a MongoDB database. The backend integrates with Google's Gemini API for advanced generative AI capabilities.

## Architecture

### 1. Frontend (React)
- Built with React and Tailwind CSS for a modern, responsive UI.
- Communicates with the backend via RESTful API endpoints.
- Handles user interactions, displays job data, and shows AI-generated queries to display job-trading logs data and statistics.
- Uses React Router for navigation and component-based structure for maintainability and extensibility.

### 2. Backend (Node.js/Express)
- Provides RESTful APIs for the frontend.
- Handles business logic, user requests, and data processing.
- Integrates with Gemini API via the `@google/generative-ai` package to generate jobs data insights and analysis.
- Connects to MongoDB for persistent storage of job-trading logs and related data.
- Uses environment variables for configuration and API key management.

### 3. Database (MongoDB)
- Stores job logs, user queries, and analysis results.
- Managed as a Docker container for easy setup and consistency.

### 4. Gemini API Integration
- The Gemini API key is managed via environment variables for security.
- All AI-powered features are routed through a dedicated backend service (see `backend/src/services/geminiService.js`).
- Keeps API keys and sensitive logic on the server side, never exposing them to the client.

### 5. Containerization (Docker & Docker Compose)
- All components (frontend, backend, database) run in separate containers.
- `docker-compose.yml` orchestrates the services for local development and deployment.
- Environment variables are shared via a single `.env` file for consistency.

## File Structure (Key Parts)
- `frontend/` — React app
- `backend/` — Node.js/Express API server
- `backend/src/services/geminiService.js` — Handles Gemini API integration
- `.env` — Environment variables (API keys, ports, etc.)
- `docker-compose.yml` — Multi-container orchestration

## Key Design Choices

- **Separation of Concerns:** Clear division between frontend (UI/UX), backend (logic/API), and database (storage).
- **Containerization:** Containerization allows each component to scale independently and allows for easy deployment across multiple environments and operating systems.
- **Extensibility:** Modular code structure (e.g., services for Gemini integration) makes it easy to add new features or swap out AI providers.
- **Environment Management:** Centralized `.env` file for all configuration, making it easy to manage secrets and configurations.
- **React Hooks Usage:** The frontend leverages React hooks (such as `useState`, `useEffect`, and custom hooks) for state management, side effects, and code reuse, resulting in cleaner and more maintainable components.
- **Middleware Validation:** The backend uses middleware for validating incoming requests, ensuring that data is sanitized and meets required formats before reaching business logic. This improves robustness and maintainability by centralizing validation logic.

## Summary
This architecture ensures a secure, scalable, and developer-friendly environment for building and running an AI-powered job skill analyzer. The design choices focus on maintainability, security, and ease of deployment.


# AI Tools Usage

## AI agents used
- ChatGPT
- Gemini
- Claude

## Procedure

### ChatGPT
I used ChatGPT in order to create the containerized environment for my project, since ChatGPT is the best LLM that I know for small technical issues and project configurations.
I also used ChatGPT for general errors and bugs that I found in my system.

### Example Prompt:
#### Improve queries
```
The following chat message doesn't work properly:
Total jobs processed by country this week

Result query:
Generated Query Data: {
queryType: 'aggregate',
query: [ { '$match': [Object] }, { '$group': [Object] } ],
explanation: 'This query calculates the total number of jobs processed for each country this week.  Note that the week starts on Monday, July 29th, 2024 and ends on Sunday, August 4th, 2024.  Adjust the date range in the $match stage for different weeks.'
}

How can I improve the prompt?
```

**This prompt helped me realize that AI Agents don't have time perception, meaning that they are not familiar with today's date, so I needed to add the current date to the gemini prompt.** 

### Claude
Then, I used Claude to initialize a base structure for my backend and frontend code, I decided to use claude because:
- Claude has capabilities to handle complicated coding prompts and output code in great quality, quickly and efficiently. 
- Claude also handles code separation to modules and directories better than most if not all LLMs (gemini is giving a fight here).

My strategy with Claude was to build the backend first, and use it again to build the frontend based on the existing routes that I created.
I had to use multiple prompts in separate chats since Claude has a limit on output length.

### Example Prompts:
#### Backend
```
Hey,
I have a task that I need to do (details in the attached document).
I need you to help me implement the backend for the first screen.
Note that I already initialized the datatbase with the given data in the document.
The database contains many rows which can go up to millions.
The front will be written in react, so make adjustments where needed.
The backend should written in Node.js + Express, this is our initial index.json file:

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error", err));


app.get('/', (req, res) => {
res.send('Backend is working');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
Follow best practices, dividing to separate modules/directories.
Make it as simple as possible.
```

#### Frontend
```
Now create the react frontend for the first page, make it simple but look good, since it is not necessary in the task. 
Use TailwindCSS to design the UI.
Use react hooks to handle all API calls to the backend, and store the filters and dashboard data in the useState hook.
```

