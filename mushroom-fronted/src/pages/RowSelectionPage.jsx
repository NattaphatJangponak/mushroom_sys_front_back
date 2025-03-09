import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RowModal from "../components/RowModal";

function RowSelectionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const updatedRowId = searchParams.get("updatedRow");
    const updatedStatus = searchParams.get("status");

    let storedPots;
    try {
        storedPots = JSON.parse(searchParams.get("pots")) || [];
    } catch (error) {
        storedPots = [];
    }

    const [rowsData, setRowsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ✅ โหลดข้อมูลจาก Local Storage
    useEffect(() => {
        const savedRows = JSON.parse(localStorage.getItem("rowsData"));
        if (savedRows) {
            setRowsData(savedRows);
        } else {
            const initialRows = [
                { id: "01", name: "Row 01", status: "Available" },
                { id: "02", name: "Row 02", status: "In Use" },
                { id: "03", name: "Row 03", status: "Available" },
                { id: "04", name: "Row 04", status: "Maintenance" },
                { id: "05", name: "Row 05", status: "Maintenance" },
            ];
            setRowsData(initialRows);
            localStorage.setItem("rowsData", JSON.stringify(initialRows));
        }
    }, []);

    // ✅ อัปเดตข้อมูลเมื่อมีการเปลี่ยนแปลง Row
    useEffect(() => {
        if (rowsData.length > 0) {
            localStorage.setItem("rowsData", JSON.stringify(rowsData));
        }
    }, [rowsData]);

    return (
        <div className="bg-white min-h-screen p-8">
            <h2 className="text-4xl font-bold mx-10 my-4">APPLICATION</h2>

            {/* ✅ ปุ่มเปิด Modal */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-600"
            >
                Manage Rows
            </button>

            {/* ✅ Grid Layout */}
            <div className="grid grid-cols-4 gap-6">
                {rowsData.map((row) => (
                    <div
                        key={row.id}
                        onClick={() => {
                            navigate(`/potselection?row=${row.id}&status=${row.status}&pots=${encodeURIComponent(JSON.stringify(storedPots))}`);
                        }}
                        className="border rounded-lg text-center p-8 cursor-pointer hover:bg-gray-200 transition"
                    >
                        <p className="font-bold text-xl">{row.name}</p>
                        <p className="text-sm text-gray-500">{row.status}</p>
                    </div>
                ))}
            </div>

            {/* ✅ เรียกใช้ Modal */}
            {isModalOpen && (
                <RowModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)}
                    rowsData={rowsData}
                    setRowsData={setRowsData}
                />
            )}
        </div>
    );
}

export default RowSelectionPage;
