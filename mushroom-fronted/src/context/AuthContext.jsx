import { createContext, useState, useEffect } from "react";
import axios from "axios";
// import { jwtDecode } from "jwt-decode"; // Import jwt-decode
// const NODE_RED_BASE = import.meta.env.VITE_NODE_RED;
// const PRISMA_BASE = import.meta.env.VITE_PRISMA;

// const BACKEND_API = import.meta.env.VITE_BACKEND_API;


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({username:null , user_id:null});
    const [loading, setLoading] = useState(true);


    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    //         try {
    //             const decodedUser = jwtDecode(token);
    //             setUser(decodedUser);
    //         } catch (error) {
    //             console.error("Error decoding token:", error.message);
    //             localStorage.removeItem("token"); // Clear invalid token
    //         }
    //     }
    // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const fetchUser = async () => {
            try {
                // const res = await axios.get(`http://172.17.64.1:1880/user/${username}`);
                // const res = await axios.get(`${NODE_RED_BASE}/user/${username}`);
                const res = await axios.get(`${import.meta.env.VITE_NODE_RED}/user/${username}`);
                console.log(res)
                const user_id = res.data?.user_id || res.data?.data?.user_id || res.data?.data?.id;

                if (user_id) {
                    setUser({ username, user_id });
                }
            } catch (err) {
                console.error("❌ Failed to fetch user:", err.message);
                localStorage.removeItem("token");
                localStorage.removeItem("username");
            } finally {
                setLoading(false); // ✅ บอกว่าโหลดเสร็จแล้ว
            }
        };

        fetchUser();
    } else {
        setLoading(false); // ไม่มี token ก็ถือว่าโหลดเสร็จ
    }
}, []);

    console.log(user)
    // const updateUser = async (id, userData) => {
    //     try {
    //         console.log("📌 API Request - Updating user:", id, userData); // ✅ Debugging
    //         const response = await axios.put(`http://localhost:5000/api/auth/update/${id}`, userData, {
    //             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // ✅ ใส่ Token
    //         }); 

    //         console.log("✅ User updated successfully:", response.data);

    //         setUser(prevUser => ({
    //             ...prevUser,
    //             username: userData.username, // ✅ อัปเดต username ใน state
    //         }));

    //         return true;
    //     } catch (error) {
    //         console.error("❌ Error updating user:", error.response?.data || error.message);
    //         return false;
    //     }
    // };

    const login = async (username, password) => {
        try {
            // const response = await axios.post("http://172.17.64.1:1880/login", { username, password });
            // const response = await axios.post(`${NODE_RED_BASE}/login`, { username, password });
            const response = await axios.post(`${import.meta.env.VITE_NODE_RED}/login`, { username, password });
            const { token } = response.data;
    
            console.log("Login successful:", response.data);
    
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
            // 🔁 ดึง user_id เพิ่มเติมจาก API
            // const userInfo = await axios.get(`http://172.17.64.1:1880/user/${username}`);
            // const userInfo = await axios.get(`${NODE_RED_BASE}/user/${username}`);
            const userInfo = await axios.get(`${import.meta.env.VITE_NODE_RED}/user/${username}`);
            const {user_id} = userInfo.data;// 👈 ตรวจสอบว่า API ส่งมาจริง
            console.log(user_id)
    
            // ✅ เก็บทั้ง username และ user_id
            setUser({ username, user_id });
    
            return true;
        } catch (error) {
            console.error("Login failed:", error.response?.data?.message || error.message);
            return false;
        }
    };
    

    
    

    // Register function
    const register = async (username, password) => {
        try {
            // await axios.post("http://172.17.64.1:5000/api/auth/register", { username, password });
            // await axios.post(`${PRISMA_BASE}/api/auth/register`, { username, password });
            await axios.post(`${import.meta.env.VITE_PRISMA}/register`, { username, password });
            
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
        // , updateUser
        <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;