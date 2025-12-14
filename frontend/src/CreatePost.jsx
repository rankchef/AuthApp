import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import usePostReq from '../hooks/usePostReq'
import { useContext } from 'react'
import { AuthContext } from './AuthProvider'

const CreatePost = () => {
  const [formData, setFormData] = useState({title: "", content: ""})
  const [errors, setErrors] = useState({errorTitle: "", errorContent: ""})
  
  const { postReq } = usePostReq();
  const navigate = useNavigate();

  const handleFormData = (e) => {
      const {id, value} = e.target;
      setFormData(prev => {
        return {...prev, [id]: value}
      })
  }
  const validate = () =>{
    const {title, content} = formData;
    const newErrors = {};
    if (!title) {
      newErrors.errorTitle = "Title cannot be empty";
      setErrors(newErrors);
    }

    if (!content) {
      newErrors.errorContent = "Content cannot be empty";
      setErrors(newErrors);
    }

    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
      if (!validate()) return;
      const { status, data } = await postReq(import.meta.env.VITE_CREATE_POST_POST, formData);
      if (status === 200) {
        return navigate('/')
      }
  }
  return (
    <>
    <div className='flex items-center justify-center' style={{ minHeight: '100vh', flexDirection: 'column'}}> 
    <h1 className='text-center'>Create a new post</h1>
        <div className='container' style={{ width: '500px' }}>
            <form onSubmit={handleSubmit} action="" method="post">
                <label htmlFor="title">Title</label>
                <input onChange={handleFormData} type="text" id='title' placeholder='Enter title'/>
                {errors.errorTitle && <p style={{color: "red"}}>{errors.errorTitle}</p>}
                <label htmlFor="content">Content</label>
                <input onChange={handleFormData} id='content' placeholder='Enter content'/>
                {errors.errorContent && <p style={{color: "red"}}>{errors.errorContent}</p>}
                <button type="submit">Create post</button>
            </form>
        </div>
    </div>
    </> 
  )
}

export default CreatePost