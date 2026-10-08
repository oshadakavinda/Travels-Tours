import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { uploadToCloudinary } from '../../utils/cloudinary';

// StarRating Component
const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`w-8 h-8 cursor-pointer ${
            star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path
            fill="currentColor"
            d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
          />
        </svg>
      ))}
    </div>
  );
};

const WriteReview = ({ onCancel, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Get current user from Redux store
  const { currentUser } = useSelector((state) => state.user);

  const handleImageUpload = async (file) => {
    return uploadToCloudinary(file, (progress) => {
      setUploadProgress(progress);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!currentUser) {
      setError('Please sign in to post a review');
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload images if any
      const uploadedImageUrls = [];
      if (images.length > 0) {
        for (const image of images) {
          const imageUrl = await handleImageUpload(image);
          uploadedImageUrls.push(imageUrl);
        }
      }

      const reviewData = {
        rating,
        comment,
        userId: currentUser._id,
        images: uploadedImageUrls,
      };

      const response = await axios.post('/api/review/create', reviewData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      console.log('Review created successfully:', response.data);
      // Clear form after successful submission
      setRating(0);
      setComment('');
      setImages([]);
      setUploadProgress(0);
      // Notify parent to update reviews state.
      if (onReviewSubmitted) {
        onReviewSubmitted(response.data.review);
      }
    } catch (error) {
      console.error('Error creating review:', error);
      setError(error.response?.data?.message || 'Error creating review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Validate: must be an image and under 5MB
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.size <= 5000000
    );
    if (validFiles.length !== files.length) {
      setError('Some files were rejected. Please only upload images under 5MB.');
    }
    setImages((prevImages) => [...prevImages, ...validFiles]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  if (!currentUser) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded">
        Please sign in to post a review
      </div>
    );
  }

  return (
    <div className="h-full px-8 max-lg:py-8 rounded-3xl bg-gray-100 w-full max-xl:max-w-3xl max-xl:mx-auto mt-4">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mb-4 text-yellow-400 mt-4"
        >
          &larr; Back
        </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 p-2 bg-red-50 rounded">{error}</div>
        )}
        <div className="flex items-center gap-6">
          <label className="block mb-1">Rating:</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>
        <div>
          <label className="block mb-1">Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <div>
          <label className="block mb-1">Images:</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            accept="image/*"
          />
          {images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Uploading: {uploadProgress}%
              </p>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-yellow-400 text-white px-4 py-2 rounded ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default WriteReview;
