const { Community, CommunityMember, Post, User } = require('../models');

module.exports = {
    async createCommunity(req, res) {
        try {
            const { name, description, iconUrl, isPublic } = req.body;

            const community = await Community.create({
                name,
                description,
                iconUrl,
                creatorId: req.user.id,
                isPublic: isPublic !== undefined ? isPublic : true,
            });

            // Auto-join creator as admin
            await CommunityMember.create({
                communityId: community.id,
                userId: req.user.id,
                role: 'admin',
            });

            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.redirect('/communities');
            }

            res.status(201).json(community);
        } catch (err) {
            res.status(400).json({ message: 'Failed to create community', error: err.message });
        }
    },

    async getAllCommunities(req, res) {
        try {
            const communities = await Community.findAll({
                include: [
                    { model: User, as: 'Creator', attributes: ['username'] },
                    { model: User, as: 'Members', attributes: ['id'], through: { attributes: [] } },
                ],
                order: [['createdAt', 'DESC']],
            });

            // Get user's joined communities
            const myCommunitiesIds = await CommunityMember.findAll({
                where: { userId: req.user.id },
                attributes: ['communityId'],
            });

            const myCommunityIdsSet = new Set(myCommunitiesIds.map((m) => m.communityId));
            const myCommunities = communities.filter((c) => myCommunityIdsSet.has(c.id));

            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.render('communities', { communities, user: { id: req.user.id } });
            }

            // Return both all communities and user's joined communities
            res.json({
                communities,
                myCommunities,
            });
        } catch (err) {
            res.status(500).json({ message: 'Error fetching communities', error: err.message });
        }
    },

    async getCommunityById(req, res) {
        try {
            const community = await Community.findByPk(req.params.id, {
                include: [
                    { model: User, as: 'Creator', attributes: ['username'] },
                    { model: User, as: 'Members', attributes: ['id', 'username'], through: { attributes: [] } },
                ],
            });

            if (!community) {
                return res.status(404).json({ message: 'Community not found' });
            }

            const posts = await Post.findAll({
                where: { communityId: req.params.id },
                include: [
                    {
                        model: User,
                        attributes: ['username'],
                        include: [{ model: require('../models').Profile, attributes: ['avatarUrl'] }],
                    },
                    { model: require('../models').Comment, include: [{ model: User, attributes: ['username'] }] },
                    { model: require('../models').Like, attributes: ['userId'] },
                ],
                order: [['createdAt', 'DESC']],
            });

            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.render('communityDetail', { community, posts, user: { id: req.user.id } });
            }

            res.json({ community, posts });
        } catch (err) {
            res.status(500).json({ message: 'Error fetching community', error: err.message });
        }
    },

    async joinCommunity(req, res) {
        try {
            const existing = await CommunityMember.findOne({
                where: { communityId: req.params.id, userId: req.user.id },
            });

            if (existing) {
                return res.status(400).json({ message: 'Already a member' });
            }

            await CommunityMember.create({
                communityId: req.params.id,
                userId: req.user.id,
                role: 'member',
            });

            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.redirect(`/communities/${req.params.id}`);
            }

            res.json({ message: 'Joined community' });
        } catch (err) {
            res.status(400).json({ message: 'Failed to join', error: err.message });
        }
    },

    async leaveCommunity(req, res) {
        try {
            const deleted = await CommunityMember.destroy({
                where: { communityId: req.params.id, userId: req.user.id },
            });

            if (!deleted) {
                return res.status(404).json({ message: 'Not a member' });
            }

            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.redirect('/communities');
            }

            res.json({ message: 'Left community' });
        } catch (err) {
            res.status(400).json({ message: 'Failed to leave', error: err.message });
        }
    },

    async getMyCommunities(req, res) {
        try {
            const communities = await Community.findAll({
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

            res.json(communities);
        } catch (err) {
            res.status(500).json({ message: 'Error fetching communities', error: err.message });
        }
    },
};
