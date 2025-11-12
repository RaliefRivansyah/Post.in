const { Comment } = require('../models');

module.exports = {
    async createComment(req, res) {
        try {
            const { content } = req.body;
            const postId = req.params.postId || req.params.id;
            const comment = await Comment.create({
                postId,
                userId: req.user.id,
                content,
            });

            // If it's a view request, redirect back
            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.redirect('/posts');
            }

            res.status(201).json(comment);
        } catch (err) {
            res.status(400).json({ message: 'Comment failed', error: err.message });
        }
    },

    async deleteComment(req, res) {
        try {
            const deleted = await Comment.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ message: 'Comment not found' });
            res.json({ message: 'Comment deleted' });
        } catch (err) {
            res.status(400).json({ message: 'Delete failed', error: err.message });
        }
    },
};
