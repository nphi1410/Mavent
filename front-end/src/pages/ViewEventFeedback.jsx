// AdminViewEventFeedback.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faChartColumn, faUser } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const mockFeedback = [
    { id: 1, name: 'Thomas Brown', rating: 5, comment: 'Outstanding event! The diversity of speakers and topics was impressive.', date: 'Jan 17, 2024, 11:30 PM', eventId: 101 },
    { id: 2, name: 'Lisa White', rating: 4, comment: 'Good event, well organized.', date: 'Jan 18, 2024, 9:15 AM', eventId: 101 },
    { id: 3, name: 'John Smith', rating: 3, comment: 'It was okay, but a bit too long.', date: 'Jan 19, 2024, 1:00 PM', eventId: 101 },
    { id: 4, name: 'Mary Johnson', rating: 2, comment: 'Not very engaging.', date: 'Jan 20, 2024, 3:45 PM', eventId: 101 },
    { id: 5, name: 'Chris Green', rating: 4, comment: 'Informative but room for improvement.', date: 'Jan 21, 2024, 5:20 PM', eventId: 101 },
    { id: 6, name: 'Emily Davis', rating: 5, comment: 'Fantastic speakers and topics.', date: 'Jan 22, 2024, 10:00 AM', eventId: 101 },
    { id: 7, name: 'Brian Lee', rating: 1, comment: 'Very disappointing experience.', date: 'Jan 23, 2024, 11:45 AM', eventId: 101 },
    { id: 8, name: 'Sophia Martinez', rating: 5, comment: 'Loved everything about it!', date: 'Jan 24, 2024, 2:30 PM', eventId: 101 },
    { id: 9, name: 'Daniel Kim', rating: 3, comment: 'Could be better.', date: 'Jan 25, 2024, 4:00 PM', eventId: 101 },
    { id: 10, name: 'Nancy Wilson', rating: 5, comment: 'Truly outstanding!', date: 'Jan 26, 2024, 6:15 PM', eventId: 101 },
    { id: 11, name: 'Steve Clark', rating: 2, comment: 'Not what I expected.', date: 'Jan 27, 2024, 8:00 PM', eventId: 101 },
    { id: 12, name: 'Rachel Moore', rating: 4, comment: 'Good session overall.', date: 'Jan 28, 2024, 9:00 AM', eventId: 101 },
];

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
                backgroundColor: [
                    '#22c55e', '#4ade80', '#facc15', '#f87171', '#fca5a5'
                ],
            },
        ],
    };
}

const chartOptions = {
    indexAxis: 'y',
    scales: {
        x: { beginAtZero: true },
    },
    plugins: {
        legend: { display: false },
    },
};

function FeedbackCard({ feedback }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center gap-2 text-yellow-500">
                {[...Array(feedback.rating)].map((_, i) => <FontAwesomeIcon icon={faStar} aStar key={i} />)}
                <span className="text-sm font-semibold">{feedback.rating}/5</span>
            </div>
            <p className="mt-2 text-gray-700">{feedback.comment}</p>
            <div className="text-sm text-gray-500 mt-2 flex justify-between">
                <span>{feedback.name}</span>
                <span>{feedback.date}</span>
            </div>
            <div className="text-xs text-gray-400">Event ID: {feedback.eventId}</div>
        </div>
    );
}

export default function ViewEventFeedback() {
    const [search, setSearch] = useState('');
    const [filterRating, setFilterRating] = useState(null);
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const filtered = mockFeedback.filter(f => {
        const matchText = f.comment.toLowerCase().includes(search.toLowerCase()) ||
            f.name.toLowerCase().includes(search.toLowerCase());
        const matchRating = filterRating ? f.rating === filterRating : true;
        return matchText && matchRating;
    });

    const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filtered.length / pageSize);

    const chartData = getChartData(filtered);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Feedback from Event Participants</h1>

                <div className="bg-white p-6 rounded-lg shadow mb-6">
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faChartColumn} className="text-gray-800 text-xl" />
                        <h2 className="text-xl font-semibold text-gray-800 pl-1.5">Feedback Summary</h2>
                    </div>

                    <div className="flex justify-center gap-16">
                        <div>
                            <p className="text-sm text-gray-500">Average Rating</p>
                            <p className="text-2xl font-bold flex items-center gap-2 text-yellow-500">
                                <FontAwesomeIcon icon={faStar} /> {(mockFeedback.reduce((a, b) => a + b.rating, 0) / mockFeedback.length).toFixed(1)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Reviews</p>
                            <p className="text-2xl font-bold flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className='text-blue-500' />
                                {mockFeedback.length}
                            </p>
                        </div>
                    </div>
                    <Bar data={chartData} options={chartOptions} />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search by name or comment..."
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

                {paginated.map(f => (
                    <FeedbackCard key={f.id} feedback={f} />
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
