import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PencilIcon, TrashIcon, PlusIcon, XIcon } from "@heroicons/react/solid";
 
import { FaEye } from "react-icons/fa";
import axios from "axios";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";

const PRISMA_BASE = import.meta.env.VITE_PRISMA;

const ViewGrowing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const deviceId = searchParams.get("device_id");
  const [imageBase64, setImageBase64] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");


  const growingId = searchParams.get("growing_id");
  const deviceName = searchParams.get("device_name");
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [imageModal, setImageModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [typePotOptions, setTypePotOptions] = useState([]);
  const [form, setForm] = useState({
    growing_pot_id: "",
    type_pot_id: "",
    index: 1,
    img_path: "",
    ai_result: "",
    status: "",
    pot_name: ""
  });


  useEffect(() => {
    if (!growingId) {
      console.warn("⚠️ ไม่มีค่า device_id");
      return;
    }
    // axios
    //   .get(`http://172.17.64.1:5000/api/viewGrowing/${growingId}`)
    axios.get(`${PRISMA_BASE}/api/viewGrowing/${growingId}`)
      .then((response) => {
        console.log("✅ ViewGrowing Data:", response);
        setData(response.data.data || []);
      })
      .catch((error) => console.error("❌ Error fetching data:", error));
  }, [growingId]);

  // useEffect(() => {
  //   axios.get(`http://172.17.64.1:5000/api/viewGrowing/1`)
  //     .then(response => {
  //       setImageBase64(response.data.data[0].img_path);
  //       console.log("🔹 Fetching data for growing_id:", response.data.data);
  //     })
  //     .catch(error => console.error("Error fetching image:", error));
  // }, []);


  const fetchData = async () => {
    if (!growingId) {
      console.warn("⚠️ ไม่มีค่า growing_id");
      return;
    }

    try {
      // const response = await axios.get(`http://172.17.64.1:5000/api/viewGrowing/${String(growingId)}`);
      const response = await axios.get(`${PRISMA_BASE}/api/viewGrowing/${String(growingId)}`);
      console.log("✅ ViewGrowing Data:", response);
      setData(response.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchTypePots = async () => {
      try {
        // const response = await axios.get("http://172.17.64.1:5000/api/mushroom"); // ✅ เปลี่ยนเป็น API `/api/mushroom`
        const response = await axios.get(`${PRISMA_BASE}/api/mushroom`); // ✅ เปลี่ยนเป็น API `/api/mushroom`
        console.log("✅ Type Pots Data:", response.data);

        // ✅ ตรวจสอบว่า response.data.data เป็นอาร์เรย์ก่อน map()
        if (Array.isArray(response.data.data)) {
          setTypePotOptions(response.data.data);
        } else {
          console.error("⚠️ API response is not an array:", response.data);
          setTypePotOptions([]);
        }
      } catch (error) {
        console.error("❌ Error fetching Type Pots:", error.response?.data || error.message);
        setTypePotOptions([]);
      }
    };

    fetchTypePots();
  }, []);

  useEffect(() => {
    fetchData();
  }, [growingId]);



  const handleAddEdit = async () => {
    try {
      if (!form.type_pot_id || !form.status) {
        alert("⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง!");
        return;
      }

      if (!growingId) {
        console.error("❌ cultivationId is null or undefined!");
        return;
      }

      const data = {
        // cultivation_id: Number(cultivationId), // ✅ FK เชื่อมกับ `cultivation`
        type_pot_id: Number(form.type_pot_id), // ✅ ID ของประเภทหม้อ
        index: form.index || 1, // ✅ ถ้าไม่มีค่าให้ใช้ `1`
        img_path: form.img_path || null, // ✅ ค่าเริ่มต้นเป็น `null`
        ai_result: form.ai_result || null, // ✅ ค่าเริ่มต้นเป็น `null`
        status: form.status, // ✅ สถานะของหม้อ
        pot_name: form.pot_name,
        growing_id: Number(growingId)
      };



      console.log("🔹 Data being sent:", data);
      let response;

      if (form.growing_pot_id) {
        alert("🔹 Editing pot with ID:");
        // response = await axios.put(`http://172.17.64.1:5000/api/viewGrowing/${form.growing_pot_id}`, data);
        response = await axios.put(`${PRISMA_BASE}/api/viewGrowing/${form.growing_pot_id}`, data);
      } else {
        console.log("🔹 Adding new pot");
        alert("🔹 Adding new pot");
        // response = await axios.post("http://172.17.64.1:5000/api/viewGrowing", data);
        response = await axios.post(`${PRISMA_BASE}/api/viewGrowing`, data);
      }

      console.log("✅ API Response:", response.data);

      if (response.data.success === true) {
        fetchData(); // ✅ โหลดข้อมูลใหม่หลังจากเพิ่มหรือแก้ไข
        closeModal(); // ✅ ปิด modal
      }

    } catch (error) {
      console.error("❌ Error saving pot:", error.response?.data || error.message);
    }
  };
  const handleDelete = async (growing_pot_id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบฟาร์มนี้?")) {
      return;
    }
    try {
      if (!growing_pot_id) {
        console.error("❌ growing_pot_id is null or undefined!");
        return;
      }

      console.log("🔹 Deleting pot with ID:", growing_pot_id);
      // const response = await axios.delete(`http://172.17.64.1:5000/api/viewGrowing/${growing_pot_id}`);
      const response = await axios.delete(`${PRISMA_BASE}/api/viewGrowing/${growing_pot_id}`);

      console.log("✅ API Response:", response.data);
      if (response.data.success === true) {
        fetchData(); // ✅ โหลดข้อมูลใหม่หลังจากลบ
      }
    } catch (error) {
      console.error("❌ Error deleting pot:", error.response?.data || error.message);
    }
  };

  const filteredItems = data.filter(({ pot_name, typePot, status }) => {
    const safePotName = pot_name ? pot_name.toLowerCase() : "";
    const safeTypePot = typePot?.type_pot_name ? typePot.type_pot_name.toLowerCase() : "";
    const safeStatus = status ? status.toLowerCase() : "";
    const searchTerm = search.toLowerCase();

    return (
      (selectedStatus === "All Status" || safeStatus === selectedStatus.toLowerCase()) &&
      (searchTerm === "" || safePotName.includes(searchTerm) || safeTypePot.includes(searchTerm))
    );
  });


  // const handleHarvest = (potId) =>
  //   console.log(`Harvesting pot with ID: ${potId}`);

  // const handleHarvestAll = () => console.log("Harvesting all pots");

  const handleViewImage = async (growing_pot_id) => {
    try {
      console.log("🔹 Fetching image for growing_pot_id:", growing_pot_id);

      // ตรวจสอบก่อนว่ามี growingId หรือไม่
      if (!growingId) {
        console.warn("⚠️ No growingId provided.");
        return;
      }

      // ใช้ API เดิม
      // const response = await axios.get(`http://172.17.64.1:5000/api/viewGrowing/${growingId}`);
      const response = await axios.get(`${PRISMA_BASE}/api/viewGrowing/${growingId}`);

      if (response.data.success && Array.isArray(response.data.data)) {
        // ค้นหา growing_pot_id ที่ต้องการ
        const potData = response.data.data.find(pot => pot.growing_pot_id === growing_pot_id);

        if (potData && potData.img_path) {
          console.log("✅ Image found, opening modal.");
          setImageBase64(potData.img_path);
          setImageModal(true);
        } else {
          console.warn("⚠️ No image found for this growing pot.");
          setImageBase64(""); // เคลียร์ค่าเก่า
          setImageModal(true); // เปิด modal ถึงแม้ไม่มีภาพ
        }
      } else {
        console.warn("⚠️ API response unsuccessful or data format incorrect.");
      }
    } catch (error) {
      console.error("❌ Error fetching image:", error.message || error);
    }
  };



  const closeImageModal = () => {
    setImageModal(false);
  };

  // const handleDelete = (potId) => console.log(`Deleting pot with ID: ${potId}`);

  const handleEdit = (item) => {
    setForm(item);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setForm({
      growing_pot_id: '',
      type_pot_id: "", // ✅ ประเภทของหม้อ
      index: 1, // ✅ ค่า default เป็น 1
      img_path: "", // ✅ ค่า default เป็น ""
      ai_result: "", // ✅ ค่า default เป็น ""
      status: "", // ✅ ค่า default เป็น ""
      pot_name: ''
    });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-3xl flex items-center mb-6">
        <button
          className="flex items-center text-gray-700 hover:text-gray-900 mr-4"
          onClick={() => navigate(-1)} // Navigate back
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-semibold text-gray-800">
          Devices: {deviceName}
        </h1>
      </div>

      <div className="flex gap-4 mb-6 w-full max-w-3xl items-center">
        <input
          type="text"
          placeholder="Search by Pot Name or Type"
          className="p-3 w-full border rounded-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="p-3 border rounded-lg shadow-sm">
          <option value="">Filter by status</option>
        </select>

        <select
          className="p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="All Status">All Status</option>
          <option value="pending">Pending</option>
          <option value="safe">Safe</option>
          <option value="danger">Danger</option>
        </select>



        {/* <button
          className="bg-green-500 text-white p-3 rounded-lg shadow-md"
          onClick={handleHarvestAll}
        >
          <GiFarmTractor className="w-5 h-5" />
        </button> */}
        <button
          className="bg-blue-500 text-white p-3 rounded-lg shadow-md"
          onClick={() => setModal(true)}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Pot ID</th>
              <th className="p-3 text-left">Pot Name</th>
              {/* <th className="p-3 text-left">Type</th> */}
              <th className="p-3 text-left">Type Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Image</th>
              {/* <th className="p-3 text-center">Harvest</th> */}
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && filteredItems.map(({ growing_pot_id, typePot, type_pot_id, status, pot_name }) => (
              <tr key={growing_pot_id} className="border-t">
                <td className="p-3">{growing_pot_id}</td>
                <td className="p-3">{pot_name}</td>
                <td className="p-3">{typePot?.type_pot_name || "N/A"}</td>
                {/* <td className="p-3">{type_pot_id}</td> */}
                <td className="p-3">{status}</td>
                <td className="p-3 text-center">
                  <button
                    className="bg-gray-500 text-white p-2 rounded-lg"
                    onClick={() => handleViewImage(growing_pot_id)}
                  >
                    <FaEye className="w-5 h-5" />
                  </button>
                </td>
                {/* <td className="p-3 text-center">
                  <button
                    className="bg-green-500 text-white p-2 rounded-lg"
                    onClick={() => handleHarvest(growing_pot_id)}
                  >
                    <GiFarmTractor className="w-5 h-5" />
                  </button>
                </td> */}
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded-lg"
                      onClick={() =>

                        handleEdit({ growing_pot_id, type_pot_id, status, pot_name })
                      }
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-lg"
                      onClick={() => handleDelete(growing_pot_id)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {imageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">View Image</h2>
              <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            {imageBase64 ? (
              <img src={`${imageBase64}`} alt="Growing Pot" className="w-full rounded-lg" />
            ) : (
              <p>No Image Available</p>
            )}
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {form.growing_pot_id ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <input
              disabled={true}
              className="w-full border p-2 mb-4"
              placeholder="Pot ID"
              value={form.growing_pot_id ?? ""}
              onChange={(e) => setForm({ ...form, growing_pot_id: e.target.value })}
            />
            <input
              className="w-full border p-2 mb-4"
              placeholder="Pot Name"
              value={form.pot_name ?? ""} // ✅ ถ้า `id` เป็น `null` ให้ใช้ `""`
              onChange={(e) => setForm({ ...form, pot_name: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded mb-3"
              value={form.type_pot_id || ""}
              onChange={(e) => {
                const selectedPot = typePotOptions.find(pot => pot.type_pot_id === Number(e.target.value));
                setForm({
                  ...form,
                  type_pot_id: selectedPot ? selectedPot.type_pot_id : "",
                  type_pot_name: selectedPot ? selectedPot.type_pot_name : ""
                });
              }}
            >
              <option value="" disabled>Select Pot Type</option>
              {typePotOptions.map(({ type_pot_id, type_pot_name }) => (
                <option key={type_pot_id} value={type_pot_id}>
                  {type_pot_name}
                </option>
              ))}
            </select>
            <select
              className="w-full border p-2 mb-4"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="pending">Pending</option>
              <option value="safe">Safe</option>
              <option value="danger">Danger</option>
            </select>


            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddEdit}
              >
                {form.growing_pot_id ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewGrowing;
