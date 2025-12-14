import React from 'react'
import { useState, useEffect } from 'react'
import useGetReq from '../hooks/useGetReq'
import { useNavigate } from 'react-router-dom'
import Post from './Post'

const PostList = ({ url }) => {
    const [posts, setPosts] = useState([])
    const navigate = useNavigate();
    const { getReq } = useGetReq();
    useEffect(() => {
        const fetchPosts = async () => {
        const { status, data } = await getReq(url)
        if (status === 200) setPosts(data);
        }
        fetchPosts();
    }, [url])
    const handleDelete = (post) => {
        const deletePost = async () => {
            setPosts(posts.filter(currPost => post._id != currPost._id))
            getReq(`http://localhost:8000/post/delete/${post._id}`)
        }
        deletePost();
    }

    const handleEdit = (post) => {
        navigate("/edit-post", {
        state: {
            postId: post._id,
            prevTitle: post.title,
            prevContent: post.content,
        },
    });
};
  return (
    <>
    {!posts.length && <small>There are no posts to show</small>}
    {posts.map(post => (
        <Post key={post._id} post={post} onDelete={handleDelete} onEdit={handleEdit}/>
    ))}
    </>
  )
}

export default PostList