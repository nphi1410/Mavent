// Hàm đơn giản để kết hợp các class names
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Hàm định dạng ngày tháng
export const formatDate = (date, options) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  const dateToFormat = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('vi-VN', options || defaultOptions).format(dateToFormat);
};

// Hàm debounce để hạn chế gọi hàm liên tục
export const debounce = (func, waitFor) => {
  let timeout = null;
  
  return (...args) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Hàm truncate text nếu quá dài
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Hàm format tiền tệ
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
