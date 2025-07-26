import axios from "axios";

export const exportEventsToExcel = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/events/export", {
            responseType: "blob",
        });

        // Tạo file download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "events.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error exporting events:", error);
        throw error;
    }
};
