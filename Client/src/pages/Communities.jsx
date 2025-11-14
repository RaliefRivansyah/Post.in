import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { communityService } from '../services/api.service';
import { toast } from 'react-toastify';
import CreateCommunityModal from '../components/CreateCommunityModal';

export default function Communities() {
    const [communities, setCommunities] = useState([]);
    const [myCommunityIds, setMyCommunityIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCommunities();
    }, []);

    const fetchCommunities = async () => {
        try {
            const data = await communityService.getAllCommunities();
            // Handle new response format with communities array
            setCommunities(data.communities || data);
            // Store my community IDs for checking membership
            const myIds = (data.myCommunities || []).map((c) => c.id);
            setMyCommunityIds(myIds);
        } catch (error) {
            toast.error('Failed to load communities');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (id) => {
        try {
            await communityService.joinCommunity(id);
            toast.success('Joined community!');
            fetchCommunities();
        } catch (error) {
            toast.error('Failed to join community');
        }
    };

    const handleLeave = async (id) => {
        try {
            await communityService.leaveCommunity(id);
            toast.success('Left community');
            fetchCommunities();
        } catch (error) {
            toast.error('Failed to leave community');
        }
    };

    const handleCreateCommunity = async (communityData) => {
        try {
            await communityService.createCommunity(communityData);
            toast.success('Community created!');
            setShowModal(false);
            fetchCommunities();
        } catch {
            toast.error('Failed to create community');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="py-6">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">All Communities</h1>
                    <button onClick={() => setShowModal(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Create Community
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communities.map((community) => {
                        const isMember = myCommunityIds.includes(community.id);

                        return (
                            <div key={community.id} className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        {community.iconUrl ? (
                                            <img src={community.iconUrl} alt={community.name} className="w-12 h-12 rounded-full mr-3" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-bold mr-3">
                                                {community.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <Link to={`/communities/${community.id}`} className="text-lg font-bold hover:text-blue-600">
                                                c/{community.name}
                                            </Link>
                                            <p className="text-sm text-gray-500">{community.Members?.length || 0} members</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4 line-clamp-2">{community.description}</p>

                                {isMember ? (
                                    <button
                                        onClick={() => handleLeave(community.id)}
                                        className="w-full py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
                                        Leave
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleJoin(community.id)}
                                        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Join
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {communities.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No communities yet. Be the first to create one!</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            Create Community
                        </button>
                    </div>
                )}
            </div>

            {showModal && <CreateCommunityModal onClose={() => setShowModal(false)} onCreate={handleCreateCommunity} />}
        </div>
    );
}
