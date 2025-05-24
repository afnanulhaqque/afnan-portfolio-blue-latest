export const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return url;
  
  // If it's already a direct image URL, return as is
  if (url.includes('drive.google.com/uc')) return url;
  
  // Extract file ID from Google Drive URL
  // Handle formats:
  // 1. /d/FILE_ID/view
  // 2. /file/d/FILE_ID/view?usp=drive_link
  // 3. /file/d/FILE_ID/view
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!fileIdMatch) return url;
  
  const fileId = fileIdMatch[1];
  // Use the direct image URL format
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

export const isValidImageUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}; 