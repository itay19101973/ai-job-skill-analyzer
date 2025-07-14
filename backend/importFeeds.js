import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';

dotenv.config();

const COLLECTION_NAME = 'feeds';

// Define the schema for a feed item to avoid typing issues later
const feedSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    country_code: { type: String, required: true },
    currency_code: { type: String, required: true },
    progress: {
        SWITCH_INDEX: { type: Boolean, required: true },
        TOTAL_RECORDS_IN_FEED: { type: Number, required: true },
        TOTAL_JOBS_FAIL_INDEXED: { type: Number, required: true },
        TOTAL_JOBS_IN_FEED: { type: Number, required: true },
        TOTAL_JOBS_SENT_TO_ENRICH: { type: Number, required: true },
        TOTAL_JOBS_DONT_HAVE_METADATA: { type: Number, required: true },
        TOTAL_JOBS_DONT_HAVE_METADATA_V2: { type: Number, required: true },
        TOTAL_JOBS_SENT_TO_INDEX: { type: Number, required: true },
    },
    status: { type: String, required: true },
    timestamp: { type: Date, required: true },
    transactionSourceName: { type: String, required: true },
    noCoordinatesCount: { type: Number, required: true },
    recordCount: { type: Number, required: true },
    uniqueRefNumberCount: { type: Number, required: true },
}, { collection: COLLECTION_NAME });

const Feed = mongoose.model(COLLECTION_NAME, feedSchema);

async function downloadJson(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        console.error('Error downloading JSON:', err.message);
        throw err;
    }
}

async function insertToMongo(data) {
    try {
        if (!Array.isArray(data)) {
            throw new Error('Expected JSON array, got something else');
        }
        const result = await Feed.insertMany(data);
        console.log(`Inserted ${result.length} documents into '${COLLECTION_NAME}'`);
    } catch (err) {
        console.error('MongoDB Insert Error:', err.message);
    }
}

(async () => {
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

        console.log('⬇Downloading JSON from:', FEED_URL);
        const data = await downloadJson(FEED_URL);

        console.log('Inserting data into MongoDB...');
        await insertToMongo(data);

    } catch (err) {
        console.error('Failed to complete import:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
})();
