import mongoose from 'mongoose';

const jobLogSchema = new mongoose.Schema({
    _id: String,
    country_code: String,
    currency_code: String,
    progress: {
        SWITCH_INDEX: Boolean,
        TOTAL_RECORDS_IN_FEED: Number,
        TOTAL_JOBS_FAIL_INDEXED: Number,
        TOTAL_JOBS_IN_FEED: Number,
        TOTAL_JOBS_SENT_TO_ENRICH: Number,
        TOTAL_JOBS_DONT_HAVE_METADATA: Number,
        TOTAL_JOBS_DONT_HAVE_METADATA_V2: Number,
        TOTAL_JOBS_SENT_TO_INDEX: Number
    },
    status: String,
    timestamp: Date,
    transactionSourceName: String,
    noCoordinatesCount: Number,
    recordCount: Number,
    uniqueRefNumberCount: Number
});

// Add indexes for better query performance
jobLogSchema.index({ timestamp: -1 });
jobLogSchema.index({ transactionSourceName: 1 });
jobLogSchema.index({ country_code: 1 });
jobLogSchema.index({ status: 1 });

export default mongoose.model('JobLog', jobLogSchema);