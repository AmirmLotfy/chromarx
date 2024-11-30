export const maskSensitiveData = (text: string) => {
  return text.replace(/./g, '•');
};

export const maskUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${maskSensitiveData(urlObj.hostname)}${urlObj.pathname}`;
  } catch {
    return maskSensitiveData(url);
  }
};