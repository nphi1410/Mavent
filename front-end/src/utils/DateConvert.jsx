export const separateDayMonthYear = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("default", { month: "short" });
    const year = d.getFullYear();
    return [day, month, year];
};

/**
 * Formats a Date into Vietnamese date string.
 *
 * @param {string | Date} date - The date to format.
 * @param {boolean} withWeekday - Whether to include the day of the week.
 * @returns {string} - Formatted date string.
 */
export const vietnameseDate = (date, withWeekday = false) => {
  if (!date) return "";
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (withWeekday) {
    options.weekday = "long";
  }

  return new Date(date).toLocaleString("vi-VN", options);
};
