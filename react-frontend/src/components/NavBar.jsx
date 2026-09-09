
import '../style/NavBar.css'
import { useNavigate } from 'react-router-dom';

export default function NavBar({showAuthButtons = false}){

    const navigate = useNavigate();

    
    return(
        <nav className="navBar">
            <div className="logo">Impala</div>
            {showAuthButtons && (
            <div className="auth-buttons">
            <button className="btn-login" onClick={()=>navigate('/login')}>Log in</button>
            <button className="btn-register" onClick={() => navigate('register')}>Register</button>
            </div>
      )}
        </nav>
    );
}

