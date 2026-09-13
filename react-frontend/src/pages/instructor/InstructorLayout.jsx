import { useNavigate, useLocation} from 'react-router-dom';


import NavBar from '../../components/NavBar';
import '../../style/InstructorLayout.css'

export default function InstructorLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/instructor' },
    { id: 'schedule', label: 'Schedule',  path: '/instructor/schedule' },
    { id: 'notifications', label: 'Notifications',  path: '/instructor/notif' },
    { id: 'vehicle', label: 'Vehicle',  path: '/instructor/vehicle' },
    { id: 'students', label: 'Candidates',  path: '/instructor/candidates' },
    { id: 'leave', label: 'Leave Request',  path: '/instructor/leave-request' },
    { id: 'profile', label: 'Profile',  path: '/instructor/profile' },

   
  ];

  const handleTabClick = (tabId, path) => {
   
    navigate(path);
  };

   const activeTab = menuItems
    .filter((item) =>
      item.path === '/instructor'
        ? location.pathname === '/instructor'
        : location.pathname.startsWith(item.path)
    )
    .sort((a, b) => b.path.length - a.path.length)[0]?.id || 'dashboard';

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