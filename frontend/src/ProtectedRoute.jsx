import React from 'react'
import { useContext} from 'react'
import { AuthContext } from './AuthProvider'
import { Navigate, useNavigate } from 'react-router-dom'

const ProtectedRoute = ({children, requiredRole}) => {
    const navigate = useNavigate()
    const { authState } = useContext(AuthContext);
    const { authenticated, user_data, loading } = authState;
  if (loading) return <div>loading</div>
  if (!authenticated || (requiredRole && user_data?.role !== requiredRole)) return <Navigate to="/login"/>
  else{
    return children
  }
}

export default ProtectedRoute