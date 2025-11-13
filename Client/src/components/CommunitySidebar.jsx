import { Link } from 'react-router-dom';

export default function CommunitySidebar({ communities }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 sticky top-6 border border-[#E0E0E0]">
            <h3 className="font-bold text-lg mb-4 text-[#1A1A1A]">My Communities</h3>

            {communities && communities.length > 0 ? (
                <div className="space-y-2 mb-4">
                    {communities.map((community) => (
                        <Link
                            key={community.id}
                            to={`/communities/${community.id}`}
                            className="flex items-center p-2 rounded-lg hover:bg-[#F5F5F5] transition">
                            {community.iconUrl ? (
                                <img src={community.iconUrl} alt={community.name} className="w-6 h-6 rounded-full mr-2" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-[#6C63FF] flex items-center justify-center text-white text-xs font-bold mr-2">
                                    {community.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="text-sm text-[#1A1A1A]">r/{community.name}</span>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-[#5F5F5F] mb-4">You haven't joined any communities yet.</p>
            )}

            <hr className="my-4 border-[#E0E0E0]" />

            <Link
                to="/communities"
                className="block w-full text-center px-4 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-[#4C46EF] transition text-sm">
                Explore Communities
            </Link>
        </div>
    );
}
