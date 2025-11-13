# Post.in - Social Media Platform

Full-stack social media application dengan fitur komunitas seperti Reddit, dibangun dengan Express.js backend dan React frontend.

## 🚀 Features

### Backend (Server)

-   **Authentication**: Register, Login dengan JWT, **Google OAuth Sign In**
-   **Posts**: Create, Read, Update, Delete posts dengan title, content, images, dan videos
-   **📷 Media Uploads**: Image dan video upload menggunakan Cloudinary
-   **Comments**: Comment pada posts
-   **🤖 AI Bot**: AI-powered comment responses menggunakan Google Gemini (mention @bot atau @ai)
-   **🔔 Real-time Notifications**: Firebase Realtime Database untuk notifikasi instant
-   **Likes**: Like/unlike posts
-   **Communities**:
    -   Create dan join communities (seperti subreddits)
    -   Post ke specific communities
    -   Smart feed: menampilkan posts dari communities yang di-join
-   **Profile Management**:
    -   Edit username, bio, location, website
    -   Avatar upload support
    -   Profile statistics

### Frontend (Client)

-   **Modern React UI**: Menggunakan React 19 dengan Tailwind CSS v4
-   **Responsive Design**: Mobile-friendly layouts
-   **Protected Routes**: Authentication guard untuk halaman private
-   **Toast Notifications**: User feedback dengan react-toastify
-   **Real-time Updates**: Automatic refresh setelah actions
-   **3-Column Layout**: Communities sidebar, feed, dan following (coming soon)

## 🛠️ Tech Stack

### Backend

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL dengan Sequelize ORM
-   **Authentication**: JWT (JSON Web Tokens) + Google OAuth
-   **AI Integration**: Google Gemini API (@google/generative-ai)
-   **Real-time**: Firebase Realtime Database (firebase-admin)
-   **File Upload**: Cloudinary (cloudinary, multer, multer-storage-cloudinary)
-   **Session**: express-session
-   **Template Engine**: EJS (untuk server-side rendering)
-   **CORS**: Enabled untuk React frontend

### Frontend

-   **Framework**: React 19.2.0
-   **Styling**: Tailwind CSS v4
-   **Routing**: React Router DOM v7
-   **HTTP Client**: Axios
-   **Notifications**: React Toastify
-   **Build Tool**: Vite v7

## 📦 Installation & Setup

### Prerequisites

-   Node.js (v14 atau lebih tinggi)
-   PostgreSQL
-   npm atau yarn

### Backend Setup

1. Navigate ke folder server:

```bash
cd Server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):

```env
JWT_SECRET=your_secret_key_here
PORT=3000
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
GEMINI_API_KEY=your_gemini_api_key_here
```

> **🤖 AI Bot Setup**: Dapatkan Gemini API key dari [Google AI Studio](https://makersuite.google.com/app/apikey) untuk mengaktifkan fitur AI comment responses.

4. Setup database di `config/config.json`:

```json
{
    "development": {
        "username": "your_db_username",
        "password": "your_db_password",
        "database": "your_database_name",
        "host": "127.0.0.1",
        "dialect": "postgres"
    }
}
```

5. Run migrations:

```bash
npx sequelize-cli db:migrate
```

6. (Optional) Seed data:

```bash
npx sequelize-cli db:seed:all
```

7. Start server:

```bash
node app.js
```

Server akan berjalan di `http://localhost:3000`

### Frontend Setup

1. Navigate ke folder client:

```bash
cd Client
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

4. Start development server:

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 📁 Project Structure

```
Project/
├── Server/                 # Backend Express.js
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Authentication & authorization
│   ├── migrations/        # Database migrations
│   ├── models/            # Sequelize models
│   ├── seeders/           # Database seeders
│   ├── views/             # EJS templates
│   └── app.js            # Main server file
│
└── Client/                # Frontend React
    ├── public/            # Static files
    └── src/
        ├── components/    # Reusable components
        ├── pages/         # Page components
        ├── services/      # API services
        ├── utils/         # Utility functions
        ├── App.jsx       # Main app component
        └── main.jsx      # Entry point
```

## 📝 Google OAuth Setup

Untuk mengaktifkan Google Sign In:

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project atau pilih existing project
3. Enable Google+ API
4. Pergi ke "Credentials" → "Create Credentials" → "OAuth Client ID"
5. Pilih "Web application"
6. Tambahkan Authorized JavaScript origins:
    - `http://localhost:5173`
    - `http://localhost:5174`
7. Tambahkan Authorized redirect URIs:
    - `http://localhost:3000/auth/google/callback`
8. Copy **Client ID** dan **Client Secret**
9. Paste ke `.env` files:
    - Backend (`Server/.env`): `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`
    - Frontend (`Client/.env`): `VITE_GOOGLE_CLIENT_ID`

