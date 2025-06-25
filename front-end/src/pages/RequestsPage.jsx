import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { useParams } from 'react-router-dom';
import { vietnameseDate } from "../utils/DateConvert";
// Remove the non-existent import
// import RequestDetailsModal from '../components/request/RequestDetailsModal';

// Mock data for requests
const MOCK_REQUESTS = [
  {
    id: 1,
    requesterName: "Nguyen Van A",
    requesterEmail: "nguyenvana@example.com",
    requestType: "JOIN_EVENT",
    departmentName: "Marketing",
    submissionDate: "2025-06-20T09:30:00",
    status: "PENDING",
    message: "I would like to join the marketing team for this event.",
    avatarUrl: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 2,
    requesterName: "Tran Thi B",
    requesterEmail: "tranthib@example.com",
    requestType: "DEPARTMENT_TRANSFER",
    departmentName: "Operations",
    submissionDate: "2025-06-19T14:45:00",
    status: "APPROVED",
    message: "I have experience in operations and would like to transfer from the design team.",
    avatarUrl: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: 3,
    requesterName: "Le Van C",
    requesterEmail: "levanc@example.com",
    requestType: "ROLE_CHANGE",
    departmentName: "Technical",
    submissionDate: "2025-06-18T11:15:00",
    status: "REJECTED",
    message: "I would like to apply for the role of department manager based on my 3 years experience.",
    avatarUrl: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    id: 4,
    requesterName: "Pham Thi D",
    requesterEmail: "phamthid@example.com",
    requestType: "JOIN_EVENT",
    departmentName: "Finance",
    submissionDate: "2025-06-17T16:20:00",
    status: "PENDING",
    message: "I am interested in helping with the financial aspects of this event.",
    avatarUrl: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    id: 5,
    requesterName: "Hoang Van E",
    requesterEmail: "hoangvane@example.com",
    requestType: "RESOURCE_REQUEST",
    departmentName: "Technical",
    submissionDate: "2025-06-16T10:05:00",
    status: "APPROVED",
    message: "Requesting additional equipment for the technical setup.",
    avatarUrl: "https://randomuser.me/api/portraits/men/5.jpg"
  }
];

// Helper function for status badge styling
const getStatusBadgeClasses = (status) => {
  switch(status) {
    case 'APPROVED':
      return 'bg-green-100 text-green-700';
    case 'REJECTED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-yellow-100 text-yellow-700';
  }
};

// Helper function for request type display
const formatRequestType = (type) => {
  return type.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ');
};

const RequestsPage = () => {
  const { id } = useParams(); // Get the event ID from the URL parameters
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Filter requests based on status
  const filteredRequests = filterStatus === 'ALL' 
    ? MOCK_REQUESTS 
    : MOCK_REQUESTS.filter(request => request.status === filterStatus);

  return (
    <AdminLayout activeItem="requests">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Requests Management</h1>
        <p className="text-gray-600 mb-6">Manage all requests for event #{id}</p>
        
        {/* Filter controls */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-gray-700">Filter by status:</span>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filterStatus === 'ALL' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterStatus('PENDING')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filterStatus === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setFilterStatus('APPROVED')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filterStatus === 'APPROVED' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Approved
            </button>
            <button 
              onClick={() => setFilterStatus('REJECTED')}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filterStatus === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
        
        {/* Requests table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full bg-white text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3 text-center">#</th>
                <th className="px-4 py-3 text-left">Requester</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Submitted</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request, idx) => (
                  <tr
                    key={request.id}
                    className="cursor-pointer border-t h-12 border-gray-100 hover:bg-blue-50 transition"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <td className="px-4 py-3 text-center">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                          <img 
                            src={request.avatarUrl} 
                            alt={request.requesterName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{request.requesterName}</p>
                          <p className="text-xs text-gray-500">{request.requesterEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-lg">
                        {formatRequestType(request.requestType)}
                      </span>
                    </td>
                    <td className="px-4 py-3">{request.departmentName}</td>
                    <td className="px-4 py-3">{vietnameseDate(request.submissionDate, true)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeClasses(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500 italic">
                    No requests found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request details modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition duration-300">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Request Details</h2>
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={selectedRequest.avatarUrl} 
                    alt={selectedRequest.requesterName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{selectedRequest.requesterName}</h3>
                  <p className="text-gray-600">{selectedRequest.requesterEmail}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Request Type</p>
                  <p className="font-medium">{formatRequestType(selectedRequest.requestType)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{selectedRequest.departmentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Submission Date</p>
                  <p className="font-medium">{vietnameseDate(selectedRequest.submissionDate, true)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${getStatusBadgeClasses(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Message</p>
                <p className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  {selectedRequest.message}
                </p>
              </div>
              
              {selectedRequest.status === 'PENDING' && (
                <div className="flex justify-end space-x-3">
                  <button 
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition"
                  >
                    Reject
                  </button>
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default RequestsPage;