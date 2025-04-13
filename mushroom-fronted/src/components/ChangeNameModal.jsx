import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { use } from "react";

function ChangePasswordModal({ isOpen, onClose }) {
    // const { user } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    console.log(user)
// if (!isOpen || loading) return null;

    


    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    // const [user_id, setUser_id] = useState(null);

    const user_id = user?.user_id;
    
    const getUser = async () => {
        if (!user || !user.user_id) {
            return null;
        }
        

        try {
            const response = await axios.get(`http://49.0.81.242:1880/user/${user.username}`);
            console.log("📦 user info response:", response.data);

            const id = response.data?.user_id || response.data?.data?.user_id;
            if (id) {
                setUser_id(id);
            } else {
                console.warn("⚠️ user_id not found in response");
            }
        } catch (error) {
            console.error("❌ Error fetching user:", error.response?.data || error.message);
        }
    };
    useEffect(() => {
        getUser();
    }, []);
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword) {
            Swal.fire({
                icon: "warning",
                title: "Missing Fields",
                text: "Please enter both current and new passwords.",
            });
            return;
        }

        try {
            console.log("🔑 Submitting password change with:", {
                user_id: user.user_id,
                currentPassword,
                newPassword
            });

            const response = await axios.post("http://49.0.81.242:1880/change_password", {
                user_id,
                currentPassword,
                newPassword,
            });

            console.log("🔐 Password change response:", response);
            console.log("🔐 Password change response data:", response.data);

            if (response.status >= 200 && response.status < 300) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Password updated successfully!",
                }).then(() => {
                    onClose();
                });
            }
        } catch (error) {
            console.error("❌ Failed to update password:", error.response?.data || error.message);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update password. Please try again.",
            });
        }
    };


    let username = user?.username == null ? "" : user.username;

    return (
        isOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <div className="text-2xl font-bold mb-4 text-black">Change Password</div>

                    <label className="block text-sm font-medium text-gray-500 mb-2">Username</label>
                    <input
                        readOnly
                        value={username}
                        className="w-full h-12 px-4 rounded-md bg-gray-50 border border-gray-300 text-gray-700 mb-4"
                    />

                    <label className="block text-sm font-medium text-gray-500 mb-2">Current Password</label>
                    <input
                        type="text"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full h-12 px-4 rounded-md bg-gray-50 border border-gray-300 text-gray-700 mb-4"
                    />

                    <label className="block text-sm font-medium text-gray-500 mb-2">New Password</label>
                    <input
                        type="text"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full h-12 px-4 rounded-md bg-gray-50 border border-gray-300 text-gray-700 mb-4"
                    />

                    <div className="flex justify-end space-x-3">
                        <button onClick={handleSubmit} className="px-6 py-3 bg-black text-white rounded-md text-lg font-semibold">
                            CHANGE PASSWORD
                        </button>
                        <button onClick={onClose} className="px-6 py-3 bg-gray-400 text-white rounded-md text-lg font-semibold">
                            CLOSE
                        </button>
                    </div>
                </div>
            </div>
        )
    );
}

export default ChangePasswordModal;