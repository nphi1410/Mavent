import React, { createContext, useContext, useEffect, useState } from "react";
import { getUserInfoInEvent } from "../services/userEventService";
import { useNavigate, useParams } from "react-router-dom";

export const EventRoleContext = createContext();

export const EventRoleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  console.log("EventRoleProvider mounted. eventId:", eventId);

  useEffect(() => {
    console.log("Running useEffect with eventId:", eventId);
    setLoading(true);
    if (!eventId) {
      console.log("No eventId found.");
      return;
    }
    const fetchUserInfoInEvent = async () => {
      try {
        const response = await getUserInfoInEvent(eventId);
        console.log("Fetched user:", response);
        if (response) {
          // console.log("context: response data: ", response);
          setUser(response);
        } else {
          // console.log("No user data found for eventId:", eventId);
          setUser(null);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching user role:", err);
      }
    };

    fetchUserInfoInEvent();
    console.log("useEffect completed for eventId:", eventId);
  }, [eventId]);

  if (loading) {
    console.log("Loading user role...");
    return <div>Loading...</div>;
  }

  return (
    <EventRoleContext.Provider value={{ user, roleLoading: loading }}>
      {children}
    </EventRoleContext.Provider>
  );
};

export const useEventRole = () => {
  const context = useContext(EventRoleContext);
  if (!context) {
    console.log("no context found");
    return {
      user: null,
      roleLoading: true,
    }
  }
  return context;
}
