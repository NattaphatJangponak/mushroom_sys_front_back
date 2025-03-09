import React, { useState, useEffect } from "react";

function RowModal({ isOpen, onClose, rowsData, setRowsData }) {
    const [newRowName, setNewRowName] = useState("");

    // ✅ โหลดข้อมูลจาก Local Storage ตอนเปิด Modal
    useEffect(() => {
        const savedRows = JSON.parse(localStorage.getItem("rowsData"));
        if (savedRows) {
            setRowsData(savedRows);
        }
    }, []);

    // ✅ บันทึกลง Local Storage เมื่อแก้ไข Row
    useEffect(() => {
        if (rowsData.length > 0) {
            localStorage.setItem("rowsData", JSON.stringify(rowsData));
        }
    }, [rowsData]);

    // ✅ ฟังก์ชันเพิ่ม Row
    const handleAddRow = () => {
        if (newRowName.trim()) {
            const newId = String(rowsData.length + 1).padStart(2, "0");
            const newRow = { id: newId, name: newRowName, status: "Available" };
            setRowsData([...rowsData, newRow]);
            setNewRowName("");
        }
    };

    // ✅ ฟังก์ชันลบ Row
    const handleDeleteRow = (id) => {
        const updatedRows = rowsData.filter(row => row.id !== id);
        setRowsData(updatedRows);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Manage Rows</h2>

                {/* ✅ ตารางแสดงข้อมูล Row */}
                <div className="overflow-auto max-h-96">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowsData.map((row, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">{row.id}</td>
                                    <td className="border p-2">{row.name}</td>
                                    <td className="border p-2">
                                        <select
                                            value={row.status}
                                            onChange={(e) => {
                                                const updatedRows = [...rowsData];
                                                updatedRows[index].status = e.target.value;
                                                setRowsData(updatedRows);
                                            }}
                                            className="border rounded-md p-1"
                                        >
                                            <option value="Available">Available</option>
                                            <option value="In Use">In Use</option>
                                            <option value="Maintenance">Maintenance</option>
                                        </select>
                                    </td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => handleDeleteRow(row.id)}
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

                {/* ✅ เพิ่ม Row */}
                <div className="flex space-x-2 mt-4">
                    <input
                        type="text"
                        value={newRowName}
                        onChange={(e) => setNewRowName(e.target.value)}
                        placeholder="Enter new row name"
                        className="border border-gray-300 rounded-md px-4 py-2 w-full"
                    />
                    <button
                        onClick={handleAddRow}
                        className="px-2 bg-blue-500 text-white rounded-md"
                    >
                        +Add
                    </button>
                </div>

                {/* ✅ ปุ่ม SAVE & CLOSE */}
                <div className="flex justify-end mt-6 space-x-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-400 text-white rounded-md text-lg font-semibold"
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RowModal;
