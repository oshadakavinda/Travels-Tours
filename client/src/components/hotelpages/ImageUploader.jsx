import React, { useState } from "react";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { Alert } from "flowbite-react";

function ImageUploader({ setImageURL, label, id }) {
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadError(null);
      try {
        const url = await uploadToCloudinary(file, (progress) => {
          setUploadProgress(progress);
        });
        setImageURL(url);
        setUploadProgress(null);
        setUploadError(null);
      } catch (error) {
        setUploadProgress(null);
        setUploadError(`Error uploading file: ${error.message}`);
        console.log(`${label} upload error:`, error);
      }
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="file"
        accept="image/*"
        id={id}
        onChange={handleImageChange}
        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-full file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        required
      />
      {uploadProgress && <div>Upload progress: {uploadProgress}%</div>}
      {uploadError && <Alert color="failure">{uploadError}</Alert>}
    </div>
  );
}

export default ImageUploader;
