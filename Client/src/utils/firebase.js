import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set, remove } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Notification service
export const notificationService = {
    // Listen to notifications for a user
    listenToNotifications(userId, callback) {
        const notificationsRef = ref(database, `notifications/${userId}`);
        return onValue(notificationsRef, (snapshot) => {
            const notifications = [];
            snapshot.forEach((childSnapshot) => {
                notifications.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val(),
                });
            });
            callback(notifications);
        });
    },

    // Send a notification
    async sendNotification(userId, notification) {
        const notificationsRef = ref(database, `notifications/${userId}`);
        const newNotificationRef = push(notificationsRef);
        await set(newNotificationRef, {
            ...notification,
            createdAt: Date.now(),
            read: false,
        });
    },

    // Mark notification as read
    async markAsRead(userId, notificationId) {
        const notificationRef = ref(database, `notifications/${userId}/${notificationId}`);
        await set(notificationRef, { read: true });
    },

    // Delete notification
    async deleteNotification(userId, notificationId) {
        const notificationRef = ref(database, `notifications/${userId}/${notificationId}`);
        await remove(notificationRef);
    },

    // Clear all notifications
    async clearAllNotifications(userId) {
        const notificationsRef = ref(database, `notifications/${userId}`);
        await remove(notificationsRef);
    },
};

// Real-time post updates
export const postUpdateService = {
    // Listen to post updates
    listenToPostUpdates(callback) {
        const postsRef = ref(database, 'postUpdates');
        return onValue(postsRef, (snapshot) => {
            const update = snapshot.val();
            if (update) {
                callback(update);
            }
        });
    },

    // Trigger post update
    async triggerPostUpdate(type, postId) {
        const postsRef = ref(database, 'postUpdates');
        await set(postsRef, {
            type, // 'new', 'edit', 'delete'
            postId,
            timestamp: Date.now(),
        });
    },
};

export default database;
