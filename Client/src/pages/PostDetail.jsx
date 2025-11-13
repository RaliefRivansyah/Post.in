import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService, profileService } from '../services/api.service';
import { toast } from 'react-toastify';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState(null);

    useEffect(() => {
        fetchPost();
        fetchCurrentUser();
    }, [id]);

    const fetchPost = async () => {
        try {
            const data = await postService.getPostById(id);
            setPost(data);
        } catch (error) {
            toast.error('Failed to load post');
            navigate('/posts');
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
            // User not logged in or error fetching profile
            console.error('Error fetching user:', error);
        }
    };

    const handleLike = async () => {
        try {
            await postService.likePost(id);
            fetchPost();
            toast.success('Post liked!');
        } catch (error) {
            toast.error('Failed to like post');
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            const result = await postService.createComment(id, comment);
            setComment('');

            // Check if AI responded
            if (result.aiComment) {
                toast.success('Comment added! AI Bot is responding... 🤖');
                // Refresh to show both comments
                setTimeout(() => fetchPost(), 1500);
            } else {
                toast.success('Comment added!');
                fetchPost();
            }
        } catch (error) {
            toast.error('Failed to add comment');
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await postService.deletePost(id);
            toast.success('Post deleted successfully!');
            navigate('/posts');
        } catch (error) {
            toast.error('Failed to delete post');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await postService.deleteComment(id, commentId);
            toast.success('Comment deleted!');
            fetchPost();
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="py-6">
            <div className="container mx-auto px-4 max-w-4xl">
                <Link to="/posts" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                    ← Back to feed
                </Link>

                {/* Post Card */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Post Header */}
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                {post.User.Profile?.avatarUrl ? (
                                    <img
                                        src={post.User.Profile.avatarUrl}
                                        alt={post.User.username}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
                                        {post.User.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    {post.Community && (
                                        <Link
                                            to={`/communities/${post.Community.id}`}
                                            className="text-sm font-bold text-gray-900 hover:underline">
                                            r/{post.Community.name}
                                        </Link>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        Posted by {post.User.username} • {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {(post.User.id === currentUserId || currentUserRole === 'admin') && (
                                <button
                                    onClick={handleDeletePost}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                    Delete Post
                                </button>
                            )}
                        </div>

                        {/* Post Content */}
                        <h1 className="text-2xl font-bold mb-4">{post.title}</h1>

                        {post.mediaType === 'video' && post.videoUrl ? (
                            <video src={post.videoUrl} controls className="w-full rounded-lg mb-4 max-h-96" preload="metadata" />
                        ) : post.imageUrl ? (
                            <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg mb-4 max-h-96 object-cover" />
                        ) : null}

                        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>

                        {/* Post Actions */}
                        <div className="flex items-center gap-4 mt-6 pt-4 border-t">
                            <button
                                onClick={handleLike}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
                                <span>❤️</span>
                                <span>{post.Likes?.length || 0} Likes</span>
                            </button>
                            <div className="flex items-center gap-2 text-gray-600">
                                <span>💬</span>
                                <span>{post.Comments?.length || 0} Comments</span>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t bg-gray-50 p-6">
                        {/* AI Bot Info */}
                        <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🤖</span>
                                <h3 className="font-bold text-purple-900">AI Bot Available!</h3>
                            </div>
                            <p className="text-sm text-purple-800">
                                <strong>Tip:</strong> Mention <code className="bg-purple-100 px-2 py-0.5 rounded">@bot</code> or{' '}
                                <code className="bg-purple-100 px-2 py-0.5 rounded">@ai</code> in your comment to get an AI-powered
                                response!
                            </p>
                            <p className="text-xs text-purple-600 mt-2">
                                Example: "@bot what do you think about this?" or "@ai can you explain this?"
                            </p>
                        </div>

                        {/* Add Comment Form */}
                        <form onSubmit={handleComment} className="mb-6">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write a comment... (Use @bot or @ai to ask AI)"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                            />
                            <button type="submit" className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Comment
                            </button>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {post.Comments && post.Comments.length > 0 ? (
                                post.Comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className={`rounded-lg p-4 ${
                                            comment.User.username === 'WOWO'
                                                ? 'bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200'
                                                : 'bg-white'
                                        }`}>
                                        <div className="flex items-start">
                                            {comment.User.Profile?.avatarUrl ? (
                                                <img
                                                    src={comment.User.Profile.avatarUrl}
                                                    alt={comment.User.username}
                                                    className="w-8 h-8 rounded-full mr-3"
                                                />
                                            ) : (
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                                                        comment.User.username === 'WOWO'
                                                            ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                                                            : 'bg-gray-400'
                                                    }`}>
                                                    {comment.User.username.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-sm">{comment.User.username}</p>
                                                        {comment.User.username === 'WOWO' && (
                                                            <span className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-0.5 rounded-full font-medium">
                                                                🤖 AI
                                                            </span>
                                                        )}
                                                    </div>
                                                    {(comment.User.id === currentUserId || currentUserRole === 'admin') && (
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="text-xs text-red-600 hover:text-red-800 hover:underline">
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-gray-800 mt-1">{comment.content}</p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {new Date(comment.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
