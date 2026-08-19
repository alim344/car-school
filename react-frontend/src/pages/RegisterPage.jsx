import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../style/RegisterPage.css';
import axios from 'axios';

export default function RegisterPage() {
  const navigate = useNavigate();
  
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    category: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'AM', label: 'Category AM - Mopeds' },
    { value: 'A1', label: 'Category A1 - Light Motorcycles' },
    { value: 'A2', label: 'Category A2 - Mid Motorcycles' },
    { value: 'A', label: 'Category A - Unrestricted Motorcycles' },
    { value: 'B1', label: 'Category B1 - Light Quadricycles' },
    { value: 'B', label: 'Category B - Passenger Cars' },
    { value: 'BE', label: 'Category BE - Cars with Trailer' },
    { value: 'C1', label: 'Category C1 - Light Trucks' },
    { value: 'C', label: 'Category C - Trucks' },
    { value: 'CE', label: 'Category CE - Trucks with Trailer' },
    { value: 'D1', label: 'Category D1 - Minibuses' },
    { value: 'D', label: 'Category D - Buses' },
    { value: 'DE', label: 'Category DE - Buses with Trailer' },
    { value: 'F', label: 'Category F - Tractors' },
    { value: 'M', label: 'Category M - Mopeds' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!registerData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!registerData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!registerData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!registerData.email.trim()) {
      newErrors.email = 'Email is required';
    } 
    if (!registerData.password) {
      newErrors.password = 'Password is required';
    }
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!registerData.confirmPassword) {
    newErrors.confirmPassword = 'Please confirm your password';
    }
    if (!registerData.category) {
      newErrors.category = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const register = async (userData) =>{

    try{
        const response = await axios.post('http://localhost:8080/auth/register',userData)
        return response.data;
    } catch (error) {

    console.error('Registration error:', error);
    
   
    alert(error.message || 'An error occurred during registration.');
    
  } finally {
    setIsSubmitting(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

   

    try {
       const userData = { ...registerData };
       delete userData.confirmPassword;
      
      
      const response = await register(userData);
      console.log('Registration successful:', response);
      alert('You have successfully registered!');
      navigate('/');

    } catch (error) {
      alert('An error occurred during registration.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <NavBar showAuthButtons={false} />
      
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h1>CREATE YOUR PROFILE</h1>
            <p>Begin your journey in safe hands</p>
          </div>

          <hr className="divider" />

          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-section">
              <h2>Personal Info</h2>

              <div className="form-row">
                <div className="form-group">
                  <label >First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={registerData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label >Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={registerData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label >Username</label>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={registerData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className={errors.username ? 'error' : ''}
                  />
                  {errors.username && <span className="error-message">{errors.username}</span>}
                </div>

                <div className="form-group">
                  <label >Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label >Password</label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={registerData.password}
                    onChange={handleChange}
                    placeholder="Enter a strong password"
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label >Confirm Password</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>
            </div>

           
            <div className="form-section">
              <h2>Course Selection</h2>
              <p className="section-description">Choose the driving category you want to register for</p>

              <div className="form-group">
                <label htmlFor="category">Select Category</label>
                <select
                  id="category"
                  name="category"
                  value={registerData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Choose a category..</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>
            </div>

            <button 
              type="submit" 
              className="register-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}