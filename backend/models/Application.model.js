import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        companyName: {
            type: String,
            required: [true, 'Please provide a company name'],
            trim: true,
            maxlength: [100, 'Company name cannot be more than 100 characters'],
        },
        jobTitle: {
            type: String,
            required: [true, 'Please provide a job title'],
            trim: true,
            maxlength: [100, 'Job title cannot be more than 100 characters'],
        },
        appliedDate: {
            type: Date,
            required: [true, 'Please provide an application date'],
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['Pending', 'Interview', 'Selected', 'Rejected'],
            default: 'Pending',
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [1000, 'Notes cannot be more than 1000 characters'],
        },
    },
    { timestamps: true }
);

// Index for faster querying
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, appliedDate: -1 });

// Add a text index for search functionality
applicationSchema.index(
    { companyName: 'text', jobTitle: 'text', notes: 'text' },
    { name: 'applications_text_search' }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
