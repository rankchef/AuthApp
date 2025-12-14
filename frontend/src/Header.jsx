import React from 'react'
import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthProvider'

const Header = () => {
  const { authState } = useContext(AuthContext);
  const { authenticated, user_data, loading } = authState;
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="text-2xl font-bold text-primary">ISecurity</div>
      <nav className="flex gap-4">
        <Link to="/" className="hover:text-primary-dark">Home</Link>
        {(!authenticated && !loading) && <Link to="/login" className="hover:text-primary-dark">Login</Link>}
        {authenticated && <Link to="/create-post">Create post</Link>}
        {authenticated && <Link to="/settings">Settings</Link>}
      </nav>
    </header>
  )
}

export default Header