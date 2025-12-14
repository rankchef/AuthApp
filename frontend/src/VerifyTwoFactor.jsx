import React from 'react'
import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import usePostReq from '../hooks/usePostReq';
const VerifyTwoFactor = () => {
  const authContext = useContext(AuthContext);
  const { login } = authContext;
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const { postReq } = usePostReq();
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
        return setErrors({errorMessage: "2FA code is required"});
      }
      const { status, data } = await postReq(import.meta.env.VITE_VERIFY_CODE_POST, formData);

      if (status === 200) {
        login(data);
        return navigate('/')
      }
      setErrors(data);
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