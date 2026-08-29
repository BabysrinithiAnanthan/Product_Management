import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../src/Style/Login.css'
function Login(){
     const navigate=useNavigate();
      
     const[form,setForm]= useState({
        email:"",
        password:""
    });

    const[message,setMessage]=useState("");
    
   
    const handleChange = (e) =>{
        setForm({...form,
            [e.target.name]:e.target.value});
    };
    const handleSubmit = async(e) => {
        e.preventDefault();

        try{
            
            const response = await fetch("http://localhost:5000/api/auth/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(form)
            });

            const data = await response.json();

            console.log("Login Response",data);

            if(!response.ok){
               setMessage(data.message);
               return;
            }
            
            localStorage.setItem("token",data.token);

            localStorage.setItem("user",JSON.stringify(data.user));

            setMessage("Login Successfully");
            
            console.log("Login Data:",data);
            console.log("Token",data.token);
            console.log("USER",data.user);
            
            navigate("/products");

            setForm({
                email:"",
                password:""
            })
        }catch(error){
            setMessage("ERROR:",error)
        }
    };


   return (
  <div className="login-page">

    <div className="login-card">

      <div className="login-title">
        <h2>Welcome Back</h2>
        <p className="login-subtitle">
          Login to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your registered email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="login-button">
          Login
        </button>

        <p className="register-text">
          Don't have an account?{" "}
          <button
            type="button"
            className="register-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>

        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

      </form>

    </div>

  </div>
);

}
export default Login;
