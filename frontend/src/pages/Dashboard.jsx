import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Modal from '../components/ui/Modal';
import ApplicationForm from './ApplicationForm';
import { IoGridOutline, IoListOutline, IoPersonOutline, IoSettingsOutline } from 'react-icons/io5';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    { name: 'Overview', href: '/dashboard', icon: IoGridOutline, current: location.pathname === '/dashboard' },
    { name: 'Applications', href: '/dashboard/applications', icon: IoListOutline, current: location.pathname.startsWith('/dashboard/applications') },
    { name: 'Profile', href: '/dashboard/profile', icon: IoPersonOutline, current: location.pathname === '/dashboard/profile' },
  ];

  return (
    <div className="min-h-screen bg-app-dark flex flex-col">
      <Navbar onAddClick={() => setIsModalOpen(true)} />
      
      <div className="flex flex-1 max-w-screen-2xl mx-auto w-full">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 p-6 gap-2">
           <p className="text-[10px] font-bold text-app-muted uppercase tracking-widest mb-2 px-3">Menu</p>
           {sidebarItems.map((item) => (
             <Link
               key={item.name}
               to={item.href}
               className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                 item.current 
                   ? 'bg-accent/10 text-accent font-medium shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]' 
                   : 'text-app-muted hover:text-white hover:bg-white/5'
               }`}
             >
               <item.icon size={20} className={item.current ? 'text-accent' : 'group-hover:text-white'} />
               {item.name}
             </Link>
           ))}
           
           <div className="mt-auto">
             <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-app-muted hover:text-white hover:bg-white/5 transition-all w-full text-left">
               <IoSettingsOutline size={20} />
               Settings
             </button>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
           <Outlet />
        </main>
      </div>

      {/* Add Application Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="New Application"
        className="max-w-2xl"
      >
        <ApplicationForm onCancel={() => setIsModalOpen(false)} isModal={true} />
      </Modal>
    </div>
  );
}
