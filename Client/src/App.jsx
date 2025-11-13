import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Main Pages
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import BaseLayout from './components/BaseLayout';

function App() {
    return (
        <Router>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes with BaseLayout */}
                <Route
                    element={
                        <ProtectedRoute>
                            <BaseLayout />
                        </ProtectedRoute>
                    }>
                    <Route path="/posts" element={<Posts />} />
                    <Route path="/posts/new" element={<CreatePost />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/communities" element={<Communities />} />
                    <Route path="/communities/:id" element={<CommunityDetail />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<EditProfile />} />
                </Route>

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/posts" replace />} />
                <Route path="*" element={<Navigate to="/posts" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
