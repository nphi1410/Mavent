import React, { useState, useEffect } from 'react';
import { getTaskFeedback, createTaskFeedback } from '../../services/profileService';
import { getAllAccounts } from '../../services/accountService';

const TaskFeedbackModal = ({ taskId, isOpen, onClose }) => {
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [userAccounts, setUserAccounts] = useState([]);
    const [usersMap, setUsersMap] = useState({});

    useEffect(() => {
        console.log("TaskFeedbackModal mounted with taskId:", taskId);

        if (isOpen && taskId) {
            fetchFeedback();
            fetchAllAccounts();
        }
    }, [isOpen, taskId]);

    const fetchAllAccounts = async () => {
        try {
            const accounts = await getAllAccounts();
            console.log("Fetched all accounts:", accounts);

            setUserAccounts(accounts || []);

            const accountsMap = {};
            accounts.forEach(account => {
                accountsMap[account.accountId] = account;
            });
            setUsersMap(accountsMap);

            console.log("User accounts map:", accountsMap);
        } catch (err) {
            console.error("Failed to fetch accounts:", err);
        }
    };

    const fetchFeedback = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getTaskFeedback(taskId);
            setFeedback(data || []);
            console.log("Fetched feedback:", data);

            if (Array.isArray(data) && data.length > 0) {
                console.log("Feedback by account IDs:", data.map(item => item.feedbackByAccountId));
            }

        } catch (err) {
            console.error("Failed to fetch feedback:", err);
            setError(err.message || "Không thể tải phản hồi");
        } finally {
            setLoading(false);
        }
    };

    const getUserInfo = (userId) => {
        const userAccount = usersMap[userId];
        if (userAccount) {
            return {
                fullName: userAccount.fullName || userAccount.username,
            };
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const data = await createTaskFeedback(taskId, newComment);
            setFeedback([...feedback, data]);
            setNewComment('');

        } catch (err) {
            console.error("Failed to submit feedback:", err);
            setError(err.message || "Không thể gửi phản hồi");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        } catch (error) {
            console.error("Error formatting date:", error, dateString);
            return dateString || "Không có ngày";
        }
    };
    console.log(userAccounts);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/40 z-[10000] flex justify-center items-center p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <header className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">All Feedbacks</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </header>

                    {/* Feedback list */}
                    <div className="mb-3 space-y-4">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00155c]"></div>
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 text-red-600 rounded-md">
                                <p>{error}</p>
                                <button
                                    onClick={fetchFeedback}
                                    className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded"
                                >
                                    Try Again
                                </button>
                            </div>
                        ) : feedback.length === 0 ? (
                            <div className="text-center text-gray-500 py-6">No feedback yet</div>
                        ) : (
                            feedback.map((item) => {
                                console.log("Rendering feedback item:", item);
                                const userInfo = getUserInfo(item.feedbackByAccountId);
                                console.log("User info for this feedback:", userInfo);

                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 rounded-lg border border-gray-200"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div>
                                                <div className="font-semibold">
                                                    {userInfo?.fullName || `User #${item.feedbackByAccountId}`}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {formatDate(item.createdAt)}
                                                    {userInfo?.email && <span className="ml-2">({userInfo.email})</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 whitespace-pre-wrap">{item.comment}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* New feedback form */}
                    <form onSubmit={handleSubmit} className="pt-4">
                        <div className="mb-3">
                            <label htmlFor="comment" className="block mb-2 text-sm font-medium text-gray-700">
                                Add new feedback
                            </label>
                            <textarea
                                id="comment"
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Enter your feedback..."
                                disabled={submitting}
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#00155c] text-white rounded-md hover:bg-[#172c70] disabled:bg-gray-400"
                                disabled={submitting || !newComment.trim()}
                            >
                                {submitting ? 'Sending...' : 'Send feedback'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskFeedbackModal;