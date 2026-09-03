import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import NavBar from '../../components/NavBar';
import '../../style/InstructorLayout.css'

export default function InstructorLayout({ children }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/instructor' },
    { id: 'schedule', label: 'Schedule',  path: '/instructor/schedule' },
    { id: 'vehicle', label: 'Vehicle',  path: '/instructor/vehicle' },
    { id: 'students', label: 'Students',  path: '/instructor/students' },
    { id: 'reports', label: 'Reports',  path: '/instructor/reports' },
    { id: 'profile', label: 'Profile',  path: '/instructor/profile' },
   
  ];

  const handleTabClick = (tabId, path) => {
    setActiveTab(tabId);
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken'); 
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="instructor-layout">
      <NavBar showAuthButtons={false} />
      
      <div className="layout-container">
        <aside className="sidebar">
          

          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              
              return (
                <button
                  key={item.id}
                  className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => handleTabClick(item.id, item.path)}
                >
                 
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <button className="sidebar-item logout" onClick={handleLogout}>
              
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
}