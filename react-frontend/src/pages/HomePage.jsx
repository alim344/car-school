import NavBar from '../components/NavBar';
import '../style/HomePage.css';
import CategoryGroups from '../components/CategoryGroups';
import { categories, getGroups } from '../assets/data/categories';




export default function HomePage() {
  const groups = getGroups();

  return (
    <div className="homepage">
      <NavBar showAuthButtons={true} />
      
      <div className="homepage-content">
        
        <div className="hero-section">
          <h1 className="hero-title">
            Welcome to <span className="highlight">Car School</span>
          </h1>
          
          <h2 className="hero-subtitle">
            Start Your Driving Journey Today
          </h2>
          
          <p className="hero-description">
            Choose the category that suits you best and start your journey with our certified instructors by your side.
          </p>
        </div>

        <CategoryGroups groups={groups} categories={categories} showRegisterButton={true}></CategoryGroups>
        
      </div>
    </div>
  );
}