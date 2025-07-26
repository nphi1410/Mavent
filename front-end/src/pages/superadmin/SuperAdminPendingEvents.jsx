import { useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { getEvents } from '../../services/EventService';
import { getAllLocations } from '../../services/EventLocationService';
import { useNavigate } from 'react-router-dom';

// Simple Popup Component
const Popup = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex justify-center items-center z-[9999]">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <p className="text-lg font-semibold mb-4">{message}</p>
                <button
                    onClick={onClose}
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
};


function SuperAdminPendingEvents() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(null); // Lưu eventId của dropdown đang mở
    const [events, setEvents] = useState([]);
    const [locations, setLocations] = useState(new Map()); // Để lưu trữ địa điểm dưới dạng Map (locationId -> locationName)

    const [currentPage, setCurrentPage] = useState(1);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

    const navigate = useNavigate();

    const eventsPerPage = 10;

    // Các trạng thái được phép cập nhật từ PENDING
    const allowedUpdateStatuses = [
        "RECRUITING", "UPCOMING", "ONGOING", "ENDED", "CANCELLED", "REVIEWING"
    ];

    // Hàm để lấy tất cả địa điểm và lưu vào Map
    const fetchLocations = async () => {
        try {
            const data = await getAllLocations();
            const locationMap = new Map();
            data.forEach(loc => {
                // Đảm bảo rằng API của bạn trả về `locationId` và `locationName`
                if (loc.locationId && loc.locationName) {
                    locationMap.set(loc.locationId, loc.locationName);
                } else {
                    console.warn("Wrong Location Data Format: ", loc);
                }
            });
            setLocations(locationMap);
        } catch (error) {
            console.error("Error fetching Locations: ", error);
            // Có thể đặt popup thông báo lỗi cho người dùng ở đây
        }
    };

    const fetchPendingEvents = async () => {
        try {
            const data = await getEvents();
            // Lọc chỉ các sự kiện có trạng thái PENDING
            setEvents(data.filter(event => event.status === "PENDING"));
        } catch (error) {
            console.error("Error fetching Event: ", error);
            // Có thể đặt popup thông báo lỗi cho người dùng ở đây
        }
    };

    // Khi component mount, fetch cả địa điểm và sự kiện
    useEffect(() => {
        fetchLocations();
        fetchPendingEvents();
    }, []);

    // Reset về trang đầu khi searchTerm thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredEvents = useMemo(() => {
        // Chỉ lọc theo searchTerm, vì trạng thái đã được cố định là PENDING
        return events.filter((event) =>
            event.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [events, searchTerm]);

    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const paginatedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

    const closePopup = () => {
        setShowPopup(false);
        setPopupMessage("");
    };

    return (
        <div className="py-10 w-full">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Pending Events</h1>
            <p className="text-gray-500 mb-6">Manage all Pending Events</p>

            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h2 className="text-2xl font-semibold mb-1 text-black">All Pending Events</h2>
                <p className="text-sm text-gray-500 mb-4">View and Update Pending Events</p>

                {/* Search only */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Search by event name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 sm:w-1/2 placeholder:text-gray-500"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border border-gray-200">
                        <thead>
                            <tr className="text-sm text-gray-500 border-b border-gray-200">
                                <th className="p-2 font-medium">Event Name</th>
                                <th className="p-2 font-medium">Start Date</th>
                                <th className="p-2 font-medium">End Date</th>
                                <th className="p-2 font-medium">Location</th> {/* Đổi tên cột */}
                                <th className="p-2 font-medium">Status</th>
                                <th className="p-2 font-medium mx-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedEvents?.map((event) => (
                                <tr key={event.eventId} className="border-b border-gray-200">
                                    <td className="p-2 font-medium text-black whitespace-nowrap">{event.name}</td>
                                    <td className="p-2 whitespace-nowrap text-gray-600">{event.startDatetime.slice(0, 10)}</td>
                                    <td className="p-2 whitespace-nowrap text-gray-600">{event.endDatetime.slice(0, 10)}</td>
                                    <td className="p-2 whitespace-nowrap text-gray-600">
                                        {/* Lấy tên địa điểm từ Map */}
                                        {locations.get(event.locationId) || event.location || 'N/A'}
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-gray-600 relative">
                                        <button
                                            // onClick={() => setDropdownOpen(dropdownOpen === event.eventId ? null : event.eventId)}
                                            className={`bg-purple-100 text-purple-600 cursor-pointer text-xs font-semibold px-2 py-1 rounded-full flex items-center justify-between`}
                                        >
                                            {event.status}
                                            {/* <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-3 h-3" /> */}
                                        </button>
                                        {/* {dropdownOpen === event.eventId && (
                                                        <ul className="absolute z-[500] bg-white border border-gray-300 rounded mt-1 w-32 shadow-lg">
                                                            {allowedUpdateStatuses.map((status) => (
                                                                <li
                                                                    key={status}
                                                                    onClick={() => handleStatusUpdate(event.eventId, status)}
                                                                    className="px-4 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                                                >
                                                                    {status}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )} */}
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-gray-600 relative">
                                        <button className='m-1 ml-4 rounded hover:bg-gray-100'
                                            onClick={() => navigate(`${event.eventId}`)}
                                        >
                                            <FontAwesomeIcon icon={faEye} color='blue' />
                                        </button>
                                        <button

                                        >
                                            {/* <FontAwesomeIcon icon={faPencil} color='red' /> */}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex relative w-full">
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center mt-4 space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`hover:cursor-pointer px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-100 text-black'}`}
                            >
                                Trước
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'}`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={`hover:cursor-pointer px-3 py-1 border rounded ${currentPage === totalPages ? 'text-gray-400 border-gray-300' : 'hover:bg-gray-100 text-black'}`}
                            >
                                Tiếp theo
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
        </div>
    );
}

export default SuperAdminPendingEvents;