import { XIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewPotForm = ({ onClose, onSubmit, defaultData = null, deviceId }) => {
  const [form, setForm] = useState({
    pot_id:"",
    type_pot_id: "",
    device_id: "",
    typepot: "",
    status: "",
    pot_name: "",
    img_path: null,
    ai_result: null
  });

  const [typePotOptions, setTypePotOptions] = useState([]);


  useEffect(() => {
    fetchTypePots();
  }, []);

  useEffect(() => {
    console.log("defaultData", defaultData);
    if (defaultData && typePotOptions.length > 0) {
      // หาค่า type_pot_id จากชื่อ
      const matchedPot = typePotOptions.find(
        (pot) => pot.type_pot_name === defaultData.type_pot_name
      );

      setForm({
        ...defaultData,
        typepot: matchedPot ? matchedPot.type_pot_id : "",
        pot_id: defaultData.pot_id || "",
      });
    } else if (!defaultData) {
      setForm({
        pot_id:"",
        type_pot_id: "",
        typepot: "",
        status: "",
        pot_name: "",
        img_path: null,
        ai_result: null
      });
    }
  }, [defaultData, typePotOptions]);


  const fetchTypePots = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/mushroom");
      console.log(response)
      if (Array.isArray(response.data.data)) {
        setTypePotOptions(response.data.data);
      } else {
        console.error("Type pot data is not an array:", response.data);
        setTypePotOptions([]);
      }
    } catch (error) {
      console.error("Error fetching type pots:", error);
      setTypePotOptions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.pot_name || !form.typepot || !form.status) {
      alert("Please fill in all required fields");
      return;
    }

    const submitData = {
      pot_id:Number(form.pot_id),
      type_pot_id:Number(form.type_pot_id),
      device_id: Number(form.device_id),
      typepot: Number(form.typepot),
      img_path: form.img_path || null,
      ai_result: form.ai_result || null,
      status: form.status,
      pot_name: form.pot_name,
      index: form.index || 1,
    };

    if (form.type_pot_id) {
      submitData.type_pot_id = form.type_pot_id;
    }

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error("Error in form submission:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {form.pot_id ? "Edit Pot" : "Add New Pot"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Pot Name</label>
            <input
              className="w-full border p-2 rounded"
              placeholder="Pot Name"
              value={form.pot_name}
              onChange={(e) => setForm({ ...form, pot_name: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Pot Type</label>
            <select
              className="w-full p-2 border rounded"
              value={form.typepot || ""}
              onChange={(e) => setForm({ ...form, typepot: e.target.value })}
              required
            >
              <option value="" disabled>Select Pot Type</option>
              {typePotOptions.map((pot) => (
                <option key={pot.type_pot_id} value={pot.type_pot_id}>
                  {pot.type_pot_name}
                </option>
              ))}
            </select>

          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              className="w-full p-2 border rounded"
              value={form.status || ""}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              required
            >
              <option value="" disabled>Select Status</option>
              <option value="pending">Pending</option>
              <option value="safe">Safe</option>
              <option value="danger">Danger</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {form.pot_id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ViewPotForm;