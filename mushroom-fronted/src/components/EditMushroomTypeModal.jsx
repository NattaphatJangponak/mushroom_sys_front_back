import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditMushroomTypeModal({ isOpen, onClose }) {
    const [mushroomTypes, setMushroomTypes] = useState([
        { id: "01", type: "POM", status: "Check" },
        { id: "02", type: "OM", status: "Check" },
        { id: "03", type: "AM", status: "Check" },
    ]);
    const navigate = useNavigate();
    const mushroomOptions = ["POM", "OM", "AM", "SHI", "BTN"];

    const handleTypeChange = (index, newType) => {
        const updatedList = [...mushroomTypes];
        updatedList[index].type = newType;
        setMushroomTypes(updatedList);
    };

    const removeMushroomType = (index) => {
        const updatedList = mushroomTypes.filter((_, i) => i !== index);
        setMushroomTypes(updatedList);
    };

    const addMushroomType = () => {
        setMushroomTypes([
            ...mushroomTypes,
            { id: String(mushroomTypes.length + 1).padStart(2, "0"), type: "", status: "Check" },
        ]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[70vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Edit Type Mushroom</h2>

                {/* Table Layout */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Type Mushroom</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mushroomTypes.map((mushroom, index) => (
                                <tr key={index} className="text-center">
                                    {/* ID (Read-Only) */}
                                    <td className="border px-4 py-2">{mushroom.id}</td>

                                    {/* Dropdown Type Mushroom */}
                                    <td className="border px-4 py-2">
                                        <select
                                            value={mushroom.type}
                                            onChange={(e) => handleTypeChange(index, e.target.value)}
                                            className="border border-gray-300 rounded-md px-2 py-1"
                                        >
                                            {mushroomOptions.map((option, idx) => (
                                                <option key={idx} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Status Mushroom */}
                                    <td className="border px-4 py-2">
                                        <button
                                            className="px-4 py-1 bg-black text-white rounded-md hover:bg-gray-700 transition"
                                            onClick={() => navigate("/rowselection")}
                                        >
                                            Check
                                        </button>
                                    </td>

                                    {/* Delete Button */}
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => removeMushroomType(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Add New Type */}
                <button
                    onClick={addMushroomType}
                    className="text-blue-500 text-sm mt-4 hover:underline"
                >
                    + Add Type
                </button>

                {/* Buttons */}
                <div className="flex justify-end mt-6 space-x-3">
                    <button className="px-6 py-3 bg-black text-white rounded-md text-lg font-semibold">
                        SAVE CHANGES
                    </button>
                    <button onClick={onClose} className="px-6 py-3 bg-gray-300 rounded-md text-lg font-semibold">
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditMushroomTypeModal;
