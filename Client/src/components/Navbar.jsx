import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { authService, profileService } from '../services/api.service';
import NotificationBell from './NotificationBell';

export default function Navbar() {
    const [profile, setProfile] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleLogout = () => {
        authService.logout();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="bg-[#1A1A1A] text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/posts" className="text-xl font-bold">
                        Postin
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link to="/posts" className="px-3 py-2 rounded-lg hover:bg-[#5F5F5F] transition">
                            Posts
                        </Link>
                        <Link to="/communities" className="px-3 py-2 rounded-lg hover:bg-[#5F5F5F] transition">
                            Communities
                        </Link>
                        <NotificationBell />

                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#5F5F5F] transition">
                                {profile?.Profile?.avatarUrl ? (
                                    <img
                                        src={profile.Profile.avatarUrl}
                                        alt={profile.username}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-[#6C63FF] flex items-center justify-center text-white text-sm font-bold">
                                        {profile?.username?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-[#E0E0E0]">
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsDropdownOpen(false)}
                                        className="block px-4 py-2 text-[#1A1A1A] hover:bg-[#F5F5F5] transition">
                                        <div className="flex items-center gap-2">
                                            <span>👤</span>
                                            <span>Profile</span>
                                        </div>
                                    </Link>
                                    <hr className="my-1 border-[#E0E0E0]" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-[#F5F5F5] transition">
                                        <div className="flex items-center gap-2">
                                            <span>🚪</span>
                                            <span>Logout</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
