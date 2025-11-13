import { Link } from 'react-router-dom';
import { authService } from '../services/api.service';
import NotificationBell from './NotificationBell';

export default function Navbar() {
    const handleLogout = () => {
        authService.logout();
    };

    return (
        <nav className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/posts" className="text-xl font-bold">
                        Postin
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link to="/posts" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">
                            Posts
                        </Link>
                        <Link to="/communities" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">
                            Communities
                        </Link>
                        <Link to="/profile" className="px-3 py-2 rounded-lg hover:bg-gray-800 transition">
                            Profile
                        </Link>
                        <NotificationBell />
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
