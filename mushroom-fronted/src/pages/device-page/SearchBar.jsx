// ไฟล์: SearchBar.jsx

import { PlusIcon } from "@heroicons/react/solid";

const SearchBar = ({ search, setSearch, selectedType, setSelectedType, SelectedStatus, setSelectedStatus, openModal }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 w-full max-w-3xl items-center">
      <input
        type="text"
        placeholder="Search robot name"
        className="p-3 w-full sm:w-2/3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="p-3 w-full sm:w-1/3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="โรงเพาะ">โรงเพาะ</option>
        <option value="โรงปลูก">โรงปลูก</option>
      </select>

      <select
        className="p-3 w-full sm:w-1/3 border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
        value={SelectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="Robot active">Robot active</option>
        <option value="Robot inactive">Robot inactive</option>
      </select>

      <button
        onClick={openModal}
         className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition mt-4 sm:mt-0 flex justify-center items-center w-full sm:w-auto"
      >
        <PlusIcon className="w-6 h-6 sm:w-5 sm:h-5" />
      </button>
    </div>

  );
};

export default SearchBar;
