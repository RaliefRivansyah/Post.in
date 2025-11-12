const { Like } = require('../models');

module.exports = {
    async toggleLike(req, res) {
        try {
            const { postId } = req.params;
            const existing = await Like.findOne({ where: { postId, userId: req.user.id } });

            if (existing) {
                await existing.destroy();

                // If it's a view request, redirect back
                if (req.headers.accept && req.headers.accept.includes('text/html')) {
                    return res.redirect('/posts');
                }

                return res.json({ message: 'Unliked' });
            }

            await Like.create({ postId, userId: req.user.id });

            // If it's a view request, redirect back
            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.redirect('/posts');
            }

            res.json({ message: 'Liked' });
        } catch (err) {
            res.status(400).json({ message: 'Like failed', error: err.message });
        }
    },
};
