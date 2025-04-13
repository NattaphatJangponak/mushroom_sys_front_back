import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/solid";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from "axios";

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_NODE_RED}/get_user`);
            console.log(response.data)
            setUsers(response.data);
            setFilteredUsers(response.data);

        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const results = users.filter(user =>
            user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.user_id?.toString().includes(searchTerm)
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    const handleDelete = async (user_id) => {
        if (window.confirm(`Are you sure you want to delete user ${user_id}?`)) {
            const response = await axios.delete(`${import.meta.env.VITE_NODE_RED}/user/${user_id}`);
            if (response.status === 200) {
                fetchUsers()
            }
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen font-title flex flex-col items-center">
  <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Management</h1>

  {/* 🔍 Search and Add */}
  <div className="flex gap-4 mb-6 w-full max-w-3xl items-center">
    <input
      type="text"
      placeholder="Search by username"
      className="p-3 w-full border rounded-lg shadow-sm focus:ring focus:ring-blue-200"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

    <button
      onClick={() => navigate('/user-management/create')}
      className="bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition flex items-center"
    >
      <PlusIcon className="w-5 h-5" />
    </button>
  </div>

  {/* 📋 Users Table */}
  <div className="w-full font-title overflow-x-auto">
    <div className="min-w-[600px] max-w-5xl mx-auto bg-white rounded-lg shadow-md p-4">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200 text-sm text-gray-700">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Username</th>
            <th className="p-3 text-left">UUID</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                Loading users...
              </td>
            </tr>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.user_id} className="border-t text-sm hover:bg-gray-50">
                <td className="p-3">{user.user_id}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.uuid}</td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => navigate('/user-management/update?user_id=' + user.user_id + '&username=' + user.username)}
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.user_id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
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
                {searchTerm ? 'No matching users found' : 'No users available'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

    );
};

export default UserManagementPage;