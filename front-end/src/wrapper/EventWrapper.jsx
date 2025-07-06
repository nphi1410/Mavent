// EventWrapper.jsx
import { Outlet, useParams } from "react-router-dom";
import { EventRoleProvider } from "../context/EventRoleContext";

export function DebugParams() {
  const params = useParams();
  console.log("DebugParams params:", params);
  // return <div>DebugParams: {JSON.stringify(params)}</div>;
}


export default function EventWrapper() {
  return (
    <>
      {/* <DebugParams /> */}
      <EventRoleProvider>
        <Outlet />
      </EventRoleProvider>
    </>
  );
}
