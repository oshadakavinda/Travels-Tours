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
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashTravelPlan() {
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [bookingList, setBookingList] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingIdToDelete, setBookingIdToDelete] = useState(null);
  const [startIndex, setStartIndex] = useState(0); // Track start index

  useEffect(() => {
    fetchTripPlans(); // Initial fetch when component mounts
  }, []);

  const fetchTripPlans = async (newStartIndex = 0) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/trip-plan/user-trips?startIndex=${newStartIndex}&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch travel plans");
      }

      if (newStartIndex === 0) {
        setBookingList(data.tripPlans);
      } else {
        setBookingList((prev) => [...prev, ...data.tripPlans]);
      }
      setStartIndex(newStartIndex + 10);
      setShowMore(data.tripPlans.length === 10);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching travel plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    try {
      const res = await fetch(`/api/trip-plan/delete/${bookingIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error deleting booking");
      }
      // Update the booking list by filtering out the deleted booking
      setBookingList((prev) =>
        prev.filter((booking) => booking._id !== bookingIdToDelete)
      );

      setShowModal(false);
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col sm:flex-row justify-between items-center px-4 sm:px-16 my-4 gap-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          <span className="text-[#F4AC20]">ALL</span> Bookings
        </h2>
      </div>

      <div className="w-full overflow-x-auto px-4 sm:px-6">
        {bookingList.length > 0 ? (
          <>
            <div className="min-w-full">
              <Table hoverable className="shadow-md">
                <Table.Head>
                  <Table.HeadCell>Booking ID</Table.HeadCell>
                  <Table.HeadCell>Contact Number</Table.HeadCell>
                  <Table.HeadCell>Arrival Date</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {bookingList.map((booking) => (
                    <Table.Row
                      key={booking._id}
                      className="bg-white hover:bg-gray-100 cursor-pointer"
                    >
                      <Table.Cell>
                        <Link
                          to={`/dashboard/booking/${booking._id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {booking._id}
                        </Link>
                      </Table.Cell>

                      <Table.Cell>{booking.mobileNumber}</Table.Cell>
                      <Table.Cell>
                        {new Date(booking.arrivalDate).toLocaleDateString()}
                      </Table.Cell>

                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true);
                            setBookingIdToDelete(booking._id);
                          }}
                          className="font-medium text-red-500 hover:underline cursor-pointer"
                        >
                          Delete
                        </span>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
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
              Are you sure you want to delete this booking?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteBooking}>
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
  );
}
