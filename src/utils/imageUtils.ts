export const uploadToImgBB = async (imageUrl: string): Promise<string> => {
  try {
    // First, fetch the image as a blob
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create form data
    const formData = new FormData();
    formData.append('image', blob);

    // Upload to ImgBB
    const uploadResponse = await fetch('https://api.imgbb.com/1/upload?key=YOUR_IMGBB_API_KEY', {
      method: 'POST',
      body: formData
    });

    const data = await uploadResponse.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error('Failed to upload image to ImgBB');
    }
  } catch (error) {
    console.error('Error uploading to ImgBB:', error);
    return imageUrl; // Return original URL if upload fails
  }
};

export const convertGoogleDriveUrl = (url: string): string => {
  if (!url) return '';
  
  try {
    // If it's already a direct image URL, return as is
    if (url.includes('drive.google.com/uc?export=view')) {
      return url;
    }

    // Extract file ID from various Google Drive URL formats
    let fileId = '';
    
    // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=drive_link
    // Format 2: https://drive.google.com/file/d/FILE_ID/view
    // Format 3: https://drive.google.com/open?id=FILE_ID
    // Format 4: https://drive.google.com/drive/folders/FILE_ID
    // Format 5: https://drive.google.com/drive/u/0/folders/FILE_ID
    // Format 6: https://drive.google.com/file/d/FILE_ID/preview
    const patterns = [
      /\/d\/([a-zA-Z0-9_-]+)/,  // Matches /d/FILE_ID
      /[?&]id=([a-zA-Z0-9_-]+)/, // Matches ?id=FILE_ID or &id=FILE_ID
      /\/folders\/([a-zA-Z0-9_-]+)/, // Matches /folders/FILE_ID
      /\/preview\?id=([a-zA-Z0-9_-]+)/, // Matches /preview?id=FILE_ID
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        fileId = match[1];
        break;
      }
    }

    if (!fileId) {
      console.error('Could not extract file ID from Google Drive URL:', url);
      return url; // Return original URL if we can't extract the file ID
    }

    // Try different URL formats
    const urlFormats = [
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
      `https://drive.google.com/file/d/${fileId}/preview`,
      `https://drive.google.com/uc?id=${fileId}&export=download`
    ];

    console.log('Trying URL formats:', urlFormats);
    return urlFormats[0]; // Return the first format for now
  } catch (error) {
    console.error('Error converting Google Drive URL:', error);
    return url;
  }
};

export const isValidGoogleDriveUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    return url.includes('drive.google.com');
  } catch {
    return false;
  }
};

export const validateAndConvertImageUrl = async (url: string): Promise<string> => {
  if (!url) return '';
  
  try {
    // If it's a Google Drive URL, try to convert and upload to ImgBB
    if (isValidGoogleDriveUrl(url)) {
      const convertedUrl = convertGoogleDriveUrl(url);
      console.log('Converted Google Drive URL:', { original: url, converted: convertedUrl });
      return await uploadToImgBB(convertedUrl);
    }
    
    // If it's already a direct image URL, return as is
    return url;
  } catch (error) {
    console.error('Error validating image URL:', error);
    return url;
  }
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