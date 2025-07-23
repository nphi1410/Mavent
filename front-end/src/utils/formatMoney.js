
export const formatMoney = (amount) => {
  if (!amount && amount !== 0) return "";
  

  const numAmount = typeof amount === 'string' ? parseInt(amount) : amount;
  
  // Format with thousand separators
  return numAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
