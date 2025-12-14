import React from 'react'
import { createContext } from 'react'
import { useEffect, useState } from 'react'
import useGetReq from '../hooks/useGetReq';
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const { getReq } = useGetReq();
    const [authState, setAuthState] = useState({authenticated: false, user_data: null, loading: true})
    const login = (userData) => {
        setAuthState({authenticated: true, user_data: userData, loading: false})
    }
    const logout = () => {
        getReq(import.meta.env.VITE_LOGOUT_GET)
        setAuthState({authenticated: false, user_data: null, loading: false})
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
    }, [])

  return (
        <AuthContext.Provider value = {{authState, login, logout}}>
            {children}
        </AuthContext.Provider>
  )
}

export default AuthProvider