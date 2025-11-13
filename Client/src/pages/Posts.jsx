import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService, communityService, profileService } from '../services/api.service';
import { toast } from 'react-toastify';
import PostCard from '../components/PostCard';
import CommunitySidebar from '../components/CommunitySidebar';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]); // Store all posts
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedType, setFeedType] = useState('all'); // 'all' or 'following'
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState(null);

    useEffect(() => {
        fetchData();
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        // Filter posts based on feedType
        if (feedType === 'all') {
            setPosts(allPosts);
        } else {
            // Only show posts from joined communities
            const communityIds = communities.map((c) => c.id);
            const filteredPosts = allPosts.filter((post) => communityIds.includes(post.communityId));
            setPosts(filteredPosts);
        }
    }, [feedType, allPosts, communities]);

    const fetchData = async () => {
        try {
            const [postsData, communitiesData] = await Promise.all([postService.getAllPosts(), communityService.getAllCommunities()]);
            const fetchedPosts = postsData.posts || postsData;
            setAllPosts(fetchedPosts);
            setPosts(fetchedPosts);
            // Use myCommunities from response, fallback to communities array if old format
            setCommunities(communitiesData.myCommunities || (Array.isArray(communitiesData) ? communitiesData : []));
        } catch (error) {
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const data = await profileService.getProfile();
            setCurrentUserId(data.id);
            setCurrentUserRole(data.role);
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleLike = async (postId) => {
        try {
            await postService.likePost(postId);
            fetchData(); // Refresh posts
            toast.success('Post liked!');
        } catch (error) {
            toast.error('Failed to like post');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await postService.deletePost(postId);
            toast.success('Post deleted successfully!');
            fetchData(); // Refresh posts
        } catch (error) {
            toast.error('Failed to delete post');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C63FF] mx-auto"></div>
                    <p className="mt-4 text-[#5F5F5F]">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-6 bg-[#F5F5F5] min-h-screen">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar - Communities */}
                    <div className="lg:col-span-3">
                        <CommunitySidebar communities={communities} />
                    </div>

                    {/* Main Content - Posts Feed */}
                    <div className="lg:col-span-6">
                        {/* Feed Type Tabs */}
                        <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden border border-[#E0E0E0]">
                            <div className="flex border-b border-[#E0E0E0]">
                                <button
                                    onClick={() => setFeedType('all')}
                                    className={`flex-1 py-3 px-4 text-sm font-semibold transition flex items-center justify-center gap-2 ${
                                        feedType === 'all'
                                            ? 'border-b-2 border-[#6C63FF] text-[#6C63FF]'
                                            : 'text-[#5F5F5F] hover:bg-[#F5F5F5]'
                                    }`}>
                                    <span> All Posts</span>
                                </button>
                                <button
                                    onClick={() => setFeedType('following')}
                                    className={`flex-1 py-3 px-4 text-sm font-semibold transition flex items-center justify-center gap-2 ${
                                        feedType === 'following'
                                            ? 'border-b-2 border-[#6C63FF] text-[#6C63FF]'
                                            : 'text-[#5F5F5F] hover:bg-[#F5F5F5]'
                                    }`}>
                                    <span> Following</span>
                                </button>
                            </div>
                        </div>

                        {/* Create Post Card */}
                        <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-[#E0E0E0]">
                            <Link
                                to="/posts/new"
                                className="block w-full text-left px-4 py-3 bg-[#F5F5F5] hover:bg-[#E0E0E0] rounded-lg text-[#5F5F5F]">
                                Create a post...
                            </Link>
                        </div>

                        {/* Posts List */}
                        <div className="space-y-4">
                            {posts.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-8 text-center border border-[#E0E0E0]">
                                    {feedType === 'following' ? (
                                        <>
                                            <p className="text-[#5F5F5F] mb-2">No posts from your followed communities yet.</p>
                                            <p className="text-[#5F5F5F] text-sm mb-4 opacity-70">
                                                Join some communities to see their posts here!
                                            </p>
                                            <Link
                                                to="/communities"
                                                className="inline-block px-6 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#4C46EF]">
                                                Browse Communities
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[#5F5F5F]">No posts yet. Be the first to post!</p>
                                            <Link
                                                to="/posts/new"
                                                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                                Create Post
                                            </Link>
                                        </>
                                    )}
                                </div>
                            ) : (
                                posts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onLike={handleLike}
                                        onDelete={handleDeletePost}
                                        currentUserId={currentUserId}
                                        currentUserRole={currentUserRole}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Following (Placeholder) */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
                            <h3 className="font-bold text-lg mb-4">Following</h3>
                            <p className="text-sm text-gray-500">Follow users feature coming soon!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
