import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
import JobLog from './src/models/jobLog.js'; // adjust the path if needed

dotenv.config();

async function downloadJson(url) {
    const response = await axios.get(url);
    return response.data;
}

async function insertToMongo(data) {
    if (!Array.isArray(data)) {
        throw new Error('Expected JSON array, got something else');
    }

    const result = await JobLog.insertMany(data);
    console.log(`Inserted ${result.length} documents into 'JobLog' collection`);
}

const MONGO_URI = process.env.MONGO_URI;
const FEED_URL = process.env.FEED_URL;

if (!MONGO_URI || !FEED_URL) {
    console.error('Environment variables MONGO_URI and FEED_URL must be set.');
    process.exit(1);
}

try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Downloading JSON from:', FEED_URL);
    const data = await downloadJson(FEED_URL);

    console.log('Inserting data into MongoDB...');
    await insertToMongo(data);
} catch (err) {
    console.error('Failed to complete import:', err.message);
} finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}
