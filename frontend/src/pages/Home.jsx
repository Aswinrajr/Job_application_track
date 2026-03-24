import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getApplications } from '../services/applicationService';
import { IoStatsChartOutline, IoBriefcaseOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline, IoArrowForward } from 'react-icons/io5';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function Home() {
    const [stats, setStats] = useState({
        applied: 0,
        interview: 0,
        offer: 0,
        rejected: 0,
        total: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const applications = await getApplications();
                const counts = {
                    applied: applications.filter(app => app.status.toLowerCase() === 'pending').length,
                    interview: applications.filter(app => app.status.toLowerCase() === 'interview').length,
                    offer: applications.filter(app => app.status.toLowerCase() === 'selected' || app.status.toLowerCase() === 'offer').length,
                    rejected: applications.filter(app => app.status.toLowerCase() === 'rejected').length,
                    total: applications.length
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

    const statCards = [
        { title: 'Total Applications', value: stats.total, icon: IoBriefcaseOutline, color: 'text-white', bg: 'bg-white/10' },
        { title: 'Interviews Scheduled', value: stats.interview, icon: IoStatsChartOutline, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
        { title: 'Offers Received', value: stats.offer, icon: IoCheckmarkCircleOutline, color: 'text-green-400', bg: 'bg-green-400/10' },
        { title: 'Rejected', value: stats.rejected, icon: IoCloseCircleOutline, color: 'text-red-400', bg: 'bg-red-400/10' },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-app-card border border-white/5 rounded-2xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                   <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard Overview</h1>
                   <p className="text-app-muted">Track your career progress and manage your applications efficiently.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="interview" className="px-3 py-1 uppercase tracking-tighter">Live Updates</Badge>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <Card key={idx} className="relative group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-app-muted mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl transition-transform group-hover:scale-110`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                             <Link to="/dashboard/applications" className="text-xs font-medium text-accent hover:text-accent-hover flex items-center gap-1 group/link">
                                View details <IoArrowForward className="transition-transform group-hover/link:translate-x-1" />
                             </Link>
                             <span className="text-[10px] text-app-muted">+12% from last month</span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Visual Charts & Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 min-h-[400px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Application Velocity</h3>
                            <p className="text-xs text-app-muted">Job applications over the last 30 days</p>
                        </div>
                        <select className="bg-app-border text-xs text-white border-none rounded-lg focus:ring-1 focus:ring-accent">
                            <option>Last 30 Days</option>
                            <option>Last 6 Months</option>
                        </select>
                    </div>
                    {/* Placeholder for Chart */}
                    <div className="flex-1 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center">
                         <div className="text-center">
                            <IoStatsChartOutline size={48} className="text-app-muted mx-auto mb-4 opacity-20" />
                            <p className="text-sm text-app-muted">Chart visualization will appear here</p>
                         </div>
                    </div>
                </Card>

                <Card className="min-h-[400px] flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-6">Upcoming Events</h3>
                    <div className="space-y-4">
                        {[
                            { title: 'Google Interview', time: 'Tomorrow, 10:00 AM', status: 'Interview' },
                            { title: 'Meta Follow-up', time: 'In 2 days', status: 'Applied' },
                            { title: 'Stripe Technical', time: 'Mar 28, 2:00 PM', status: 'Interview' },
                        ].map((event, i) => (
                            <div key={i} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-sm font-medium text-white group-hover:text-accent font-sans">{event.title}</h4>
                                    <Badge variant={event.status.toLowerCase()} className="scale-75 origin-top-right">{event.status}</Badge>
                                </div>
                                <p className="text-xs text-app-muted">{event.time}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
