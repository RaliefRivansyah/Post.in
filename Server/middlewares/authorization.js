const { Post, Comment } = require('../models');

const authorization = {
  adminOnly: (req, res, next) => {
    if (req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    next();
  },

  postOwnerOrAdmin: async (req, res, next) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) return res.status(404).json({ message: 'Post not found' });

      if (req.user.role !== 'admin' && post.userId !== req.user.id)
        return res.status(403).json({ message: 'Forbidden: Not owner' });

      next();
    } catch {
      return res.status(403).json({ message: 'Forbidden' });
    }
  },

  commentOwnerOrAdmin: async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.id);
      if (!comment) return res.status(404).json({ message: 'Comment not found' });

      if (req.user.role !== 'admin' && comment.userId !== req.user.id)
        return res.status(403).json({ message: 'Forbidden: Not owner' });

      next();
    } catch {
      return res.status(403).json({ message: 'Forbidden' });
    }
  },
};

module.exports = authorization;
