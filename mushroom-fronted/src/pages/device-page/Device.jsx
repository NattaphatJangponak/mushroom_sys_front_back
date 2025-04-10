import { useState, useEffect } from "react";
import axios from "axios";
import DeviceList from "./DeviceList";
import DeviceForm from "./DeviceForm";
import SearchBar from "./SearchBar";

const Device = () => {
  const [devices, setDevices] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    device_id: "",
    device_name: "",
    description: "",
    device_type: "",
    status: "inactive"
  });
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://49.0.81.242:5000/api/device");
        setDevices(response.data.data || []);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setDevices([]);
      }
    };
    fetchData();
  }, []);

  const handleAddEdit = async () => {
    if (!form.device_name || !form.description || !form.status) {
      alert("Please fill in all fields");
      return;
    }

    try {
      if (form.device_id) {
        const formData = { ...form };
        delete formData.farm;
        await axios.put(`http://49.0.81.242:5000/api/device/${form.device_id}`, formData);
      }
      else {
        await axios.post("http://49.0.81.242:5000/api/device", form);
      }

      const updatedDevices = await axios.get("http://49.0.81.242:5000/api/device");
      setDevices(updatedDevices.data.data || []);
      closeModal();
    } catch (error) {
      console.error("Error saving device:", error.response?.data || error);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setModal(true);
  };


  const handleDelete = async (device_id) => {
    if (!window.confirm("Are you sure you want to delete this device?")) return;

    try {
      await axios.delete(`http://49.0.81.242:5000/api/device/${device_id}`);
      setDevices(devices.filter(item => item.device_id !== device_id));
    } catch (error) {
      console.error("Error deleting device:", error);
    }
  };

  const closeModal = () => {
    setModal(false);
    setForm({
      device_id: "",
      device_name: "",
      description: "",
      device_type: "",
      status: "inactive"
    });
  };

  console.log("device_type values:", devices.map(d => d.device_type));
  const filteredDevices = devices.filter(device => {
    const searchTerm = search.toLowerCase();

    const matchSearch =
      (device.device_id?.toString().toLowerCase() || "").includes(searchTerm) ||
      (device.device_name?.toLowerCase() || "").includes(searchTerm) ||
      (device.farm_type?.toLowerCase() || "").includes(searchTerm) ||
      (device.device_type?.toLowerCase() || "").includes(searchTerm);

    const deviceTypeText =
      device.device_type === "โรงเพาะ"
        ? "โรงเพาะ"
        : device.device_type === "โรงปลูก"
          ? "โรงปลูก"
          : "";

    const statusTypeText =
      device.status === "active"
        ? "active"
        : device.status === "inactive"
          ? "inactive"
          : "";

    const matchType = selectedType === "" || deviceTypeText === selectedType;
    const matchStatus = selectedStatus === "" || statusTypeText === selectedStatus;
    // const matchType =
    //   selectedType === "" || device.device_type === selectedType;
    //   console.log("device_type values:", devices.map(d => d.device_type));
    return matchSearch && matchType && matchStatus;
  });


  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Device Management</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        SelectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        openModal={() => setModal(true)}
      />

      <DeviceList
        devices={filteredDevices}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {modal && (
        <DeviceForm
          form={form}
          setForm={setForm}
          handleAddEdit={handleAddEdit}
          closeModal={closeModal}
          isEditing={!!form.device_id}
        />
      )}
    </div>
  );
};

export default Device;