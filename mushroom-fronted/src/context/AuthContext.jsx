import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decode JWT
            setUser(decodedUser);
        }
    }, []);

    const updateUser = async (id, userData) => {
        try {
            console.log("📌 API Request - Updating user:", id, userData); // ✅ Debugging
            const response = await axios.put(`http://localhost:5000/api/auth/update/${id}`, userData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ ใส่ Token
            });

            console.log("✅ User updated successfully:", response.data);

            setUser(prevUser => ({
                ...prevUser,
                username: userData.username, // ✅ อัปเดต username ใน state
            }));

            return true;
        } catch (error) {
            console.error("❌ Error updating user:", error.response?.data || error.message);
            return false;
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", { username, password });
            const { token } = response.data;
            // console.log(username, password);
            // console.log("Login successful:", response.data);

            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Decode token to get user data
            const decoded = jwtDecode(token);

            setUser({ id: decoded.id, username: decoded.username, password: decoded.password });

            return true;
        } catch (error) {
            console.error(error)
            console.error("Login failed:", error.response?.data?.message || error.message);
            return false;
        }
    };

    // Register function
    const register = async (username, password) => {
        try {
            await axios.post("http://localhost:5000/api/auth/register", { username, password });
            return true;
        } catch (error) {
            console.error("Registration failed:", error.response?.data?.message || error.message);
            return false;
        }
    };

    // Logout function  
    const logout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;