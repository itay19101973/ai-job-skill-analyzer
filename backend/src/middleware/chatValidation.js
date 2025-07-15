export const validateChatQuery = (req, res, next) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: 'Question is required' });
    }

    if (typeof question !== 'string') {
        return res.status(400).json({ error: 'Question must be a string' });
    }

    if (question.trim().length === 0) {
        return res.status(400).json({ error: 'Question cannot be empty' });
    }

    if (question.length > 500) {
        return res.status(400).json({ error: 'Question is too long (max 500 characters)' });
    }

    next();
};

// Rate limiting for chat API
export const chatRateLimit = (req, res, next) => {
    // Simple in-memory rate limiting
    const clientIP = req.ip;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 10; // 10 requests per minute

    if (!global.chatRateLimits) {
        global.chatRateLimits = new Map();
    }

    const clientData = global.chatRateLimits.get(clientIP) || { requests: [], blocked: false };

    // Clean old requests
    clientData.requests = clientData.requests.filter(timestamp => now - timestamp < windowMs);

    if (clientData.requests.length >= maxRequests) {
        return res.status(429).json({
            error: 'Too many requests. Please wait before asking another question.'
        });
    }

    clientData.requests.push(now);
    global.chatRateLimits.set(clientIP, clientData);

    next();
};