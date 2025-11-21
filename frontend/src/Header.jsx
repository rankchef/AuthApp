import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="text-2xl font-bold text-primary">ISecurity</div>
      <nav className="flex gap-4">
        <Link to="/" className="hover:text-primary-dark">Home</Link>
        <Link to="/register" className="hover:text-primary-dark">Register</Link>
        <Link to="/login" className="hover:text-primary-dark">Login</Link>
      </nav>
    </header>
  )
}

export default Header