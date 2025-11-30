import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getApplications } from '../services/applicationService';
import Statistics from '../components/Statistics';
import ApplicationChart from '../components/ApplicationChart';

export default function Home() {
    const [stats, setStats] = useState({
        total: 0,
        interviews: 0,
        offers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const applications = await getApplications();
                const counts = {
                    total: applications.length,
                    interviews: applications.filter(app =>
                        app.status.toLowerCase() === 'interview'
                    ).length,
                    offers: applications.filter(app =>
                        app.status.toLowerCase() === 'offer'
                    ).length
                };
                setStats(counts);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Welcome back! Here's what's happening with your job applications.
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-5 mb-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {stats.total}
                        </dd>
                        <div className="mt-4">
                            <Link
                                to="/dashboard/applications"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                View all applications
                                <span aria-hidden="true"> &rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Interviews</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {stats.interviews}
                        </dd>
                        <div className="mt-4">
                            <Link
                                to="/dashboard/applications?status=interview"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                View interviews
                                <span aria-hidden="true"> &rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Offers</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                            {stats.offers}
                        </dd>
                        <div className="mt-4">
                            <Link
                                to="/dashboard/applications?status=offer"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                View offers
                                <span aria-hidden="true"> &rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <Statistics />
            <ApplicationChart />
        </div>
    );
}