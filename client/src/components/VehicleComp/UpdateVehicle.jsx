import { FileInput, Select, TextInput, Button, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadToCloudinary } from "../../utils/cloudinary";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { vehicleId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/vehicles/getvehicles?vehicleId=${vehicleId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          setLoading(false);
          return;
        }
        setPublishError(null);
        if (data.vehicles && data.vehicles.length > 0) {
          // Ensure we're setting all the fetched data
          const vehicleData = data.vehicles[0];
          setFormData({
            ...vehicleData,
            title: vehicleData.title || '',
            content: vehicleData.content || '',
            image: vehicleData.image || '',
            _id: vehicleData._id
          });
        } else {
          setPublishError('No vehicle found with this ID');
        }
      } catch (error) {
        console.log(error.message);
        setPublishError('Failed to fetch vehicle data');
      } finally {
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchPost();
    }
  }, [vehicleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/vehicles/updatevehicle/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/vehicles`);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Update the <span style={{ color: '#F4AC20' }}>Vehicle</span>
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading vehicle data...</div>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type='text'
            placeholder="Title"
            required
            id='title'
            className="flex-1"
            style={{ borderColor: '#F4AC20' }}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            value={formData.title || ''}
          />
        </div>
        
        {/* Enhanced Image Upload Section - Automatic Upload */}
        <div className="flex flex-col sm:flex-row gap-4 items-center border-4 p-3" style={{ borderColor: '#F4AC20' }}>
          <div className="w-full">
            <FileInput 
              type='file' 
              accept='image/*' 
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
                    setImageUploadError(null);
                    setFormData({ ...formData, image: downloadURL });
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

        {/* Error Alert */}
        {imageUploadError && 
          <Alert color='failure'>
            {imageUploadError}
          </Alert>
        }

        {/* Enhanced Image Preview Section */}
        {formData.image && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
            <div className="relative">
              <img 
                src={formData.image} 
                alt="Vehicle preview"
                className="max-w-full h-48 object-cover rounded-lg shadow-md border border-gray-200"
              />
              <div className="mt-2 text-xs text-green-600 flex items-center">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {imageUploadProgress ? 'Uploading new image...' : 'Image ready'}
              </div>
            </div>
          </div>
        )}

        <ReactQuill 
          theme="snow" 
          value={formData.content || ''} 
          placeholder="Write Something..." 
          className="h-72 mb-12" 
          required 
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        
        <Button 
          type='submit' 
          style={{ backgroundColor: '#F4AC20', color: '#FFF' }}
        >
          Update Vehicle
        </Button>

        {publishError && 
          <Alert className="mt-5" color='failure'>
            {publishError}
          </Alert>
        }
        </form>
      )}
    </div>
  );
}