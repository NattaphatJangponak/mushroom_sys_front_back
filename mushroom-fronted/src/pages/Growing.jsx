import { useState, useEffect } from "react";
import axios from "axios";
import {
  PencilIcon,
  EyeIcon,
  TrashIcon,
  PlusIcon,
  XIcon,
} from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";

const PRISMA_URL = import.meta.env.VITE_PRISMA;


const Growing = () => {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    device_name: "",
    mushroom_farm_name: "",
  });
  const [search, setSearch] = useState("");
  const [selectedFarm, setSelectedFarm] = useState("");
  const [devices, setDevices] = useState([]);
  const [farms, setFarms] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchData = async () => {
      try {
        const [devicesRes, farmsRes, growingRes] = await Promise.all([
          // axios.get("http://172.17.64.1:5000/api/device"),
          // axios.get("http://172.17.64.1:5000/api/farm"),
          // axios.get("http://172.17.64.1:5000/api/growing")
          axios.get(`${PRISMA_URL}/api/device`),
          axios.get(`${PRISMA_URL}/api/farm`),
          axios.get(`${PRISMA_URL}/api/growing`)
        ]);

        console.log("Devices API Response:", devicesRes.data);
        console.log("Farms API Response:", farmsRes.data);
        console.log("Growing API Response:", growingRes.data);

        setDevices(devicesRes.data.data || []);

        setFarms(farmsRes.data.data || []);

        const deviceMap = devicesRes.data.data.reduce((acc, { device_id, device_name }) => {
          acc[device_id] = device_name;
          return acc;
        }, {});

        const mappedItems = growingRes.data.data.map((item) => ({
          ...item,

          device_name: deviceMap[item.device_id] || "Unknown Device",
          mushroom_farm_name: farmsRes.data.data.find(f => f.farm_id === item.farm_id)?.farm_name || "Unknown Farm"
        }));

        setItems(mappedItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!form.device_name && devices.length > 0) {
      setForm((prev) => ({ ...prev, device_name: devices[0].device_name }));
    }
    if (!form.mushroom_farm_name && farms.length > 0) {
      setForm((prev) => ({ ...prev, mushroom_farm_name: farms[0].farm_name }));
    }
  }, [devices, farms]); // ✅ ทำงานเมื่อ devices หรือ farms เปลี่ยน

  const handleAddEdit = async () => {
    try {
      if (!form.device_name || !form.mushroom_farm_name) {
        alert("Please fill in all fields");
        return;
      }

      const data = {
        device_id: devices.find((d) => d.device_name === form.device_name)?.device_id,
        farm_id: farms.find((f) => f.farm_name === form.mushroom_farm_name)?.farm_id
      };

      console.log("🔹 Data being sent:", data);
      let response;
      if (form.id) {
        console.log("🔹 Editing cultivation with ID:", form.id);
        // response = await axios.put(`http://172.17.64.1:5000/api/growing/${form.id}`, data);
        response = await axios.put(`${PRISMA_URL}/api/growing/${form.id}`, data);
      } else {
        // response = await axios.post("http://172.17.64.1:5000/api/growing", data);
        response = await axios.post(`${PRISMA_URL}/api/growing`, data);
      }

      console.log("✅ API Response:", response.data);

      if (response.data.success === true) {

        // const updatedResponse = await axios.get("http://172.17.64.1:5000/api/growing");
        const updatedResponse = await axios.get(`${PRISMA_URL}/api/growing`);
        setItems(updatedResponse.data.data);
        closeModal();
        window.location.reload();
      }

    } catch (error) {
      console.error("❌ Error saving growing:", error.response?.data || error.message);
    }
  };

  const handleEdit = (item) => {
    setForm({
      id: item.growing_id,  // ✅ ใช้ `cultivation_id` เป็น `id`
      device_name: item.device_name,
      mushroom_farm_name: item.mushroom_farm_name
    });
    setModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบฟาร์มนี้?")) {
      return; 
    }
    try {
      // await axios.delete(`http://172.17.64.1:5000/api/growing/${id}`);
      await axios.delete(`${PRISMA_URL}/api/growing/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item.growing_id !== id));
    } catch (error) {
      console.error("Error deleting growing:", error);
    }
  };

  const closeModal = () => {
    setModal(false);
    setForm({ id: null, device_name: "", mushroom_farm_name: "" });
  };

  const filteredItems = items.filter(({ device_name, mushroom_farm_name }) => {
    const safeDeviceName = device_name ? device_name.toLowerCase() : "";  // ✅ ตรวจสอบก่อนใช้
    const safeFarmName = mushroom_farm_name ? mushroom_farm_name.toLowerCase() : ""; // ✅ ตรวจสอบก่อนใช้

    return (
      (selectedFarm === "" ||
        selectedFarm === "All Farms" ||
        mushroom_farm_name === selectedFarm) &&
      (safeDeviceName.includes(search.toLowerCase()) ||
        safeFarmName.includes(search.toLowerCase()))
    );
  });

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Growing Management
      </h1>

      <div className="flex gap-4 mb-6 w-full max-w-3xl items-center">
        <input
          type="text"
          placeholder="Search by Device Name or Farm Name"
          className="p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={selectedFarm}
          onChange={(e) => setSelectedFarm(e.target.value)}
        >
          <option value="All Farms">All Farms</option>
          {farms.map(({ farm_name }, index) => (
            <option key={index} value={farm_name}>
              {farm_name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setModal(true)}
          className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Device Name</th>
              <th className="p-3 text-left">Mushroom Farm Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(
              ({ growing_id, device_name, mushroom_farm_name }) => (
                <tr key={growing_id} className="border-t">
                  <td className="p-3">{growing_id}</td>
                  <td className="p-3">{device_name}</td>
                  <td className="p-3">{mushroom_farm_name}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-600 transition"
                        onClick={() =>
                          handleEdit({ growing_id, device_name, mushroom_farm_name })
                        }
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="bg-red-500 text-white p-2 rounded-lg shadow hover:bg-red-600 transition"
                        onClick={() => handleDelete(id)}
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="bg-green-500 text-white p-2 rounded-lg shadow hover:bg-green-600 transition"
                        onClick={() =>
                          navigate(`/mushroom-growing/view/?growing_id=${growing_id}&device_name=${device_name}`)
                        }
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {form.id ? "Edit Item" : "Add New Item"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <select
              className="w-full p-2 border rounded mb-3"
              value={form.device_name || (devices.length > 0 ? devices[0].device_name : "")} // ✅ ตั้งค่า default เป็นตัวแรก
              onChange={(e) =>
                setForm({ ...form, device_name: e.target.value })
              }
            >
              {devices.map(({ device_name }, index) => (
                <option key={index} value={device_name}>
                  {device_name}
                </option>
              ))}
            </select>

            <select
              className="w-full p-2 border rounded mb-3"
              value={form.mushroom_farm_name || (farms.length > 0 ? farms[0].farm_name : "")} // ✅ ตั้งค่า default เป็นตัวแรก
              onChange={(e) =>
                setForm({ ...form, mushroom_farm_name: e.target.value })
              }
            >
              {farms.map(({ farm_name }, index) => (
                <option key={index} value={farm_name}>
                  {farm_name}
                </option>
              ))}
            </select>


            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {form.id ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Growing;
