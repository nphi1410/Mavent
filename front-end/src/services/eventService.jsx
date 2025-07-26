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

// Tạo sự kiện (gửi multipart/form-data)
export const createEvent = async (eventData, bannerFile, posterFile, selectedTags = []) => {
  try {
    const formData = new FormData();

    // Thêm event data dưới dạng JSON string
    formData.append('event', JSON.stringify(eventData));

    // Thêm files
    formData.append('banner', bannerFile);
    formData.append('poster', posterFile);

    // Thêm tags dưới dạng JSON string nếu có
    if (selectedTags && selectedTags.length > 0) {
      formData.append('tags', JSON.stringify(selectedTags));
    }

    // SỬA: Xóa Content-Type header để browser tự set cho multipart/form-data
    const response = await Api.post('/events/create-event', formData, {
      headers: {
        'Content-Type': undefined, // Force remove Content-Type
      },
    });

    return {
      success: true,
      eventId: response.data.eventId,
      data: response.data,
    };

  } catch (error) {
    console.error('Error creating event:', error);
    let errorMessage = 'Tạo sự kiện thất bại';
    
    if (error.response && error.response.data) {
      // Nếu response.data là string, dùng trực tiếp
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } 
      // Nếu response.data là object có message
      else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      // Nếu response.data là object khác, convert to string
      else {
        errorMessage = JSON.stringify(error.response.data);
      }
    } else if (error.message) {
      errorMessage = 'Lỗi kết nối: ' + error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

// Cập nhật sự kiện (gửi multipart/form-data gồm JSON + ảnh)
export const updateEvent = async (id, eventData, bannerFile, posterFile) => {
  try {
    const formData = new FormData();

    // 1. Add JSON event object as string
    formData.append("event", JSON.stringify(eventData));

    // 2. Add optional banner & poster files
    if (bannerFile) formData.append("banner", bannerFile);
    if (posterFile) formData.append("poster", posterFile);

    // 3. Gửi PUT request
    const response = await Api.put(`/events/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

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

export const registerEvent = async (eventRegisterDTO) => {
  try {
    // console.log(eventRegisterDTO);

    const response = await Api.post(`/events/register`, eventRegisterDTO);
    return response;
  } catch (error) {
    console.error(
      `Error registering for event with ID ${eventRegisterDTO}:`,
      error
    );
    return null;
  }
};

export const getAttendingEvent = async (accountId, pageable) => {
  try {
    const response = await Api.get(`/events/attending/${accountId}`, {
      params: pageable,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching attending events:", error);
    return [];
  }
};

export const getJoiningEvent = async (accountId) => {
  try {
    const response = await Api.get(`/events/joining/${accountId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching attending events:", error);
    return [];
  }
};

export const getAttendingSummary = async (accountId, eventRole) => {
  try {
    const response = await Api.get(`/events/attending/summary/${accountId}`, {
      params: { eventRole },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching location:", error);
    return [];
  }
};

export const getSummary = async (status) => {
  try {
    const response = await Api.get(`/events/summary`, {
      params: { status },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching location:", error);
    return [];
  }
};

export const countAttendanceByAccountId = async (accountId, eventRole, countCurrentMonth) => {
  const response = await Api.get("/events/count", {
    params: { accountId, eventRole, countCurrentMonth },
  });
  return response.data;
};

export const getEventRolesByAccount = async (accountId, page = 0, size = 1, sort = "createdAt,desc") => {
  const response = await Api.get("/events/account", {
    params: { accountId, page, size, sort },
  });
  return response.data;
};

export const getPendingEventDetailsById = async (eventId) => {
  try {
    const response = await Api.get(`/events/pending/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pending event details for ID ${eventId}:`, error);
    return null;
  }
}

export const updatePendingEvent = async (eventId, status) => {
  try {
    const response = await Api.patch(`/events/pending/${eventId}`, status);
    return response.data;
  } catch (error) {
    console.error(`Error updating pending event with ID ${eventId}:`, error);
    return null;
  }
}

export const getEventsByCreator = async () => {
  try {
    const response = await Api.get(`/events/created`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching events for creator`, error);
    return [];
  }
}