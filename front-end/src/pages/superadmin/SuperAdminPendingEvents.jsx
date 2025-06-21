import { useEffect, useState, useMemo } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { getEvents, updateEvent } from '../../services/eventService';
import { getAllLocations } from '../../services/eventLocationService';
import SuperAdminSidebar from '../../components/superadmin/SuperAdminSidebar';

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
    const [exporting, setExporting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");

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
                    console.warn("Dữ liệu địa điểm không đúng định dạng:", loc);
                }
            });
            setLocations(locationMap);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách địa điểm:", error);
            // Có thể đặt popup thông báo lỗi cho người dùng ở đây
        }
    };

    const fetchPendingEvents = async () => {
        try {
            const data = await getEvents();
            // Lọc chỉ các sự kiện có trạng thái PENDING
            setEvents(data.filter(event => event.status === "PENDING"));
        } catch (error) {
            console.error("Lỗi khi lấy sự kiện:", error);
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

    const handleStatusUpdate = async (eventId, newStatus) => {
        try {
            // Gọi hàm updateEvent từ eventService và chỉ truyền trường status cần cập nhật
            await updateEvent(eventId, { status: newStatus });

            // Xóa sự kiện đã được cập nhật khỏi trạng thái cục bộ
            setEvents(prevEvents => prevEvents.filter(event => event.eventId !== eventId));
            setPopupMessage("Đã chấp nhận cho tổ chức sự kiện này");
            setShowPopup(true);
            setDropdownOpen(null); // Đóng dropdown sau khi cập nhật
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái sự kiện:", error);
            setPopupMessage("Có lỗi xảy ra khi cập nhật trạng thái.");
            setShowPopup(true);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupMessage("");
    };

    return (
        <div className="h-screen w-screen flex bg-amber-50">
            <SuperAdminSidebar />
            <div className='flex flex-col flex-1'>
                <main className='flex-1 overflow-y-auto p-10 bg-gray-100'>
                    <div className="py-10 w-full">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Sự kiện đang chờ duyệt</h1>
                        <p className="text-gray-500 mb-6">Quản lý và xem tất cả các sự kiện đang chờ duyệt</p>

                        <div className="border border-gray-200 rounded-lg p-4 bg-white">
                            <h2 className="text-2xl font-semibold mb-1 text-black">Tất cả sự kiện đang chờ</h2>
                            <p className="text-sm text-gray-500 mb-4">Xem và quản lý các sự kiện đang ở trạng thái PENDING</p>

                            {/* Search only */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sự kiện..."
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
                                            <th className="p-2 font-medium">Tên sự kiện</th>
                                            <th className="p-2 font-medium">Ngày bắt đầu</th>
                                            <th className="p-2 font-medium">Ngày kết thúc</th>
                                            <th className="p-2 font-medium">Địa điểm</th> {/* Đổi tên cột */}
                                            <th className="p-2 font-medium">Trạng thái</th>
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
                                                        onClick={() => setDropdownOpen(dropdownOpen === event.eventId ? null : event.eventId)}
                                                        className={`bg-purple-100 text-purple-600 cursor-pointer text-xs font-semibold px-2 py-1 rounded-full flex items-center justify-between w-32`}
                                                    >
                                                        {event.status}
                                                        <FontAwesomeIcon icon={faChevronDown} className="ml-2 w-3 h-3" />
                                                    </button>
                                                    {dropdownOpen === event.eventId && (
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
                                                    )}
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
                    </div>
                </main>
            </div>
            {showPopup && <Popup message={popupMessage} onClose={closePopup} />}
        </div>
    );
}

export default SuperAdminPendingEvents;