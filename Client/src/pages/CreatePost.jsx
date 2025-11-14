import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { postService, communityService } from '../services/api.service';
import { toast } from 'react-toastify';
import MediaUploader from '../components/MediaUploader';

export default function CreatePost() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [communities, setCommunities] = useState([]);
    const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
    const [uploadedMedia, setUploadedMedia] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        videoUrl: '',
        communityId: searchParams.get('communityId') || '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async () => {
        try {
            const data = await communityService.getAllCommunities();
            setCommunities(data.myCommunities || data);
        } catch (error) {
            console.error('Failed to load communities');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleMediaUploadComplete = (media) => {
        setUploadedMedia(media);
        if (media.mediaType === 'image') {
            setFormData({ ...formData, imageUrl: media.url, videoUrl: '' });
        } else {
            setFormData({ ...formData, videoUrl: media.url, imageUrl: '' });
        }
    };

    const handleMediaTypeChange = (type) => {
        setMediaType(type);
        setUploadedMedia(null);
        setFormData({ ...formData, imageUrl: '', videoUrl: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert empty string to null for communityId
            const postData = {
                ...formData,
                communityId: formData.communityId || null,
                mediaType: uploadedMedia?.mediaType || null,
            };
            await postService.createPost(postData);
            toast.success('Post created successfully!');
            navigate('/posts');
        } catch (error) {
            toast.error('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-6 bg-[#F5F5F5] min-h-screen">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="bg-white rounded-lg shadow-md p-6 border border-[#E0E0E0]">
                    <h2 className="text-2xl font-bold mb-6 text-[#1A1A1A]">Create a Post</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {communities.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Post to Community (optional)</label>
                                <select
                                    name="communityId"
                                    value={formData.communityId}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]">
                                    <option value="">Your Profile (no community)</option>
                                    {communities.map((community) => (
                                        <option key={community.id} value={community.id}>
                                            c/{community.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Title *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                placeholder="Enter a title for your post..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Content *</label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows="6"
                                className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
                                placeholder="What's on your mind?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Add Media (optional)</label>

                            <div className="flex gap-2 mb-4">
                                <button
                                    type="button"
                                    onClick={() => handleMediaTypeChange('image')}
                                    className={`px-4 py-2 rounded-lg ${
                                        mediaType === 'image'
                                            ? 'bg-[#6C63FF] text-white'
                                            : 'bg-[#E0E0E0] text-[#1A1A1A] hover:bg-[#5F5F5F] hover:text-white'
                                    }`}>
                                    📷 Image
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMediaTypeChange('video')}
                                    className={`px-4 py-2 rounded-lg ${
                                        mediaType === 'video'
                                            ? 'bg-[#6C63FF] text-white'
                                            : 'bg-[#E0E0E0] text-[#1A1A1A] hover:bg-[#5F5F5F] hover:text-white'
                                    }`}>
                                    🎥 Video
                                </button>
                            </div>

                            <MediaUploader mediaType={mediaType} onUploadComplete={handleMediaUploadComplete} />

                            {uploadedMedia && (
                                <div className="mt-2 text-sm text-[#6C63FF]">
                                    ✓ {mediaType === 'image' ? 'Image' : 'Video'} uploaded successfully!
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-2 px-4 bg-[#6C63FF] text-white rounded-lg hover:bg-[#4C46EF] disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Posting...' : 'Post'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/posts')}
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
