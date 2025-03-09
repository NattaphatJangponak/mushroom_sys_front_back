import React, { useState } from "react";

function FarmTypeModal({ isOpen, onClose, farmTypes, setFarmTypes }) {
    const [newFarmType, setNewFarmType] = useState("");

    // ✅ addfarm
    const addFarmType = () => {
        if (newFarmType.trim()) {
            setFarmTypes([
                ...farmTypes,
                { id: String(farmTypes.length + 1).padStart(2, "0"), name: newFarmType },
            ]);
            setNewFarmType("");
        }
    };

    // ✅ delefarm
    const removeFarmType = (index) => {
        const updatedList = farmTypes.filter((_, i) => i !== index);
        setFarmTypes(updatedList);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[70vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Edit Farm-Type</h2>

                {/* Table Layout */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Farm Name</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {farmTypes.map((farm, index) => (
                                <tr key={index} className="text-center">
                                    {/* ID (Read-Only) */}
                                    <td className="border px-4 py-2">{farm.id}</td>

                                    {/* Dropdown Farm Name */}
                                    <td className="border px-4 py-2">
                                        <select
                                            value={farm.name}
                                            onChange={(e) => {
                                                const updatedList = [...farmTypes];
                                                updatedList[index].name = e.target.value;
                                                setFarmTypes(updatedList);
                                            }}
                                            className="border border-gray-300 rounded-md px-2 py-1"
                                        >
                                            {farmTypes.map((option, idx) => (
                                                <option key={idx} value={option.name}>
                                                    {option.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* Delete Button */}
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => removeFarmType(index)}
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

                {/* Add New Farm Type */}
                <div className="flex space-x-2 mt-4">
                    <input
                        type="text"
                        value={newFarmType}
                        onChange={(e) => setNewFarmType(e.target.value)}
                        placeholder="New farm type"
                        className="border border-gray-300 rounded-md px-3 py-2 min-w-52"
                    />
                    <button
                        onClick={addFarmType}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        + Add
                    </button>
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-6 space-x-3">
                    <button className="px-6 py-3 bg-black text-white rounded-md text-lg font-semibold">
                        SAVE CHANGES
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-300 rounded-md text-lg font-semibold"
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FarmTypeModal;
