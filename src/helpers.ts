export const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const getLinksIntoArray = (message: string): string[] => {
  const urlPattern =
    /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\/\S*)?/g;
  return message.match(urlPattern) || [];
};

export const converttToUserTimezone = (date: string) => {
  return new Date(date).toLocaleString();
};

export const convertToUserMMHH = (date: string) => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const parseMessageWithLinks = (message: string) => {
  const urlPattern =
    /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?(?:\/\S*)?/g;

  return message.replace(urlPattern, (url) => {
    const link = url.startsWith("http") ? url : `http://${url}`;
    return `<a href="${link}" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline">${url}</a>`;
  });
};
