import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import usePostReq from "../hooks/usePostReq";

const EditPost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  const postId = state?.postId;
  const prevTitle = state?.prevTitle;
  const prevContent = state?.prevContent;

  useEffect(() => {
    if (!postId || prevTitle == null || prevContent == null) navigate("/");
  }, [postId, prevTitle, prevContent, navigate]);

  const [formData, setFormData] = useState({ title: prevTitle, content: prevContent });
  const [errors, setErrors] = useState({ errorTitle: "", errorContent: "" });

  const { postReq } = usePostReq();

  const handleFormData = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.errorTitle = "Title cannot be empty";
    if (!formData.content) newErrors.errorContent = "Content cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const { status } = await postReq(`http://localhost:8000/post/edit/${postId}`, formData);
    if (status === 200) navigate("/");
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: "100vh", flexDirection: "column" }}>
      <h1 className="text-center">Edit Post</h1>
      <div className="container" style={{ width: "500px" }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter title"
            value={formData.title || ""}
            onChange={handleFormData}
          />
          {errors.errorTitle && <p style={{ color: "red" }}>{errors.errorTitle}</p>}

          <label htmlFor="content">Content</label>
          <input
            id="content"
            placeholder="Enter content"
            value={formData.content || ""}
            onChange={handleFormData}
          />
          {errors.errorContent && <p style={{ color: "red" }}>{errors.errorContent}</p>}

          <button type="submit">Update Post</button>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
