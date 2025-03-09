import React, { useState } from "react";

function ChangeStatusModal({ isOpen, onClose, selectedPot, onUpdatePotStatus }) {
    if (!isOpen || !selectedPot) return null;

    const [potStatus, setPotStatus] = useState(selectedPot.potStatus);

    const handleSave = () => {
        onUpdatePotStatus(selectedPot.id, potStatus);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6">Change Pot Status</h2>

                {/* ข้อมูล Pot */}
                <div className="grid grid-cols-2 gap-4 text-gray-500 font-semibold">
                    <p>ID</p>
                    <p>Row:Pot</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <input
                        type="text"
                        value={selectedPot.id}
                        readOnly
                        className="border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-center"
                    />

                    <input
                        type="text"
                        value={selectedPot.rowPot}
                        readOnly
                        className="border border-gray-300 rounded-md px-4 py-2 bg-gray-100 text-center"
                    />
                </div>

                {/* Pot in Row Status */}
                <div className="mt-4">
                    <label className="text-gray-500 font-semibold">Pot in Row Status</label>
                    <select
                        value={potStatus}
                        onChange={(e) => setPotStatus(e.target.value)}
                        className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    >
                        <option value="Safe">Safe</option>
                        <option value="Warning">Warning</option>
                        <option value="Danger">Danger</option>
                    </select>
                </div>

                <div className="flex justify-end mt-6 space-x-3">
                    <button className="px-6 py-3 bg-black text-white rounded-md" onClick={handleSave}>SAVE CHANGES</button>
                    <button onClick={onClose} className="px-6 py-3 bg-gray-300 rounded-md">CLOSE</button>
                </div>
            </div>
        </div>
    );
}

export default ChangeStatusModal;
