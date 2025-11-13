import { Link } from 'react-router-dom';

export default function CommunitySidebar({ communities }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
            <h3 className="font-bold text-lg mb-4">My Communities</h3>

            {communities && communities.length > 0 ? (
                <div className="space-y-2 mb-4">
                    {communities.map((community) => (
                        <Link
                            key={community.id}
                            to={`/communities/${community.id}`}
                            className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition">
                            {community.iconUrl ? (
                                <img src={community.iconUrl} alt={community.name} className="w-6 h-6 rounded-full mr-2" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-2">
                                    {community.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="text-sm">r/{community.name}</span>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 mb-4">You haven't joined any communities yet.</p>
            )}

            <hr className="my-4" />

            <Link
                to="/communities"
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                Explore Communities
            </Link>
        </div>
    );
}
