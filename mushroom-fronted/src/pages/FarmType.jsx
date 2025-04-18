import { useState, useEffect } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon, PlusIcon, XIcon } from "@heroicons/react/solid";

const FarmType = () => {
  const [farms, setFarms] = useState([]); // เก็บข้อมูลฟาร์ม
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    farm_id: "",
    farm_name: "",
    farm_type: "",
    farm_description: "",
    farm_status: "inactive",
  });
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(""); // สำหรับกรองประเภท
  const [selectedStatus, setSelectedStatus] = useState(""); // สำหรับกรองสถานะ

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://49.0.81.242:5000/api/farm"); // โหลด farms.json
        if (Array.isArray(response.data.data)) {
          setFarms(response.data.data);
          console.log("Farms loaded:", response.data); // เช็คข้อมูลใน Console
        } else {
          console.error("Error: farms.json is not an array", response.data);
          setFarms([]);
        }
      } catch (error) {
        console.error("Error fetching farms:", error);
        setFarms([]);
      }
    };
    fetchData();
  }, []);

  const handleAddEdit = async () => {
    try {
      if (
        !form.farm_name ||
        !form.farm_type ||
        !form.farm_description ||
        !form.farm_status
      ) {
        alert("Please fill in all fields");
        return;
      }

      if (form.farm_id) {
        await axios.put(`http://49.0.81.242:5000/api/farm/${form.farm_id}`, form);
      } else {
        await axios.post("http://49.0.81.242:5000/api/farm", form);
      }

      // โหลดข้อมูลใหม่หลังจากบันทึก
      const response = await axios.get("http://49.0.81.242:5000/api/farm");

      // ตรวจสอบว่าข้อมูลที่ได้เป็นอาร์เรย์ก่อน setFarms
      if (Array.isArray(response.data.data)) {
        setFarms(response.data.data);
      } else {
        console.error("Error: Expected an array but got:", response.data);
        setFarms([]); // ป้องกันข้อผิดพลาด
      }

      closeModal();
    } catch (error) {
      console.error(
        "Error saving device:",
        error.response ? error.response.data : error
      );
    }
  };

  // ✅ แก้ไขข้อมูลฟาร์ม
  const handleEdit = (item) => {
    if (!item || typeof item !== "object") {
      console.error("Error: Invalid item selected for editing", item);
      return;
    }

    // ป้องกันค่า undefined ที่อาจทำให้เกิด error
    setForm({
      farm_id: item.farm_id || "",
      farm_name: item.farm_name || "",
      farm_type: item.farm_type || "",
      farm_description: item.farm_description || "",
      farm_status: item.farm_status === true ? "true" : "false",
    });

    // ตรวจสอบค่า farms ก่อนเปิด modal
    if (!Array.isArray(farms)) {
      console.error("Error: farms is not an array", farms);
      return;
    }

    setModal(true);
  };

  // ✅ ลบข้อมูลฟาร์ม
  const handleDelete = async (farm_id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบฟาร์มนี้?")) {
      return;
    }

    try {
      await axios.delete(`http://49.0.81.242:5000/api/farm/${farm_id}`); // เรียก API DELETE

      // อัปเดต State ให้ UI ลบรายการออกทันที
      setFarms((prevFarms) =>
        prevFarms.filter((item) => item.farm_id !== farm_id)
      );
    } catch (error) {
      console.error("Error deleting farm:", error);
    }
  };

  // ✅ ปิด Modal
  const closeModal = () => {
    setModal(false);
    setForm({
      farm_id: "",
      farm_name: "",
      farm_type: "",
      farm_description: "",
      farm_status: "inactive",
    });
  };

  // ✅ ฟิลเตอร์การค้นหา (ปรับปรุงแล้ว)
  const filteredFarms = farms.filter(
    ({ farm_name, farm_type, farm_status }) => {
      // กรองตาม search
      const matchesSearch =
        farm_name.toLowerCase().includes(search.toLowerCase()) ||
        farm_type.toLowerCase().includes(search.toLowerCase());

      // กรองตามประเภท (ถ้ามีการเลือก)
      const matchesType = selectedType ? farm_type === selectedType : true;

      // กรองตามสถานะ (แปลงสถานะให้เป็น string ก่อนเปรียบเทียบ)
      const statusString = String(farm_status).toLowerCase();
      const matchesStatus = selectedStatus
        ? selectedStatus === "active"
          ? ["true", "active", "1"].includes(statusString)
          : ["false", "inactive", "0"].includes(statusString)
        : true;

      return matchesSearch && matchesType && matchesStatus;
    }
  );

  return (
    <div className="p-8 bg-gray-100 min-h-screen font-title flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Farm Management
      </h1>

      {/* 🔍 ค้นหาและเพิ่มข้อมูล */}
      <div className="flex gap-4 mb-6 w-full max-w-3xl items-center">
        <input
          type="text"
          placeholder="Search by Farm Name or Type"
          className="p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="โรงเพาะ">โรงเพาะ</option>
          <option value="โรงปลูก">โรงปลูก</option>
        </select>

        <select
          className="p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">โรงนี้คนใช้งาน</option>
          <option value="inactive">โรงนี้คนไม่ใช้งาน</option>
        </select>

        <button
          onClick={() => setModal(true)}
          className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>

      {/* 📊 ตารางแสดงข้อมูลฟาร์ม */}
      <div className="w-full font-title overflow-x-auto">
        <div className="min-w-[900px] max-w-7xl mx-auto bg-white rounded-lg shadow-md p-4">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-sm text-gray-700">
                <th className="p-3 text-left">Farm Name</th>
                <th className="p-3 text-left">Farm Type</th>
                <th className="p-3 text-left min-w-[200px]">Description</th>
                <th className="p-3 text-left min-w-[160px]">Status</th>
                <th className="p-3 text-center w-[120px]">Temperature</th>
                <th className="p-3 text-center w-[120px]">Humidity</th>
                <th className="p-3 text-center w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFarms.map(
                ({
                  farm_id,
                  farm_name,
                  farm_type,
                  farm_description,
                  farm_status,
                  temperature,
                  humidity,
                }) => (
                  <tr key={farm_id} className="border-t hover:bg-gray-50 text-sm">
                    <td className="p-3">{farm_name}</td>
                    <td className="p-3">{farm_type}</td>
                    <td className="p-3 max-w-[250px] truncate" title={farm_description}>
                      {farm_description}
                    </td>
                    <td className="p-3 font-medium">
                      {["true", "active", "1"].includes(String(farm_status).toLowerCase()) ? (
                        <span className="text-green-600">โรงมีคนใช้งาน</span>
                      ) : (
                        <span className="text-red-600">โรงไม่มีคนใช้งาน</span>
                      )}
                    </td>

                    <td className="p-3 text-center">{temperature}</td>
                    <td className="p-3 text-center">{humidity}</td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-600 transition"
                          onClick={() =>
                            handleEdit({
                              farm_id,
                              farm_name,
                              farm_type,
                              farm_description,
                              farm_status,
                            })
                          }
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          className="bg-red-500 text-white p-2 rounded-lg shadow hover:bg-red-600 transition"
                          onClick={() => handleDelete(farm_id)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Modal สำหรับเพิ่ม/แก้ไขข้อมูล */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {form.farm_id ? "Edit Farm" : "Add New Farm"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Input: Farm Name */}
            <input
              type="text"
              placeholder="Farm Name"
              className="w-full p-2 border rounded mb-3"
              value={form.farm_name}
              onChange={(e) => setForm({ ...form, farm_name: e.target.value })}
            />

            {/* Dropdown: Farm Type */}
            <select
              className="w-full p-2 border rounded mb-3"
              value={form.farm_type}
              onChange={(e) => setForm({ ...form, farm_type: e.target.value })}
            >
              <option value="">Select Farm Type</option>
              <option value="โรงเพาะ">โรงเพาะ</option>
              <option value="โรงปลูก">โรงปลูก</option>
            </select>

            {/* Input: Farm Description */}
            <textarea
              placeholder="Farm Description"
              className="w-full p-2 border rounded mb-3"
              rows="3"
              value={form.farm_description}
              onChange={(e) =>
                setForm({ ...form, farm_description: e.target.value })
              }
            />

            {/* Dropdown: Farm Status */}
            <select
              className="w-full p-2 border rounded mb-3"
              value={form.farm_status}
              onChange={(e) =>
                setForm({ ...form, farm_status: e.target.value })
              }
            >
              <option value="">Select Status</option>
              <option value={true}>โรงนี้คนใช้งาน</option>
              <option value={false}>โรงนี้คนไม่ใช้งาน</option>
            </select>

            {/* Action Buttons */}
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

export default FarmType;
