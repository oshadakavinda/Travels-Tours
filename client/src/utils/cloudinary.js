/**
 * Upload an image file directly to Cloudinary with real-time progress reporting.
 * @param {File} file - The file to upload.
 * @param {(percent: number) => void} [onProgress] - Optional callback for upload percentage (0-100).
 * @returns {Promise<string>} The secure URL of the uploaded image.
 */
export const uploadToCloudinary = (file, onProgress) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "z7wvrvuj";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "travel_tours";

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } catch (e) {
          reject(new Error("Invalid response from Cloudinary"));
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(new Error(errorResponse.error?.message || "Failed to upload image to Cloudinary"));
        } catch (e) {
          reject(new Error(`Cloudinary upload failed with status ${xhr.status}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudinary upload"));
    };

    xhr.send(formData);
  });
};
