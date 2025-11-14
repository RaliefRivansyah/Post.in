require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('./config/passport');
const authentication = require('./middlewares/authentication');
const authorization = require('./middlewares/authorization');
const authController = require('./controllers/authController');
const profileController = require('./controllers/profileController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');
const likeController = require('./controllers/likeController');
const communityController = require('./controllers/communityController');
const uploadController = require('./controllers/uploadController');
const { uploadImage, uploadVideo, uploadAvatar } = require('./config/cloudinary');
const { Post, Comment, User, Community, CommunityMember } = require('./models');

const app = express();

// CORS configuration
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
    })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(
    session({
        secret: 'sessionsecret',
        resave: false,
        saveUninitialized: true,
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// ======== VIEW ROUTES ========

// Landing page
app.get('/', (req, res) => {
    res.render('index', { token: req.session.token });
});

// Register (view only)
app.get('/register', (req, res) => res.render('register'));

// Login (view only)
app.get('/login', (req, res) => res.render('login'));

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// ======== API ROUTES (JSON) ========
// Auth routes (public)
app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.post('/api/auth/google', authController.googleLogin);

// Protected API routes
app.get('/api/posts', authentication, postController.getAllPosts);
app.post('/api/posts', authentication, postController.createPost);
app.get('/api/posts/:id', authentication, postController.getPostById);
app.delete('/api/posts/:id', authentication, authorization.postOwnerOrAdmin, postController.deletePost);
app.post('/api/posts/:postId/like', authentication, likeController.toggleLike);
app.post('/api/posts/:postId/comment', authentication, commentController.createComment);
app.delete('/api/posts/:postId/comment/:id', authentication, authorization.commentOwnerOrAdmin, commentController.deleteComment);

app.get('/api/communities', authentication, communityController.getAllCommunities);
app.post('/api/communities', authentication, communityController.createCommunity);
app.get('/api/communities/:id', authentication, communityController.getCommunityById);
app.post('/api/communities/:id/join', authentication, communityController.joinCommunity);
app.post('/api/communities/:id/leave', authentication, communityController.leaveCommunity);

app.get('/api/profile', authentication, profileController.getProfile);
app.post('/api/profile/edit', authentication, profileController.updateProfile);

// Upload routes
app.post('/api/upload/image', authentication, uploadImage.single('image'), uploadController.uploadImage);
app.post('/api/upload/video', authentication, uploadVideo.single('video'), uploadController.uploadVideo);
app.post('/api/upload/avatar', authentication, uploadAvatar.single('avatar'), uploadController.uploadAvatar);
app.delete('/api/upload/media', authentication, uploadController.deleteMedia);

// ======== PROTECTED VIEW ========
// Middleware for EJS views only (after API routes)
app.use((req, res, next) => {
    // Skip this middleware for API routes
    if (req.path.startsWith('/api')) {
        return next();
    }

    const jwt = require('jsonwebtoken');
    if (!req.session.token) return res.redirect('/login');
    try {
        req.user = jwt.verify(req.session.token, process.env.JWT_SECRET);
        next();
    } catch {
        res.redirect('/login');
    }
});

// View all posts
app.get('/posts', postController.getAllPosts);

// New post form
app.get('/posts/new', async (req, res) => {
    const { Community, CommunityMember } = require('./models');
    const myCommunities = await Community.findAll({
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
    res.render('newPost', { myCommunities, communityId: req.query.communityId || '' });
});

// View single post detail
app.get('/posts/:id', postController.getPostById);

// Create post
app.post('/posts', postController.createPost);

// Comment on post
app.post('/posts/:postId/comment', commentController.createComment);

// Like/unlike post
app.post('/posts/:postId/like', likeController.toggleLike);

// Profile routes
app.get('/profile', profileController.getProfile);
app.get('/profile/edit', profileController.showEditProfile);
app.post('/profile/edit', profileController.updateProfile);

// Community routes
app.get('/communities', communityController.getAllCommunities);
app.post('/communities', communityController.createCommunity);
app.get('/communities/:id', communityController.getCommunityById);
app.post('/communities/:id/join', communityController.joinCommunity);
app.post('/communities/:id/leave', communityController.leaveCommunity);

// Export app untuk testing
module.exports = app;
