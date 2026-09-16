import { useNavigate, useLocation } from 'react-router-dom';


import NavBar from '../../components/NavBar';
import '../../style/CandidateLayout.css'

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();


  const menuItems = [
    { id: 'schedule', label: 'Schedule',  path: '/admin' },
    { id: 'practical-exam', label: 'Practical Exam',  path: '/admin/scheduler' },
    { id: 'vehicles', label: 'Vehicles',  path: '/admin/vehicles' },
    {id: 'vehicle-request', label: 'Vehicle Requests', path: '/admin/vehicle-requests'},
    { id: 'instructor-leaves', label: 'Leave Requests',  path: '/admin/leaves' },
    { id: 'instructor-assign', label: 'Assign Instructor',  path: '/admin/assign' },
    { id: 'all-candidates', label: 'Candidates',  path: '/admin/candidates' },
    { id: 'all-instructors', label: 'Instructors',  path: '/admin/instructors' },
    
   
  ];

  const activeTab = menuItems
    .filter((item) =>
      item.path === '/admin'
        ? location.pathname === '/admin'
        : location.pathname.startsWith(item.path)
    )
    .sort((a, b) => b.path.length - a.path.length)[0]?.id || 'scheduler';

  const handleTabClick = (tabId, path) => {
   
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