import { useNavigate } from "react-router-dom";
import { logout } from "../../services/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function LogoutButton({ setIsOpen }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();          // call logout logic
      setIsOpen(false);        // close dropdown/menu
      navigate("/login");      // redirect to login page
    } catch (err) {
      console.error("Error during logout:", err.message);
    }
  };

  return (
    <div
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-300 transition"
    >
      <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
      Logout
    </div>
  );
}

export default LogoutButton;
