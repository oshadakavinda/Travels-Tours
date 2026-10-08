import { useState, useEffect } from "react";
import { Alert, Button, TextInput, FileInput } from "flowbite-react";
import ReactQuill from "react-quill";
import { uploadToCloudinary } from "../utils/cloudinary";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateDestination() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [additionalImageUploadProgress, setAdditionalImageUploadProgress] = useState(null);
  const [formData, setFormData] = useState({ additionalImages: [] });
  const [publishError, setPublishError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityInput, setActivityInput] = useState("");
  const { destId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchDestinations = async () => {
        const res = await fetch(`/api/destination/get-dest?destId=${destId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.destinations[0]);
          setActivities(data.destinations[0].activities || []);
        }
      };

      fetchDestinations();
    } catch (error) {
      console.log(error.message);
    }
  }, [destId]);

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (
      activityInput.trim() !== "" &&
      !activities.includes(activityInput.trim())
    ) {
      setActivities([...activities, activityInput.trim()]);
      setActivityInput("");
    }
  };

  const handleRemoveActivity = (activityToRemove) => {
    setActivities(
      activities.filter((activity) => activity !== activityToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = { ...formData, activities };
    try {
      const res = await fetch(`/api/destination/update-dest/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/destinations/${data.slug}`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update the Destination
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="justify-between">
          <TextInput
            type="text"
            placeholder="Destination Name"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, destinationName: e.target.value })
            }
            value={formData.destinationName}
          />
        </div>

        {/* Main Image Upload with improved styling */}
        <div className="flex flex-col sm:flex-row gap-4 items-center border-4 p-3">
          <div className="w-full">
            <FileInput
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  setImageUploadError(null);
                  try {
                    const downloadURL = await uploadToCloudinary(
                      selectedFile,
                      (progress) => setImageUploadProgress(progress)
                    );
                    setImageUploadProgress(null);
                    setFormData({ ...formData, destImage: downloadURL });
                  } catch (err) {
                    setImageUploadError("Image uploading failed: " + err.message);
                    setImageUploadProgress(null);
                  }
                }
              }}
            />
          </div>
          {imageUploadProgress && (
            <div className="w-16 h-16 flex-shrink-0">
              <CircularProgressbar
                value={imageUploadProgress}
                text={`${imageUploadProgress || 0}%`}
              />
            </div>
          )}
        </div>

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {formData.destImage && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div className="relative">
              <img 
                src={formData.destImage} 
                alt="Uploaded preview" 
                className="max-w-full h-48 object-cover rounded-lg shadow-md border border-gray-200"
              />
              <div className="mt-2 text-xs text-green-600 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Image uploaded successfully
              </div>
            </div>
          </div>
        )}

        {/* Additional Images Section with improved styling */}
        <div className="flex flex-col gap-4 border-4 p-3">
          <label className="font-bold text-sm sm:text-base">
            Upload Additional Images (Max 5)
          </label>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="w-full">
              <FileInput
                type="file"
                accept="image/*"
                disabled={formData.additionalImages.length >= 5}
                onChange={async (e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile && formData.additionalImages.length < 5) {
                    setImageUploadError(null);
                    try {
                      const downloadURL = await uploadToCloudinary(
                        selectedFile,
                        (progress) => setAdditionalImageUploadProgress(progress)
                      );
                      setAdditionalImageUploadProgress(null);
                      setFormData({
                        ...formData,
                        additionalImages: [...formData.additionalImages, downloadURL],
                      });
                    } catch (err) {
                      setImageUploadError("Upload failed: " + err.message);
                      setAdditionalImageUploadProgress(null);
                    }
                  }
                }}
              />
            </div>
            
            {additionalImageUploadProgress && (
              <div className="w-16 h-16 flex-shrink-0">
                <CircularProgressbar
                  value={additionalImageUploadProgress}
                  text={`${additionalImageUploadProgress || 0}%`}
                />
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500">
            {formData.additionalImages.length}/5 images uploaded
          </div>
        </div>

        {formData.additionalImages && formData.additionalImages.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Additional Images Preview:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {formData.additionalImages.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Additional upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg shadow-md border border-gray-200"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors duration-200"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        additionalImages: formData.additionalImages.filter(
                          (_, i) => i !== index
                        ),
                      });
                    }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <ReactQuill
          theme="snow"
          placeholder="Description"
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, description: value });
          }}
          value={formData.description}
        />

        {/* Activities section */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <TextInput
              type="text"
              placeholder="Add an activity (e.g., Hiking, Swimming)"
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddActivity(e)}
              className="w-full"
            />
            <button
              type="button"
              className="w-full sm:w-auto bg-[#ffffff] text-black py-2 px-6 rounded-lg hover:bg-[#f7dcbc] border-2 border-[#F4AC20]"
              onClick={handleAddActivity}
            >
              Add Activity
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {activity}
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveActivity(activity)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" color="warning" className="w-full sm:w-auto">
          Update Destination
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}