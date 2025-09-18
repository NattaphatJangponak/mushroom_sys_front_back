import { XIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import axios from "axios";

const PRISMA_URL = import.meta.env.VITE_PRISMA;


const DeviceForm = ({
    form,
    setForm,
    handleAddEdit,
    closeModal,
    isEditing,
}) => {

    const [farms, setFarms] = useState([]);

    useEffect(() => {
        getAllFarms()
    }, [])

    async function getAllFarms() {
        try {
            // const response = await axios.get("http://172.17.64.1:5000/api/farm");
            const response = await axios.get(`${PRISMA_URL}/api/farm`);

            setFarms(response.data.data || []);
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {isEditing ? "Edit Device" : "Add Device"}
                    </h2>
                    <button onClick={closeModal}>
                        <XIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Device Name"
                    className="w-full p-2 border rounded mb-3"
                    value={form.device_name}
                    onChange={(e) => setForm({ ...form, device_name: e.target.value })}
                    required
                />

                {/* <textarea
                    placeholder="Description"
                    className="w-full p-2 border rounded mb-3"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                /> */}

                {/* Farm Selection Dropdown */}
                <select
                    className="w-full p-2 border rounded mb-3"
                    value={form.farm_id}
                    onChange={(e) => setForm({ ...form, farm_id: e.target.value })}
                    required
                >
                    <option value="">Select Farm</option>
                    {farms.map(farm => (
                        <option key={farm.farm_id} value={farm.farm_id}>
                            {farm.farm_name}
                        </option>
                    ))}
                </select>

                <select
                    className="w-full p-2 border rounded mb-3"
                    value={form.device_type}
                    onChange={(e) => setForm({ ...form, device_type: e.target.value })}
                    required
                >
                    <option value="">Select Type</option>
                    <option value="cultivation">เครื่องเพาะ</option>
                    <option value="growing">เครื่องปลูก</option>
                </select>

                <select
                    className="w-full p-2 border rounded mb-3"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    required
                >
                    <option value="">Select Device</option>
                    <option value="active">Robot active</option>
                    <option value="inactive">Robot inactive</option>
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
                        {isEditing ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeviceForm;