import React, { useState } from "react";
// Đảm bảo eventService.js của bạn đã được cập nhật để xử lý lỗi như đề xuất trước đó
import { createEvent } from "../services/eventService";

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDatetime: "", // Khởi tạo là chuỗi rỗng để dễ dàng bind với input datetime-local
        endDatetime: "",   // Khởi tạo là chuỗi rỗng để dễ dàng bind với input datetime-local
        location: "",
        ddayInfo: "",
        maxMemberNumber: 0,
        maxParticipantNumber: 0,
        status: "UPCOMING",
        bannerUrl: "",
        posterUrl: "",
    });

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Xóa thông báo lỗi cũ khi người dùng bắt đầu nhập lại
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        // Đảm bảo giá trị là số nguyên không âm
        const parsedValue = parseInt(value, 10);
        setFormData(prev => ({ ...prev, [name]: isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue }));
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleDateChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrorMessage("");
        setSuccessMessage("");
    };

    // Hàm kiểm tra URL cơ bản
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // Hàm validate dữ liệu form
    const validateForm = () => {
        // Reset thông báo lỗi
        setErrorMessage("");

        const {
            name,
            description,
            startDatetime,
            endDatetime,
            location,
            maxMemberNumber,
            maxParticipantNumber,
            bannerUrl,
            posterUrl
        } = formData;

        if (!name.trim()) {
            setErrorMessage("Tên sự kiện không được để trống.");
            return false;
        }
        if (!description.trim()) {
            setErrorMessage("Mô tả sự kiện không được để trống.");
            return false;
        }
        if (!location.trim()) {
            setErrorMessage("Địa điểm sự kiện không được để trống.");
            return false;
        }

        // Validate ngày giờ
        if (!startDatetime) {
            setErrorMessage("Thời gian bắt đầu không được để trống.");
            return false;
        }
        if (!endDatetime) {
            setErrorMessage("Thời gian kết thúc không được để trống.");
            return false;
        }

        const startDate = new Date(startDatetime);
        const endDate = new Date(endDatetime);

        if (isNaN(startDate.getTime())) { // Kiểm tra ngày hợp lệ
            setErrorMessage("Thời gian bắt đầu không hợp lệ.");
            return false;
        }
        if (isNaN(endDate.getTime())) { // Kiểm tra ngày hợp lệ
            setErrorMessage("Thời gian kết thúc không hợp lệ.");
            return false;
        }

        if (endDate <= startDate) {
            setErrorMessage("Thời gian kết thúc phải sau thời gian bắt đầu.");
            return false;
        }

        // Validate số lượng
        if (maxMemberNumber < 0) {
            setErrorMessage("Số thành viên tối đa không được âm.");
            return false;
        }
        if (maxParticipantNumber < 0) {
            setErrorMessage("Số người tham gia tối đa không được âm.");
            return false;
        }
        if (maxParticipantNumber < maxMemberNumber) {
            setErrorMessage("Số người tham gia tối đa không được nhỏ hơn số thành viên tối đa.");
            return false;
        }


        // Validate URL ảnh (nếu có)
        if (bannerUrl && !isValidUrl(bannerUrl)) {
            setErrorMessage("URL Banner không hợp lệ. Vui lòng nhập một URL ảnh hợp lệ.");
            return false;
        }
        if (posterUrl && !isValidUrl(posterUrl)) {
            setErrorMessage("URL Poster không hợp lệ. Vui lòng nhập một URL ảnh hợp lệ.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validate dữ liệu
        if (!validateForm()) {
            return; // Dừng lại nếu validation thất bại
        }

        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        const payload = {
            ...formData,
            // Chuyển đổi ngày giờ sang định dạng ISO string cho BE
            startDatetime: formData.startDatetime ? new Date(formData.startDatetime).toISOString() : null,
            endDatetime: formData.endDatetime ? new Date(formData.endDatetime).toISOString() : null,
        };

        try {
            const result = await createEvent(payload); // Giả sử createEvent trả về { success: true, data: response.data }

            // THAY ĐỔI DÒNG NÀY:
            if (result.success && result.data && result.data.eventId) { // Kiểm tra createdEvent.eventId
                setSuccessMessage("🎉 Tạo sự kiện thành công!");
                // Tùy chọn: reset form sau khi tạo thành công
                setFormData({
                    name: "",
                    description: "",
                    startDatetime: "",
                    endDatetime: "",
                    location: "",
                    ddayInfo: "",
                    maxMemberNumber: 0,
                    maxParticipantNumber: 0,
                    status: "UPCOMING",
                    bannerUrl: "",
                    posterUrl: "",
                });
            } else {
                // Sử dụng thông báo lỗi từ result.message nếu có, hoặc thông báo chung
                setErrorMessage(result.message || "Tạo sự kiện thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Lỗi khi tạo sự kiện:", error);
            setErrorMessage(error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Tạo sự kiện mới</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
                    {/* Event Name */}
                    <div>
                        <label htmlFor="name" className="block mb-2 font-medium">Tên sự kiện <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="w-full p-2 border rounded"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block mb-2 font-medium">Mô tả <span className="text-red-500">*</span></label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            className="w-full p-2 border rounded"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Start & End Datetime */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDatetime" className="block mb-2 font-medium">Thời gian bắt đầu <span className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                id="startDatetime"
                                className="w-full p-2 border rounded"
                                value={formData.startDatetime}
                                onChange={(e) => handleDateChange("startDatetime", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="endDatetime" className="block mb-2 font-medium">Thời gian kết thúc <span className="text-red-500">*</span></label>
                            <input
                                type="datetime-local"
                                id="endDatetime"
                                className="w-full p-2 border rounded"
                                value={formData.endDatetime}
                                onChange={(e) => handleDateChange("endDatetime", e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div>
                        <label htmlFor="location" className="block mb-2 font-medium">Địa điểm <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            className="w-full p-2 border rounded"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* D-Day Info */}
                    <div>
                        <label htmlFor="ddayInfo" className="block mb-2 font-medium">Thông tin D-Day</label>
                        <input
                            type="text"
                            id="ddayInfo"
                            name="ddayInfo"
                            className="w-full p-2 border rounded"
                            value={formData.ddayInfo}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Max Members & Participants */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="maxMemberNumber" className="block mb-2 font-medium">Số thành viên tối đa</label>
                            <input
                                type="number"
                                id="maxMemberNumber"
                                name="maxMemberNumber"
                                min="0"
                                className="w-full p-2 border rounded"
                                value={formData.maxMemberNumber}
                                onChange={handleNumberChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="maxParticipantNumber" className="block mb-2 font-medium">Số người tham gia tối đa</label>
                            <input
                                type="number"
                                id="maxParticipantNumber"
                                name="maxParticipantNumber"
                                min="0"
                                className="w-full p-2 border rounded"
                                value={formData.maxParticipantNumber}
                                onChange={handleNumberChange}
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block mb-2 font-medium">Trạng thái</label>
                        <select
                            id="status"
                            name="status"
                            className="w-full p-2 border rounded"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="UPCOMING">UPCOMING</option>
                            <option value="REVIEWING">REVIEWING</option>
                            <option value="PENDING">PENDING</option>
                            <option value="ONGOING">ONGOING</option>
                            <option value="ENDED">ENDED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="RECRUITING">RECRUITING</option>
                        </select>
                    </div>

                    {/* Banner & Poster */}
                    <div>
                        <label htmlFor="bannerUrl" className="block mb-2 font-medium">Banner URL</label>
                        <input
                            type="text"
                            id="bannerUrl"
                            name="bannerUrl"
                            className="w-full p-2 border rounded"
                            value={formData.bannerUrl}
                            onChange={handleChange}
                            placeholder="e.g., https://example.com/banner.jpg"
                        />
                    </div>

                    <div>
                        <label htmlFor="posterUrl" className="block mb-2 font-medium">Poster URL</label>
                        <input
                            type="text"
                            id="posterUrl"
                            name="posterUrl"
                            className="w-full p-2 border rounded"
                            value={formData.posterUrl}
                            onChange={handleChange}
                            placeholder="e.g., https://example.com/poster.png"
                        />
                    </div>
                </div>

                {errorMessage && (
                    <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
                        {successMessage}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {loading ? "Đang tạo..." : "Xác nhận tạo sự kiện"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;