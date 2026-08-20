import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useState } from "react";
import '../style/LoginPage.css';

export default function LoginPage(){




    const navigate = useNavigate();

    const [email,setEmail] = useState("");
    const[password,setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleEmail = (e) =>{
        setEmail(e.target.value);
        setSubmitted(false);
    }

    const handlePassword = (e) =>{
        setPassword(e.target.value);
        setSubmitted(false);
    }

    const login = async (UserData) => {

        try{
            const response = await axios.post('http://localhost:8080/auth/login', UserData);
            const role = response.data.role;

            if(role == "ROLE_CANDIDATE"){
                navigate('/candidate_main');
            }else if(role == "ROLE_ADMIN"){
                navigate('/admin_main');
            }else{
                navigate('/instructor');
            }

        }catch(error){
            alert(error.message);
        }
    }

    const validateForm = () =>{
        if(!email.trim()){
            return false;
        }
        if(!password.trim()){
            return false;
        }

        return true;

    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitted(true);

    

        try {
        const userData = { email,password };
        
        
            await login(userData);
        
        

        } catch (error) {
            alert('An error occurred during login.');
            console.error('Login error:', error);
        } finally {
            setSubmitted(false);
        }
  };


    return(

        <div className="login-page">
            <NavBar showAuthButtons={false} />

            <div className="login-component">
                <div className="login-card">
                    <div className="login-title">
                        <h1>LOGIN</h1>
                    </div>
                </div>


                <hr className="divider" />

                <form onSubmit={handleSubmit}  className="login-form">
                    <div className="form-row">
                        <label className="label">Email</label>
                        <input onChange={handleEmail} className="email" value={email} type="email"
                        placeholder="Enter your email"></input>
                    </div>
                    <div className="form-row">
                        <label className="label">Password</label>
                        <input onChange={handlePassword} className="password" value={password} type="password"
                        placeholder="Enter your password"></input>
                    </div>
                    <button type="submit" 
                        className="login-btn"
                        disabled={submitted}>
                           {submitted ? "Loging In" : "LOGIN"}
                            </button>

                </form>
            </div>

        </div>


    );

    
}