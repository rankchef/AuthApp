import React from 'react'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import usePostReq from '../hooks/usePostReq';
const Register = () => {

  const [formData, setFormData] = useState({email: "", username: "", password: "", confirmPassword: ""})
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { postReq } = usePostReq();
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => {
      return {...prev, [id]: value}
    })
  }

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format"
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.confirmPassword != formData.password)  newErrors.confirmPassword = "Passwords must match"

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const { status, data } = await postReq(import.meta.env.VITE_REGISTER_POST, formData) 
    
    if (status === 201) return navigate('/successful-register', { state: { email: formData.email }});
    
    setErrors(data);
    }
  
  return (
    <div className='flex items-center justify-center' style={{ minHeight: '100vh', flexDirection: 'column'}}>
        <h1>Register</h1>
        <div className='container' style={{ width: '500px' }}>
            <form action="" method="post" onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                <input value={formData.username} onChange={handleChange} type="text" id='username'  placeholder='Enter username'/>
                {errors.username && <p style={{color: "red"}}>{errors.username}</p>}

                <label htmlFor="email">E-mail</label>
                <input value={formData.email} onChange={handleChange} type="text" id='email'  placeholder='Enter e-mail'/>
                {errors.email && <p style={{color: "red"}}>{errors.email}</p>}

                <label htmlFor="password">Password</label>
                <input value={formData.password} onChange={handleChange} type="password" id='password' placeholder='Enter password'/>
                {errors.password && <p style={{color: "red"}}>{errors.password}</p>}

                <label htmlFor="confirm-password">Confirm Password</label>
                <input value={formData.confirmPassword} onChange={handleChange} type="password" id='confirmPassword' placeholder='Confirm password'/>
                {errors.confirmPassword && <p style={{color: "red"}}>{errors.confirmPassword}</p>}
                <button type="submit">Register</button>
            </form>
            <small>Already have an account? <Link to="/login">Login here</Link></small>
        </div>
    </div>
  )
}

export default Register