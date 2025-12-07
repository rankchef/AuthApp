import React from 'react'
import { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { useState } from 'react'
import { useEffect } from 'react'
const Home = () => {
  const {authState, setAuthState} = useContext(AuthContext);
  const [imageUrl, setImageUrl] = useState("")
  useEffect( () => {
    const fetchImage = async () => {
      const response = await fetch(import.meta.env.VITE_HOME_GET,{
        credentials: "include"
      })
      console.log(response);
      const data = await response.json();
      
      setImageUrl(data.responseImage)
    }
      fetchImage();
  }, [])

  

  return (
    <div className='flex items-center justify-center' style={{ minHeight: '100vh', flexDirection: 'column'}}>
      {imageUrl && <img src={imageUrl}/>}
      {!authState.loading && <h2>Hello, {authState.user_data.username}</h2>}
    </div>
  )
}

export default Home