import React, { useState } from "react";

function ChangePotModal({ isOpen, onClose, selectedPot, onSave, allPots }) {
    const [newPotLocation, setNewPotLocation] = useState("");
    const [applyToAll, setApplyToAll] = useState(false);

    const handleSave = () => {
        if (applyToAll) {
            const updatedPots = allPots.map(pot => ({
                ...pot,
                changePot: newPotLocation,
            }));
            onSave(updatedPots);
        } else {
            const updatedPot = { ...selectedPot, changePot: newPotLocation };
            onSave(updatedPot);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center z-50 justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Change Pot</h2>

                {/* เลือก Pot ที่ต้องการเปลี่ยน */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Selected Pot</label>
                    <input
                        type="text"
                        value={selectedPot?.rowPot || "Select a Pot"}
                        readOnly
                        className="w-full p-2 border rounded-md bg-gray-100"
                    />
                </div>

                {/* Input เป้าหมายใหม่ */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">New Pot Location</label>
                    <input
                        type="text"
                        value={newPotLocation}
                        onChange={(e) => setNewPotLocation(e.target.value)}
                        placeholder="Enter new Row:Pot"
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                {/* Toggle เปลี่ยนทั้งหมด */}
                <div className="flex items-center space-x-2 mb-4">
                    <input
                        type="checkbox"
                        checked={applyToAll}
                        onChange={() => setApplyToAll(!applyToAll)}
                        className="h-4 w-4"
                    />
                    <label className="text-sm text-gray-700">Apply to all Pots in this Row</label>
                </div>

                {/* ปุ่ม Action */}
                <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 bg-gray-300 rounded-md" onClick={onClose}>Cancel</button>
                    <button className="px-4 py-2 bg-black text-white rounded-md" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
}

export default ChangePotModal;
