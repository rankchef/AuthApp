import React, { useContext } from "react";
import { AuthContext } from "./AuthProvider.jsx";

const Post = ({ post, onEdit, onDelete }) => {
  const { authState } = useContext(AuthContext);

  const isLoggedIn = authState.authenticated;
  const userId = authState.user_data?._id;
  const role = authState.user_data?.role;

  const isAuthor = userId === post.authorId;
  const canEdit = isAuthor;
  const canDelete = isAuthor || role === "admin" || role === "mod";

  const formattedDate = new Date(post.createdAt).toLocaleString();

  return (
    <div className="card post-card">
      <h2 className="mb-1">{post.title}</h2>

      <p className="post-content mb-2">{post.content}</p>

      <div className="post-meta">
        <span>Author: {post.username}</span>
        <span>{formattedDate}</span>
      </div>

      {isLoggedIn && (canEdit || canDelete) && (
        <div className="flex gap-1 mt-2">
          {canEdit && (
            <button className="primary" onClick={() => onEdit(post)}>
              Edit
            </button>
          )}
          {canDelete && (
            <button className="secondary" onClick={() => onDelete(post)}>
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Post;
