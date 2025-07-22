export const getLogoUrl = (url) => {
  const token = import.meta.env.VITE_LOGO_DEV_TOKEN;
  return `${url}?token=${token}`;
};
