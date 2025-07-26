import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useForm,
  FormProvider,
  Controller,
  useFormContext,
} from "react-hook-form";
import {
  getMeetingById,
  createMeeting,
  updateMeeting,
  getMeetingAttendees,
} from "../../services/MeetingService";
import { getDepartmentsByEventId } from "../../services/DepartmentService";
import memberService from "../../services/MemberService";
import MeetingAttendeeSelect from "../../components/meeting/MeetingAttendeeSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const statusOptions = ["SCHEDULED", "CANCELLED", "COMPLETED", "POSTPONED"];

const EditMeetingPage = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("meetingId");
  const eventId = searchParams.get("eventId");
  const isEdit = Boolean(id && !isNaN(Number(id)));
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      eventId,
      meetingId: id,
      departmentId: "",
      title: "",
      description: "",
      meetingDatetime: "",
      endDatetime: "",
      location: "",
      meetingLink: "",
      status: "SCHEDULED",
      organizerAccountId: sessionStorage.getItem("accountId"),
      notes: "",
      attendees: [],
    },
  });

  const { handleSubmit, getValues, reset, register, control, watch } = methods;

  const [departments, setDepartments] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [existedAttendees, setExistedAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [memberData, deptData] = await Promise.all([
          memberService.getMembers(eventId),
          getDepartmentsByEventId(eventId),
        ]);
        setAttendees(memberData);
        setDepartments(deptData);

        if (isEdit) {
          const meeting = await getMeetingById(id);
          const attendees = await getMeetingAttendees(id);
          setExistedAttendees(attendees);
          reset({
            ...meeting,
            meetingDatetime: meeting.meetingDatetime?.slice(0, 16),
            endDatetime: meeting.endDatetime?.slice(0, 16),
            attendees: attendees.map((a) => a.accountId),
          });
        }
      } catch (err) {
        console.error("Error loading:", err);
        alert("Failed to load meeting data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, eventId, reset]);

  const onSubmit = async (data) => {
    if (data.meetingDatetime > data.endDatetime) {
      alert("Start date must be before end date.");
      return;
    }
    try {
      await createMeeting(data);
      if (isEdit) {
        alert("Meeting updated!");
      } else {
        alert("Meeting created!");
      }
      navigate("/meetings");
    } catch (err) {
      console.error(err);
      alert("Failed to submit.");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading meeting...</div>
    );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto p-6 my-10 bg-white rounded-xl shadow-md space-y-4"
      >
        <div>
          <button
            type="button"
            onClick={() => navigate("/meetings")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
          >
            <FontAwesomeIcon icon="arrow-left" className="w-4 h-4" />
            Back
          </button>
        </div>

        <h2 className="text-3xl font-semibold text-center">
          {isEdit ? "Edit Meeting" : "New Meeting"}
        </h2>

        {/* Hidden fields */}
        <input type="hidden" {...register("eventId")} />
        <input type="hidden" {...register("organizerAccountId")} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select department */}
          <div>
            <label className="block text-sm font-medium">Department</label>
            <select
              {...register("departmentId")}
              className="mt-1 w-full border rounded-md px-3 py-2"
            >
              <option value="">All</option>
              {departments.map((d) => (
                <option key={d.departmentId} value={d.departmentId}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Title"
            name="title"
            isRequired
            registerOptions={{ required: "Title is required" }}
          />

          <Input
            label="Location"
            name="location"
            isRequired
            registerOptions={{ required: "Location is required" }}
          />

          <Input label="Meeting Link" name="meetingLink" register={register} />
          <Input
            label="Meeting Time"
            name="meetingDatetime"
            type="datetime-local"
            isRequired
            registerOptions={{
              required: "Start time is required",
              validate: (value) => {
                const now = new Date();
                const start = new Date(value);
                return start >= now || "Start time must be in the future";
              },
            }}
          />

          <Input
            label="End Time"
            name="endDatetime"
            type="datetime-local"
            isRequired
            registerOptions={{
              required: "End time is required",
              validate: (value) => {
                const end = new Date(value);
                const start = new Date(getValues("meetingDatetime"));
                return end > start || "End time must be after start time";
              },
            }}
          />
        </div>

        {isEdit && (
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              {...register("status")}
              className="mt-1 w-full border rounded-md px-3 py-2"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium">Attendees</label>
          <Controller
            control={control}
            name="attendees"
            render={({ field }) => (
              <MeetingAttendeeSelect
                attendees={attendees}
                existedAttendees={existedAttendees}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <Textarea label="Description" name="description" register={register} />
        <Textarea label="Notes" name="notes" register={register} />

        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEdit ? "Update Meeting" : "Create Meeting"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

// Reusable components
const Input = ({
  label,
  name,
  registerOptions = {},
  type = "text",
  isRequired = false,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label className="block text-sm font-medium">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        {...register(name, registerOptions)}
        className="mt-1 w-full border rounded-md px-3 py-2"
      />
      {errors[name] && (
        <p className="text-sm text-red-600 mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );
};

const Textarea = ({ label, name, register }) => (
  <div>
    <label className="block text-sm font-medium">{label}</label>
    <textarea
      {...register(name)}
      rows={3}
      className="mt-1 w-full border rounded-md px-3 py-2"
    />
  </div>
);

export default EditMeetingPage;
