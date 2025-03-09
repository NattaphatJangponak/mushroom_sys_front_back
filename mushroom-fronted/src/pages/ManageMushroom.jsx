import { useState } from "react";

const initialData = [
  { id: 1, device_id: "px-xx201sd", mushroom_farm_name: "โรงเพาะ 1" },
  { id: 2, device_id: "px-yy302ad", mushroom_farm_name: "โรงเพาะ 2" },
  { id: 3, device_id: "px-zz403jk", mushroom_farm_name: "โรงเพาะ 3" },
  { id: 4, device_id: "px-aa504lm", mushroom_farm_name: "โรงเพาะ 4" },
  { id: 5, device_id: "px-bb605op", mushroom_farm_name: "โรงเพาะ 5" },
];

const Materdata = () => {
  const [items, setItems] = useState(initialData);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ id: null, device_id: "", mushroom_farm_name: "" });
  const [search, setSearch] = useState({ device_id: "", mushroom_farm_name: "" });

  const handleAddEdit = () => {
    if (form.id) {
      setItems(items.map((item) => (item.id === form.id ? form : item)));
    } else {
      setItems([...items, { ...form, id: Date.now() }]);
    }
    setModal(false);
    setForm({ id: null, device_id: "", mushroom_farm_name: "" });
  };

  const handleEdit = (item) => {
    setForm(item);
    setModal(true);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter(
    (item) =>
      item.device_id.toLowerCase().includes(search.device_id.toLowerCase()) &&
      item.mushroom_farm_name.toLowerCase().includes(search.mushroom_farm_name.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-100  font-title min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">การเพาะ</h1>
      
      <div className="flex gap-4 mb-6 w-full max-w-3xl items-center">
        <input
          type="text"
          placeholder="Search by Device ID"
          className="p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={search.device_id}
          onChange={(e) => setSearch({ ...search, device_id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Search by Farm Name"
          className="p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
          value={search.mushroom_farm_name}
          onChange={(e) => setSearch({ ...search, mushroom_farm_name: e.target.value })}
        />
        <button onClick={() => setModal(true)} className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-600 transition">
          Add Item
        </button>
      </div>
      
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Device ID</th>
              <th className="p-3 text-left">Mushroom Farm Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.id}</td>
                <td className="p-3">{item.device_id}</td>
                <td className="p-3">{item.mushroom_farm_name}</td>
                <td className="p-3 text-center">
                  <button
                    className="mr-2 bg-blue-500 text-white py-1 px-3 rounded-lg shadow hover:bg-blue-600 transition"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="mr-2 bg-green-500 text-white py-1 px-3 rounded-lg shadow hover:bg-green-600 transition"
                  >
                    View Details
                  </button>
                  <button
                    className="bg-red-500 text-white py-1 px-3 rounded-lg shadow hover:bg-red-600 transition"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">{form.id ? "Edit Item" : "Add Item"}</h2>
            <input
              type="text"
              placeholder="Device ID"
              className="w-full p-3 border rounded-lg mb-3 focus:ring focus:ring-blue-200"
              value={form.device_id}
              onChange={(e) => setForm({ ...form, device_id: e.target.value })}
            />
            <input
              type="text"
              placeholder="Mushroom Farm Name"
              className="w-full p-3 border rounded-lg mb-4 focus:ring focus:ring-blue-200"
              value={form.mushroom_farm_name}
              onChange={(e) => setForm({ ...form, mushroom_farm_name: e.target.value })}
            />
            <div className="flex justify-end">
              <button className="mr-2 bg-gray-500 text-white py-2 px-4 rounded-lg" onClick={() => setModal(false)}>
                Cancel
              </button>
              <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition" onClick={handleAddEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Materdata;
