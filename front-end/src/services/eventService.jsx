import Api from "../config/Api";

export const getFilterEvents = async ({
  name,
  status,
  tagIds,
  sortType,
  page,
  size,
}) => {
  try {
    const body = {
      name,
      status,
      tagIds: tagIds && tagIds.length > 0 ? tagIds : [],
      sortType,
      page,
      size,
    };

    const res = await Api.post("/events/filter", body); // sending as JSON in body
    console.log(res.data);
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
