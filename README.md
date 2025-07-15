# AI Job Skill Analyzer

This project analyzes job skills using AI, with a React frontend and a Node.js/Express/MongoDB backend. It integrates with the Gemini API for generative AI features.

## Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Setup Steps

### 1. Configure Environment Variables
Copy the provided `.env` file (or ensure it exists at the root). You will need a Gemini API key (see below).

```
MONGO_URI=mongodb://mongo:27017/joblogs
API_PORT=5000
API_URL=http://localhost:5000
FRONTEND_PORT=3000
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Obtain a Gemini API Key
1. Go to the [Google AI Studio Gemini API page](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Create a new API key.
4. Copy the key and paste it into the `GEMINI_API_KEY` field in your `.env` file.

### 4. Start the Application (Recommended: Docker Compose)
```sh
docker-compose up --build
```
- The backend will be available at `http://localhost:5000`
- The frontend will be available at `http://localhost:3000`

## Project Structure
- `backend/`: Node.js/Express API server
- `frontend/`: React app
- `.env`: Environment variables (including Gemini API key)
- `docker-compose.yml`: Multi-container setup for MongoDB, backend, and frontend

## Notes
- Ensure your Gemini API key is kept secret. **Do not commit your `.env` file with the key to version control.**
- For development, you can use the included `.env` template and modify as needed.

## Troubleshooting
- If ports are busy, change `API_PORT` or `FRONTEND_PORT` in `.env`.
- Note that if you change the `API_PORT`, you need to change the `API_URL` in `.env` as well.
- MongoDB data will persist in the container unless removed.
- For any issues, check logs with:
  ```sh
  docker-compose logs
  ```

---

For more information, see the `frontend/README.md` for React-specific commands.
