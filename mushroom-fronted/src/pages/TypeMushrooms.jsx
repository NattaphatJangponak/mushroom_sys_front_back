import { useState, useEffect } from "react";
import axios from "axios";
import { PencilIcon, TrashIcon, PlusIcon, XIcon } from "@heroicons/react/solid";

const PotType = () => {
    const [potTypes, setPotTypes] = useState([]);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ type_pot_id: "", type_pot_name: "", description: "" });
    // , status: "inactive"
    const [search, setSearch] = useState("");

    // ✅ โหลดข้อมูล `potType` จาก API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://49.0.81.242:5000/api/mushroom");

                console.log("API Response:", response.data); // ✅ Debug ตรวจสอบ API Response

                if (response.data.success && Array.isArray(response.data.data)) {
                    setPotTypes(response.data.data);
                } else {
                    console.error("Error: Expected an array but got:", response.data);
                    setPotTypes([]);
                }
            } catch (error) {
                console.error("Error fetching pot types:", error.response?.data || error.message);
                setPotTypes([]);
            }
        };

        fetchData();
    }, []);

    // ✅ เพิ่มหรือแก้ไขข้อมูล
    const handleAddEdit = async () => {
        try {
            if (!form.type_pot_name || !form.description ) {
                // || form.status === ""
                alert("Please fill in all fields");
                return;
            }

            const data = {
                type_pot_name: form.type_pot_name,
                description: form.description,
                status: form.status === "active" ? true : false // ✅ แปลงค่า String เป็น Boolean
            };

            let response;
            if (form.type_pot_id) {
                response = await axios.put(`http://49.0.81.242:5000/api/mushroom/${form.type_pot_id}`, data);
            } else {
                response = await axios.post("http://49.0.81.242:5000/api/mushroom", data);
            }

            // ✅ โหลดข้อมูลใหม่หลังจากบันทึก
            const updatedResponse = await axios.get("http://49.0.81.242:5000/api/mushroom");
            if (updatedResponse.data.success && Array.isArray(updatedResponse.data.data)) {
                setPotTypes(updatedResponse.data.data);
            }

            closeModal();
        } catch (error) {
            console.error("Error saving Potrype:", error.response ? error.response.data : error);
        }
    };


    // ✅ แก้ไขข้อมูล
    const handleEdit = (item) => {
        setForm({
            type_pot_id: item.type_pot_id,
            type_pot_name: item.type_pot_name,
            description: item.description || "",
            
        });
        // status: item.status === true ? "true" : "false"// ✅ แปลง Boolean เป็น String
        setModal(true);
    };

    // ✅ ลบข้อมูล
    const handleDelete = async (type_pot_id) => {
        if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบฟาร์มนี้?")) {
            return; 
          }
        
        try {
            await axios.delete(`http://49.0.81.242:5000/api/mushroom/${type_pot_id}`);
            setPotTypes((prev) => prev.filter((item) => item.type_pot_id !== type_pot_id));
        } catch (error) {
            console.error("Error deleting pot type:", error);
        }
    };

    // ✅ ปิด Modal และรีเซ็ตฟอร์ม
    const closeModal = () => {
        setModal(false);
        setForm({ type_pot_id: "", description: "" });
    };
    // , status: "inactive"

    // ✅ ค้นหาและเรียงลำดับข้อมูล
    // const filteredPotTypes = potTypes
    //     .filter(({ type_pot_name }) =>
    //         type_pot_name.toLowerCase().includes(search.toLowerCase())
    //     )
    //     .sort((a, b) => Number(a.type_pot_id) - Number(b.type_pot_id));

    const filteredPotTypes = potTypes.filter(({ type_pot_id, type_pot_name }) => {
        const safePotTypesId = type_pot_id?.toString().toLowerCase() || "";
        const safePotTypesName = type_pot_name?.toLowerCase() || "";
        return (
            safePotTypesId.includes(search.toLowerCase()) ||
            safePotTypesName.includes(search.toLowerCase())

        );
    });
    return (
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Mushroom Type Management</h1>

            {/* 🔍 ค้นหาและเพิ่มข้อมูล */}
            <div className="flex gap-4 mb-6 w-full max-w-3xl items-center">
                <input
                    type="text"
                    placeholder="Search by Mushroom Name"
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

            {/* 📊 ตารางแสดงข้อมูล */}
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            {/* <th className="p-3 text-left">Pot Type ID</th> */}
                            <th className="p-3 text-left">Mushroom Name</th>
                            <th className="p-3 text-left">Description</th>
                            {/* <th className="p-3 text-left">Status</th> */}
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* , status  */}
                        {filteredPotTypes.map(({ type_pot_id, type_pot_name, description}) => (
                            <tr key={type_pot_id} className="border-t">
                                {/* <td className="p-3">{type_pot_id}</td> */}
                                <td className="p-3">{type_pot_name}</td>
                                <td className="p-3">{description}</td>
                                {/* <td className="p-3">{status === true ? 'active' : 'inactive'}</td> */}
                                <td className="p-3 text-center">
                                    <div className="flex justify-center gap-2">
                                        {/* , status */}
                                        <button
                                            className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-600 transition"
                                            onClick={() => handleEdit({ type_pot_id, type_pot_name, description })}
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="bg-red-500 text-white p-2 rounded-lg shadow hover:bg-red-600 transition"
                                            onClick={() => handleDelete(type_pot_id)}
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
                                {form.type_pot_id ? "Edit Pot Type" : "Add New Pot Type"}
                            </h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <XIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Pot Type Name"
                            className="w-full p-2 border rounded mb-3"
                            value={form.type_pot_name}
                            onChange={(e) => setForm({ ...form, type_pot_name: e.target.value })}
                        />
                        <textarea
                            placeholder=" Description"
                            className="w-full p-2 border rounded mb-3"
                            rows="3"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        {/* <select
                            className="w-full p-2 border rounded mb-3"
                            value={form.status}
                            onChange={(e) => setForm({ ...form, status: e.target.value })}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select> */}


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
                                {form.type_pot_id ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PotType;
