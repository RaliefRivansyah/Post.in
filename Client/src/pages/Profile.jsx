import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileService } from '../services/api.service';
import { toast } from 'react-toastify';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setProfile(data);
        } catch {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="py-6">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-32"></div>

                    <div className="px-6 pb-6">
                        <div className="flex items-end justify-between -mt-16 mb-6">
                            <div className="flex items-end">
                                {profile.Profile?.avatarUrl ? (
                                    <img
                                        src={profile.Profile.avatarUrl}
                                        alt={profile.username}
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                                        {profile.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div className="ml-6 mb-4">
                                    <h1 className="text-3xl font-bold text-gray-900">{profile.username}</h1>
                                    <p className="text-gray-600">{profile.email}</p>
                                </div>
                            </div>
                            <Link to="/profile/edit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4">
                                Edit Profile
                            </Link>
                        </div>

                        {/* Profile Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="border rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bio</h3>
                                <p className="text-gray-800">{profile.Profile?.bio || 'No bio yet'}</p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Location</h3>
                                <p className="text-gray-800">{profile.Profile?.location || 'Not specified'}</p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Website</h3>
                                {profile.Profile?.website ? (
                                    <a
                                        href={profile.Profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline">
                                        {profile.Profile.website}
                                    </a>
                                ) : (
                                    <p className="text-gray-800">No website</p>
                                )}
                            </div>

                            <div className="border rounded-lg p-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Member Since</h3>
                                <p className="text-gray-800">
                                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600">{profile.Posts?.length || 0}</p>
                                <p className="text-gray-600 text-sm">Posts</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600">{profile.Comments?.length || 0}</p>
                                <p className="text-gray-600 text-sm">Comments</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600">{profile.JoinedCommunities?.length || 0}</p>
                                <p className="text-gray-600 text-sm">Communities</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
