import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getTaskById,
    getEventById,
    getRequestById
} from '../../services/notificationService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheck } from '@fortawesome/free-solid-svg-icons';

const NotificationModal = ({ isOpen, onClose, onUnreadCountUpdate }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [readNotifications, setReadNotifications] = useState(new Set());
    const [taskTitles, setTaskTitles] = useState({});
    const [eventNames, setEventNames] = useState({});
    const [requestTypes, setRequestTypes] = useState({});
    const navigate = useNavigate();
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen]);

    // Fetch notifications
    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUserNotifications();
            setNotifications(data || []);
        } catch (err) {
            setError(err.message || 'Không thể tải thông báo');
        } finally {
            setLoading(false);
        }
    };

    // Fetch task, event, request details
    useEffect(() => {
        const fetchExtraDetails = async () => {
            const taskMap = {};
            const eventMap = {};
            const requestMap = {};

            for (const notification of notifications) {
                const { taskId, eventId, requestId } = notification;

                if (taskId && !taskMap[taskId]) {
                    const task = await getTaskById(taskId);
                    if (task) taskMap[taskId] = task.title;
                }

                if (eventId && !eventMap[eventId]) {
                    const event = await getEventById(eventId);
                    if (event) eventMap[eventId] = event.name;
                }

                if (requestId && !requestMap[requestId]) {
                    const request = await getRequestById(requestId);
                    if (request) requestMap[requestId] = request.type;
                }
            }

            setTaskTitles(taskMap);
            setEventNames(eventMap);
            setRequestTypes(requestMap);
        };

        if (notifications.length > 0) {
            fetchExtraDetails();
        }
    }, [notifications]);

    // Đóng modal khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen]);

    const handleNotificationClick = async (notification) => {
        try {
            if (!readNotifications.has(notification.notificationId)) {
                await markNotificationAsRead(notification.notificationId);
                setReadNotifications(prev => new Set([...prev, notification.notificationId]));
                if (onUnreadCountUpdate) {
                    onUnreadCountUpdate();
                }
            }

            handleNotificationRouting(notification);
            handleClose();
        } catch (err) {
            console.error('Error handling notification click:', err);
        }
    };

    const handleNotificationRouting = (notification) => {
        const { type, eventId, taskId } = notification;

        switch (type) {
            case 'ACCEPTANCE OF REQUEST':
            case 'EVENT APPROVAL':
            case 'EVENT UPDATE':
                if (eventId) navigate(`/event/${eventId}/staff/details`);
                break;
            case 'UPDATE TASK DONE':
            case 'TASK ASSIGNMENT':
            case 'FEEDBACK TASK':
                if (taskId) {
                    console.log(`Navigating to task with ID: ${taskId}`);
                    
                    getTaskById(taskId).then((task) => {
                        if (task && task.eventId) {
                            navigate(`/event/${task.eventId}/staff/tasks`, {
                                state: { openTaskId: taskId }
                            });
                        } else {
                            console.error("Không tìm thấy eventId trong task");
                        }
                    }).catch((err) => {
                        console.error("Error fetching task details:", err);
                    });
                }
                break;


            case 'MEETING INVITATION':
                navigate(`/events/${eventId}/meetings`);
                break;
            case 'EVENT FEEDBACK':
                navigate(`/events/${eventId}/feedback`);
                break;
            case 'DOCUMENT UPLOADED':
                navigate(`/events/${eventId}/documents`);
                break;
            case 'BUDGET UPDATED':
                navigate(`/events/${eventId}/budget`);
                break;
            default:
                break;
        }
    };

    const handleClose = async () => {
        try {
            await markAllNotificationsAsRead();
            const allNotificationIds = notifications.map(n => n.notificationId);
            setReadNotifications(new Set(allNotificationIds));
            if (onUnreadCountUpdate) onUnreadCountUpdate();
        } catch (err) {
            console.error('Error marking all as read on close:', err);
        } finally {
            onClose();
        }
    };

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const notificationDate = new Date(dateString);
        const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
        return `${Math.floor(diffInMinutes / 1440)} days ago`;
    };
    console.log('NotificationModal rendered with notifications:', notifications);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end items-start pt-16 pr-6">
            <div
                ref={modalRef}
                className="bg-white rounded-xl shadow-2xl w-96 max-h-[80vh] flex flex-col animate-fadeIn"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4">
                    <h3 className="text-lg font-bold text-gray-900">Thông báo</h3>
                    <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                            <button
                                onClick={handleClose}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Đánh dấu đã đọc
                            </button>
                        )}
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Đang tải...</div>
                    ) : error ? (
                        <div className="p-4 text-center text-red-500">{error}</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">Không có thông báo</div>
                    ) : (
                        notifications.map((notification) => {
                            const isRead = notification.isRead || readNotifications.has(notification.notificationId);
                            return (
                                <div
                                    key={notification.notificationId}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-gray-50 ${!isRead ? 'bg-blue-50' : 'bg-white'
                                        }`}
                                >
                                    <div className="text-xl ms-3 me-3">
                                        {isRead ? (
                                            <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                                        ) : (
                                            <FontAwesomeIcon icon={faBell} className="text-blue-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-semibold ${isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                            {notification.type} - {notification.message}
                                        </p>

                                        {/* 📝 Task title */}
                                        {notification.taskId && taskTitles[notification.taskId] && (
                                            <p className="text-xs text-gray-500 italic">
                                                Task: {taskTitles[notification.taskId]}
                                            </p>
                                        )}

                                        {/* 📌 Event name */}
                                        {notification.eventId && eventNames[notification.eventId] && (
                                            <p className="text-xs text-gray-500 italic">
                                                Event: {eventNames[notification.eventId]}
                                            </p>
                                        )}

                                        {/* 🔄 Request type */}
                                        {notification.requestId && requestTypes[notification.requestId] && (
                                            <p className="text-xs text-gray-500 italic">
                                                Request Type: {requestTypes[notification.requestId]}
                                            </p>
                                        )}

                                        <span className="text-xs text-gray-400">
                                            {formatTimeAgo(notification.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;
