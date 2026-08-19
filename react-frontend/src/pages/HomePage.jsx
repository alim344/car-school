import NavBar from '../components/NavBar';
import CategoryCard from '../components/CategoryCard';
import { categories, getGroups, groupNames } from '../assets/data/categories';

export default function HomePage() {
  const groups = getGroups();

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      margin: 0,
      padding: 0
    }}>
      <NavBar showAuthButtons={true} />
      
      <div style={{
        paddingTop: '80px',
        paddingBottom: '60px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '32px',
        paddingRight: '32px'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px 0 60px'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            color: 'white',
            marginBottom: '10px',
            letterSpacing: '-1px'
          }}>
            Welcome to <span style={{ color: 'rgb(214, 251, 79)' }}>Car School</span>
          </h1>
          
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#e2e8f0',
            marginBottom: '16px'
          }}>
            Start Your Driving Journey Today
          </h2>
          
          <p style={{
            fontSize: '1.1rem',
            color: '#94a3b8',
            maxWidth: '600px',
            margin: '0 auto 30px',
            lineHeight: '1.6'
          }}>
            Choose the category that suits you best and start your journey with our certified instructors by your side.
          </p>
        </div>

        
        {groups.map(group => (
          <div key={group} style={{ marginBottom: '60px' }}>
            <h2 style={{
              textAlign: 'center',
              color: 'white',
              fontSize: '2.2rem',
              fontWeight: '700',
              marginBottom: '40px',
              letterSpacing: '0.5px'
            }}>
              {groupNames[group] || group}
              <span style={{
                display: 'block',
                width: '60px',
                height: '4px',
                background: 'rgb(214, 251, 79)',
                margin: '12px auto 0',
                borderRadius: '2px'
              }}></span>
            </h2>
            
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '30px',
              flexWrap: 'wrap'
            }}>
              {categories
                .filter(cat => cat.group === group)
                .map((cat) => (
                  <CategoryCard key={cat.id} {...cat} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}