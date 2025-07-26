import { useEffect, useState } from "react"
import { UserPlus, Search, X } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getAllAccounts } from "@/services/accountService"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { set } from "react-hook-form"
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useParams } from "react-router-dom"
import { updatePendingEvent } from "../../services/eventService"
import { addNewRole } from "../../services/roleService"
import AccountList from "./AccountList"


export default function EventApproval({ eventData }) {

    const [status, setStatus] = useState("");
    const token = sessionStorage.getItem("token");
    const assignedBy = jwtDecode(token).accountId;
    // console.log("decoded token:", jwtDecode(token));

    const [adminAssigned, setAdminAssigned] = useState({
        eventRole: "ADMIN",
        assignedByAccountId: assignedBy,
        eventName: eventData.name,
        assignedByAccountUsername: jwtDecode(token).sub
    });
    const [note, setNote] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate();

    const handleAssignProposer = () => {
        console.log("Assigning proposer as event admin")
        const adminData = {
            accountId: eventData.creator.id,
            ...adminAssigned
        }
        setAdminAssigned(adminData)
        console.log("Admin assigned data:", adminData)

        // Implement actual assignment logic
    }

    const handleAssignAdmin = (user) => {
        console.log("Assigning user as admin:", user)
        const adminData = {
            ...adminAssigned,
            accountId: user.accountId
        }
        setAdminAssigned(adminData)
        console.log("Admin assigned data by choosing:", adminData)
        // Implement actual assignment logic
    }

    const handleSubmit = async () => {
        // console.log("Submitting event approval with status:", status, "and note:", note);
        // Implement actual submission logic

        try {
            const updateStatusRes = await updatePendingEvent(eventData.id, {
                status: status,
                note: note,
                accountId: eventData.creator.id,
                assignedByAccountId: assignedBy,
                eventName: eventData.name,
                assignedByAccountUsername: jwtDecode(token).sub,
            });
            if (updateStatusRes) {
                console.log("Event status updated successfully:", updateStatusRes);
                if( status.toUpperCase().includes("UPCOMING")) {
                    const addRoleRes = await addNewRole(eventData.id, adminAssigned);
                }
                setTimeout(() => {
                    navigate("/superadmin/events/pending");

                    // Reset state after submission
                    setStatus("");
                    setNote("");
                }, 2000);
            }

        } catch (error) {
            console.error("Error submitting event approval:", error);
        }
    }

    // Mock search function - replace with actual API call


    return (
        <div className="bg-white mt-8 border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-3">Event Approval</h2>

            <div className="mb-4 flex flex-col">
                <p className="text-gray-600"><span className="text-red-600">(*) </span>This note will be sent directly to Proposer via email</p>
                <textarea
                    placeholder="Add notes or comments about the event proposal..."
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    required
                    onChange={(e) => setNote(e.target.value)}
                ></textarea>
            </div>

            <div className="mb-4 grid grid-cols-5 justify-between">
                <div className="relative col-span-2">
                    <h2 className="my-4">Do you <span className="text-green-700 font-medium">Approve </span>
                        or do you <span className="text-red-700 font-medium">Reject </span>this event?</h2>
                    <button
                        onClick={() => setStatus("UPCOMING")}
                        className={`inline-flex mr-5 items-center cursor-pointer px-4 py-2 border rounded-md shadow-sm text-sm font-medium 
                            ${status.toUpperCase().includes("UPCOMING") ? `text-white bg-green-700` : `border-green-300 text-green-500`}
                            hover:bg-green-700 hover:text-white 
                        `}
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => setStatus("CANCELLED")}
                        className={`inline-flex items-center cursor-pointer px-4 py-2 border rounded-md shadow-sm text-sm font-medium
                            ${status.toUpperCase().includes("CANCELLED") ? `text-white bg-red-700` : `border-red-300 text-red-500`}
                            hover:bg-red-700 hover:text-white 
                        `}
                    >
                        Reject
                    </button>
                </div>
                {status.toUpperCase().includes("UPCOMING") && (
                    adminAssigned.accountId === null || adminAssigned.accountId === undefined ? (

                        <div className="col-span-2" >
                            <h2 className="my-4">Assign <span className="text-red-700 font-medium">Admin </span> for this Event?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pr-8">
                                <button
                                    onClick={handleAssignProposer}
                                    className="inline-flex items-center cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Assign Proposer
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-3"
                                >
                                    <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" className="h-4 w-4 mr-2" />
                                    Choose another
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="col-span-2">
                            <h2 className="my-4">Assign <span className="text-red-700 font-medium">Admin </span> assigned:</h2>
                            <div className="col-span-2 flex items-center gap-2">
                                {adminAssigned && (
                                    <Badge className="h-full" variant="primary">
                                        <Avatar
                                            src={users.find(user => user.accountId === adminAssigned.accountId)?.avatarUrl || "/placeholder.svg"}
                                            alt={users.find(user => user.accountId === adminAssigned.accountId)?.username}
                                            className="h-8 w-8"
                                        />
                                        <hr />@{users.find(user => user.accountId === adminAssigned.accountId)?.username}
                                    </Badge>
                                )}
                                <button
                                    className="inline-flex items-center cursor-pointer px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-800 bg-white  hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => {
                                        setIsModalOpen(true)
                                    }}
                                >
                                    <FontAwesomeIcon icon="fa-solid fa-pen-to-square" className="h-4 w-4" />
                                </button>
                            </div>

                        </div>
                    ))}

                {status && (
                    <div className="pl-5 col-span-1">
                        <h2 className="font-bold my-4">Confirm Submit</h2>
                        <button
                            onClick={() => handleSubmit()}
                            className="inline-flex items-center px-4 py-2 cursor-pointer border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            SUBMIT
                        </button>
                    </div>
                )}
            </div>


            {/* Search and Assign Other Admins */}
            {/* Modal */}
            {isModalOpen && 
                <AccountList
                    setIsModalOpen={setIsModalOpen}
                    handleAssignAdmin={handleAssignAdmin}
                />
            }
        </div>
    )
}