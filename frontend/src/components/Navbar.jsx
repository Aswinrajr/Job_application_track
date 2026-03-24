import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { IoBriefcaseOutline, IoAdd, IoNotificationsOutline, IoLogOutOutline, IoPersonOutline } from 'react-icons/io5';
import Button from './ui/Button';
import { SearchInput } from './ui/Input';

const Navbar = ({ onAddClick }) => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-40 w-full bg-app-dark/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 gap-4">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-transform group-hover:scale-110">
                            <IoBriefcaseOutline size={22} />
                        </div>
                        <span className="hidden md:block text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                            JobTrack
                        </span>
                    </Link>

                    {/* Search - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-md">
                        <SearchInput placeholder="Search applications..." className="w-full" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button 
                            variant="primary" 
                            size="sm" 
                            onClick={onAddClick}
                            className="hidden sm:flex gap-1.5"
                        >
                            <IoAdd size={18} />
                            Add Application
                        </Button>
                        
                        {/* Mobile Add Icon */}
                        <button 
                            onClick={onAddClick}
                            className="sm:hidden p-2 rounded-lg bg-accent text-white"
                        >
                            <IoAdd size={20} />
                        </button>

                        <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

                        <button className="p-2 rounded-lg text-app-muted hover:text-white hover:bg-white/5 transition-colors relative">
                            <IoNotificationsOutline size={22} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-dark" />
                        </button>

                        {/* Profile Dropdown (Simplified for now) */}
                        <div className="flex items-center gap-3 pl-1">
                            <Link to="/dashboard/profile" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center text-accent transition-all group-hover:border-accent group-hover:bg-accent/30">
                                    <IoPersonOutline size={18} />
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-xs font-medium text-white line-clamp-1">{currentUser?.username || 'User'}</p>
                                    <p className="text-[10px] text-app-muted line-clamp-1 uppercase tracking-wider font-bold">Pro Account</p>
                                </div>
                            </Link>
                            
                            <button 
                                onClick={handleLogout}
                                className="p-2 rounded-lg text-app-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                title="Logout"
                            >
                                <IoLogOutOutline size={22} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
