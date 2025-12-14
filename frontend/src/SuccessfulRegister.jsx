import React from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
const SuccessfulRegister = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    useEffect(() =>{
            if (!email) navigate('/')
          }, [email])
  return (
    <>
    <div className="container flex items-center justify-center" style={{flexDirection: "column"}}>
    <h1>Congratulations, you successfully registered</h1>
    {email && <p><Link to="/login">Click here to login to your new account</Link></p>}
    </div>
    </>
  )
}

export default SuccessfulRegister