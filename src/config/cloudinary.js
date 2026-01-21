// Cloudinary configuration for KARTEJI
export const CLOUDINARY_CONFIG = {
  cloudName: "dbxktcwug",
  uploadPreset: "Karteji",
  uploadUrl: "https://api.cloudinary.com/v1_1/dbxktcwug/image/upload"
};

/**
 * Upload image to Cloudinary
 * @param {File} file - Image file to upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Upload result with URL
 */
export async function uploadToCloudinary(file, onProgress = null) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
  formData.append('folder', 'karteji');

  try {
    const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    // Cloudinary upload error:
    throw error;
  }
}
