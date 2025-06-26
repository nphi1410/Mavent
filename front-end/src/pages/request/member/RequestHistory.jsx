import { use, useEffect, useState } from "react"
import Layout from '../../../components/layout/AdminLayout';
import { useParams } from 'react-router-dom';
import {
  getRequestsByEventIdAndAccountId,     // for member
  getRequestsByEventIdAndDepartmentId,   // for department manager
  getRequestsByEventId,                   // for admin
  getRequestTypes,
} from "../../../services/requestService";
import RequestForm from "../../../components/request/CreateRequest.jsx";
import { getUserInfoInEvent } from "../../../services/userEventService.jsx";
import RequestDetailsPopup from "../../../components/request/MemberRequestDetails.jsx";

export default function RequestHistory() {
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestTypes, setRequestTypes] = useState([]); // Initialize requestTypes state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [departmentId, setDepartmentId] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]); // State for filtered requests
  const [role, setRole] = useState(""); // Default role is "member"
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [accountId, setAccountId] = useState(""); // State for account ID
  const [viewRequest, setViewRequest] = useState(null); // State for the request to view details


  const { id: eventId } = useParams();
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const userEventInfo = await getUserInfoInEvent(eventId);
        console.log("userEventInfo:", userEventInfo)
        // if (userEventInfo.role) {


        // console.log("User role:", role);
        // }
        setDepartmentId(userEventInfo?.departmentId || null); // Set department ID if available
        setRole(userEventInfo.role || "participant"); // Set role, default to "participant"

        let rqs;
        if (userEventInfo.role.toLowerCase().includes("member")) rqs = await getRequestsByEventIdAndAccountId(eventId, userEventInfo.accountId); // await here
        else if (userEventInfo.role.toUpperCase() === "ADMIN") {
          // console.log("Fetching all requests for admin role");
          rqs = await getRequestsByEventId(eventId); // await here
        }
        else if (userEventInfo.role.toLowerCase().includes("department_manager")) rqs = await getRequestsByEventIdAndDepartmentId(eventId, userEventInfo.departmentId); // await here

        const requestTypes = await getRequestTypes();

        setRequests(rqs); // data is already resolved
        setFilteredRequests(rqs); // Initialize filtered requests with all requests
        setRequestTypes(requestTypes); // Set request types

        console.log("requests:", rqs)
      } catch (err) {
        console.error("Error fetching requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [eventId, accountId]);
  useEffect(() => {
    const filterRequests = () => {
      let filtered = requests;
      console.log("Filtering requests with current filters:", {
        typeFilter,
        statusFilter,
        searchTitle,
      });
      // If no filters are applied, return all requests
      if (!typeFilter && !statusFilter && !searchTitle) {
        console.log("No filters applied, returning all requests");
        setFilteredRequests(requests);
        return;
      }
      // Filter by type
      if (typeFilter) {
        // console.log("typeFilter:", typeFilter)
        filtered.map(request => {
          if (typeFilter.includes(request.requestTypeId)) {
            console.log("Matched request:", request);
          }
        });
        filtered = filtered.filter(request => typeFilter.includes(request.requestTypeId));
      }

      // Filter by status
      if (statusFilter) {
        // console.log("statusFilter:", statusFilter)
        filtered = filtered.filter(request => request.status.toLowerCase().includes(statusFilter.toLowerCase()));
      }

      // Filter by title
      if (searchTitle) {
        console.log("searchTitle:", searchTitle)
        filtered = filtered.filter(request => request?.title?.toLowerCase().includes(searchTitle.toLowerCase()));
      }

        // // Paginate results
        // const itemsPerPage = 5;
        // const startIndex = (currentPage - 1) * itemsPerPage;
        // const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

        setFilteredRequests(filtered);
    };

    filterRequests();
  }, [typeFilter, statusFilter, searchTitle]);


  if (loading) return <p>Loading...</p>;
  if (!requests || requests.length === 0) {
    return (
      <Layout activeItem="requests">
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-4">No Requests Found</h1>
                <p className="text-gray-600">There are no requests available for this event yet.</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-yellow-500 text-white",
      APPROVED: "bg-green-500 text-white",
      REJECTED: "bg-red-500 text-white",
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
        {status}
      </span>
    )
  }



  const handleCreateRequest = () => {
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
    console.log("Form closed");
  };


  const handleViewDetail = (id) => {
    // console.log("View detail for request:", id)
    const request = requests.find(req => req.requestId === id);
    if (!request) {
      console.error("Request not found:", id);
      return;
    }
    setViewRequest(request);
    console.log("Request to view:", request);
    setIsPopupOpen(true);
  }


  return (
    <Layout activeItem="requests">
      <div className="min-h-screen bg-gray-50 py-8">
        {showCreateForm && (
          <RequestForm
            eventId={eventId}
            accountId={accountId}
            departmentId={departmentId}
            onClose={handleCloseForm}
          />
        )}
        {isPopupOpen && (
          <RequestDetailsPopup
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            requestData={viewRequest}
            requestType={requestTypes.find(type => type.requestTypeId === viewRequest.requestTypeId)?.name || "Unknown Type"}
            answeredByAccountId={viewRequest.responseByAccountId}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">REQUEST HISTORY</h1>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-end">
                <div className="flex-1 min-w-0">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Type</option>
                    {requestTypes?.map((type) => (
                      <option key={type.requestTypeId} value={type.requestTypeId}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 min-w-0">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    placeholder="Search by Title"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400"
                  />
                </div>
                
                {!role.toLowerCase().includes("admin") && (
                  <div className="flex-shrink-0">
                    <button
                      onClick={handleCreateRequest}
                      className="cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Create Request
                    </button>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="bg-[#ffffff] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-rose-200">
                    <thead>
                      <tr>
                        {!role.toLowerCase().includes("member") && (
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Requested By</th>
                        )}
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Request Title</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Answered Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">View Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-200">
                      {filteredRequests?.map((request) => (
                        <tr key={request.requestId} className="hover:bg-gray-200 transition-colors duration-150">
                          {/* <td className="px-6 py-4 text-sm text-gray-900">{
                          request.requestByAccountId ? 
                            getAccountById(request.requestByAccountId)?.username : "Unknown User"
                        }</td> */}
                          {!role.toLowerCase().includes("member") && (
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {request.requestByUsername ? request.requestByUsername : "Unknown User"
                              }
                            </td>
                          )}
                          <td className="px-6 py-4 text-sm text-gray-900">{request.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {requestTypes.find(type => type.requestTypeId === request.requestTypeId)?.name || "Unknown Type"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-line">
                            {
                              request.createdAt ?
                                new Date(request.createdAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }) : "Not Yet"
                            }
                          </td>
                          <td className="px-6 py-4">{getStatusBadge(request.status)}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 whitespace-pre-line">
                            {
                              request.status !== "PENDING" ?
                                new Date(request.updatedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                                : "Not Yet"
                            }
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewDetail(request.requestId)}
                              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-4 rounded-full text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              View
                            </button>
                          </td>
                        </tr>

                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {/* <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-rose-200 border border-rose-300 rounded-md hover:bg-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Prev
              </button>

              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors duration-200 ${currentPage === page
                      ? "bg-rose-400 text-white hover:bg-rose-500"
                      : "text-gray-700 bg-rose-200 border border-rose-300 hover:bg-rose-300"
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-rose-200 border border-rose-300 rounded-md hover:bg-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Next
              </button>
            </div> */}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  )
}
