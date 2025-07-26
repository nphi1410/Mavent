import { useEffect, useState } from "react";
import { getRequestTypes, createRequest } from "../../services/RequestService";

export default function RequestForm({
  eventId,
  accountId,
  departmentId,
  onClose,
  requestTypes,
}) {
  // const [requestTypes, setRequestTypes] = useState("")
  const [selectedRequestTypeId, setSelectedRequestTypeId] = useState("");
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDescription, setRequestDescription] = useState("");
  const [files, setFiles] = useState(null);

  // useEffect((e) => {
  //   const fetchRequestTypes = async () => {
  //     try {
  //       const requestTypes = await getRequestTypes();
  //       setRequestTypes(requestTypes); // Set request types

  //       console.log("requestTypes:", requestTypes)
  //     } catch (err) {
  //       console.error("Error fetching request types:", err);
  //     }
  //   };

  //   fetchRequestTypes();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        accountId,
        eventId,
        taskId: null,
        departmentId,
        requestTypeId: selectedRequestTypeId,
        content: requestDescription,
      };

      await createRequest(eventId, payload); //  Service call
      alert("Request created successfully");
      onClose();
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Failed to submit request. Please try again.");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!requestTypes || requestTypes.length === 0) {
    return <p>No request types available.</p>;
  }

  return (
    <div
      className="fixed inset-0 backdrop-blur-[0px] bg-gray-900/40 z-[9999] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="flex justify-between py-6 px-6 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-gray-800">Request Form</h1>
          <button
            type="button"
            onClick={onClose}
            className="w-1/4 bg-gray-400 hover:bg-gray-500 text-white rounded-full transition-colors duration-200 focus:outline-none focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Request Type */}
            <div className="space-y-2">
              <div className="relative">
                <select
                  value={selectedRequestTypeId}
                  onChange={(e) => setSelectedRequestTypeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select Request Type
                  </option>
                  {requestTypes
                    ?.filter((filteredType) => filteredType.isActive)
                    .map((type) => (
                      <option
                        key={type.requestTypeId}
                        value={type.requestTypeId}
                      >
                        {type.name}
                      </option>
                    ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Request Title Input */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter Request Title"
                value={requestTitle}
                onChange={(e) => setRequestTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900"
                required
              />
            </div>

            {/* Request Description Textarea */}
            <div className="space-y-2">
              <textarea
                placeholder="Enter why you want to send Request..."
                value={requestDescription}
                onChange={(e) => setRequestDescription(e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-900 resize-none"
                required
              />
            </div>

            {/* File Upload */}
            {/* <div className="space-y-2">
              <label htmlFor="file-upload" className="block">
                <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 cursor-pointer text-sm text-gray-600">
                  Submit Files (if needed)
                </div>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                  className="hidden"
                />
              </label>
              {files && files.length > 0 && (
                <div className="text-xs text-gray-500 mt-1">{files.length} file(s) selected</div>
              )}
            </div> */}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
