import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ViewPotList from "./ViewPotList";
import ViewPotForm from "./ViewPotForm";
import {
  XIcon,
  PlusIcon,
  MinusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/solid";

const NODE_RED_URL = import.meta.env.VITE_NODE_RED;





const ViewPot = () => {
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get("device_id");
  const farmID = searchParams.get("farm");

  const [pots, setPots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPot, setCurrentPot] = useState(null);


  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImages, setCurrentImages] = useState({ robot: "", ai: "" });
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [rotation, setRotation] = useState(90);
  const [rotation2, setRotation2] = useState(90);
  const [scale, setScale] = useState(0.6);
  const [scale2, setScale2] = useState(0.6);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = currentImage;
    link.download = "image.jpg";
    link.click();
  };


  useEffect(() => {
    if (deviceId) {
      getPotByDeviceID();
    }
  }, [deviceId]);

  const getPotByDeviceID = async () => {
    try {
      // const response = await axios.get(
      //   `http://172.17.64.1:1880/get_pot_from_device/${deviceId}`
      // );
      const response = await axios.get(`${NODE_RED_URL}/get_pot_from_device/${deviceId}`);
      setPots(response.data || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching pots:", error);
      setError("Failed to load pots.");
    } finally {
      setLoading(false);
    }
  };



  const handleView = (imgRobot, imgAI) => {
    const robotSrc = imgRobot?.startsWith("data:image")
      ? imgRobot
      : `data:image/jpeg;base64,${imgRobot}`;

    const aiSrc = imgAI?.startsWith("data:image")
      ? imgAI
      : `data:image/jpeg;base64,${imgAI}`;

    setCurrentImages({ robot: robotSrc, ai: aiSrc });
    setShowImageModal(true);
  };


  const handleEdit = (pot) => {
    setCurrentPot(pot);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      // await axios.delete(`http://172.17.64.1:1880/del_pot/${deviceId}/${id}`);
      await axios.delete(`${NODE_RED_URL}/del_pot/${deviceId}/${id}`);
      getPotByDeviceID(); // Refresh the list
    } catch (error) {
      console.error("Error deleting pot:", error);
      alert("Failed to delete pot");
    }
  };

  const handleFormSubmit = async (formData) => {
    console.log("Submitting:", formData);
    try {
      if (formData.pot_id) {
        // Update existing pot
        // await axios.put(
        //   `http://172.17.64.1:1880/edit_pot/${formData.pot_id}`,
        //   formData
        // );
        await axios.put(`${NODE_RED_URL}/edit_pot/${formData.pot_id}`, formData);
      } else {
        // Create new pot
        // await axios.post("http://172.17.64.1:1880/add_pot", {
        //   ...formData,
        //   device: parseInt(deviceId),
        //   farm: parseInt(farmID),
        // });
        await axios.post(`${NODE_RED_URL}/add_pot`, {
          ...formData,
          device: parseInt(deviceId),
          farm: parseInt(farmID),
        });
      }
      getPotByDeviceID(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      console.error("Error saving pot:", error);
      alert("Failed to save pot");
    }
  };

  const filteredPots = pots.filter((pot) => {
    const matchStatus = selectedStatus === "" || pot.status === selectedStatus;
    const matchSearch =
      search === "" ||
      pot.pot_name?.toLowerCase().includes(search.toLowerCase()) ||
      String(pot.typepot)?.toLowerCase().includes(search.toLowerCase()) ||
      String(pot.cultivation_pot_id)?.includes(search);

    return matchStatus && matchSearch;
  });


  const rotateLeft = () => {
    setRotation((prev) => prev - 90);
  };

  const rotateRight = () => {
    setRotation((prev) => prev + 90);
  };

  const zoomIn = () => {
    setScale((prev) => prev + 0.2);
  };

  const zoomOut = () => {
    setScale((prev) => (prev > 0.4 ? prev - 0.2 : 0.2));
  };


  const rotateLeft2 = () => {
    setRotation2((prev) => prev - 90);
  };

  const rotateRight2 = () => {
    setRotation2((prev) => prev + 90);
  };

  const zoomIn2 = () => {
    setScale2((prev) => prev + 0.2);
  };

  const zoomOut2 = () => {
    setScale2((prev) => (prev > 0.4 ? prev - 0.2 : 0.2));
  };






  return (
    <div className="p-8 bg-gray-100 min-h-screen flex font-title flex-col items-center">
      <h1 className="text-3xl font-semibold text-gray-800">Pot Management</h1>
      <div className="flex flex-col md:flex-row justify-between mt-4">
        <div className="w-full max-w-6xl flex flex-wrap justify-between items-center gap-3 mb-6">
          {/* Left side: Back button + Device ID */}
          <div className="flex items-center gap-2">
            <button
              className="text-gray-700 hover:text-gray-900 text-2xl"
              onClick={() => navigate(-1)}
            >
              ←
            </button>
            <h1 className="text-2xl font-semibold mr-40 text-gray-800">
              Robot: {deviceId || "N/A"}
            </h1>
          </div>

          {/* Right side: Input + Select + Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by Pot id, and type"
              className="p-3 w-full sm:w-96 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="p-3 w-full sm:w-auto border rounded-lg shadow-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Filter by status</option>
              <option value="pending">Pending</option>
              <option value="safe">Safe</option>
              <option value="danger">Danger</option>
            </select>
            <button
              className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition mt-4 sm:mt-0 flex justify-center items-center w-full sm:w-auto"
              title="Add new pot"
              onClick={() => {
                setCurrentPot(null);
                setShowForm(true);
              }}
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 mt-4">Loading...</p>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        <ViewPotList
          data={filteredPots}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <ViewPotForm
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          defaultData={currentPot}
          cultivationId={[]}
        />
      )}

      {/* Image View Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center px-4">
          <div className="relative bg-white rounded-xl shadow-xl inline-block overflow-auto max-w-[95vw] max-h-[90vh] p-2">

            {/* ปุ่มปิด */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              title="Close"
            >
              <XIcon className="w-6 h-6" />
            </button>

            {/* ปุ่มควบคุม */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-3 bg-white px-5 py-2 rounded-full shadow-lg z-10">
              <button onClick={rotateLeft} title="Rotate Left">
                <ChevronLeftIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
              </button>
              <button onClick={rotateRight} title="Rotate Right">
                <ChevronRightIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
              </button>
              <button onClick={zoomIn} title="Zoom In">
                <PlusIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
              </button>
              <button onClick={zoomOut} title="Zoom Out">
                <MinusIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
              </button>
              <hr className="my-6 border-black" />

              <button onClick={rotateLeft2} title="Rotate Left AI">
                <ChevronLeftIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
              </button>
              <button onClick={rotateRight2} title="Rotate Right AI">
                <ChevronRightIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
              </button>
              <button onClick={zoomIn2} title="Zoom In AI">
                <PlusIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
              </button>
              <button onClick={zoomOut2} title="Zoom Out AI">
                <MinusIcon className="w-5 h-5 text-gray-700 hover:text-blue-600" />
              </button>

              {/* <button onClick={handleDownload} title="Download">
                <XIcon className="w-5 h-5 text-gray-700 hover:text-green-600" />
              </button> */}
            </div>

            {/* ภาพ */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 p-6">
              {currentImages.robot && (
                <div className="text-center">
                  <p className="mb-2 font-semibold">ภาพจากหุ่นยนต์</p>
                  <img
                    src={currentImages.robot}
                    alt="Robot"
                    className="rounded-lg border"
                    style={{
                      transform: `rotate(${rotation}deg) scale(${scale})`,
                      maxWidth: "100%",
                      maxHeight: "70vh",
                    }}
                  />
                </div>
              )}

              {currentImages.ai && (
                <div className="text-center">
                  <p className="mb-2 font-semibold">ภาพจาก AI</p>
                  <img
                    src={currentImages.ai}
                    alt="AI"
                    className="rounded-lg border"
                    style={{
                      transform: `rotate(${rotation2}deg) scale(${scale2})`,
                      maxWidth: "100%",
                      maxHeight: "70vh",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default ViewPot;
