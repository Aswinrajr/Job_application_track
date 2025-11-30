import { useEffect, useState } from 'react';
import { getApplications } from '../services/applicationService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Statistics = () => {
    const [stats, setStats] = useState({
        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
        selected: 0
    });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const applications = await getApplications();

                // Calculate status counts
                const statusCounts = applications.reduce((acc, app) => {
                    const status = app.status.toLowerCase();
                    return {
                        ...acc,
                        [status]: (acc[status] || 0) + 1
                    };
                }, { applied: 0, interview: 0, offer: 0, rejected: 0, selected: 0 });

                // Prepare chart data (last 7 days)
                const today = new Date();
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const date = new Date(today);
                    date.setDate(date.getDate() - (6 - i));
                    return date.toISOString().split('T')[0];
                });

                const chartData = last7Days.map(date => {
                    const dayApps = applications.filter(app =>
                        new Date(app.appliedDate).toISOString().split('T')[0] === date
                    );

                    return {
                        date,
                        Applied: dayApps.length,
                        Interview: dayApps.filter(a => a.status.toLowerCase() === 'interview').length,
                        Offer: dayApps.filter(a => a.status.toLowerCase() === 'offer').length,
                        Rejected: dayApps.filter(a => a.status.toLowerCase() === 'rejected').length,
                        Selected: dayApps.filter(a => a.status.toLowerCase() === 'selected').length
                    };
                });

                setStats(statusCounts);
                setChartData(chartData);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStats();
    }, []);

    const statusColors = {
        applied: 'bg-blue-500',
        interview: 'bg-yellow-500',
        offer: 'bg-green-500',
        rejected: 'bg-red-500',
        selected: 'bg-purple-500'
    };

    return (
        <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Application Statistics</h2>

            {/* Status Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
                {Object.entries(stats).map(([status, count]) => (
                    <div key={status} className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <dt className="text-sm font-medium text-gray-500 capitalize">{status}</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{count}</dd>
                            <div className={`h-2 w-full ${statusColors[status] || 'bg-gray-200'} mt-2 rounded-full`}></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detailed Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Status Over Time</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="Applied" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                            <Area type="monotone" dataKey="Interview" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                            <Area type="monotone" dataKey="Offer" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                            <Area type="monotone" dataKey="Rejected" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                            <Area type="monotone" dataKey="Selected" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Statistics;