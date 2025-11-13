import { Link } from 'react-router-dom';

export default function PostCard({ post, onLike, onDelete, currentUserId, currentUserRole }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="p-4">
                {/* Post Header */}
                <div className="flex items-center mb-3">
                    {post.User.Profile?.avatarUrl ? (
                        <img src={post.User.Profile.avatarUrl} alt={post.User.username} className="w-8 h-8 rounded-full mr-2" />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold mr-2">
                            {post.User.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1">
                        {post.Community ? (
                            <div className="text-sm">
                                <Link to={`/communities/${post.Community.id}`} className="font-bold text-gray-900 hover:underline">
                                    r/{post.Community.name}
                                </Link>
                                <span className="text-gray-500"> • Posted by {post.User.username}</span>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600">Posted by {post.User.username}</p>
                        )}
                    </div>
                </div>

                {/* Post Content */}
                <Link to={`/posts/${post.id}`}>
                    <h3 className="text-lg font-bold mb-2 hover:text-blue-600">{post.title}</h3>
                </Link>

                {post.mediaType === 'video' && post.videoUrl ? (
                    <video src={post.videoUrl} controls className="w-full rounded-lg mb-3 max-h-96" preload="metadata" />
                ) : post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="w-full rounded-lg mb-3 max-h-96 object-cover" />
                ) : null}

                <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p>

                {/* Post Actions */}
                <div className="flex items-center gap-4 pt-3 border-t">
                    <button
                        onClick={() => onLike(post.id)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm">
                        <span>❤️</span>
                        <span>{post.Likes?.length || 0}</span>
                    </button>
                    <Link to={`/posts/${post.id}`} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 text-sm">
                        <span>💬</span>
                        <span>{post.Comments?.length || 0}</span>
                    </Link>
                    <span className="text-xs text-gray-500 ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span>
                    {(currentUserId === post.User.id || currentUserRole === 'admin') && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete(post.id);
                            }}
                            className="text-xs text-red-600 hover:text-red-800 hover:underline">
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
