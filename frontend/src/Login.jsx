import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({email: "", password: ""})
  const [errors, setErrors] = useState({errorMessage: ""})
  const navigate = useNavigate()
  const handleFormData = (e) => {
      const {id, value} = e.target;
      setFormData(prev => {
        return {...prev, [id]: value}
      })
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      const {email, password} = formData;
      const newErrors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email) || !password) {
        newErrors.errorMessage = "Invalid user credentials";
        setErrors(newErrors);
      }
      else{
        try{
        const response = await fetch(import.meta.env.VITE_LOGIN_POST, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(formData)
        })
        const data = await response.json()
        if (!response.ok){
          setErrors(data)
        }
        else{
          navigate("/verify-2fa", { state: { email: formData.email }})
        }
        }
        catch{
          alert("Something went wrong.")
        }
      }
      
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
        </div>
    </div>
    </> 
  )
}

export default Login