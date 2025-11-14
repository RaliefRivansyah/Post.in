const request = require('supertest');
const app = require('../app');
const { User, Community, CommunityMember, Profile } = require('../models');
const jwt = require('jsonwebtoken');

// Helper function untuk generate token
function generateToken(userId, role = 'user') {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'supersecretjwt');
}

describe('Community Endpoints', () => {
    let testUser;
    let testCommunity;
    let authToken;

    beforeAll(async () => {
        // Create test user
        testUser = await User.create({
            username: 'communityuser',
            email: 'communityuser@example.com',
            password: 'password123',
            role: 'user',
        });

        // Create profile
        await Profile.create({
            userId: testUser.id,
            bio: 'Test bio',
        });

        authToken = generateToken(testUser.id);
    });

    afterAll(async () => {
        // Cleanup
        await CommunityMember.destroy({ where: { userId: testUser.id } });
        await Community.destroy({ where: { creatorId: testUser.id } });
        await Profile.destroy({ where: { userId: testUser.id } });
        await User.destroy({ where: { id: testUser.id } });
    });

    describe('POST /api/communities', () => {
        it('should create a new community successfully', async () => {
            const response = await request(app).post('/api/communities').set('Authorization', `Bearer ${authToken}`).send({
                name: 'testcommunity',
                description: 'A test community for testing purposes',
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name', 'testcommunity');
            expect(response.body).toHaveProperty('description');

            testCommunity = response.body;
        });

        it('should fail without authentication', async () => {
            const response = await request(app).post('/api/communities').send({
                name: 'unauthcommunity',
                description: 'Should fail',
            });

            expect(response.status).toBe(401);
        });

        it('should allow duplicate community name', async () => {
            const response = await request(app).post('/api/communities').set('Authorization', `Bearer ${authToken}`).send({
                name: 'testcommunity',
                description: 'Duplicate name',
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('name', 'testcommunity');
        });

        it('should fail if required fields are missing', async () => {
            const response = await request(app).post('/api/communities').set('Authorization', `Bearer ${authToken}`).send({
                description: 'Missing name field',
            });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/communities', () => {
        it('should get all communities successfully', async () => {
            const response = await request(app).get('/api/communities').set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('communities');
            expect(response.body).toHaveProperty('myCommunities');
            expect(Array.isArray(response.body.communities)).toBe(true);
        });

        it('should fail without authentication', async () => {
            const response = await request(app).get('/api/communities');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/communities/:id', () => {
        it('should get community details by ID', async () => {
            const response = await request(app).get(`/api/communities/${testCommunity.id}`).set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('community');
            expect(response.body.community).toHaveProperty('id', testCommunity.id);
            expect(response.body.community).toHaveProperty('name', 'testcommunity');
        });

        it('should return 404 for non-existent community', async () => {
            const response = await request(app).get('/api/communities/99999').set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/communities/:id/join', () => {
        let communityToJoin;

        beforeAll(async () => {
            communityToJoin = await Community.create({
                name: 'jointestcommunity',
                description: 'Community for join testing',
                creatorId: testUser.id,
            });
        });

        afterAll(async () => {
            await CommunityMember.destroy({ where: { communityId: communityToJoin.id } });
            await Community.destroy({ where: { id: communityToJoin.id } });
        });

        it('should join a community successfully', async () => {
            const response = await request(app)
                .post(`/api/communities/${communityToJoin.id}/join`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Joined community');
        });

        it('should fail to join already joined community', async () => {
            const response = await request(app)
                .post(`/api/communities/${communityToJoin.id}/join`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Already a member');
        });

        it('should fail without authentication', async () => {
            const response = await request(app).post(`/api/communities/${communityToJoin.id}/join`);

            expect(response.status).toBe(401);
        });
    });

    describe('POST /api/communities/:id/leave', () => {
        let communityToLeave;

        beforeEach(async () => {
            communityToLeave = await Community.create({
                name: 'leavetestcommunity' + Date.now(),
                description: 'Community for leave testing',
                creatorId: testUser.id,
            });

            await CommunityMember.create({
                userId: testUser.id,
                communityId: communityToLeave.id,
            });
        });

        afterEach(async () => {
            await CommunityMember.destroy({ where: { communityId: communityToLeave.id } });
            await Community.destroy({ where: { id: communityToLeave.id } });
        });

        it('should leave a community successfully', async () => {
            const response = await request(app)
                .post(`/api/communities/${communityToLeave.id}/leave`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Left community');
        });

        it('should fail without authentication', async () => {
            const response = await request(app).post(`/api/communities/${communityToLeave.id}/leave`);

            expect(response.status).toBe(401);
        });
    });
});
