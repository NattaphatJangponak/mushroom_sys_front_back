// ไฟล์: SearchBar.jsx

import { PlusIcon } from "@heroicons/react/solid";

const SearchBar = ({ search, setSearch, selectedType, setSelectedType, SelectedStatus,setSelectedStatus,openModal }) => {
  return (
    <div className="flex gap-4 mb-6 w-full max-w-3xl items-center">
      <input
        type="text"
        placeholder="Search devices name"
        className="p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="เครื่องเพาะ">เครื่องเพาะ</option>
        <option value="เครื่องปลูก">เครื่องปลูก</option>
      </select>

      <select
        className="p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
        value={SelectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="active">ทำงาน</option>
        <option value="inactive">ไม่ทำงาน</option>
      </select>

      

      <button
        onClick={openModal}
        className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchBar;
