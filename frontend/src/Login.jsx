import React from 'react'
import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import usePostReq from '../hooks/usePostReq'
import { useContext } from 'react'
import { AuthContext } from './AuthProvider'

const Login = () => {
  const [formData, setFormData] = useState({email: "", password: ""})
  const [errors, setErrors] = useState({errorMessage: ""})
  
  const { postReq } = usePostReq();
  const navigate = useNavigate();

  const authContext = useContext(AuthContext)
  const { login } = authContext;
  const handleFormData = (e) => {
      const {id, value} = e.target;
      setFormData(prev => {
        return {...prev, [id]: value}
      })
  }
  const validate = () =>{
    const {email, password} = formData;
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || !password) {
      newErrors.errorMessage = "Invalid user credentials";
      setErrors(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
      if (!validate()) return;
      const { status, data } = await postReq(import.meta.env.VITE_LOGIN_POST, formData);
      if (status === 200) {
        login(data);
        return navigate('/')
      }
      if (status === 401){
        if (data.errorMessage === "Email verification required") return navigate('/verify-email', {state: {email: formData.email}});
        if (data.errorMessage === "2FA required") return navigate('/verify-2fa', {state: {email: formData.email}});
      }
      setErrors(data)
  }
  return (
    <>
    <div className='flex items-center justify-center' style={{ minHeight: '100vh', flexDirection: 'column'}}> 
    <h1 className='text-center'>Login</h1>
        <div className='container' style={{ width: '500px' }}>
            <form onSubmit={handleSubmit} action="" method="post">
                <label htmlFor="email">E-mail</label>
                <input onChange={handleFormData} type="text" id='email' placeholder='Enter e-mail'/>
                <label htmlFor="password">Password</label>
                <input onChange={handleFormData} type="password" id='password' placeholder='Enter password'/>
                <button type="submit">Login</button>
                {errors.errorMessage && <p style={{color: "red"}}>{errors.errorMessage}</p>}
            </form>
            <small>Don't have an acccount? <Link to="/register">Register here</Link></small>
        </div>
    </div>
    </> 
  )
}

export default Login