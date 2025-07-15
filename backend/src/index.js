import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboard.js';
import chatRoutes from './routes/chat.js';
import { validateDashboardQuery } from './middleware/validation.js';
import { validateChatQuery, chatRateLimit } from './middleware/chatValidation.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Trust proxy for rate limiting
app.set('trust proxy', 1);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error", err));

app.get('/', (req, res) => {
    res.send('Backend is working');
});

// Dashboard routes
app.use('/api/dashboard', validateDashboardQuery, dashboardRoutes);

// Chat routes with validation and rate limiting
app.use('/api/chat', chatRateLimit, validateChatQuery, chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));