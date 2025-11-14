const request = require('supertest');
const app = require('../app');
const { User, Post, Community, Profile } = require('../models');
const jwt = require('jsonwebtoken');

// Helper function untuk generate token
function generateToken(userId, role = 'user') {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'supersecretjwt');
}

describe('Post Endpoints', () => {
    let testUser;
    let testCommunity;
    let testPost;
    let authToken;

    beforeAll(async () => {
        // Create test user
        testUser = await User.create({
            username: 'postuser',
            email: 'postuser@example.com',
            password: 'password123',
            role: 'user',
        });

        // Create profile for user
        await Profile.create({
            userId: testUser.id,
            bio: 'Test bio',
        });

        // Create test community
        testCommunity = await Community.create({
            name: 'testcommunity',
            description: 'Test community description',
            creatorId: testUser.id,
        });

        authToken = generateToken(testUser.id);
    });

    afterAll(async () => {
        // Cleanup
        await Post.destroy({ where: { userId: testUser.id } });
        await Community.destroy({ where: { id: testCommunity.id } });
        await Profile.destroy({ where: { userId: testUser.id } });
        await User.destroy({ where: { id: testUser.id } });
    });

    describe('POST /api/posts', () => {
        it('should create a new post successfully', async () => {
            const response = await request(app).post('/api/posts').set('Authorization', `Bearer ${authToken}`).send({
                title: 'Test Post Title',
                content: 'Test post content',
                communityId: testCommunity.id,
            });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('title', 'Test Post Title');
            expect(response.body).toHaveProperty('content', 'Test post content');

            testPost = response.body;
        });

        it('should fail without authentication', async () => {
            const response = await request(app).post('/api/posts').send({
                title: 'Test Post',
                content: 'Test content',
                communityId: testCommunity.id,
            });

            expect(response.status).toBe(401);
        });

        it('should fail with invalid token', async () => {
            const response = await request(app).post('/api/posts').set('Authorization', 'Bearer invalidtoken').send({
                title: 'Test Post',
                content: 'Test content',
                communityId: testCommunity.id,
            });

            expect(response.status).toBe(401);
        });

        it('should fail if required fields are missing', async () => {
            const response = await request(app).post('/api/posts').set('Authorization', `Bearer ${authToken}`).send({
                content: 'Test content without title',
                // missing title
            });

            expect(response.status).toBe(400);
        });
    });

    describe('GET /api/posts', () => {
        it('should get all posts successfully', async () => {
            const response = await request(app).get('/api/posts').set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('posts');
            expect(Array.isArray(response.body.posts)).toBe(true);
        });

        it('should fail without authentication', async () => {
            const response = await request(app).get('/api/posts');

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/posts/:id', () => {
        it('should get a specific post by ID', async () => {
            const response = await request(app).get(`/api/posts/${testPost.id}`).set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id', testPost.id);
            expect(response.body).toHaveProperty('title', 'Test Post Title');
        });

        it('should return 404 for non-existent post', async () => {
            const response = await request(app).get('/api/posts/99999').set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/posts/:id', () => {
        let postToDelete;

        beforeEach(async () => {
            postToDelete = await Post.create({
                title: 'Post to Delete',
                content: 'This will be deleted',
                userId: testUser.id,
                communityId: testCommunity.id,
            });
        });

        it('should delete own post successfully', async () => {
            const response = await request(app).delete(`/api/posts/${postToDelete.id}`).set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Post deleted');
        });

        it("should fail to delete another user's post", async () => {
            // Create another user
            const anotherUser = await User.create({
                username: 'anotheruser',
                email: 'another@example.com',
                password: 'password123',
            });

            const anotherToken = generateToken(anotherUser.id);

            const response = await request(app).delete(`/api/posts/${postToDelete.id}`).set('Authorization', `Bearer ${anotherToken}`);

            expect(response.status).toBe(403);

            // Cleanup
            await User.destroy({ where: { id: anotherUser.id } });
        });
    });
});
