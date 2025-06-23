import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react";
import { getAccountById } from "../../services/accountService";
import { updateRequest } from "../../services/requestService";

export default function RequestDetailsPopup({ isOpen, onClose, requestData, requestType, answeredByAccountId }) {
    if (!isOpen) return null;

    const [answeredByAccount, setAnsweredByAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [responseContent, setResponseContent] = useState("");

    const data = requestData;
    const getStatusBadge = (status) => {
        const statusStyles = {
            Pending: "bg-yellow-500 text-white",
            Approved: "bg-green-500 text-white",
            Rejected: "bg-red-500 text-white",
        }

        return (
            <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusStyles[status] || "bg-gray-500 text-white"}`}
            >
                {status}
            </span>
        )
    }
    const handleApprove = async () => {
        try {
            await updateRequest({
                eventId: data.eventId,
                requestId: data.requestId,
                status: "APPROVED",
                responseContent: responseContent || "No feedback provided.",
                responseByAccountId: answeredByAccountId, // or your logged-in user ID
            });
            alert("Request approved!");
            onClose();
        } catch (error) {
            console.error("Error approving request:", error);
            alert("Failed to approve request.");
        }
    };

    const handleReject = async () => {
        try {
            await updateRequest({
                eventId: data.eventId,
                requestId: data.requestId,
                status: "REJECTED",
                responseContent: responseContent || "No feedback provided.",
                responseByAccountId: answeredByAccountId,
            });
            alert("Request rejected.");
            onClose();
        } catch (error) {
            console.error("Error rejecting request:", error);
            alert("Failed to reject request.");
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }

    useEffect(() => {
        const fetchAnsweredBy = async () => {
            if (answeredByAccountId) {
                try {
                    const response = await getAccountById(answeredByAccountId);
                    console.log("response:", response)
                    if (response) {
                        setAnsweredByAccount(response);
                        console.log("answeredByAccount:", response);
                    } else {
                        setAnsweredByAccount("not yet answered");
                    }

                } catch (error) {
                    console.error("Error fetching answered by account:", error);
                }
            }
        }
        fetchAnsweredBy();
        setLoading(false);
    }, [answeredByAccountId]);

    if (loading) return <div className="text-center p-4">Loading...</div>;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-gray-200 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-300">
                    <button
                        onClick={onClose}
                        className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Back to Request History
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Request Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Title */}
                            {/* <div>
                                <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                    <span className="text-gray-800 font-medium">{data.title}</span>
                                </div>
                            </div> */}
                            <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-800">{data.requestByUsername}</h2>
                            </div>

                            {/* Request Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Request Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Request Type:</label>
                                        <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                            <span className="text-gray-800">{requestType}</span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status:</label>
                                        <div>{getStatusBadge(data.status)}</div>
                                    </div>
                                </div>
                                {/* Answered By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Answered By:</label>
                                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                        <span className="text-gray-800">{answeredByAccount?.username ? answeredByAccount?.username : "Not yet"}</span>
                                    </div>
                                </div>

                                {/* Created Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Created Date:</label>
                                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                        <span className="text-gray-800">{data.createdAt}</span>
                                    </div>
                                </div>

                                {/* Answered Date */}
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Answered Date:</label>
                                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                        <span className="text-gray-800">{
                                            data.status.toUpperCase() === "PENDING"
                                                ? "Not yet answered"
                                                : data.updatedAt
                                        }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <div className="bg-white rounded-lg p-4 shadow-sm min-h-[200px]">
                                    <p className="text-gray-800 leading-relaxed">{data.requestContent}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Feedback */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-4 shadow-sm h-full">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">FEEDBACK</h3>
                                <textarea className="text-gray-700 leading-relaxed w-full"
                                    onChange={(e) => setResponseContent(e.target.value)}
                                    placeholder={data.responseContent
                                        ? data.responseContent
                                        : "No feedback provided yet."}>

                                </textarea>
                            </div>
                            <div className="mt-6">
                                {data.status.toUpperCase() === "PENDING" && (
                                    <div className="mt-6 flex justify-around">
                                        <button
                                            onClick={handleApprove}
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </div>

                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
