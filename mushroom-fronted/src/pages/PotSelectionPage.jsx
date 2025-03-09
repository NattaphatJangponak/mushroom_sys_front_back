import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ManagePotModal from '../components/ManagePotModal';

function PotSelectionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const rowId = searchParams.get('row') || "1";
    const initialRowStatus = searchParams.get('status') || "Available";

    let storedPots;
    try {
        storedPots = JSON.parse(searchParams.get('pots')) || [];
    } catch (error) {
        storedPots = [];
    }

    const [showImage, setShowImage] = useState(false);
    const [isModalOpen, setIsManagePotOpen] = useState(false);
    const [potData, setPotData] = useState(
        storedPots.length > 0
            ? storedPots
            : [...Array(12).keys()].map((num) => ({
                id: String(num + 1).padStart(2, '0'),
                rowPot: `${rowId}:${String(num + 1).padStart(2, '0')}`,
                status: initialRowStatus,
                potStatus: "Safe"
            }))
    );

    // ✅ เปลี่ยนค่าเฉพาะ Pot ที่เลือก
    const handleUpdatePotStatus = (potId, newPotStatus) => {
        setPotData(potData.map(pot =>
            pot.id === potId ? { ...pot, potStatus: newPotStatus } : pot
        ));
    };

    // ✅ เปลี่ยนค่าเฉพาะ `Row Status` โดยไม่เปลี่ยน `potStatus`
    const handleUpdateRowStatus = (newRowStatus) => {
        setPotData(potData.map(pot => ({
            ...pot,
            status: newRowStatus
        })));
    };

    // ✅ ฟังก์ชันสำหรับปุ่ม SAVE CHANGES
    const handleSaveChanges = () => {
        navigate(`/rowselection?updatedRow=${rowId}&status=${potData[0]?.status || "Available"}&pots=${encodeURIComponent(JSON.stringify(potData))}`);
    };

    // ✅ เมื่อกด `Pot` ให้ไปที่ `Status Mushroom`
    const handleCheckMushroomStatus = (potId) => {
        navigate(`/application?row=${rowId}&pot=${potId}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <h2 className="text-4xl font-bold mx-10 my-4">Pot Selection for Row {rowId}</h2>
            <button
                onClick={() => setIsManagePotOpen(true)}
                className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600"
            >
                Manage Pot
            </button>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 grid grid-cols-4 gap-4">
                    {potData.length > 0 ? potData.map((pot) => (
                        <div key={pot.id} className="border rounded-lg p-6 shadow-md">
                            {/* ✅ คลิกที่ Pot เพื่อนำไปเช็ค Status Mushroom */}
                            <button
                                className="block w-full text-left"
                                onClick={() => handleCheckMushroomStatus(pot.id)}
                            >
                                <p className="font-bold text-xl">{pot.id}</p>
                                <p className="text-sm text-gray-500">{pot.status}</p>
                            </button>

                            {/* ✅ Dropdown แยกออกมา ไม่ให้กดซ้อนกัน */}
                            <div className="mt-3">
                                <label className="block text-sm text-gray-500">Pot Status</label>
                                <select
                                    value={pot.potStatus}
                                    onChange={(e) => handleUpdatePotStatus(pot.id, e.target.value)}
                                    className={`w-full border px-3 py-2 rounded-md text-sm font-semibold
                                        ${pot.potStatus === "Danger" ? "text-red-500" :
                                            pot.potStatus === "Warning" ? "text-yellow-500" :
                                                "text-green-500"
                                        }`}
                                >
                                    <option value="Safe">Safe</option>
                                    <option value="Warning">Warning</option>
                                    <option value="Danger">Danger</option>
                                </select>
                            </div>
                        </div>
                    )) : <p className="col-span-4 text-center text-gray-500">No pots available</p>}
                </div>

                {/* Sidebar Card */}
                <div className="col-span-4">
                    <div className="bg-white border border-gray-300 shadow-md rounded-lg p-6">
                        {/* Row Status Dropdown */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500 mb-2">Row Status</label>
                            <select
                                value={potData[0]?.status || "Available"}
                                onChange={(e) => handleUpdateRowStatus(e.target.value)}
                                className="w-full h-12 px-4 rounded-md bg-gray-50 border border-gray-300 text-gray-700"
                            >
                                <option value="Available">Available</option>
                                <option value="In Use">In Use</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-500 mb-2">ID</label>
                            <input
                                type="text"
                                value={`0${rowId}`}
                                readOnly
                                className="w-full h-12 px-4 rounded-md bg-gray-50 border border-gray-300 text-gray-700"
                            />
                        </div>

                        <div className="space-y-4">
                            <button className="bt-card" onClick={() => setShowImage(prev => !prev)}>Toggle Img</button>
                            <button className="bt-card" onClick={handleSaveChanges}>Save Changes Status Pot</button>
                        </div>

                        {showImage && (
                            <div className="mt-6 flex justify-center">
                                <img src="/Image/realmush.png" alt="Mushroom" className="w-40 h-40 border-4 border-gray-200 rounded-md" />
                            </div>
                        )}
                        {/* ✅ เรียกใช้ Modal */}
                        {isModalOpen && (
                            <ManagePotModal
                                isOpen={isModalOpen}
                                onClose={() => setIsManagePotOpen(false)}
                                potData={potData}
                                setPotData={setPotData}
                                rowId={rowId}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PotSelectionPage;
