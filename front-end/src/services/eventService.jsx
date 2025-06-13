import Api from "../config/Api";

//lọc sự kiện theo name,status,tags; sort, paging
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

//Lấy toàn bộ danh sách sự kiện
export const getEvents = async () => {
  try {
    const response = await Api.get("/events");
    return response.data; // array of EventDTO
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

//Lấy thông tin 1 sự kiện theo ID
export const getEventById = async (id) => {
  try {
    const response = await Api.get(`/events/${id}`);
    console.log(response.data);
    return response.data; // single EventDTO
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    return null;
  }
};

// Create event
export const createEvent = async (eventData) => {
  try {
    const response = await Api.post("/events/create-event", eventData);
    return { success: true, data: response.data }; // Trả về data từ BE
  } catch (error) {
    console.error("Error creating event:", error);
    // Trích xuất thông báo lỗi từ phản hồi của BE
    const errorMessage = error.response?.data?.message || error.message || "Đã có lỗi không mong muốn xảy ra.";
    return { success: false, message: errorMessage };
  }
};

// Update event
export const updateEvent = async (id, eventData) => {
  try {
    const response = await Api.put(`/events/${id}`, eventData);
    return response.data; // updated EventDTO
  } catch (error) {
    console.error(`Error updating event with ID ${id}:`, error);
    return null;
  }
};

export const getTrendingEvents = async (type) => {
  try {
    const response = await Api.get(`/events/trending/${type}`);
    return response.data; // array of EventDTO
  } catch (error) {
    console.error("Error fetching trending events:", error);
    return [];
  }
};
