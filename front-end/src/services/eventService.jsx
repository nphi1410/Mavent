import Api from "../config/Api";

// Lọc sự kiện theo các tiêu chí
export const getFilterEvents = async ({
  name,
  status,
  tagIds,
  sortType,
  page,
  size,
  type,
  isTrending,
}) => {
  try {
    const body = {
      name,
      status,
      tagIds: tagIds && tagIds.length > 0 ? tagIds : [],
      sortType,
      page,
      size,
      type,
      isTrending,
    };
    const res = await Api.post("/events/filter", body);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Lấy toàn bộ danh sách sự kiện
export const getEvents = async () => {
  try {
    const response = await Api.get("/events");
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// Lấy sự kiện theo ID
export const getEventById = async (id) => {
  try {
    const response = await Api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    return null;
  }
};

// ✅ Tạo sự kiện
export const createEvent = async (eventData) => {
  try {
    const response = await Api.post("/events/create-event", eventData);

    const createdEvent = response.data;

    // Nếu EventDTO có id
    const eventId = createdEvent?.eventId;

    return {
      success: true,
      eventId: eventId, // Để navigate khi tạo xong
      data: createdEvent,
    };
  } catch (error) {
    console.error("Error creating event:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Đã có lỗi không mong muốn xảy ra.";
    return { success: false, message: errorMessage };
  }
};

// Cập nhật sự kiện
export const updateEvent = async (id, eventData) => {
  try {
    const response = await Api.put(`/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Error updating event with ID ${id}:`, error);
    return null;
  }
};

// Lấy trending events
export const getTrendingEvents = async (type) => {
  try {
    const response = await Api.get(`/events/trending/${type}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trending events:", error);
    return [];
  }
};
