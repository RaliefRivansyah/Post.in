require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authentication = require('./middlewares/authentication');
const authorization = require('./middlewares/authorization');
const authController = require('./controllers/authController');
const profileController = require('./controllers/profileController');
const postController = require('./controllers/postController');
const commentController = require('./controllers/commentController');
const likeController = require('./controllers/likeController');
const communityController = require('./controllers/communityController');
const { Post, Comment, User } = require('./models');

const app = express();
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

// ======== VIEW ROUTES ========

// Landing page
app.get('/', (req, res) => {
    res.render('index', { token: req.session.token });
});

// Register
app.get('/register', (req, res) => res.render('register'));
app.post('/register', authController.register);

// Login
app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const jwt = require('jsonwebtoken');
    const { User } = require('./models');
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validPassword(password))) return res.send('Invalid credentials');
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    req.session.token = token;
    res.redirect('/posts');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'));
});

// ======== PROTECTED VIEW ========
app.use(async (req, res, next) => {
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

// ======== SERVER ========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
