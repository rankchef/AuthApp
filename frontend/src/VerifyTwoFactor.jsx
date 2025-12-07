import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
const VerifyTwoFactor = () => {
  const authContext = useContext(AuthContext);
  const { triggerAuthFetch } = authContext;
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [formData, setFormData] = useState({code: "", email: email})
  const [errors, setErrors] = useState({errorMessage: ""})
  useEffect(() =>{
    if (!email) navigate('/')
  }, [email])
  const handleFormData = (e) => {
      const {id, value} = e.target;
      setFormData(prev => {
        return {...prev, [id]: value}
      })
  }

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.code || !email){
        setErrors({errorMessage: "2FA code is required"});
      }
      else{
        try{
        const response = await fetch(import.meta.env.VITE_VERIFY_CODE_POST, {
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
          triggerAuthFetch();
          navigate("/")
        }
        }
        catch(err){
          console.log(err)
        }
      }
      }
      return (
    <>
      <div className='flex items-center justify-center' style={{ minHeight: '100vh', flexDirection: 'column'}}> 
          <div className="container" style={{ width: '500px' }}>
            <form onSubmit={handleSubmit}>
                <h2>Please enter your 6 digit code</h2>
                <input onChange={handleFormData} type="text" id='code' placeholder='Enter 2FA'/>
                {errors.errorMessage && <p style={{color: "red"}}>{errors.errorMessage}</p>}
                <button type="submit">Enter</button>
            </form>
          </div>
      </div> 
    </>
  )
  }
export default VerifyTwoFactor