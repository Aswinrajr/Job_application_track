import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { getApplications } from '../services/applicationService';

const ApplicationChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const applications = await getApplications();

                // Generate last 7 days
                const last7Days = Array.from({ length: 7 }, (_, i) => {
                    const date = subDays(new Date(), 6 - i);
                    return {
                        date: format(date, 'MMM dd'),
                        applications: 0
                    };
                });

                // Count applications per day
                applications.forEach(app => {
                    const appDate = new Date(app.appliedDate);
                    const formattedDate = format(appDate, 'MMM dd');
                    const dayData = last7Days.find(d => d.date === formattedDate);
                    if (dayData) {
                        dayData.applications += 1;
                    }
                });

                setChartData(last7Days);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-white shadow rounded-lg p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Applications Overview</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}`}
                        />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'white',
                                borderRadius: '0.5rem',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                border: 'none',
                                padding: '0.75rem',
                                fontSize: '0.875rem'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="applications"
                            stroke="#6366F1"
                            fillOpacity={1}
                            fill="url(#colorApplications)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ApplicationChart;
