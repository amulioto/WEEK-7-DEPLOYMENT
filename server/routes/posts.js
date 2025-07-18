const express = require('express');
const router = express.Router();
const { createPost, getAllPosts, getPostById, updatePost, deletePost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multerConfig'); // <- handles images

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', authMiddleware, upload.single('featuredImage'), createPost);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
