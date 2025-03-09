import React, { useState } from "react";

function ManagePotModal({ isOpen, onClose, potData, setPotData, rowId }) {
    const [newPotId, setNewPotId] = useState("");

    if (!isOpen) return null;

    // ✅ เพิ่ม `Pot`
    const addPot = () => {
        if (newPotId.trim() === "") return;
        const newPot = {
            id: newPotId,
            rowPot: `${rowId}:${newPotId}`,
            status: "Available",
            potStatus: "Safe"
        };
        setPotData([...potData, newPot]);
        setNewPotId(""); // เคลียร์ค่า Input
    };

    // ✅ ลบ `Pot`
    const removePot = (potId) => {
        setPotData(potData.filter(pot => pot.id !== potId));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[60vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">Manage Pot</h2>

                {/* Table Layout */}
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="p-2 border border-gray-300">ID</th>
                            <th className="p-2 border border-gray-300">Status</th>
                            <th className="p-2 border border-gray-300">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {potData.map((pot) => (
                            <tr key={pot.id} className="text-center">
                                <td className="p-2 border border-gray-300">{pot.id}</td>
                                <td className="p-2 border border-gray-300">{pot.potStatus}</td>
                                <td className="p-2 border border-gray-300">
                                    <button
                                        onClick={() => removePot(pot.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        🗑️ Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Add New Pot */}
                <div className="flex items-center space-x-3 mt-4">
                    <input
                        type="text"
                        placeholder="Enter Pot ID"
                        value={newPotId}
                        onChange={(e) => setNewPotId(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-md w-50"
                    />
                    <button onClick={addPot} className="bg-blue-500 text-white px-4 py-2 rounded-md">
                        +Add
                    </button>
                </div>

                {/* Buttons */}
                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        className="px-6 py-3 bg-black text-white rounded-md text-lg font-semibold"
                        onClick={onClose}
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ManagePotModal;
