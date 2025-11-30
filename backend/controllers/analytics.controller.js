import Application from '../models/Application.model.js';
import { ErrorResponse } from '../utils/errorResponse.js';
import dayjs from 'dayjs';

// @desc    Get daily applications for the last 7 days
// @route   GET /api/analytics/daily
// @access  Private
export const getDailyAnalytics = async (req, res, next) => {
    try {
        const today = dayjs().endOf('day');
        const sevenDaysAgo = today.subtract(6, 'day').startOf('day');

        const dailyStats = await Application.aggregate([
            {
                $match: {
                    user: req.user._id,
                    appliedDate: {
                        $gte: sevenDaysAgo.toDate(),
                        $lte: today.toDate(),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$appliedDate' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Fill in missing days with 0 counts
        const result = [];
        for (let i = 0; i < 7; i++) {
            const date = sevenDaysAgo.add(i, 'day').format('YYYY-MM-DD');
            const found = dailyStats.find((stat) => stat._id === date);
            result.push({
                date,
                count: found ? found.count : 0,
            });
        }

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// @desc    Get weekly applications for the last 8 weeks
// @route   GET /api/analytics/weekly
// @access  Private
export const getWeeklyAnalytics = async (req, res, next) => {
    try {
        const today = dayjs().endOf('week');
        const eightWeeksAgo = today.subtract(7, 'week').startOf('week');

        const weeklyStats = await Application.aggregate([
            {
                $match: {
                    user: req.user._id,
                    appliedDate: {
                        $gte: eightWeeksAgo.toDate(),
                        $lte: today.toDate(),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$appliedDate' },
                        week: { $week: '$appliedDate' },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { '_id.year': 1, '_id.week': 1 } },
        ]);

        // Format the response
        const result = weeklyStats.map((stat) => ({
            year: stat._id.year,
            week: stat._id.week,
            count: stat.count,
        }));

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// @desc    Get monthly applications for the current year
// @route   GET /api/analytics/monthly
// @access  Private
export const getMonthlyAnalytics = async (req, res, next) => {
    try {
        const currentYear = dayjs().year();
        const startOfYear = dayjs().year(currentYear).month(0).date(1).startOf('day');
        const endOfYear = dayjs().year(currentYear).month(11).date(31).endOf('day');

        const monthlyStats = await Application.aggregate([
            {
                $match: {
                    user: req.user._id,
                    appliedDate: {
                        $gte: startOfYear.toDate(),
                        $lte: endOfYear.toDate(),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: '$appliedDate' },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Fill in all months with 0 counts
        const result = Array(12).fill(0).map((_, index) => {
            const month = index + 1;
            const found = monthlyStats.find((stat) => stat._id === month);
            return {
                month,
                count: found ? found.count : 0,
            };
        });

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// @desc    Get status distribution
// @route   GET /api/analytics/status
// @access  Private
export const getStatusDistribution = async (req, res, next) => {
    try {
        const statusStats = await Application.aggregate([
            {
                $match: {
                    user: req.user._id,
                },
            },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Ensure all statuses are included with 0 count if not present
        const statuses = ['Pending', 'Interview', 'Selected', 'Rejected'];
        const result = statuses.map((status) => ({
            status,
            count: statusStats.find((s) => s._id === status)?.count || 0,
        }));

        res.json(result);
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard summary
// @route   GET /api/analytics/summary
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
    try {
        const today = dayjs().startOf('day');
        const startOfWeek = dayjs().startOf('week');
        const startOfMonth = dayjs().startOf('month');

        const [
            totalApplications,
            todayApplications,
            thisWeekApplications,
            thisMonthApplications,
        ] = await Promise.all([
            Application.countDocuments({ user: req.user._id }),
            Application.countDocuments({
                user: req.user._id,
                appliedDate: { $gte: today.toDate() },
            }),
            Application.countDocuments({
                user: req.user._id,
                appliedDate: { $gte: startOfWeek.toDate() },
            }),
            Application.countDocuments({
                user: req.user._id,
                appliedDate: { $gte: startOfMonth.toDate() },
            }),
        ]);

        res.json({
            today: todayApplications,
            thisWeek: thisWeekApplications,
            thisMonth: thisMonthApplications,
            total: totalApplications,
        });
    } catch (error) {
        next(error);
    }
};
