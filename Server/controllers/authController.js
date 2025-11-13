const jwt = require('jsonwebtoken');
const { User, Profile } = require('../models');
const passport = require('../config/passport');

module.exports = {
    async register(req, res) {
        try {
            const { email, password, username, role } = req.body;
            const user = await User.create({ email, password, username, role });
            res.status(201).json({ message: 'User registered', id: user.id });
        } catch (err) {
            res.status(400).json({ message: 'Registration failed', error: err.message });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ where: { email } });
            if (!user || !(await user.validPassword(password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            // Store in session for EJS views
            req.session.token = token;

            // Return JSON for API calls
            res.json({ token, message: 'Login successful' });
        } catch (err) {
            res.status(500).json({ message: 'Login error', error: err.message });
        }
    },

    async googleLogin(req, res) {
        try {
            const { credential } = req.body;

            // Decode JWT token from Google (tanpa verifikasi untuk simplicity)
            // Note: Di production, sebaiknya verifikasi token ini
            const base64Url = credential.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(Buffer.from(base64, 'base64').toString());

            const { sub: googleId, email, name, picture } = payload;

            // Check if user exists with Google ID
            let user = await User.findOne({ where: { googleId } });

            if (!user) {
                // Check if user exists with the same email
                user = await User.findOne({ where: { email } });

                if (user) {
                    // Link Google account to existing user
                    user.googleId = googleId;
                    await user.save();
                } else {
                    // Create new user
                    user = await User.create({
                        googleId,
                        email,
                        username: name,
                        password: 'google-oauth-' + Math.random().toString(36).substring(7),
                        role: 'user',
                    });

                    // Create profile for new user
                    await Profile.create({
                        userId: user.id,
                        avatarUrl: picture || null,
                    });
                }
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.json({ token, message: 'Google login successful' });
        } catch (err) {
            console.error('Google login error:', err);
            res.status(500).json({ message: 'Google login failed', error: err.message });
        }
    },
};
