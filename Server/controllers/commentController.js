const { Comment, User, Profile, Post } = require('../models');
const aiService = require('../services/aiService');
const firebaseService = require('../services/firebaseService');

module.exports = {
    async createComment(req, res) {
        try {
            const { content } = req.body;
            const postId = req.params.postId || req.params.id;

            // Save user comment to database
            const comment = await Comment.create({
                postId,
                userId: req.user.id,
                content,
            });

            // Get comment with user data
            const commentWithUser = await Comment.findByPk(comment.id, {
                include: [
                    {
                        model: User,
                        attributes: ['username'],
                        include: [{ model: Profile, attributes: ['avatarUrl'] }],
                    },
                ],
            });

            // If it's a view request, redirect back
            if (req.headers.accept && req.headers.accept.includes('text/html')) {
                return res.redirect('/posts');
            }

            // Check if AI bot is mentioned
            if (aiService.isBotMentioned(content)) {
                // Get post context for AI
                const post = await Post.findByPk(postId, {
                    include: [
                        { model: User, attributes: ['username'] },
                        {
                            model: Comment,
                            include: [{ model: User, attributes: ['username'] }],
                            limit: 5,
                            order: [['createdAt', 'DESC']],
                        },
                    ],
                });

                // Prepare context for AI
                const context = {
                    postTitle: post.title,
                    postContent: post.content,
                    previousComments: post.Comments.map((c) => `${c.User.username}: ${c.content}`).join('\n'),
                };

                // Extract user's question
                const userPrompt = aiService.extractPrompt(content);

                // Generate AI response
                const aiResponse = await aiService.generateResponse(userPrompt, context);

                // Get or create AI bot user
                let botUser = await User.findOne({ where: { email: 'aibot@system.local' } });
                if (!botUser) {
                    botUser = await User.create({
                        email: 'aibot@system.local',
                        username: 'AI Bot',
                        password: 'system-bot-no-login-' + Math.random().toString(36),
                        role: 'bot',
                    });
                    // Create bot profile
                    await Profile.create({
                        userId: botUser.id,
                        bio: 'I am an AI assistant powered by Google Gemini. Mention me with @bot or @ai to get help! 🤖',
                        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=aibot',
                    });
                }

                // Save AI response as comment
                const aiComment = await Comment.create({
                    userId: botUser.id,
                    postId,
                    content: aiResponse,
                });

                // Get AI comment with user data
                const aiCommentWithUser = await Comment.findByPk(aiComment.id, {
                    include: [
                        {
                            model: User,
                            attributes: ['username'],
                            include: [{ model: Profile, attributes: ['avatarUrl'] }],
                        },
                    ],
                });

                // Return both user comment and AI response
                return res.status(201).json({
                    userComment: commentWithUser,
                    aiComment: aiCommentWithUser,
                });
            }

            // Send Firebase notification to post owner
            const post = await Post.findByPk(postId, {
                include: [{ model: User, attributes: ['id', 'username'] }],
            });

            if (post && firebaseService.isInitialized()) {
                await firebaseService.notifyNewComment(post.userId, commentWithUser, post);
            }

            // If no bot mention, return only user comment
            res.status(201).json({ userComment: commentWithUser });
        } catch (err) {
            console.error('Comment error:', err);
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
