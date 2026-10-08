import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import React from "react";
import {
  Alert,
  Button,
  TextInput,
  Table,
  Modal,
  FileInput,
} from "flowbite-react";
import ReactQuill from "react-quill";
import { uploadToCloudinary } from "../utils/cloudinary";
import "react-quill/dist/quill.snow.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function DashDestinations() {
  const { currentUser } = useSelector((state) => state.user);
  const [destinationsList, setDestinationsList] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [destinationIdToDelete, setDestinationIdToDelete] = useState(null);
  const [showAlternateView, setShowAlternateView] = useState(false);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    destinationName: "",
    destImage: "",
    additionalImages: [],
    description: "",
  });
  const [publishError, setPublishError] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activityInput, setActivityInput] = useState("");
  const [additionalImageUploadProgress, setAdditionalImageUploadProgress] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(`/api/destination/get-dest`);
        const data = await res.json();
        if (res.ok) {
          setDestinationsList(data.destinations);
          if (data.destinations.length < 10) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchDestinations();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = destinationsList.length;
    try {
      const res = await fetch(
        `/api/destination/get-dest?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setDestinationsList((prev) => [...prev, ...data.destinations]);
        if (data.destinations.length < 10) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletedestination = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/destination/delete-dest/${destinationIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setDestinationsList((prev) =>
          prev.filter(
            (destination) => destination._id !== destinationIdToDelete
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

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
    const updatedFormData = {
      ...formData,
      activities,
      additionalImages: formData.additionalImages || [],
    };

    try {
      const res = await fetch("/api/destination/create-dest", {
        method: "POST",
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

      setPublishError(null);
      navigate(`/destinations/${data.slug}`);
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };
  return (
    <section className="w-full">
      {showAlternateView ? (
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center my-4 sm:my-7 gap-4">
            <h1 className="text-center sm:text-left text-2xl sm:text-3xl font-semibold">
              Create a new Destination
            </h1>
            <button
              className="w-full sm:w-auto bg-[#F4AC20] text-white py-2 px-6 rounded-lg hover:bg-[#f49120]"
              onClick={() => setShowAlternateView(false)}
            >
              Hide Form
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="w-full">
              <TextInput
                type="text"
                placeholder="Destination Name"
                required
                id="title"
                className="w-full"
                onChange={(e) =>
                  setFormData({ ...formData, destinationName: e.target.value })
                }
              />
            </div>

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
                        setFormData({
                          ...formData,
                          destImage: downloadURL,
                        });
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

            {imageUploadError && (
              <Alert color="failure">{imageUploadError}</Alert>
            )}

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
            alt={`upload-${index}`}
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

            <div className="min-h-[300px]">
              <ReactQuill
                theme="snow"
                placeholder="Description"
                className="h-72 mb-12"
                required
                onChange={(value) => {
                  setFormData({ ...formData, description: value });
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2 items-center">
                <TextInput
                  type="text"
                  placeholder="Add an activity"
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
                  Add Activities
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
              Add Destination
            </Button>

            {publishError && (
              <Alert className="mt-5" color="failure">
                {publishError}
              </Alert>
            )}
          </form>
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col sm:flex-row justify-between items-center px-4 sm:px-16 my-4 gap-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              <span className="text-[#F4AC20]">ALL</span> DESTINATIONS
            </h2>
            <button
              className="w-full sm:w-auto bg-[#F4AC20] text-white py-2 px-6 rounded-lg hover:bg-[#f49120]"
              onClick={() => setShowAlternateView(true)}
            >
              Create a new Destination
            </button>
          </div>

          <div className="w-full overflow-x-auto px-4 sm:px-6">
            {currentUser.isAdmin && destinationsList.length > 0 ? (
              <>
                <div className="min-w-full">
                  <Table hoverable className="shadow-md">
                    <Table.Head>
                      <Table.HeadCell className="whitespace-nowrap">
                        Image
                      </Table.HeadCell>
                      <Table.HeadCell className="whitespace-nowrap">
                        Name
                      </Table.HeadCell>
                      <Table.HeadCell className="whitespace-nowrap">
                        Edit
                      </Table.HeadCell>
                      <Table.HeadCell className="whitespace-nowrap">
                        Delete
                      </Table.HeadCell>
                    </Table.Head>
                    {destinationsList.map((destination) => (
                      <Table.Body className="divide-y" key={destination._id}>
                        <Table.Row className="bg-white">
                          <Table.Cell>
                            <Link to={`/destinations/${destination.slug}`}>
                              <img
                                src={destination.destImage}
                                alt={destination.destinationName}
                                className="w-20 h-10 object-cover bg-gray-500"
                              />
                            </Link>
                          </Table.Cell>
                          <Table.Cell>
                            <Link
                              className="font-medium text-gray-900"
                              to={`/destinations/${destination.slug}`}
                            >
                              {destination.destinationName}
                            </Link>
                          </Table.Cell>
                          <Table.Cell>
                            <Link
                              className="text-teal-500 hover:underline"
                              to={`/update-destination/${destination._id}`}
                            >
                              <span>Edit</span>
                            </Link>
                          </Table.Cell>
                          <Table.Cell>
                            <span
                              onClick={() => {
                                setShowModal(true);
                                setDestinationIdToDelete(destination._id);
                              }}
                              className="font-medium text-red-500 hover:underline cursor-pointer"
                            >
                              Delete
                            </span>
                          </Table.Cell>
                          
                        </Table.Row>
                      </Table.Body>
                    ))}
                  </Table>
                </div>
                {showMore && (
                  <button
                    onClick={handleShowMore}
                    className="w-full text-teal-500 self-center text-sm py-4"
                  >
                    Show more
                  </button>
                )}
              </>
            ) : (
              <p className="text-center text-lg py-4 animate-pulse">Loading...!</p>
            )}
          </div>

          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
                <h3 className="mb-5 text-lg text-gray-500">
                  Are you sure you want to delete this destination?
                </h3>
                <div className="flex justify-center gap-4">
                  <Button color="failure" onClick={handleDeletedestination}>
                    Yes, I'm sure
                  </Button>
                  <Button color="gray" onClick={() => setShowModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </section>
  );
}
