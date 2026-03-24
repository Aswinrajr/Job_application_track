import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApplications } from '../services/applicationService';
import { useAuth } from '../context/AuthContext';
import { IoEllipsisHorizontal, IoCalendarOutline, IoLocationOutline, IoAdd } from 'react-icons/io5';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SearchInput } from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ApplicationList() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const statuses = ['Pending', 'Interview', 'Selected', 'Rejected'];

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getApplications();
                setApplications(data);
            } catch (err) {
                setError('Failed to fetch applications');
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchApplications();
        }
    }, [currentUser]);

    const filteredApplications = applications.filter(app => 
        app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getAppsByStatus = (status) => filteredApplications.filter(app => app.status === status);

    if (loading) {
        return (
            <div className="flex gap-6 overflow-x-auto pb-4 h-[calc(100vh-200px)]">
                {statuses.map(s => (
                    <div key={s} className="min-w-[320px] w-[320px] flex flex-col gap-4 animate-pulse">
                        <div className="h-10 bg-white/5 rounded-lg" />
                        <div className="h-32 bg-white/5 rounded-xl" />
                        <div className="h-32 bg-white/5 rounded-xl" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Applications Pipeline</h1>
                    <p className="text-sm text-app-muted">Manage and track your job applications across different stages.</p>
                </div>
                <div className="flex items-center gap-3">
                    <SearchInput 
                        placeholder="Filter by company..." 
                        className="w-64" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="secondary" size="sm">Filters</Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
                {statuses.map((status) => {
                    const statusApps = getAppsByStatus(status);
                    return (
                        <div key={status} className="min-w-[320px] w-[320px] flex flex-col bg-white/[0.02] rounded-2xl border border-white/5 p-4">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold text-white/90">{status}</h3>
                                    <span className="bg-white/10 text-app-muted px-2 py-0.5 rounded-full text-[10px] font-bold">
                                        {statusApps.length}
                                    </span>
                                </div>
                                <button className="text-app-muted hover:text-white"><IoAdd size={18} /></button>
                            </div>

                            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-thin">
                                {statusApps.map((app) => (
                                    <Link key={app._id} to={`/dashboard/applications/${app._id}`}>
                                        <Card hoverEffect className="group p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <Badge variant={app.status.toLowerCase()}>{app.jobTitle}</Badge>
                                                <button className="text-app-muted group-hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                                                    <IoEllipsisHorizontal />
                                                </button>
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-bold text-white group-hover:text-accent transition-colors">{app.companyName}</h4>
                                                <div className="flex items-center gap-3 mt-2 text-[11px] text-app-muted">
                                                    <span className="flex items-center gap-1">
                                                        <IoCalendarOutline />
                                                        {new Date(app.appliedDate).toLocaleDateString()}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <IoLocationOutline />
                                                        Remote
                                                    </span>
                                                </div>
                                            </div>

                                            {app.notes && (
                                                <p className="text-[11px] text-app-muted line-clamp-2 bg-white/5 p-2 rounded-lg italic border-l-2 border-accent/40">
                                                    "{app.notes}"
                                                </p>
                                            )}
                                        </Card>
                                    </Link>
                                ))}
                                {statusApps.length === 0 && (
                                    <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/5 rounded-xl">
                                        <p className="text-xs text-app-muted">No applications</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
