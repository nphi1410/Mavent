export const convertToUrl = (base64Content, contentType) => {
    if (!base64Content || base64Content.trim() === "") {
      return "/images/fptu-showcase.png";
    }
    return `data:${contentType};base64,${base64Content}`;
  };