import { useState } from 'react';
import { uploadService } from '../services/api.service';
import { toast } from 'react-toastify';

export default function CreateCommunityModal({ onClose, onCreate }) {
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        iconUrl: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleIconUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Icon size must be less than 2MB');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('avatar', file);

            const response = await uploadService.uploadAvatar(formDataUpload);
            setFormData((prev) => ({ ...prev, iconUrl: response.url }));
            toast.success('Icon uploaded successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload icon');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6 border border-[#E0E0E0]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Create a Community</h2>
                    <button onClick={onClose} className="text-[#5F5F5F] hover:text-[#1A1A1A] text-2xl">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Community Name *</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[#E0E0E0] bg-[#F5F5F5] text-[#5F5F5F]">
                                r/
                            </span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                pattern="[a-zA-Z0-9_]+"
                                className="flex-1 px-3 py-2 border border-[#E0E0E0] rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                placeholder="community_name"
                            />
                        </div>
                        <p className="text-xs text-[#5F5F5F] mt-1">Use only letters, numbers, and underscores</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                            placeholder="What is this community about?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Community Icon</label>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                {formData.iconUrl ? (
                                    <img
                                        src={formData.iconUrl}
                                        alt="Icon preview"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-[#E0E0E0]"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-[#6C63FF] flex items-center justify-center text-white text-xl font-bold">
                                        {formData.name?.charAt(0).toUpperCase() || 'C'}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleIconUpload}
                                        disabled={uploading}
                                        className="hidden"
                                        id="icon-upload"
                                    />
                                    <label
                                        htmlFor="icon-upload"
                                        className={`inline-block px-4 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#4C46EF] cursor-pointer transition text-sm ${
                                            uploading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}>
                                        {uploading ? 'Uploading...' : 'Upload Icon'}
                                    </label>
                                    <p className="text-xs text-[#5F5F5F] mt-1">JPG, PNG up to 2MB</p>
                                </div>
                            </div>
                            <input
                                type="url"
                                name="iconUrl"
                                value={formData.iconUrl}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                placeholder="Or paste icon URL"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-lg hover:bg-[#F5F5F5]">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="flex-1 px-4 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#4C46EF] disabled:opacity-50 disabled:cursor-not-allowed">
                            Create Community
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
