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

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    console.error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
    return false;
  }

  if (file.size > maxSize) {
    console.error('File size too large. Maximum size is 5MB.');
    return false;
  }

  return true;
};

export const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Set maximum dimensions for the frame
        const MAX_WIDTH = 800;  // Reduced from 1200 to 800
        const MAX_HEIGHT = 600; // Reduced from 1200 to 600
        
        // Calculate aspect ratios
        const imgAspectRatio = width / height;
        const frameAspectRatio = MAX_WIDTH / MAX_HEIGHT;

        // Calculate new dimensions while maintaining aspect ratio
        if (imgAspectRatio > frameAspectRatio) {
          // Image is wider than frame
          if (width > MAX_WIDTH) {
            height = Math.round(MAX_WIDTH / imgAspectRatio);
            width = MAX_WIDTH;
          }
        } else {
          // Image is taller than frame
          if (height > MAX_HEIGHT) {
            width = Math.round(MAX_HEIGHT * imgAspectRatio);
            height = MAX_HEIGHT;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Create a white background
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          
          // Draw the image centered
          const x = (width - width) / 2;
          const y = (height - height) / 2;
          ctx.drawImage(img, x, y, width, height);
        }

        // Convert to blob with quality 0.8 (80%)
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create a new file with the compressed blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          'image/jpeg',
          0.8
        );
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};

export const handleImageUpload = async (file: File): Promise<string> => {
  try {
    if (!validateImageFile(file)) {
      throw new Error('Invalid image file');
    }

    const compressedFile = await compressImage(file);
    const base64String = await convertFileToBase64(compressedFile);
    return base64String;
  } catch (error) {
    console.error('Error handling image upload:', error);
    throw error;
  }
}; 