import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import HotelForm from "./hotelpages/InputHotel"; // Ensure this path is correct

const HotelTable = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

 const fetchHotels = async () => {
  try {
    const response = await axios.get("/api/hotels");
    setHotels(response.data.hotels); // Access the `hotels` array
  } catch (error) {
    console.error("Error fetching hotels:", error);
  }
};


  const deleteHotel = async (id) => {
    await axios.delete(`/api/hotels/${id}`);
    fetchHotels();
  };

  const toggleForm = () => {
    setSelectedHotel(selectedHotel ? null : {});
  };

  return (
    <section className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Hotels Management</h2>
        <Button
          className="bg-[#F4AC20] text-white py-1 px-4 rounded-lg hover:bg-[#f49120]"
          onClick={toggleForm}
        >
          {selectedHotel ? "Hide Form" : "Add a Hotel"}
        </Button>
      </div>

      {!selectedHotel && (
        <Table hoverable={true} className="w-full">
          <Table.Head>
            <Table.HeadCell>Hotel Name</Table.HeadCell>
            <Table.HeadCell>City</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {hotels.map((hotel) => (
              <Table.Row key={hotel._id} className="bg-white">
                <Table.Cell>{hotel.name}</Table.Cell>
                <Table.Cell>{hotel.city}</Table.Cell>
                <Table.Cell>
                  <Button
                    color=""
                    style={{ color: "teal" }} // Placeholder for color
                    size="xs"
                    onClick={() => setSelectedHotel(hotel)}
                  >
                    Edit
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button
                    color=""
                    style={{ color: "red" }} // Placeholder for color
                    size="xs"
                    onClick={() => {
                      setShowModal(true);
                      setSelectedHotel(hotel);
                    }}
                  >
                    Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      {selectedHotel && (
        <HotelForm
          onSave={() => {
            toggleForm();
            fetchHotels();
          }}
          initialValues={selectedHotel}
        />
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-red-500 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg font-semibold text-gray-700">
              Are you sure you want to delete this hotel?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  deleteHotel(selectedHotel._id);
                  setShowModal(false);
                  setSelectedHotel(null); // Clear selection after deleting
                }}
              >
                Yes, Delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default HotelTable;
