import React from "react";
import Table from "../components/arrangement/Table";
import LineChart from "../components/chart/LineChart";
import BarChart from "../components/chart/BarCHart";

const UserDashboardPage = () => {
  const fakeTableData = [
    {
      eventId: "EVT001",
      accountId: "ACC1001",
      eventRole: "Speaker",
      departmentId: "DPT01",
      isActive: true,
      assignedByAccountId: "ACC9001",
      createdAt: "2025-06-01T10:12:45Z",
      updatedAt: "2025-06-10T14:22:11Z",
    },
    {
      eventId: "EVT002",
      accountId: "ACC1002",
      eventRole: "Attendee",
      departmentId: "DPT02",
      isActive: true,
      assignedByAccountId: "ACC9002",
      createdAt: "2025-06-02T09:45:30Z",
      updatedAt: "2025-06-11T11:33:09Z",
    },
    {
      eventId: "EVT003",
      accountId: "ACC1003",
      eventRole: "Volunteer",
      departmentId: "DPT03",
      isActive: false,
      assignedByAccountId: "ACC9001",
      createdAt: "2025-06-03T08:20:00Z",
      updatedAt: "2025-06-09T10:00:00Z",
    },
    {
      eventId: "EVT004",
      accountId: "ACC1004",
      eventRole: "Organizer",
      departmentId: "DPT01",
      isActive: true,
      assignedByAccountId: "ACC9003",
      createdAt: "2025-06-05T14:10:05Z",
      updatedAt: "2025-06-12T13:14:30Z",
    },
    {
      eventId: "EVT005",
      accountId: "ACC1005",
      eventRole: "Sponsor",
      departmentId: "DPT02",
      isActive: false,
      assignedByAccountId: "ACC9002",
      createdAt: "2025-06-06T16:55:12Z",
      updatedAt: "2025-06-12T18:22:45Z",
    },
  ];

  return (
    <div className="px-6 py-4">
      <div className="chart-row flex gap-4 mb-6 h-[400px]">
        <div className="w-1/3">
          <LineChart />
        </div>
        <div className="w-2/3">
          <BarChart />
        </div>
      </div>
      {/*currently attending events */}
      <Table data={fakeTableData} />
    </div>
  );
};

export default UserDashboardPage;
