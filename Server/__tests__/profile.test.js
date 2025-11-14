const request = require('supertest');
const app = require('../app');
const { User, Profile } = require('../models');
const jwt = require('jsonwebtoken');

// Helper function untuk generate token
function generateToken(userId, role = 'user') {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'supersecretjwt');
}

describe('Profile Endpoints', () => {
    let testUser;
    let authToken;

    beforeAll(async () => {
        // Create test user
        testUser = await User.create({
            username: 'profileuser',
            email: 'profileuser@example.com',
            password: 'password123',
            role: 'user',
        });

        // Create initial profile
        await Profile.create({
            userId: testUser.id,
            bio: 'Initial bio',
            location: 'Test Location',
            website: 'https://example.com',
        });

        authToken = generateToken(testUser.id);
    });

    afterAll(async () => {
        // Cleanup
        await Profile.destroy({ where: { userId: testUser.id } });
        await User.destroy({ where: { id: testUser.id } });
    });

    describe('GET /api/profile', () => {
        it('should get current user profile successfully', async () => {
            const response = await request(app).get('/api/profile').set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', testUser.id);
            expect(response.body).toHaveProperty('username', 'profileuser');
            expect(response.body).toHaveProperty('Profile');
            expect(response.body.Profile).toHaveProperty('bio', 'Initial bio');
        });

        it('should fail without authentication', async () => {
            const response = await request(app).get('/api/profile');

            expect(response.status).toBe(401);
        });

        it('should fail with invalid token', async () => {
            const response = await request(app).get('/api/profile').set('Authorization', 'Bearer invalidtoken');

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/profile/edit', () => {
        it('should update profile successfully', async () => {
            const response = await request(app).post('/api/profile/edit').set('Authorization', `Bearer ${authToken}`).send({
                bio: 'Updated bio',
                location: 'Updated Location',
                website: 'https://updated.com',
                avatarUrl: 'https://example.com/avatar.jpg',
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Profile updated');
        });

        it('should fail without authentication', async () => {
            const response = await request(app).post('/api/profile/edit').send({
                bio: 'Should fail',
            });

            expect(response.status).toBe(401);
        });

        it('should update with partial data', async () => {
            const response = await request(app).post('/api/profile/edit').set('Authorization', `Bearer ${authToken}`).send({
                bio: 'Only bio updated',
                // other fields omitted
            });

            expect(response.status).toBe(200);
        });
    });
});
