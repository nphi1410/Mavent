import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function RequestHistory() {
  const [typeFilter, setTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [searchTitle, setSearchTitle] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  // Sample data
  const requests = [
    {
      id: 1,
      title: "Day Off due to sickness",
      type: "Day Off",
      createdDate: "19:00:00\n15/06/2025",
      status: "Pending",
      answeredDate: "Not yet",
    },
    {
      id: 2,
      title: "Late deadline due to sickness",
      type: "Postpone Dealine",
      createdDate: "19:00:00\n15/06/2025",
      status: "Pending",
      answeredDate: "Not yet",
    },
    {
      id: 3,
      title: "Day Off due to sickness",
      type: "Day Off",
      createdDate: "19:00:00\n15/06/2025",
      status: "Approved",
      answeredDate: "19:05:00\n15/06/2025",
    },
    {
      id: 4,
      title: "Late deadline due to sickness",
      type: "Postpone Dealine",
      createdDate: "19:00:00\n15/06/2025",
      status: "Declined",
      answeredDate: "19:10:00\n15/06/2025",
    },
    {
      id: 5,
      title: "Day Off due to sickness",
      type: "Day Off",
      createdDate: "19:00:00\n15/06/2025",
      status: "Pending",
      answeredDate: "Not yet",
    },
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: "bg-yellow-500 hover:bg-yellow-600 text-white",
      Approved: "bg-green-500 hover:bg-green-600 text-white",
      Declined: "bg-red-500 hover:bg-red-600 text-white",
    }

    return <Badge className={`${statusConfig[status]} px-3 py-1 rounded-full font-medium`}>{status}</Badge>
  }

  const handleCreateRequest = () => {
    console.log("Create new request")
  }

  const handleViewDetail = (id) => {
    console.log("View detail for request:", id)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-8">REQUEST HISTORY</h1>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day-off">Day Off</SelectItem>
                  <SelectItem value="postpone-deadline">Postpone Deadline</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Search by Title"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-64"
              />

              <div className="ml-auto">
                <Button
                  onClick={handleCreateRequest}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-medium"
                >
                  Create Request
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-rose-100 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-rose-200">
                      <th className="text-left p-4 font-semibold text-gray-800">Request Title</th>
                      <th className="text-left p-4 font-semibold text-gray-800">Type</th>
                      <th className="text-left p-4 font-semibold text-gray-800">Created Date</th>
                      <th className="text-left p-4 font-semibold text-gray-800">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-800">Answered Date</th>
                      <th className="text-left p-4 font-semibold text-gray-800">View Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id} className="border-b border-rose-200 last:border-b-0">
                        <td className="p-4 text-gray-800">{request.title}</td>
                        <td className="p-4 text-gray-800">{request.type}</td>
                        <td className="p-4 text-gray-800 whitespace-pre-line text-sm">{request.createdDate}</td>
                        <td className="p-4">{getStatusBadge(request.status)}</td>
                        <td className="p-4 text-gray-800 whitespace-pre-line text-sm">{request.answeredDate}</td>
                        <td className="p-4">
                          <Button
                            onClick={() => handleViewDetail(request.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-sm"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                className="bg-rose-300 hover:bg-rose-400 border-rose-300 text-gray-800 px-4 py-2 rounded"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>

              {[1, 2, 3].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  className={`px-4 py-2 rounded ${
                    currentPage === page
                      ? "bg-rose-400 hover:bg-rose-500 text-white"
                      : "bg-rose-200 hover:bg-rose-300 border-rose-200 text-gray-800"
                  }`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                className="bg-rose-300 hover:bg-rose-400 border-rose-300 text-gray-800 px-4 py-2 rounded"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Prev
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
