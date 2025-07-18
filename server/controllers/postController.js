const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate('category author');
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
exports.getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('category author');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content and category are required' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

    const post = new Post({
      title,
      content,
      category,
      slug,
      author: req.user._id,
      featuredImage: req.file?.filename || 'default-post.jpg',
    });

    const saved = await post.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Post creation error:', err);
    next(err);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Post not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};
