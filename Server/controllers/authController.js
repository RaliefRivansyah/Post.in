const jwt = require('jsonwebtoken');
const { User } = require('../models');

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
            if (!user || !(await user.validPassword(password))) return res.status(401).json({ message: 'Invalid credentials' });

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ access_token: token });
            res.render('login', { title: 'Login Page' });
        } catch (err) {
            res.status(500).json({ message: 'Login error', error: err.message });
        }
    },
};
