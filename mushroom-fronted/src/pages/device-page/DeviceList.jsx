import { PencilIcon, TrashIcon, EyeIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";

const DeviceList = ({ devices, handleEdit, handleDelete }) => {

    const navigate = useNavigate();

    const handleView = (device_id, farm_id) => {
        navigate(`/view-pot?device_id=${device_id}&farm=${farm_id}`);
    }

    return (

        <div className="w-full overflow-x-auto">
            <div className="min-w-[700px] max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4">
                <table className="w-full table-auto border-collapse text-sm">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="p-3 text-left">Robot Name</th>
                            <th className="p-3 text-left">Type</th>
                            <th className="p-3 text-left">Farm</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-center w-[140px]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device) => (
                            <tr key={device.device_id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{device.device_name}</td>
                                <td className="p-3">
                                    {device.device_type === "cultivation"
                                        ? "โรงเพาะ"
                                        : device.device_type === "growing"
                                            ? "โรงปลูก"
                                            : "ไม่ทราบสถานะ"}
                                </td>

                                <td className="p-3">{device.farm_name}</td>
                                <td className="p-3 font-medium">
                                    {["true", "active", "1"].includes(String(device.status).toLowerCase()) ? (
                                        <span className="text-green-600">Robot active</span>
                                    ) : (
                                        <span className="text-red-600">Robot inactive</span>
                                    )}
                                </td>
                                <td className="p-3 text-center">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            className="bg-green-500 text-white p-2 rounded-lg shadow hover:bg-green-600 transition"
                                            onClick={() => handleView(device.device_id, device.Farm?.farm_id)}
                                            title="View"
                                        >
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white p-2 rounded-lg shadow hover:bg-blue-600 transition"
                                            onClick={() => handleEdit(device)}
                                            title="Edit"
                                        >
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button
                                            className="bg-red-500 text-white p-2 rounded-lg shadow hover:bg-red-600 transition"
                                            onClick={() => handleDelete(device.device_id)}
                                            title="Delete"
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
        </div>

    );
};

export default DeviceList;