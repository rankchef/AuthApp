import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    useEffect(() =>{
        if (!email) navigate('/')
      }, [email])
  return (
    <>
    <div className="container flex items-center justify-center" style={{flexDirection: "column"}}>
    <h1>Please verify your email</h1>
    {email && <p>Check {email} for further instructions</p>}
    </div>
    </>
  )
}

export default VerifyEmail;