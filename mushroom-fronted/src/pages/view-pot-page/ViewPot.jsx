import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ViewPotList from "./ViewPotList";
import ViewPotForm from "./ViewPotForm";
import { PlusIcon } from "@heroicons/react/solid";


const ViewPot = () => {
    const [searchParams] = useSearchParams();
    const deviceId = searchParams.get("device_id");
    const farmID = searchParams.get("farm");


    const [pots, setPots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [currentPot, setCurrentPot] = useState(null);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");



    useEffect(() => {
        if (deviceId) {
            getPotByDeviceID();
        }
    }, [deviceId]);

    const getPotByDeviceID = async () => {
        try {
            const response = await axios.get(`http://49.0.81.242:1880/get_pot_from_device/${deviceId}`);
            setPots(response.data || []);
            setError(null);
        } catch (error) {
            console.error("Error fetching pots:", error);
            setError("Failed to load pots.");
        } finally {
            setLoading(false);
        }
    };

    const handleView = (id) => {
        console.log("View pot with ID:", id);
    };

    const handleEdit = (pot) => {
        setCurrentPot(pot);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://49.0.81.242:1880/del_pot/${deviceId}/${id}`);
            getPotByDeviceID(); // Refresh the list
        } catch (error) {
            console.error("Error deleting pot:", error);
            alert("Failed to delete pot");
        }
    };

    const handleFormSubmit = async (formData) => {
        console.log("Submitting:", formData);
        try {
            if (formData.pot_id) {
                // Update existing pot
                await axios.put(
                    `http://49.0.81.242:1880/edit_pot/${formData.pot_id}`,
                    formData
                );


            } else {
                // Create new pot
                await axios.post("http://49.0.81.242:1880/add_pot", {
                    ...formData,
                    device: parseInt(deviceId),
                    farm: parseInt(farmID)
                });
            }
            getPotByDeviceID(); // Refresh the list
            setShowForm(false);
        } catch (error) {
            console.error("Error saving pot:", error);
            alert("Failed to save pot");
        }
    };
    const filteredPots = pots.filter(pot => {
        const matchStatus = selectedStatus === "" || pot.status === selectedStatus;
        const matchSearch =
            search === "" ||
            pot.pot_name?.toLowerCase().includes(search.toLowerCase()) ||
            String(pot.typepot)?.toLowerCase().includes(search.toLowerCase()) ||
            String(pot.cultivation_pot_id)?.includes(search);

        return matchStatus && matchSearch;
    });

    return (
        <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">

            <h1 className="text-3xl font-semibold  text-gray-800">Pot Management</h1>
            <div className="flex justify-around mt-4">


                <div className="w-full max-w-6xl flex flex-wrap justify-between items-center gap-3 mb-6">
                    {/* Left side: Back button + Device ID */}
                    <div className="flex items-center gap-2">
                        <button
                            className="text-gray-700 hover:text-gray-900 text-2xl"
                            onClick={() => navigate(-1)}
                        >
                            ←
                        </button>
                        <h1 className="text-2xl font-semibold mr-40 text-gray-800">
                            Devices: {deviceId || "N/A"}
                        </h1>
                    </div>

                    {/* Right side: Input + Select + Buttons */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search by Pot id, and type"
                            className="p-3 w-96 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}

                        />
                        <select
                            className="p-3 border rounded-lg shadow-sm"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="All Status">Filter by status</option>
                            <option value="pending">Pending</option>
                            <option value="safe">Safe</option>
                            <option value="danger">Danger</option>
                        </select>
                        <button
                            className="bg-blue-500 text-white p-3 rounded-lg shadow hover:bg-blue-600 transition"
                            title="Add new pot"
                            onClick={() => {
                                setCurrentPot(null);
                                setShowForm(true);
                            }}
                        >
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>




            {loading ? (
                <p className="text-gray-500 mt-4">Loading...</p>
            ) : error ? (
                <p className="text-red-500 mt-4">{error}</p>
            ) : (
                <ViewPotList
                    data={filteredPots}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            {showForm && (
                <ViewPotForm
                    onClose={() => setShowForm(false)}
                    onSubmit={handleFormSubmit}
                    defaultData={currentPot}
                    cultivationId={[]}
                />
            )}
        </div>
    );
};

export default ViewPot;