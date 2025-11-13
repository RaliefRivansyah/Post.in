import { useState, useEffect } from 'react';
import { notificationService } from '../utils/firebase';
import { profileService } from '../services/api.service';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user ID using existing profile service
        const getUserId = async () => {
            try {
                const data = await profileService.getProfile();
                setCurrentUserId(data.id);
            } catch (error) {
                console.error('Error getting user:', error);
            }
        };

        getUserId();
    }, []);

    useEffect(() => {
        if (!currentUserId) return;

        // Listen to real-time notifications
        const unsubscribe = notificationService.listenToNotifications(currentUserId, (newNotifications) => {
            setNotifications(newNotifications.sort((a, b) => b.createdAt - a.createdAt));
        });

        return () => unsubscribe();
    }, [currentUserId]);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const handleNotificationClick = async (notification) => {
        // Mark as read
        if (!notification.read) {
            await notificationService.markAsRead(currentUserId, notification.id);
        }

        // Navigate to post
        if (notification.postId) {
            navigate(`/posts/${notification.postId}`);
            setShowDropdown(false);
        }
    };

    const handleClearAll = async () => {
        await notificationService.clearAllNotifications(currentUserId);
        setNotifications([]);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20 max-h-96 overflow-y-auto">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg">Notifications</h3>
                            {notifications.length > 0 && (
                                <button onClick={handleClearAll} className="text-xs text-blue-600 hover:underline">
                                    Clear All
                                </button>
                            )}
                        </div>

                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No notifications yet</div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                                            !notification.read ? 'bg-blue-50' : ''
                                        }`}>
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-2 h-2 rounded-full mt-2 ${
                                                    !notification.read ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}></div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-800">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
