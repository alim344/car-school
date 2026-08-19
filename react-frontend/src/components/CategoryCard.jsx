import '../style/CategoryCard.css';

export default function CategoryCard({ category, image, description, vehicles, duration, price, age }) {
  return (
    <div className="category-card">
     
      <div className="card-image-wrapper">
        <img src={image} alt={category} className="card-image" />
        <div className="card-category-badge">{category}</div>
      </div>
      
      
      <div className="card-content">
        <p className="card-description">{description}</p>
        <div className="card-details">
          <div className="detail-item">
            <span className="detail-label">Vehicles:</span>
            <span className="detail-value">{vehicles}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Min. Age:</span>
            <span className="detail-value">{age}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{duration}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Price:</span>
            <span className="detail-value price">{price}</span>
          </div>
        </div>
        <button className="card-btn">Register Now →</button>
      </div>
    </div>
  );
}