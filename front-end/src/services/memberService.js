import Api from "../config/Api";


// Member API service - chỉ quản lý member, không liên quan đến event management
const memberService = {
  // Lấy danh sách members của một event với phân trang và filter
  getMembers: async (eventId, params = {}, signal = undefined) => {
    try {
     

      const queryParams = new URLSearchParams();
      
 
      
      // Only append search parameter if it's not empty after trimming
      if (params.search && params.search.trim()) {
        const trimmedSearch = params.search.trim();
        queryParams.append("search", trimmedSearch);
      }

      if (params.role) {
        // Ensure role matches the format expected by backend enum
        const normalizedRole = params.role.trim().toUpperCase();
        queryParams.append("role", normalizedRole);
      }

      // Handle department filter - could be ID or name
      if (params.department !== undefined && params.department !== "") {
        // Ensure department is treated as numeric if possible
        const departmentValue =
          Number.isInteger(Number(params.department)) &&
          Number(params.department) > 0
            ? Number(params.department)
            : params.department.toString().trim();
        queryParams.append("department", departmentValue);
        // console.log('Adding department parameter:', departmentValue, 'Type:', typeof departmentValue);
      } else {
        // console.log('No department filter applied');
      }

      // Map status to backend format - ensure consistent casing
      if (params.status) {
        // Normalize status to either 'active' or 'inactive' (lowercase)
        const normalizedStatus =
          params.status.toLowerCase().trim() === "active"
            ? "active"
            : "inactive";
        queryParams.append("status", normalizedStatus);
        // console.log('Adding status parameter:', normalizedStatus);
      }

      if (params.page !== undefined) queryParams.append("page", params.page);
      if (params.size !== undefined) queryParams.append("size", params.size);

      // Cập nhật URL để phù hợp với MemberController
      const url = `/events/${eventId}/members?${queryParams.toString()}`;
      // Enhanced logging for easier debugging
      console.log('memberService.js - API parameters:', {
        eventId: eventId,
        search: params.search,
        role: params.role,
        department: params.department,
        status: params.status,
        page: params.page,
        size: params.size
      });
      console.log('memberService.js - Full API URL:', url);

      // Pass AbortController signal to the request
      const response = await Api.get(url, { signal });

      return response.data;
    } catch (error) {
      // Properly handle AbortError vs other errors
      if (
        error.name === "AbortError" ||
        error.code === "ECONNABORTED" ||
        (error.message && error.message.includes("canceled"))
      ) {
        // console.log('Request was cancelled');
        throw { name: "AbortError", message: "Request aborted" };
      }

      console.error("Error fetching members:", error);
      throw error;
    }
  },

  // Lấy chi tiết một member với AbortController support
  getMemberDetails: async (eventId, accountId, signal = undefined) => {
    try {
      // Cập nhật URL để phù hợp với endpoint trong MemberController
      const response = await Api.get(`/events/${eventId}/members/${accountId}`, {
        signal,
      });
      return response.data;
    } catch (error) {
      // Handle abort error separately
      if (
        error.name === "AbortError" ||
        error.code === "ECONNABORTED" ||
        (error.message && error.message.includes("canceled"))
      ) {
        // console.log('Member details request was cancelled');
        throw { name: "AbortError", message: "Request aborted" };
      }

      console.error(`Error fetching member details:`, error);
      throw error;
    }
  },

  // Cập nhật thông tin member (role, department, status)
  updateMember: async (memberData) => {
    try {
      console.log('memberService.updateMember called with data:', memberData);

      // Transform frontend data to backend DTO format
      const isActive =
        memberData.isActive !== undefined
          ? Boolean(memberData.isActive)
          : memberData.status === "Active";

      // Lấy accountId hiện tại từ localStorage và đảm bảo đó là số nguyên hợp lệ
      // Kiểm tra nếu không có accountId hoặc = 0 thì lấy ID cứng là 1 (hoặc admin nào đó)
      let currentUserId = parseInt(localStorage.getItem('accountId') || '0', 10);
      if (!currentUserId || currentUserId <= 0) {
        currentUserId = 1; // Fallback to a valid ID (Super Admin/Admin ID)
      }
      
      // Tạo DTO phù hợp với API MemberController và các yêu cầu xác thực
      const updateRequest = {
        // EventRole là trường bắt buộc trong UpdateMemberRequestDTO
        eventRole: memberData.role || memberData.eventRole || "MEMBER", // Luôn cung cấp vai trò hợp lệ
        // Chỉ gửi departmentId nếu được cung cấp và không phải null
        ...(memberData.departmentId !== undefined && memberData.departmentId !== null && { departmentId: memberData.departmentId }),
        // Luôn đặt trường isActive để đảm bảo nó được gửi đến backend (ép kiểu boolean)
        isActive: isActive,
        // Lý do cập nhật - đảm bảo không để trống
        reason: memberData.reason || "Updated by admin",
        // Trường assignedByAccountId là bắt buộc cho việc xác thực quyền (đảm bảo là số hợp lệ > 0)
        assignedByAccountId: memberData.assignedByAccountId || currentUserId,
      };

      console.log('Final update request:', updateRequest);

      const eventId = memberData.eventId;
      const accountId = memberData.accountId;
      
      // Sử dụng POST đúng với định nghĩa @PostMapping trong backend controller
      const response = await Api.post(`/events/${eventId}/members/${accountId}`, updateRequest);
      console.log('Update response:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating member:", error);
      throw error;
    }
  },

  // Ban/unban member
  banMember: async (banData) => {
    try {
      console.log('memberService.banMember called with data:', banData);
      
      // Ensure required fields are present
      if (!banData.eventId || !banData.accountId) {
        console.error("Missing required fields in banData:", banData);
        throw new Error("Missing required fields for ban operation");
      }

      // Make sure isBanned is explicitly a boolean
      banData.isBanned = !!banData.isBanned;

      // Lấy accountId hiện tại từ localStorage và đảm bảo đó là số nguyên hợp lệ
      // Kiểm tra nếu không có accountId hoặc = 0 thì lấy ID cứng là 1 (hoặc admin nào đó)
      let currentUserId = parseInt(localStorage.getItem('accountId') || '0', 10);
      if (!currentUserId || currentUserId <= 0) {
        currentUserId = 1; // Fallback to a valid ID (Super Admin/Admin ID)
      }

      // Cấu trúc lại request theo đúng định dạng của BanMemberRequestDTO
      const banRequest = {
        // Cần giữ nguyên trường isBanned theo yêu cầu của BanMemberRequestDTO
        isBanned: banData.isBanned,
        // Thêm reason - bắt buộc theo @NotBlank annotation
        reason: banData.reason || (banData.isBanned ? "Banned by admin" : "Unbanned by admin"),
        // Thêm trường assignedByAccountId là bắt buộc cho việc xác thực quyền (đảm bảo là số hợp lệ > 0)
        assignedByAccountId: banData.assignedByAccountId || currentUserId,
      };

      // Sử dụng endpoint RESTful từ MemberController với phương thức POST đúng với backend (@PostMapping)
      const eventId = banData.eventId;
      const accountId = banData.accountId;
      console.log('Ban request payload:', banRequest);
      const response = await Api.post(`/events/${eventId}/members/${accountId}/ban`, banRequest);
      console.log('Ban response:', response.data);
      return response.data;
    } catch (error) {
      console.error("Error banning/unbanning member:", error);
      throw error;
    }
  },

  // Thêm member mới vào event (nếu cần)
  addMember: async (memberData) => {
    try {
      // Cập nhật endpoint để phù hợp với MemberController
      const eventId = memberData.eventId;
      // Xóa eventId từ payload vì đã nằm trong URL
      const { eventId: _, ...payload } = memberData;
      const response = await Api.post(`/events/${eventId}/members`, payload);
      return response.data;
    } catch (error) {
      console.error("Error adding member:", error);
      throw error;
    }
  },
  // Xóa member khỏi event
  removeMember: async (eventId, accountId) => {
    try {
      // Cập nhật endpoint để phù hợp với MemberController
      await Api.delete(`/events/${eventId}/members/${accountId}`);
      return true;
    } catch (error) {
      console.error("Error removing member:", error);
      throw error;
    }
  },
  // Lấy danh sách departments của một event
  getDepartments: async (eventId, signal = undefined) => {
    try {
      // console.log('Calling API to get departments for eventId:', eventId);

      // Kiểm tra eventId
      if (!eventId) {
        console.warn("No eventId provided for getDepartments");
        return {
          success: false,
          data: [],
          message: "No event ID provided",
        };
      }

      // Gọi API thực tế để lấy danh sách phòng ban của sự kiện
      try {
        // Thử gọi API với endpoint /departments trước
        try {
          const response = await Api.get(`/events/${eventId}/departments`, {
            signal,
            timeout: 8000, // 8 giây timeout
          });

          // console.log('Departments API response from /departments:', response);

          // Xử lý phản hồi từ API
          let departments = [];

          if (response && response.data) {
            // Nếu API trả về mảng trực tiếp
            if (Array.isArray(response.data)) {
              departments = response.data;
            }
            // Nếu API trả về đối tượng có thuộc tính data/content là mảng
            else if (Array.isArray(response.data.data)) {
              departments = response.data.data;
            } else if (Array.isArray(response.data.content)) {
              departments = response.data.content;
            }
          }

          if (departments.length > 0) {
            // Thêm mã phòng ban nếu không có
            departments = departments.map((dept) => {
              if (!dept.deptNo) {
                // Tạo deptNo từ departmentId nếu không có sẵn
                return {
                  ...dept,
                  deptNo: `DEPT-${String(dept.departmentId).padStart(3, "0")}`,
                };
              }
              return dept;
            });

            return {
              success: true,
              data: departments,
              message: "Departments fetched successfully",
            };
          }
        } catch (err) {
          console.log(
            "Error fetching from /departments, trying alternative endpoint:",
            err
          );
        }

        // Nếu endpoint đầu tiên thất bại, thử với endpoint thay thế
        const alternativeResponse = await Api.get(
          `/events/${eventId}/departments`,
          {
            signal,
            timeout: 8000,
          }
        );

    

        let departments = [];

        if (alternativeResponse && alternativeResponse.data) {
          if (Array.isArray(alternativeResponse.data)) {
            departments = alternativeResponse.data;
          } else if (
            alternativeResponse.data.content &&
            Array.isArray(alternativeResponse.data.content)
          ) {
            departments = alternativeResponse.data.content;
          } else if (
            alternativeResponse.data.data &&
            Array.isArray(alternativeResponse.data.data)
          ) {
            departments = alternativeResponse.data.data;
          }
        }

        // Thêm mã phòng ban nếu không có
        departments = departments.map((dept) => {
          if (!dept.deptNo) {
            return {
              ...dept,
              deptNo: `DEPT-${String(dept.departmentId).padStart(3, "0")}`,
            };
          }
          return dept;
        });

        return {
          success: true,
          data: departments,
          message: "Departments fetched successfully from alternative endpoint",
        };
      } catch (apiError) {
        console.error("API error in getDepartments:", apiError);

        // Kiểm tra nếu request bị hủy/timeout
        if (
          apiError.name === "AbortError" ||
          apiError.code === "ECONNABORTED" ||
          (apiError.message &&
            (apiError.message.includes("canceled") ||
              apiError.message.includes("timeout")))
        ) {
          console.log("Departments request was cancelled or timed out");
        }

        // Rethrow để xử lý ở cấp cao hơn
        throw apiError;
      }
    } catch (error) {
      console.error("Error fetching departments:", error);

      // Trả về đối tượng với dữ liệu rỗng để UI hiển thị trạng thái không có dữ liệu
      return {
        success: false,
        data: [],
        message: "Failed to get departments from API",
        error: error.message,
      };
    }
  },

  // Get department by ID
  getDepartmentById: async (departmentId, signal = undefined) => {
    try {
      const response = await Api.get(`/departments/${departmentId}`, {
        signal,
      });
      return response.data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw { name: "AbortError", message: "Request aborted" };
      }
      console.error("Error fetching department by ID:", error);
      throw error;
    }
  },

  // Find departments by name
  findDepartmentsByName: async (eventId, name, signal = undefined) => {
    try {
      const response = await Api.get(
        `/departments/search?eventId=${eventId}&name=${encodeURIComponent(
          name
        )}`,
        { signal }
      );
      return response.data;
    } catch (error) {
      if (error.name === "AbortError") {
        throw { name: "AbortError", message: "Request aborted" };
      }
      console.error("Error searching departments by name:", error);
      throw error;
    }
  },
};

export default memberService;
