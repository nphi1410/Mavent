import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DepartmentList from "../../components/department/DepartmentList";
import { getEventById } from "../../services/eventService";

const EventDepartmentsPage = () => {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const data = await getEventById(id);
          setEventData(data);
        } catch (err) {
          console.error("Failed to fetch event:", err);
          setError("Không thể tải dữ liệu sự kiện.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [id]);

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!eventData) return <p className="text-center mt-10">Không tìm thấy sự kiện.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/events/${id}`} className="text-blue-500 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Quay lại chi tiết sự kiện
        </Link>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Phòng ban của {eventData.name}
        </h1>
        <Link 
          to={`/events/${id}/departments/manage`} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Quản lý phòng ban
        </Link>
      </div>
      
      <DepartmentList eventId={id} />
    </div>
  );
};

export default EventDepartmentsPage;
