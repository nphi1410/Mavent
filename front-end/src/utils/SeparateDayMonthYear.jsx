export const separateDayMonthYear = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("default", { month: "short" });
    const year = d.getFullYear();
    return [day, month, year];
};