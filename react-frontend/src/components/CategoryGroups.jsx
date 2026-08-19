import CategoryCard from './CategoryCard';
import { groupNames } from '../assets/data/categories';
import '../style/CategoryGroups.css';

export default function CategoryGroups({ 
  groups, 
  categories, 
  showRegisterButton = false ,
  
}) {
  return (
    <div className="category-groups">
      {groups.map(group => (
        <div key={group} className="category-group">
          <h2 className="group-title">
            {groupNames[group] || group}
          </h2>
          
          <div className="cards-container">
            {categories
              .filter(cat => cat.group === group)
              .map((cat) => (
                <CategoryCard 
                  key={cat.id} 
                  {...cat}
                  showRegisterButton={showRegisterButton}
                  
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}