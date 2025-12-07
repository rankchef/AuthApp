import React from 'react'
import { createContext } from 'react'
import { useEffect, useState } from 'react'

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({authenticated: false, user_data: null, loading: true})
    const [authTrigger, setAuthTrigger] = useState(0)
    const triggerAuthFetch = () =>{
        setAuthTrigger(authTrigger + 1);
    }
    useEffect(() => {
        const fetchAuthContext = async () => {
            const res = await fetch(import.meta.env.VITE_AUTH_STATUS_GET, {
                credentials: 'include'
            })
            const { authenticated, user_data } = await res.json();
            setAuthState({authenticated, user_data, loading: false});
        }
        fetchAuthContext();
    }, [authTrigger])

  return (
        <AuthContext.Provider value = {{authState, triggerAuthFetch}}>
            {children}
        </AuthContext.Provider>
  )
}

export default AuthProvider