import React from 'react'
import { useLocation } from 'react-router-dom';

const SuccessfulRegister = () => {
    const location = useLocation();
    const email = location.state?.email;
  return (
    <>
    <div className="container flex items-center justify-center" style={{flexDirection: "column"}}>
    <h1>Congratulations, you successfully registered</h1>
    {email && <p>Check {email} for further instructions</p>}
    </div>
    </>
  )
}

export default SuccessfulRegister