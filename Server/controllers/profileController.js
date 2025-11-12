const { Profile, User, Post, Like, Comment } = require('../models');

module.exports = {
    async getProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: ['id', 'username', 'email'],
            });

            let profile = await Profile.findOne({ where: { userId: req.user.id } });

            // Get user's posts with likes and comments count
            const posts = await Post.findAll({
                where: { userId: req.user.id },
                include: [
                    { model: Like, attributes: ['userId'] },
                    { model: Comment, attributes: ['id'] },
                ],
                order: [['createdAt', 'DESC']],
                limit: 10,
            });

            // If it's a view request, render the view
            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.render('profile', {
                    user,
                    profile,
                    posts,
                    editMode: false,
                });
            }

            if (!profile) return res.status(404).json({ message: 'Profile not found' });
            res.json(profile);
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving profile', error: err.message });
        }
    },

    async showEditProfile(req, res) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: ['id', 'username', 'email'],
            });

            let profile = await Profile.findOne({ where: { userId: req.user.id } });

            const posts = await Post.findAll({
                where: { userId: req.user.id },
                include: [
                    { model: Like, attributes: ['userId'] },
                    { model: Comment, attributes: ['id'] },
                ],
                order: [['createdAt', 'DESC']],
                limit: 10,
            });

            res.render('profile', {
                user,
                profile,
                posts,
                editMode: true,
            });
        } catch (err) {
            res.status(500).json({ message: 'Error retrieving profile', error: err.message });
        }
    },

    async updateProfile(req, res) {
        try {
            const { username, bio, avatarUrl, location, website } = req.body;

            // Update username if provided
            if (username) {
                const user = await User.findByPk(req.user.id);
                await user.update({ username });
            }

            // Check if profile exists
            let profile = await Profile.findOne({ where: { userId: req.user.id } });

            if (profile) {
                // Update existing profile
                await profile.update({ bio, avatarUrl, location, website });
            } else {
                // Create new profile
                await Profile.create({
                    userId: req.user.id,
                    bio,
                    avatarUrl,
                    location,
                    website,
                });
            }

            // If it's a view request, redirect back
            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.redirect('/profile');
            }

            res.json({ message: 'Profile updated' });
        } catch (err) {
            res.status(400).json({ message: 'Update failed', error: err.message });
        }
    },
};
