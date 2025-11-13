const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, Profile } = require('../models');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists with this Google ID
                let user = await User.findOne({
                    where: { googleId: profile.id },
                });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with the same email
                user = await User.findOne({
                    where: { email: profile.emails[0].value },
                });

                if (user) {
                    // Link Google account to existing user
                    user.googleId = profile.id;
                    await user.save();
                    return done(null, user);
                }

                // Create new user
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    password: 'google-oauth-' + Math.random().toString(36).substring(7), // Random password for OAuth users
                    role: 'user',
                });

                // Create profile for new user
                await Profile.create({
                    userId: user.id,
                    avatarUrl: profile.photos[0]?.value || null,
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
