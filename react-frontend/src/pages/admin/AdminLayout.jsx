import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import NavBar from '../../components/NavBar';
import '../../style/CandidateLayout.css'

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    
    { id: 'practical-exam', label: 'Practical Exam',  path: '/admin' },
    { id: 'reports', label: 'Reports',  path: '/candidate/reports' },
    { id: 'profile', label: 'Profile',  path: '/candidate/profile' },
   
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