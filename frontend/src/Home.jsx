import React from 'react'

import { useState } from 'react'
import { useEffect } from 'react'
const Home = () => {
  const [imageUrl, setImageUrl] = useState("")
  const [username, setUsername] = useState("")
  useEffect( () => {
    const fetchImage = async () => {
      const response = await fetch("http://localhost:8000/",{
        credentials: "include"
      })
      const data = await response.json();
      setImageUrl(data.responseImage)
      if (data.username){
        setUsername(data.username)
      }
    }
      fetchImage();
  }, [])

  

  return (
    <div className='flex items-center justify-center' style={{ minHeight: '100vh', flexDirection: 'column'}}>
      {imageUrl && <img src={imageUrl}/>}
      {username && <h2>Hello, {username}</h2>}
    </div>
  )
}

export default Home