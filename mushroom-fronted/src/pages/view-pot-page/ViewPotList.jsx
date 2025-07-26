import { PencilIcon, TrashIcon, EyeIcon, PlusIcon } from "@heroicons/react/solid";

const ViewPotList = ({ data, onView, onEdit, onDelete }) => {

    const getStatusStyle = (status) => {
        switch (status) {
            case "safe":
                return "bg-green-100 text-green-700";
            case "danger":
                return "bg-red-100 text-red-700";
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="w-full overflow-x-auto">
        <div className="min-w-[700px] max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Pots Overview</h2>
          </div>
      
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left min-w-[160px]">Pot Name</th>
                <th className="p-3 text-left min-w-[160px]">Type</th>
                <th className="p-3 text-left min-w-[120px]">Status</th>
                <th className="p-3 text-center w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr key={item.pot_id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{item.pot_name}</td>
                    <td className="p-3">{item.type_pot_name || "N/A"}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusStyle(item.status)
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                          onClick={() => onView(item.img_path, item.img_from_ai)}

                          title="View"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                          onClick={() => onEdit(item)}
                          title="Edit"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                          onClick={() => onDelete(item.pot_id)}
                          title="Delete"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No pots found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    );
};

export default ViewPotList;