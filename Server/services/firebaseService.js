const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You need to download service account key from Firebase Console
// Go to Project Settings > Service Accounts > Generate New Private Key
let database = null;

try {
    // Check if service account file exists
    const serviceAccount = require('../firebase-service-account.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    database = admin.database();
    console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
    console.warn('⚠️ Firebase service account not found. Real-time features will be disabled.');
    console.warn('To enable Firebase: Download service account JSON from Firebase Console');
}

const firebaseService = {
    // Send notification to user
    async sendNotification(userId, notification) {
        if (!database) return;
        try {
            const notificationsRef = database.ref(`notifications/${userId}`);
            await notificationsRef.push({
                ...notification,
                createdAt: Date.now(),
                read: false,
            });
        } catch (error) {
            console.error('Firebase notification error:', error);
        }
    },

    // Notify about new comment
    async notifyNewComment(postOwnerId, comment, post) {
        if (comment.userId === postOwnerId) return; // Don't notify self
        await this.sendNotification(postOwnerId, {
            type: 'comment',
            message: `${comment.User.username} commented on your post: "${post.title}"`,
            postId: post.id,
            commentId: comment.id,
            from: comment.User.username,
        });
    },

    // Notify about new like
    async notifyNewLike(postOwnerId, userId, username, post) {
        if (userId === postOwnerId) return; // Don't notify self
        await this.sendNotification(postOwnerId, {
            type: 'like',
            message: `${username} liked your post: "${post.title}"`,
            postId: post.id,
            from: username,
        });
    },

    // Trigger post update for real-time feed refresh
    async triggerPostUpdate(type, postId) {
        if (!database) return;
        try {
            const postsRef = database.ref('postUpdates');
            await postsRef.set({
                type, // 'new', 'edit', 'delete'
                postId,
                timestamp: Date.now(),
            });
        } catch (error) {
            console.error('Firebase post update error:', error);
        }
    },

    // Check if Firebase is initialized
    isInitialized() {
        return database !== null;
    },
};

module.exports = firebaseService;
