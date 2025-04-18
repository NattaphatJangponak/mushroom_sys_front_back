// ไฟล์: SearchBar.jsx

import { PlusIcon } from "@heroicons/react/solid";

const SearchBar = ({ search, setSearch, selectedType, setSelectedType, SelectedStatus,setSelectedStatus,openModal }) => {
  return (
    <div className="flex gap-4 mb-6 w-full max-w-3xl items-center">
      <input
        type="text"
        placeholder="Search robot name"
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
        <option value="โรงเพาะ">โรงเพาะ</option>
        <option value="โรงปลูก">โรงปลูก</option>
      </select>

      <select
        className="p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
        value={SelectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="หุ่นทำงาน">หุ่นทำงาน</option>
        <option value="หุ่นไม่ทำงาน">หุ่นไม่ทำงาน</option>
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
