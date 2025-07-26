import { Search, X } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { useEffect, useState } from "react";
import { getAllAccounts } from "../../services/AccountService";
import { useLocation, useParams } from "react-router-dom";
import memberService from "../../services/MemberService";

const AccountList = ({ setIsModalOpen, handleAssignAdmin }) => {
  const location = useLocation();
  const { eventId } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (location.pathname.includes("edit-event")) {
          // get event members by id
          const response = await memberService.getStaffsByEventId(eventId);
          if (response) {
            setUsers(response || []);
            setSearchResults(response || []);
            // console.log("Fetched users:", response);
          }
        } else {
          const response = await getAllAccounts();
          setUsers(response || []);
          setSearchResults(response || []);
        //   console.log("Fetched users:", response);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [eventId]);

  const searchUsers = async (query) => {
    if (query.length <= 0) {
      setSearchResults(users);
      return;
    }

    setIsSearching(true);
    // Simulate API call
    // setTimeout(() => {
    // const mockUsers = [
    //   { id: 1, username: "john_doe", avatar: "/placeholder.svg?height=32&width=32" },
    //   { id: 2, username: "jane_smith", avatar: "/placeholder.svg?height=32&width=32" },
    //   { id: 3, username: "mike_wilson", avatar: "/placeholder.svg?height=32&width=32" },
    // ].filter((user) => user.username.toLowerCase().includes(query.toLowerCase()))

    setSearchResults(
      users.filter((user) =>
        user.username.toLowerCase().includes(query.toLowerCase())
      )
    );
    setIsSearching(false);
  };

  if (isSearching) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-100 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
        {/* Close button */}
        <button
          type="button"
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
                    handleAssignAdmin(user);
                    // console.log("Assigned admin:", user.accountId)
                    setIsModalOpen(false);
                    setSearchQuery("");
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
        </div>
      </div>
    </div>
  );
};

export default AccountList;
