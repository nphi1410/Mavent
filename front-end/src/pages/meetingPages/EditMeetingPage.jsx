import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMeetingById,
  createMeeting,
  updateMeeting,
} from "../../services/meetingService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const statusOptions = ["SCHEDULED", "CANCELLED", "COMPLETED", "POSTPONED"];

const EditMeetingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== "-1";

  const [formData, setFormData] = useState({
    eventId: "",
    departmentId: "",
    title: "",
    description: "",
    meetingDatetime: "",
    endDatetime: "",
    location: "",
    meetingLink: "",
    status: "SCHEDULED",
    organizerAccountId: "",
    notes: "",
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      getMeetingById(id)
        .then((data) => {
          setFormData({
            ...data,
            meetingDatetime: data.meetingDatetime?.slice(0, 16),
            endDatetime: data.endDatetime?.slice(0, 16),
          });
        })
        .catch((err) => {
          console.error("Error loading meeting:", err);
          alert("Failed to load meeting.");
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.meetingDatetime > formData.endDatetime) {
      alert("Start date must be before end date.");
      return;
    }
    try {
      if (isEdit) {
        await updateMeeting(id, formData);
        alert("Meeting updated successfully!");
      } else {
        await createMeeting(formData);
        alert("Meeting created successfully!");
      }
      navigate("/meetings");
    } catch (err) {
      console.error("Submit failed:", err);
      alert("Failed to submit form.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading meeting...</div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl my-10 mx-auto p-6 bg-white rounded-xl shadow-md space-y-4"
    >
      <div>
        <button
          onClick={() => navigate("/meetings")}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-all"
        >
          <FontAwesomeIcon icon="arrow-left" className="w-4 h-4" />
          Back
        </button>
      </div>

      <h2 className="text-3xl font-semibold mb-6 text-center">
        {isEdit ? "Edit Meeting" : "New Meeting"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Event ID"
          name="eventId"
          value={formData.eventId}
          onChange={handleChange}
        />
        <InputField
          label="Department ID"
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
        />
        <InputField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <InputField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />
        <InputField
          label="Meeting Link"
          name="meetingLink"
          value={formData.meetingLink}
          onChange={handleChange}
        />
        <InputField
          label="Organizer Account ID"
          name="organizerAccountId"
          value={formData.organizerAccountId}
          onChange={handleChange}
        />
        <InputField
          label="Meeting Time"
          name="meetingDatetime"
          type="datetime-local"
          value={formData.meetingDatetime}
          onChange={handleChange}
        />
        <InputField
          label="End Time"
          name="endDatetime"
          type="datetime-local"
          value={formData.endDatetime}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Notes</label>
        <textarea
          name="notes"
          rows="3"
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isEdit ? "Update Meeting" : "Create Meeting"}
        </button>
      </div>
    </form>
  );
};

const InputField = ({ label, name, value, onChange, type = "text", required }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      className="mt-1 w-full border rounded-md px-3 py-2"
      required = {required}
    />
  </div>
);

export default EditMeetingPage;
