import Application from '../models/Application.model.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import dayjs from 'dayjs';

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
export const createApplication = async (req, res, next) => {
    try {
        const { companyName, jobTitle, appliedDate, status, notes } = req.body;

        const application = await Application.create({
            user: req.user._id,
            companyName,
            jobTitle,
            appliedDate: appliedDate || Date.now(),
            status: status || 'Pending',
            notes,
        });

        res.status(201).json(application);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's applications
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res, next) => {
    try {
        const { status, search, sort } = req.query;

        // Build query
        const query = { user: req.user._id };

        // Filter by status if provided
        if (status && ['Pending', 'Interview', 'Selected', 'Rejected'].includes(status)) {
            query.status = status;
        }

        // Search functionality
        if (search) {
            query.$text = { $search: search };
        }

        // Build sort
        let sortBy = { appliedDate: -1 }; // Default sort by newest first
        if (sort === 'oldest') {
            sortBy = { appliedDate: 1 };
        } else if (sort === 'company') {
            sortBy = { companyName: 1 };
        }

        const applications = await Application.find(query).sort(sortBy);

        res.json(applications);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
export const getApplicationById = async (req, res, next) => {
    try {
        const application = await Application.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!application) {
            return next(new ErrorResponse('Application not found', 404));
        }

        res.json(application);
    } catch (error) {
        next(error);
    }
};

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
export const updateApplication = async (req, res, next) => {
    try {
        const { companyName, jobTitle, appliedDate, status, notes } = req.body;

        const application = await Application.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            {
                companyName,
                jobTitle,
                appliedDate,
                status,
                notes,
            },
            { new: true, runValidators: true }
        );

        if (!application) {
            return next(new ErrorResponse('Application not found', 404));
        }

        res.json(application);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
export const deleteApplication = async (req, res, next) => {
    try {
        const application = await Application.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!application) {
            return next(new ErrorResponse('Application not found', 404));
        }

        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
