import { Router } from "express";
import handleRoleStatus from "../middleware/handleRoleStatus.js";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";
const router = Router();

router.post('/create', handleRoleStatus(["admin", "mod", "user"]), async (req, res) => {
    const { _id } = req.user;
    const createdAt = new Date(Date.now());
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({errorMessage: "Invalid post format"});
    const newPost = new Post({title, content, authorId: _id, createdAt});
    await newPost.save();
    res.json({message: "Post created successfully!"});
})

router.post('/edit/:id', handleRoleStatus(), async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({errorMessage: "Invalid post format"});
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({errorMessage: `Post with id ${req.params.id} doesn't exist`});
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({errorMessage: `Post with id ${req.params.id} doesn't exist`});
    if (!post.authorId.equals(req.user._id)) return res.status(403).json({errorMessage: `Post with id ${req.params.id} doesn't belong to you`});
    await post.updateOne({title, content});
    return res.json({message: "Sucessfully edited the post"})
})

router.get('/delete/:id', handleRoleStatus(["user", "mod", "admin"]), async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({errorMessage: `Post with id ${req.params.id} doesn't exist`});
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({errorMessage: `Post with id ${req.params.id} doesn't exist`});
    
    const isOwner = post.authorId.equals(req.user._id);
    const isModeratorOrAdmin = ["mod", "admin"].includes(req.user.role);

    if (isOwner || isModeratorOrAdmin) {
        await post.deleteOne();
        return res.json({message: "Post deleted successfully"});
    }

    res.status(403).json({errorMessage: "You aren't authorized to delete this post"});
})

router.get('/all', async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .lean();

  const authorIds = posts.map(p => p.authorId);

  const users = await User.find({ _id: { $in: authorIds } })
    .select("_id username")
    .lean();

  const userMap = new Map(
    users.map(u => [u._id.toString(), u.username])
  );

  const postsWithUsernames = posts.map(post => ({
    ...post,
    username: userMap.get(post.authorId.toString()) || "[deleted]",
  }));

  res.json(postsWithUsernames);
});

router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).json({errorMessage: `Post with id ${req.params.id} doesn't exist`});
    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({errorMessage: `Post with id ${req.params.id} doesn't exist`});
    const { authorId } = post;
    const author = await User.findById(authorId);
    const username = author ? author.username : "[deleted]";
    post.username = username;
    return res.json(post);
})


export default router;