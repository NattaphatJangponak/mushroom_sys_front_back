import { useState, useEffect } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon, PlusIcon, XIcon } from "@heroicons/react/solid";

const Device = () => {
  const [devices, setDevices] = useState([]); // เก็บข้อมูลอุปกรณ์
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ device_id: "", device_name: "", description: "", status: "inactive" });
  const [search, setSearch] = useState("");

  // ✅ โหลดข้อมูล `devices` จาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/device");

        if (Array.isArray(response.data.data)) { // ✅ ตรวจสอบว่าเป็น array
          setDevices(response.data.data);
        } else {
          console.error("Error: Expected an array but got:", response.data);
          setDevices([]); // ป้องกันข้อผิดพลาด
        }
      } catch (error) {
        console.error("Error fetching devices:", error);
        setDevices([]);
      }
    };
    fetchData();
  }, []);



  // ✅ เพิ่มหรือแก้ไขข้อมูลอุปกรณ์
  const handleAddEdit = async () => {
    try {
      // ✅ ตรวจสอบว่ากรอกข้อมูลครบ
      if (!form.device_name || !form.description || !form.status) {
        alert("Please fill in all fields");
        return;
      }

      let response;
      if (form.device_id) {
        response = await axios.put(`http://localhost:5000/api/device/${form.device_id}`, form);
      } else {
        response = await axios.post("http://localhost:5000/api/device", {
          device_name: form.device_name,
          description: form.description,
          device_type: form.device_type,
          status: form.status
        });
      }

      // ✅ โหลดข้อมูลใหม่หลังจากเพิ่ม
      const updatedDevices = await axios.get("http://localhost:5000/api/device");
      if (Array.isArray(updatedDevices.data.data)) {
        setDevices(updatedDevices.data.data);
      }

      closeModal();
    } catch (error) {
      console.error("Error saving device:", error.response ? error.response.data : error);
    }
  };


  // ✅ แก้ไขข้อมูลอุปกรณ์
  const handleEdit = (item) => {
    setForm(item);
    setModal(true);
  };

  // ✅ ลบข้อมูลอุปกรณ์
  const handleDelete = async (device_id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบฟาร์มนี้?")) {
      return; 
    }
    try {
      await axios.delete(`http://localhost:5000/api/device/${device_id}`);
      setDevices((prevDevices) => prevDevices.filter((item) => item.device_id !== device_id));
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  // ✅ ปิด Modal
  const closeModal = () => {
    setModal(false);
    setForm({ device_id: "", device_name: "", description: "", device_type: "", status: "inactive" });
  };

  const filteredDevices = devices.filter(({ device_id, device_name, farm_type, device_type }) => {
    const safeDeviceId = device_id?.toString().toLowerCase() || "";
    const safeDeviceName = device_name?.toLowerCase() || "";
    const safeFarmType = farm_type?.toLowerCase() || "";
    const safeDeviceType = device_type?.toLowerCase() || "";

    return (
      safeDeviceId.includes(search.toLowerCase()) ||
      safeDeviceName.includes(search.toLowerCase()) ||
      safeFarmType.includes(search.toLowerCase()) ||
      safeDeviceType.includes(search.toLowerCase())
    );
  });



  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Device Management</h1>

      {/* 🔍 ค้นหาและเพิ่มข้อมูล */}
      <div className="flex gap-4 mb-6 w-full max-w-3xl items-center">
        <input
          type="text"
          placeholder="Search by ID, Name, Description, Status"
          className="p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => setModal(true)}
          className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 📊 ตารางแสดงข้อมูลอุปกรณ์ */}
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Device ID</th>
              <th className="p-3 text-left">Device Name</th>
              <th className="p-3 text-left">Device Type</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map(({ device_id, device_name, description, status, device_type }) => (
              <tr key={device_id} className="border-t">
                <td className="p-3">{device_id}</td>
                <td className="p-3">{device_name}</td>
                <td className="p-3">{device_type === 'cultivation' ? 'เครื่องเพาะ' : 'เครื่องปลูก'}</td>
                <td className="p-3">{description}</td>
                <td className="p-3">
                  {["true", "active", "1"].includes(String(status).toLowerCase()) ? "Active" : "Inactive"}
                </td>



                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-600 transition"
                      onClick={() => handleEdit({ device_id, device_name, description, status, device_type })}
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      className="bg-red-500 text-white p-2 rounded-lg shadow hover:bg-red-600 transition"
                      onClick={() => handleDelete(device_id)}
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

      {/* 📌 Modal สำหรับเพิ่ม/แก้ไขข้อมูล */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {form.device_id ? "Edit Device" : "Add New Device"}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Device Name"
              className="w-full p-2 border rounded mb-3"
              value={form.device_name}
              onChange={(e) => setForm({ ...form, device_name: e.target.value })}
            />

            <textarea
              placeholder=" Description"
              className="w-full p-2 border rounded mb-3"
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <select
              className="w-full p-2 border rounded mb-3"
              value={form.device_type}
              onChange={(e) => setForm({ ...form, device_type: e.target.value })}
            >
              <option value="">Select Device Type</option>
              <option value="cultivation">เครื่องเพาะ</option>
              <option value="growing">เครื่องปลูก</option>
            </select>

            <select
              className="w-full p-2 border rounded mb-3"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>



            {/* ✅ Action Buttons */}
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
                {form.farm_id ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Device;
