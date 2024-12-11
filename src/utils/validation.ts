export const isValidAmount = (amount: number): boolean => {
  return amount > 0 && Number.isInteger(amount);
};

export const isValidFileType = (file: File): boolean => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  return allowedTypes.includes(file.type);
};

export const isValidFileSize = (file: File, maxSizeMB = 10): boolean => {
  const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
  return file.size <= maxSize;
};