import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { communityService, postService } from '../services/api.service';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';

export default function CommunityDetail() {
    const { id } = useParams();
    const [community, setCommunity] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCommunity();
    }, [id]);

    const fetchCommunity = async () => {
        try {
            const data = await communityService.getCommunityById(id);
            setCommunity(data.community || data);
            setPosts(data.posts || []);
        } catch {
            toast.error('Failed to load community');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        try {
            await communityService.joinCommunity(id);
            toast.success('Joined community!');
            fetchCommunity();
        } catch {
            toast.error('Failed to join community');
        }
    };

    const handleLeave = async () => {
        try {
            await communityService.leaveCommunity(id);
            toast.success('Left community');
            fetchCommunity();
        } catch {
            toast.error('Failed to leave community');
        }
    };

    const handleLike = async (postId) => {
        try {
            await postService.likePost(postId);
            fetchCommunity();
            toast.success('Post liked!');
        } catch {
            toast.error('Failed to like post');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!community) return null;

    const isMember = community.Members?.some((m) => m.id);

    return (
        <div className="py-6">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Community Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {community.iconUrl ? (
                                <img src={community.iconUrl} alt={community.name} className="w-20 h-20 rounded-full mr-4" />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold mr-4">
                                    {community.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <h1 className="text-3xl font-bold">r/{community.name}</h1>
                                <p className="text-gray-600 mt-1">{community.description}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Created by {community.Creator?.username} • {community.Members?.length || 0} members
                                </p>
                            </div>
                        </div>
                        <div>
                            {isMember ? (
                                <button
                                    onClick={handleLeave}
                                    className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
                                    Leave Community
                                </button>
                            ) : (
                                <button onClick={handleJoin} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Join Community
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Create Post Button for Members */}
                {isMember && (
                    <Link
                        to={`/posts/new?communityId=${id}`}
                        className="block mb-6 px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700">
                        Create Post in r/{community.name}
                    </Link>
                )}

                {/* Posts */}
                <h2 className="text-2xl font-bold mb-4">Posts</h2>
                <div className="space-y-4">
                    {posts.length > 0 ? (
                        posts.map((post) => <PostCard key={post.id} post={post} onLike={handleLike} />)
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <p className="text-gray-500 mb-4">No posts in this community yet.</p>
                            {isMember && (
                                <Link
                                    to={`/posts/new?communityId=${id}`}
                                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                    Be the first to post!
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
