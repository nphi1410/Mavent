import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventFeedback } from '../services/eventFeedbackService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChartColumn, faUser } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function getChartData(data) {
    return {
        labels: ['5★', '4★', '3★', '2★', '1★'],
        datasets: [
            {
                label: 'Rating Distribution',
                data: [
                    data.filter(f => f.rating === 5).length,
                    data.filter(f => f.rating === 4).length,
                    data.filter(f => f.rating === 3).length,
                    data.filter(f => f.rating === 2).length,
                    data.filter(f => f.rating === 1).length,
                ],
                backgroundColor: ['#22c55e', '#4ade80', '#facc15', '#f87171', '#fca5a5'],
            },
        ],
    };
}

const chartOptions = {
    indexAxis: 'y',
    scales: { x: { beginAtZero: true } },
    plugins: { legend: { display: false } },
};

function FeedbackCard({ feedback }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center gap-2 text-yellow-500">
                {[...Array(feedback.rating)].map((_, i) => (
                    <FontAwesomeIcon icon={faStar} key={i} />
                ))}
                <span className="text-sm font-semibold">{feedback.rating}/5</span>
            </div>
            <p className="mt-2 text-gray-700">{feedback.comment}</p>
            <div className="text-sm text-gray-500 mt-2 flex justify-between">
                <span>User ID: {feedback.accountId}</span>
                <span>{new Date(feedback.submittedAt).toLocaleString()}</span>
            </div>
        </div>
    );
}

export default function ViewEventFeedback() {
    const { eventId } = useParams();
    const [feedbackList, setFeedbackList] = useState([]);
    const [search, setSearch] = useState('');
    const [filterRating, setFilterRating] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const pageSize = 6;

    useEffect(() => {
        setLoading(true);
        getEventFeedback(eventId)
            .then(res => {
                setFeedbackList(res);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load feedback.');
                setLoading(false);
            });
    }, [eventId]);

    const filtered = feedbackList.filter(f => {
        const matchText = f.comment.toLowerCase().includes(search.toLowerCase());
        const matchRating = filterRating ? f.rating === filterRating : true;
        return matchText && matchRating;
    });

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    if (loading) return <div className="p-6">Loading feedback...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    const chartData = getChartData(filtered);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Feedback for Event #{eventId}</h1>

                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faChartColumn} className="text-gray-800 text-xl" />
                        <h2 className="text-xl font-semibold text-gray-800 pl-1.5">Feedback Summary</h2>
                    </div>

                    <div className="flex justify-center gap-16">
                        <div>
                            <p className="text-sm text-gray-500">Average Rating</p>
                            <p className="text-2xl font-bold flex items-center gap-2 text-yellow-500">
                                <FontAwesomeIcon icon={faStar} />
                                {(filtered.reduce((a, b) => a + b.rating, 0) / (filtered.length || 1)).toFixed(1)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Reviews</p>
                            <p className="text-2xl font-bold flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className='text-blue-500' />
                                {filtered.length}
                            </p>
                        </div>
                    </div>
                    <Bar data={chartData} options={chartOptions} />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by comment..."
                        className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex gap-2 flex-wrap">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                className={`cursor-pointer px-3 py-1 rounded border ${filterRating === star ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-200'}`}
                                onClick={() => {
                                    setFilterRating(filterRating === star ? null : star);
                                    setPage(1);
                                }}
                            >
                                {star}★
                            </button>
                        ))}
                    </div>
                </div>

                {paginated.map((f, index) => (
                    <FeedbackCard key={index} feedback={f} />
                ))}

                <div className="flex justify-center items-center mt-6 gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'} hover:bg-blue-100`}
                            onClick={() => setPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
