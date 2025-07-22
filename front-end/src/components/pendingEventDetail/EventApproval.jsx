import { useEffect, useState } from "react"
import { UserPlus, Search, X } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getAllAccounts } from "@/services/accountService"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { set } from "react-hook-form"
import { jwtDecode } from 'jwt-decode';
import { useParams } from "react-router-dom"


export default function EventApproval({eventData}) {
    const [update, setUpdate] = useState({});
    const [status, setStatus] = useState("");

    const token = sessionStorage.getItem("token");
    const assignedBy = jwtDecode(token).accountId;


    const [adminAssigned, setAdminAssigned] = useState({
        eventRole: "ADMIN",
        eventId: eventData.creator.id,
        assignedByAccountId: assignedBy
    });
    const [note, setNote] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [assignedAdmins, setAssignedAdmins] = useState([])
    const [users, setUsers] = useState([]) // Assuming you have a list of users to search from

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

    const handleSubmit = () => {
        console.log("Submitting event approval with status:", status, "and note:", note);
        // Implement actual submission logic
        // Reset state after submission
        setStatus("");
        setNote("");
        setAdminAssigned(null);
        setUpdate({});
    }



    // Mock search function - replace with actual API call
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllAccounts();
                setUsers(response || []);
                setSearchResults(response || []);
                console.log("Fetched users:", response);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers();

    }, []);

    useEffect(() => {
    }, [adminAssigned])

    const searchUsers = async (query) => {
        if (query.length <= 0) {
            setSearchResults(users)
            return
        }

        setIsSearching(true)
        // Simulate API call
        // setTimeout(() => {
        // const mockUsers = [
        //   { id: 1, username: "john_doe", avatar: "/placeholder.svg?height=32&width=32" },
        //   { id: 2, username: "jane_smith", avatar: "/placeholder.svg?height=32&width=32" },
        //   { id: 3, username: "mike_wilson", avatar: "/placeholder.svg?height=32&width=32" },
        // ].filter((user) => user.username.toLowerCase().includes(query.toLowerCase()))


        setSearchResults(users.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
        ))
        setIsSearching(false)
        // }, 300)
    }

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
                        onClick={() => setStatus("REJECTED")}
                        className={`inline-flex items-center cursor-pointer px-4 py-2 border rounded-md shadow-sm text-sm font-medium
                            ${status.toUpperCase().includes("REJECTED") ? `text-white bg-red-700` : `border-red-300 text-red-500`}
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
                                        setSearchResults(users)
                                        setIsModalOpen(true)
                                        console.log(searchResults)
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
                            onClick={() => console.log("Submit event approval")}
                            className="inline-flex items-center px-4 py-2 cursor-pointer border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            SUBMIT
                        </button>
                    </div>
                )}
            </div>


            {/* Search and Assign Other Admins */}
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-100 backdrop-blur-sm">
                    <div className="bg-white rounded-lg w-full h-2/3 max-w-md p-6 relative shadow-lg">
                        {/* Close button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Content */}
                        <div className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users to assign as admin..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        searchUsers(e.target.value);
                                    }}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {searchResults.length > 0 && (
                                <div className="border border-gray-200 rounded-lg max-h-90 overflow-y-auto">
                                    {searchResults.map((user) => (
                                        <div
                                            key={user.accountId}
                                            onClick={() => {
                                                handleAssignAdmin(user)
                                                // console.log("Assigned admin:", user.accountId)
                                                setIsModalOpen(false)
                                                setSearchQuery("")
                                            }}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                        >
                                            <Avatar
                                                src={user.avatarUrl || "/placeholder.svg"}
                                                alt={user.username}
                                                // fallback={user.username.charAt(0).toUpperCase()}
                                                size="md"
                                            />
                                            <span className="text-sm font-medium">{user.username}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* {adminAssigned && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Admins:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge
                                            key={adminAssigned.accountId}
                                            variant="secondary"
                                            className="flex items-center gap-2"
                                        >
                                            <Avatar
                                                src={adminAssigned.avatarUrl || "/placeholder.svg"}
                                                alt={adminAssigned.username}
                                                size="sm"
                                            />
                                            @{adminAssigned.username}
                                            <button
                                                onClick={() => handleRemoveAdmin(admin.id)}
                                                className="ml-1 hover:text-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    </div>
                                </div>
                            )} */}
                        </div>
                    </div>
                </div >
            )}
        </div>
    )
}