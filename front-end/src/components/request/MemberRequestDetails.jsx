import { ChevronLeft } from "lucide-react"
import { useEffect, useState } from "react";
import { getAccountById } from "../../services/accountService";
import { updateRequest } from "../../services/requestService";

export default function RequestDetailsPopup({ isOpen, onClose, requestData, requestType, isMember, answeredByAccountId }) {
    if (!isOpen) return null;

    // const [answeredByAccount, setAnsweredByAccount] = useState(null);
    // const [loading, setLoading] = useState(true);
    const [responseContent, setResponseContent] = useState("");

    const data = requestData;
    const getStatusBadge = (status) => {
        const statusStyles = {
            pending: "bg-yellow-500 text-white",
            approved: "bg-green-500 text-white",
            rejected: "bg-red-500 text-white",
        }

        return (
            <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${statusStyles[status.toLowerCase()] || "bg-gray-500 text-white"}`}
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

    // useEffect(() => {
    //     const fetchAnsweredBy = async () => {
    //         if (answeredByAccountId) {
    //             try {
    //                 const response = await getAccountById(answeredByAccountId);
    //                 console.log("response:", response)
    //                 if (response) {
    //                     setAnsweredByAccount(response);
    //                     console.log("answeredByAccount:", response);
    //                 } else {
    //                     setAnsweredByAccount("not yet answered");
    //                 }

    //             } catch (error) {
    //                 console.error("Error fetching answered by account:", error);
    //             }
    //         }
    //     }
    //     fetchAnsweredBy();
    //     setLoading(false);
    // }, [answeredByAccountId]);

    // if (loading) return <div className="text-center p-4">Loading...</div>;
    // console.log("MemberRequestDetails isMember: " + isMember)

    return (
        <div
            className="fixed inset-0 backdrop-blur-[0px] bg-gray-900/40 z-[9999] bg-opacity-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-gray-200 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="p-6 flex justify-between border-b border-gray-300">
                    <div className="flex items-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Request Details - {data.requestByUsername}</h2>
                    </div>

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
                            <div>
                                <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                    <span className="text-gray-800 font-medium">{data.title}</span>
                                </div>
                            </div>
                            {/* <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                <h2 className="text-xl font-semibold text-gray-800">{data.requestByUsername}</h2>
                            </div> */}

                            {/* Request Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Request Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Request Type:</label>
                                        <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                            <span className="text-gray-800">{requestType}</span>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Status:</label>
                                        <div>{getStatusBadge(data.status)}</div>
                                    </div>
                                </div>
                                {/* Answered By */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Answered By:</label>
                                    {console.log("requestData:", requestData)}
                                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                        <span className="text-gray-800">{data.responseByUsername ? data.responseByUsername : "Not yet"}</span>
                                    </div>
                                </div>

                                {/* Created Date */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Created Date:</label>
                                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                        <span className="text-gray-800">{data.createdAt}</span>
                                    </div>
                                </div>

                                {/* Answered Date */}
                                <div className="md:col-span-1">
                                    <label className="block text-sm font-medium mb-2">Answered Date:</label>
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
                                <h3 className="text-lg font-semibold mb-4 text-center">FEEDBACK</h3>
                                <textarea className="text-gray-700 leading-relaxed w-full h-7/10"
                                    onChange={(e) => setResponseContent(e.target.value)}
                                    placeholder={
                                        data.responseContent
                                                ? ""
                                                : isMember 
                                                        ? "" 
                                                        : "Provide feedback here"

                                    }
                                    value={
                                        data?.responseContent 
                                            ? data?.responseContent 
                                            : isMember
                                                    ? "No feedback provided yet."
                                                    : null
                                    }
                                    readOnly={isMember}
                                    required={!isMember}
                                >
                                </textarea>
                                {!isMember && data.status.toUpperCase() === "PENDING" && (

                                    <div className="mt-6 flex gap-4 justify-baseline bottom-0 left-0 right-0 ">
                                        <button
                                            onClick={handleApprove}
                                            className="flex-1 bg-green-600 text-white font-semibold text-lg py-3 rounded-2xl hover:bg-green-700 transition-colors duration-200"
                                        >
                                            APPROVE
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            className="flex-1 bg-red-600 text-white font-semibold text-lg py-3 rounded-2xl hover:bg-red-700 transition-colors duration-200"
                                        >
                                            REJECT
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
