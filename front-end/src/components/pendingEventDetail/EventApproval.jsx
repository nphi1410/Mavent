import { useEffect, useState } from "react"
import { UserPlus, Search, X } from "lucide-react"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useParams } from "react-router-dom"
import { updatePendingEvent } from "../../services/EventService"
import { addNewRole } from "../../services/RoleService"
import AccountList from "./AccountList"
import Alert from "../ui/Alert"


export default function EventApproval({ eventData }) {

    const [status, setStatus] = useState("");
    const token = sessionStorage.getItem("token");
    const assignedBy = jwtDecode(token).accountId;
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Alert
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState('');
    const [message, setMessage] = useState('');
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


    // HANDLERS

    const handleAssignProposer = () => {
        // console.log("Assigning proposer as event admin")
        const adminData = {
            accountId: eventData.creator.id,
            avatarUrl: eventData.creator.avatarUrl,
            username: eventData.creator.username,
            ...adminAssigned
        }
        setAdminAssigned(adminData)
        // console.log("Admin assigned data:", adminData)

        // Implement actual assignment logic
    }

    const handleAssignAdmin = (user) => {
        // console.log("Assigning user as admin:", user)
        const adminData = {
            ...adminAssigned,
            accountId: user.accountId,
            avatarUrl: user.avatarUrl,
            username: user.username
        }
        setAdminAssigned(adminData)
        // console.log("Admin assigned data by choosing:", adminData)
        // Implement actual assignment logic
    }

    const handleSubmit = async () => {
        // console.log("Submitting event approval with status:", status, "and note:", note);
        // Implement actual submission logic
        setIsSubmitting(true);
        setShowAlert(false);
        setMessage('');
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
                // console.log("Event status updated successfully:", updateStatusRes);
                if (status.toUpperCase().includes("UPCOMING")) {
                    const addRoleRes = await addNewRole(eventData.id, adminAssigned);
                }
                setStatus("");
                setAlertVariant("success");
                setMessage("Event Updated Successfully!")
                setShowAlert(true);
                setNote("");
                setTimeout(() => {
                    // Reset state after submission

                    navigate("/superadmin/events/pending");
                }, 3000);
            }

        } catch (error) {
            setAlertVariant("danger");
            setMessage("Fail to update event!")
            setShowAlert(true);
            console.error("Error submitting event approval:", error);
        }
        setIsSubmitting(false);
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
                            ${status.toUpperCase().includes("UPCOMING") ? `text-white bg-green-700` : `border-green-600 text-green-700`}
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
                                            src={adminAssigned?.avatarUrl || "/placeholder.svg"}
                                            alt={adminAssigned?.username}
                                            className="h-8 w-8"
                                        />
                                        <hr />@{adminAssigned?.username}
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

                {
                    isSubmitting ?
                        <div className="flex justify-center items-center">
                            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                        </div>
                        :
                        (status && (adminAssigned.accountId != null || status.includes("CANCELLED")) && (
                            <div className="pl-5 col-span-1">
                                <h2 className="font-bold my-4">Confirm Submit</h2>
                                <button
                                    onClick={() => handleSubmit()}
                                    className="inline-flex items-center px-4 py-2 cursor-pointer border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    SUBMIT
                                </button>

                            </div>
                        ))
                }



            </div>
            {
                showAlert && (
                    <Alert variant={alertVariant} message={message} />
                )
            }

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
