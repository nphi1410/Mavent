import { useEffect, useState } from "react"
import { UserPlus, Search, X } from "lucide-react"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getAllAccounts } from "../../services/accountService"


export default function EventApproval({ onAssignProposer, onAssignAdmin }) {
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [assignedAdmins, setAssignedAdmins] = useState([])
    const [users, setUsers] = useState([]) // Assuming you have a list of users to search from

    // Mock search function - replace with actual API call
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllAccounts();
                setUsers(response || []);
                console.log("Fetched users:", response);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers();

    }, []);

    const searchUsers = async (query) => {
        if (query.length < 0) {
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

    const handleAssignAdmin = (user) => {
        if (!assignedAdmins.find((admin) => admin.id === user.id)) {
            setAssignedAdmins([...assignedAdmins, user])
            onAssignAdmin(user)
        }
        setSearchQuery("")
        setSearchResults([])
    }

    const handleRemoveAdmin = (userId) => {
        setAssignedAdmins(assignedAdmins.filter((admin) => admin.id !== userId))
    }

    return (
        <div className="bg-white mt-8 border border-gray-200 rounded-lg p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-3">Event Approval</h2>

                <div className="mb-4">
                    <textarea
                        placeholder="Add notes or comments about the event proposal..."
                        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                    ></textarea>
                </div>

                <div className="mb-4">
                    <button
                        onClick={() => console.log("Accept event approval")}
                        className="inline-flex mr-5 items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 cursor-pointer hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Accept
                    </button>
                    <button
                        onClick={() => console.log("Decline event approval")}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-red-600 cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Decline
                    </button>
                </div>


                {/* Assign Proposer as Admin */}
                <div className="mb-4">
                    <button
                        onClick={onAssignProposer}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Proposer as Event Admin
                    </button>
                </div>

                {/* Search and Assign Other Admins */}
                {/* <div className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users to assign as admin..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                searchUsers(e.target.value)
                            }}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {searchResults.length > 0 && (
                        <div className="border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                            {searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => handleAssignAdmin(user)}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                >
                                    <Avatar
                                        src={user.avatarUrl || "/placeholder.svg"}
                                        alt={user.username}
                                        fallback={user.username.charAt(0).toUpperCase()}
                                        size="md"
                                    />
                                    <span className="text-sm font-medium">@{user.username}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {assignedAdmins.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Admins:</h4>
                            <div className="flex flex-wrap gap-2">
                                {assignedAdmins.map((admin) => (
                                    <Badge key={admin.id} variant="secondary" className="flex items-center gap-2">
                                        <Avatar
                                            src={admin.avatar || "/placeholder.svg"}
                                            alt={admin.username}
                                            fallback={admin.username.charAt(0).toUpperCase()}
                                            size="sm"
                                        />
                                        @{admin.username}
                                        <button onClick={() => handleRemoveAdmin(admin.id)} className="ml-1 hover:text-red-600">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div> */}
        </div>
    )
}