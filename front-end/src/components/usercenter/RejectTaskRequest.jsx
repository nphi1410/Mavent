import React, { useState, useEffect } from 'react';
import { getUserProfile, getUserTasks } from '../../services/ProfileService';
import { getRequestsByEventId, updateRequest } from '../../services/requestService';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { getAccountById } from '../../services/accountService';

const RejectTaskRequest = () => {
  const [requests, setRequests] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingRequest, setProcessingRequest] = useState(null);

  const { id: eventId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);

        const tasks = await getUserTasks({ eventName: "" });
        const userCreatedTasks = tasks.filter(
          (task) =>
            task.eventId === parseInt(eventId) &&
            task.assignedByAccountId === profile.id
        );
        setUserTasks(userCreatedTasks);

        const allRequests = await getRequestsByEventId(eventId);

                const enrichedRequests = await Promise.all(
                    allRequests.map(async (req) => {
                        let user = null;
                        try {
                            user = await getAccountById(req.requestByAccountId);
                        } catch (err) {
                            console.error(`Không load được account ${req.requestByAccountId}`, err);
                        }

            return {
              ...req,
              requestByUsername: user?.username || "Unknown",
              requestByEmail: user?.email || "Unknown",
            };
          })
        );

                const relevantRequests = enrichedRequests.filter(request => {
                    const isUserRequest = request.requestByAccountId === profile.id;
                    const isTaskCreator = request.taskId &&
                        userCreatedTasks.some(task => task.taskId === request.taskId);

          return (
            request.requestType === "Cancel Task" &&
            (isUserRequest || isTaskCreator)
          );
        });

                const finalRequests = relevantRequests.map(request => {
                    const associatedTask = tasks.find(task => task.taskId === request.taskId);
                    return {
                        ...request,
                        taskName: associatedTask?.title || 'Unknown Task',
                        taskDescription: associatedTask?.description || '',
                        assignedByAccountId: associatedTask?.assignedByAccountId
                    };
                });


        setRequests(finalRequests);
      } catch (err) {
        console.error("Error fetching requests:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        } else {
          setError(err.message || "Failed to load requests");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, navigate]);

  const handleProcessRequest = async (
    requestId,
    action,
    responseContent = ""
  ) => {
    setProcessingRequest(requestId);
    try {
      const updateData = {
        requestId: requestId,
        eventId: parseInt(eventId),
        status: action === "accept" ? "APPROVED" : "REJECTED",
        responseContent: responseContent,
      };

      await updateRequest(updateData);

            const allRequests = await getRequestsByEventId(eventId);
            const taskCancelRequests = allRequests.filter(request => {
                return request.taskId &&
                    // request.status === 'PENDING' &&
                    request.requestType === 'Cancel Task' &&
                    userTasks.some(task => task.taskId === request.taskId);
            });

      const enrichedRequests = taskCancelRequests.map((request) => {
        const associatedTask = userTasks.find(
          (task) => task.taskId === request.taskId
        );
        return {
          ...request,
          taskName: associatedTask?.taskName || "Unknown Task",
          taskDescription: associatedTask?.description || "",
        };
      });

      setRequests(enrichedRequests);
      alert(
        `Request ${action === "accept" ? "approved" : "rejected"} successfully!`
      );
    } catch (err) {
      console.error("Error processing request:", err);
      alert("Failed to process request. Please try again.");
    } finally {
      setProcessingRequest(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // console.log('userTasks:', userTasks);
  // console.log(userProfile);

  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-red-600 text-center">Error: {error}</div>;
  }
  console.log('requests:', requests);
  
  return (
    <main className="flex-grow p-10 bg-white">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Task Cancel Requests</h1>
            <p className="text-gray-600 mt-1">
              Manage cancel requests for tasks you created
            </p>
            <p className="text-sm text-gray-500 mt-1">
              You have created {userTasks.length} tasks in this event
            </p>
          </div>
          <Link
            to={`/event/${eventId}/staff/tasks`}
            className="bg-[#00155c] hover:bg-[#172c70] text-white px-4 py-2 rounded-lg"
          >
            Back to Tasks
          </Link>
        </div>

                {/* Requests Table */}
                {requests.length > 0 ? (
                    <div className="bg-white rounded-lg shadow overflow-x-auto">
                        <table className="min-w-full table-fixed">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-64 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Task Name</th>
                                    <th className="w-48 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Requester</th>
                                    <th className="w-80 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                                    <th className="w-32 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
                                    <th className="w-24 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="w-32 py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map((request) => (
                                    <RequestRow
                                        key={request.requestId}
                                        request={request}
                                        userProfile={userProfile}
                                        onProcess={handleProcessRequest}
                                        isProcessing={processingRequest === request.requestId}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p>No pending task cancel requests found.</p>
                        <p className="text-sm mt-2">
                            {userTasks.length > 0
                                ? "No one has requested to cancel tasks you created yet."
                                : "You haven't created any tasks in this event yet."
                            }
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
};

const RequestRow = ({ request, userProfile, onProcess, isProcessing }) => {
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState("");
  const [responseContent, setResponseContent] = useState("");

  const handleActionClick = (actionType) => {
    setAction(actionType);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (action === "reject" && !responseContent.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    onProcess(request.requestId, action, responseContent);
    setShowModal(false);
    setResponseContent("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

    return (
        <>
            <tr className="hover:bg-gray-50">
                <td className="py-4 px-4 text-sm text-gray-900">
                    <div className="font-medium truncate" title={request.taskName}>
                        {request.taskName}
                    </div>
                    <div className="text-gray-500 text-xs">Task ID: {request.taskId}</div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                    <div className="font-medium">{request.requestByUsername || 'Unknown'}</div>
                    <div className="text-gray-500 text-xs">{request.requestByEmail || request.email || ''}</div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                    <div className="max-w-xs">
                        <div className="truncate" title={request.content || request.title}>
                            {request.content || request.title || 'No reason provided'}
                        </div>
                    </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                    {formatDate(request.createdAt || request.createdDate)}
                </td>
                <td className="py-4 px-4 text-sm">
                    {getStatusBadge(request.status)}
                </td>
                <td className="py-4 px-4 text-sm">
                    {request.status === 'PENDING' && !isProcessing ? (
                        request.assignedByAccountId === userProfile.id ? ( 
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleActionClick('accept')}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium"
                                    title="Accept this request"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleActionClick('reject')}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                                    title="Reject this request"
                                >
                                    Reject
                                </button>
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400">You cannot process this request</span>
                        )
                    ) : isProcessing ? (
                        <div className="text-xs text-blue-500 flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-500 mr-1"></div>
                            Processing...
                        </div>
                    ) : (
                        <div className="text-xs text-gray-500">Processed</div>
                    )}
                </td>
            </tr>

            {showModal && (
                <div className="fixed inset-0 backdrop-blur-[0px] bg-gray-900/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {action === 'accept' ? 'Accept Request' : 'Reject Request'}
                        </h3>

            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600 mb-1">
                Task: <span className="font-medium">{request.taskName}</span>
              </p>
              <p className="text-sm text-gray-600">
                Requester:{" "}
                <span className="font-medium">
                  {request.requestByUsername || "Unknown"}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Reason:{" "}
                <span className="font-medium">
                  {request.content || request.title || "No reason provided"}
                </span>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Message{" "}
                {action === "reject" ? "(Required)" : "(Optional)"}
              </label>
              <textarea
                value={responseContent}
                onChange={(e) => setResponseContent(e.target.value)}
                placeholder={
                  action === "accept"
                    ? "Enter any additional notes (optional)..."
                    : "Please provide a reason for rejection..."
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  setResponseContent("");
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className={`px-4 py-2 rounded font-medium ${
                  action === "accept"
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {action === "accept" ? "Accept Request" : "Reject Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RejectTaskRequest;
