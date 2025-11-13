const { Post, User, Comment, Like, Profile, Community, CommunityMember } = require('../models');

module.exports = {
    async createPost(req, res) {
        try {
            const { title, content, imageUrl, communityId } = req.body;
            const post = await Post.create({ userId: req.user.id, title, content, imageUrl, communityId });

            // If it's a view request, redirect back
            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.redirect('/posts');
            }

            res.status(201).json(post);
        } catch (err) {
            res.status(400).json({ message: 'Post failed', error: err.message });
        }
    },

    async getAllPosts(req, res) {
        try {
            // Always return ALL posts, let frontend do the filtering
            const posts = await Post.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username'],
                        include: [{ model: Profile, attributes: ['avatarUrl'] }],
                    },
                    {
                        model: Community,
                        attributes: ['id', 'name', 'iconUrl'],
                    },
                    {
                        model: Comment,
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'username'],
                                include: [{ model: Profile, attributes: ['avatarUrl'] }],
                            },
                        ],
                    },
                    { model: Like, attributes: ['userId'] },
                ],
                order: [['createdAt', 'DESC']],
            });

            // Get user's communities for sidebar
            const myCommunitiesFull = await Community.findAll({
                include: [
                    {
                        model: User,
                        as: 'Members',
                        where: { id: req.user.id },
                        attributes: [],
                        through: { attributes: [] },
                    },
                ],
            });

            // If it's a view request, render the view
            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.render('posts', { posts, myCommunities: myCommunitiesFull });
            }

            res.json({ posts, myCommunities: myCommunitiesFull });
        } catch (err) {
            res.status(500).json({ message: 'Error fetching posts', error: err.message });
        }
    },

    async getPostById(req, res) {
        try {
            const post = await Post.findByPk(req.params.id, {
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username'],
                        include: [{ model: Profile, attributes: ['avatarUrl'] }],
                    },
                    {
                        model: Community,
                        attributes: ['id', 'name', 'iconUrl'],
                    },
                    {
                        model: Comment,
                        include: [
                            {
                                model: User,
                                attributes: ['id', 'username'],
                                include: [{ model: Profile, attributes: ['avatarUrl'] }],
                            },
                        ],
                        order: [['createdAt', 'ASC']],
                    },
                    { model: Like, attributes: ['userId'] },
                ],
            });

            if (!post) {
                if (req.headers.accept && req.headers.accept.includes('text/html')) {
                    return res.status(404).send('Post not found');
                }
                return res.status(404).json({ message: 'Post not found' });
            }

            // If it's a view request, render the detail view
            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.render('postDetail', { post });
            }

            res.json(post);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching post', error: err.message });
        }
    },

    async deletePost(req, res) {
        try {
            const deleted = await Post.destroy({ where: { id: req.params.id } });
            if (!deleted) return res.status(404).json({ message: 'Post not found' });
            res.json({ message: 'Post deleted' });
        } catch (err) {
            res.status(400).json({ message: 'Delete failed', error: err.message });
        }
    },
};
