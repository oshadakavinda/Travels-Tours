import { FileInput, TextInput, Button, Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { uploadToCloudinary } from "../../utils/cloudinary";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import Waypoint from "../shared/waypoint";

export default function UpdateTour() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    desc: "",
    days: 1,
    destinations: [],
    photo: "",
  });
  const [publishError, setPublishError] = useState(null);
  const { tourId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tourId) {
      setPublishError("Invalid Tour ID");
      return;
    }

    const fetchTour = async () => {
      try {
        const res = await fetch(`/api/tours/gettour/${tourId}`);
        const data = await res.json();
        // console.log(data.destinations);
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setPublishError(null);
        setFormData({
          ...data,
          destinations: Array.isArray(data.destinations)
            ? data.destinations.map((destination) => destination._id)
            : [],
        });

        console.log(formData.destinations);
      } catch (error) {
        setPublishError("Failed to fetch tour");
      }
    };

    fetchTour();
  }, [tourId]);

  const handleWaypointChange = (day, value) => {
    const updatedDestinations = [...formData.destinations];
    updatedDestinations[day - 1] = value;
    setFormData((prev) => ({ ...prev, destinations: updatedDestinations }));
  };

  const handleUploadImage = async () => {
    if (!file) {
      setImageUploadError("Please select an image.");
      return;
    }

    try {
      setImageUploadError(null);
      const downloadURL = await uploadToCloudinary(file, (progress) => {
        setImageUploadProgress(progress);
      });
      setImageUploadProgress(null);
      setFormData((prev) => ({ ...prev, photo: downloadURL }));
    } catch (error) {
      setImageUploadError("Image upload failed: " + error.message);
      setImageUploadProgress(null);
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, desc, days, destinations, photo } = formData;

    if (!title || !desc || !days || destinations.length < days || !photo) {
      setPublishError("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch(`/api/tours/update-tour/${tourId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/dashboard?tab=tours`);
    } catch (error) {
      console.error("Error updating tour:", error);
      setPublishError("Something went wrong.");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Update the <span className="text-[#F4AC20]">Tour</span>
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Tour Title"
          required
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
        />
        <TextInput
          type="number"
          placeholder="Number of Days"
          required
          min="1"
          value={formData.days}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              days: parseInt(e.target.value, 10),
            }))
          }
        />
        <Waypoint
          days={formData.days}
          destinations={formData.destinations}
          onChange={handleWaypointChange}
        />
        <div className="flex flex-col sm:flex-row gap-4 items-center border-4 p-3">
          <div className="w-full">
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  const storage = getStorage(app);
                  const fileName =
                    new Date().getTime() + "-" + selectedFile.name;
                  const storageRef = ref(storage, fileName);
                  const uploadTask = uploadBytesResumable(
                    storageRef,
                    selectedFile
                  );

                  uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                      const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      setImageUploadProgress(progress.toFixed(0));
                    },
                    (error) => {
                      setImageUploadError("Image uploading failed!");
                      setImageUploadProgress(null);
                    },
                    () => {
                      getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadURL) => {
                          setImageUploadProgress(null);
                          setImageUploadError(null);
                          setFormData({
                            ...formData,
                            photo: downloadURL,
                          });
                        }
                      );
                    }
                  );
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
        {formData.photo && (
          <img
            src={formData.photo}
            alt="Tour"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          value={formData.desc}
          placeholder="Write tour description..."
          className="h-72 mb-12"
          required
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, desc: value }))
          }
        />
        <Button type="submit" className="bg-[#F4AC20] text-white">
          Update Tour
        </Button>
        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
