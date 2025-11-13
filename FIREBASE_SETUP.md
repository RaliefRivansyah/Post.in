# 🔥 Firebase Realtime Database Setup Guide

## Prerequisites

-   Firebase Account (free)
-   Firebase Project created

## Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Enter project name (e.g., "postin-realtime")
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 2. Enable Realtime Database

1. In Firebase Console, go to **Realtime Database**
2. Click "Create Database"
3. Choose location (closest to your users)
4. Start in **Test Mode** (for development)
    ```
    {
      "rules": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
    ```
5. Click "Enable"

### 3. Get Firebase Configuration (Frontend)

1. Go to **Project Settings** (⚙️ icon)
2. Scroll down to "Your apps"
3. Click **Web** icon (</>)
4. Register app (nickname: "postin-client")
5. Copy the `firebaseConfig` object values
6. Add to `Client/.env`:
    ```env
    VITE_FIREBASE_API_KEY=AIzaSy...
    VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
    VITE_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
    VITE_FIREBASE_APP_ID=1:123456789:web:abc123
    ```

### 4. Get Service Account (Backend)

1. Go to **Project Settings** > **Service Accounts**
2. Click **Generate New Private Key**
3. Download JSON file
4. Rename to `firebase-service-account.json`
5. Move to `Server/` directory (same level as `app.js`)
6. Add to `Server/.env`:
    ```env
    FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
    ```

⚠️ **IMPORTANT**: Add `firebase-service-account.json` to `.gitignore`!

### 5. Update Security Rules (Production)

For production, update Realtime Database rules:

```json
{
    "rules": {
        "notifications": {
            "$userId": {
                ".read": "$userId === auth.uid",
                ".write": "true"
            }
        },
        "postUpdates": {
            ".read": "auth != null",
            ".write": "auth != null"
        }
    }
}
```

## Features Enabled

### 📬 Real-time Notifications

-   Comment notifications
-   Like notifications
-   Unread count badge
-   Click to navigate to post

### 🔔 Notification Bell Component

-   Appears in Navbar
-   Red badge shows unread count
-   Dropdown shows notification list
-   Mark as read on click
-   Clear all notifications

### 🚀 Real-time Post Updates

-   Auto-refresh feed when new posts added
-   Instant updates without page reload

## Testing

1. **Restart both servers**:

    ```bash
    # Terminal 1 - Backend
    cd Server
    node app.js

    # Terminal 2 - Frontend
    cd Client
    npm run dev
    ```

2. **Test Notifications**:

    - Login with User A
    - Create a post
    - Login with User B (different browser/incognito)
    - Comment on User A's post
    - Check User A's notification bell (red badge should appear)

3. **Check Firebase Console**:
    - Go to Realtime Database
    - You should see data under `notifications/{userId}/`

## Troubleshooting

### "Firebase not initialized" warning

-   Check if `firebase-service-account.json` exists in `Server/` folder
-   Verify `FIREBASE_DATABASE_URL` in `Server/.env`

### Notifications not appearing

-   Check browser console for errors
-   Verify Firebase config in `Client/.env`
-   Check Firebase Database Rules (should allow read/write)

### CORS errors

-   Make sure Firebase Database URL is correct
-   Check that app is registered in Firebase Console

## File Structure

```
Server/
├── firebase-service-account.json  # ⚠️ Don't commit!
├── .env                           # Contains FIREBASE_DATABASE_URL
└── services/
    └── firebaseService.js         # Firebase Admin SDK

Client/
├── .env                           # Contains Firebase config
├── src/
│   ├── utils/
│   │   └── firebase.js            # Firebase client SDK
│   └── components/
│       └── NotificationBell.jsx   # Notification UI
```

## Security Notes

-   Never commit `firebase-service-account.json`
-   Never commit `.env` files with real credentials
-   Update database rules before production deployment
-   Consider rate limiting for notifications

## Additional Features to Implement

-   [ ] Push notifications (with Firebase Cloud Messaging)
-   [ ] Notification sound/vibration
-   [ ] Mention notifications (@username)
-   [ ] Community notifications
-   [ ] Email digest of notifications

---

Need help? Check [Firebase Documentation](https://firebase.google.com/docs/database)