## 🤖 AI Bot Setup

AI Bot menggunakan **Google Gemini API** untuk memberikan response otomatis pada comments:

### Cara Setup:

1. Dapatkan API key dari [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tambahkan ke `Server/.env`:
    ```env
    GEMINI_API_KEY=your_actual_gemini_api_key
    ```
3. Restart server

### Cara Menggunakan:

Mention AI Bot di comment dengan salah satu trigger words:

-   `@bot` - "Hey @bot, what's the main point of this post?"
-   `@ai` - "Can you @ai summarize this discussion?"
-   `@aibot` - "@aibot explain this topic"
-   `@assistant` - "@assistant help me understand"

AI akan otomatis reply dengan response yang context-aware berdasarkan:

-   Post title dan content
-   Recent comments di thread
-   Pertanyaan user

### Fitur AI Bot:

-   ✅ **Auto-reply** ketika di-mention
-   ✅ **Context-aware** - AI baca post + comments untuk jawaban relevan
-   ✅ **Special styling** - AI comments punya gradient purple-blue background dan badge 🤖
-   ✅ **Fallback responses** - Jika API gagal, AI tetap kasih helpful response
-   ✅ **Auto-create bot user** - Bot user otomatis dibuat saat first mention

> **Note**: AI Bot membutuhkan `GEMINI_API_KEY` yang valid. Tanpa API key, AI features tidak akan berfungsi.

## 🔐 API Endpoints

### Authentication

-   `POST /api/register` - Register new user
-   `POST /api/login` - Login user
-   `POST /api/auth/google` - Google Sign In

### Posts

-   `GET /api/posts` - Get all posts (smart feed)
-   `GET /api/posts/:id` - Get single post
-   `POST /api/posts` - Create new post
-   `DELETE /api/posts/:id` - Delete post (owner or admin)
-   `POST /api/posts/:id/like` - Like/unlike post

### Uploads

-   `POST /api/upload/image` - Upload image (max 5MB)
-   `POST /api/upload/video` - Upload video (max 50MB)
-   `POST /api/upload/avatar` - Upload avatar (max 2MB)
-   `DELETE /api/upload/media` - Delete media from Cloudinary
-   `POST /api/posts/:id/comment` - Add comment

### Communities

-   `GET /api/communities` - Get all communities
-   `GET /api/communities/:id` - Get community detail
-   `POST /api/communities` - Create new community
-   `POST /api/communities/:id/join` - Join community
-   `POST /api/communities/:id/leave` - Leave community

### Profile

-   `GET /api/profile` - Get user profile
-   `POST /api/profile/edit` - Update profile

## 🎨 UI Features

### Pages

-   **Login/Register**: Authentication forms
-   **Posts Feed**: Smart feed dengan sidebar communities
-   **Post Detail**: Full post view dengan comments
-   **Create Post**: Form untuk membuat post baru
-   **Communities**: Browse dan join communities
-   **Community Detail**: View posts dalam community
-   **Profile**: User profile dengan statistics
-   **Edit Profile**: Update profile information

### Components

-   **Navbar**: Navigation dengan logout
-   **PostCard**: Reusable post display
-   **CommunitySidebar**: Communities list sidebar
-   **CreateCommunityModal**: Modal untuk create community
-   **ProtectedRoute**: Authentication guard

## 📷 Cloudinary Setup

Project ini menggunakan **Cloudinary** untuk media uploads. Setup lengkap ada di [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md).

**Quick Setup:**

1. Sign up di [cloudinary.com](https://cloudinary.com)
2. Get credentials dari Dashboard
3. Update `Server/.env`:
    ```env
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

**Supported Formats:**

-   Images: JPG, PNG, GIF, WEBP (max 5MB)
-   Videos: MP4, MOV, AVI, WEBM (max 50MB)

## 🔄 Smart Feed Logic

Feed menampilkan:

1. Posts dari communities yang user join (jika ada)
2. Semua posts jika user belum join community manapun
3. Sorted by newest first

## 🧪 Testing

### Test Accounts (setelah seeding)

-   Email: `user1@mail.com` | Password: `123456`
-   Email: `user2@mail.com` | Password: `123456`
-   Email: `user3@mail.com` | Password: `123456`

### Sample Communities

-   r/Technology
-   r/Photography
-   r/Cooking
-   r/Gaming
-   r/Travel

## 🚧 Coming Soon

-   User follow/unfollow system
-   Real-time notifications
-   Image upload (currently URL only)
-   Post editing
-   Community moderators
-   Search functionality

## 📝 License

ISC

## 👥 Contributors

-   Ralief Rivansyah

## 🐛 Known Issues

-   None currently reported

## 📞 Support

For issues or questions, please create an issue in the repository.
