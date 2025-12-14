import React from 'react'
import { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { useState } from 'react'
import { useEffect } from 'react'
import Post from './Post'
import PostList from './PostList'
const Home = () => {
  const {authState, setAuthState} = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState("")

  return (
    <div className='flex items-center justify-center' style={{ minHeight: '100vh', flexDirection: 'column'}}>
      {(!authState.loading && authState.authenticated) && <h2>Hello, {["admin", "mod"].includes(authState.user_data.role) ? authState.user_data.role : ""} {authState.user_data.username}</h2>}
      <PostList url={"http://localhost:8000/post/all"}/>
    </div>
  )
}

export default Home