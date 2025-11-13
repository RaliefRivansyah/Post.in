import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService, uploadService } from '../services/api.service';
import { toast } from 'react-toastify';

export default function EditProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        location: '',
        avatarUrl: '',
        website: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileService.getProfile();
            setFormData({
                username: data.username || '',
                bio: data.Profile?.bio || '',
                location: data.Profile?.location || '',
                avatarUrl: data.Profile?.avatarUrl || '',
                website: data.Profile?.website || '',
            });
        } catch {
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (2MB for avatar)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Avatar size must be less than 2MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await uploadService.uploadAvatar(formData);
            setFormData((prev) => ({ ...prev, avatarUrl: response.url }));
            toast.success('Avatar uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await profileService.updateProfile(formData);
            toast.success('Profile updated successfully!');
            navigate('/profile');
        } catch {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C63FF]"></div>
            </div>
        );
    }

    return (
        <div className="py-6 bg-[#F5F5F5] min-h-screen">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-lg shadow-md p-6 border border-[#E0E0E0]">
                    <h2 className="text-2xl font-bold mb-6 text-[#1A1A1A]">Edit Profile</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Username *</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Avatar</label>
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    {formData.avatarUrl ? (
                                        <img
                                            src={formData.avatarUrl}
                                            alt="Avatar preview"
                                            className="w-20 h-20 rounded-full object-cover border-2 border-[#E0E0E0]"
                                            onError={(e) => {
                                                e.target.src = '';
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full bg-[#6C63FF] flex items-center justify-center text-white text-2xl font-bold">
                                            {formData.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            disabled={uploading}
                                            className="hidden"
                                            id="avatar-upload"
                                        />
                                        <label
                                            htmlFor="avatar-upload"
                                            className={`inline-block px-4 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#4C46EF] cursor-pointer transition ${
                                                uploading ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}>
                                            {uploading ? 'Uploading...' : 'Upload Avatar'}
                                        </label>
                                        <p className="text-xs text-[#5F5F5F] mt-1">JPG, PNG, GIF up to 2MB</p>
                                    </div>
                                </div>
                                <input
                                    type="url"
                                    name="avatarUrl"
                                    value={formData.avatarUrl}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                    placeholder="Or paste image URL"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Bio</label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                placeholder="Tell us about yourself..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                placeholder="City, Country"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Website URL</label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                placeholder="https://yourwebsite.com"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={saving || uploading}
                                className="flex-1 py-2 px-4 bg-[#6C63FF] text-white rounded-lg hover:bg-[#4C46EF] disabled:opacity-50 disabled:cursor-not-allowed">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="px-6 py-2 border border-[#E0E0E0] rounded-lg hover:bg-[#F5F5F5]">
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
