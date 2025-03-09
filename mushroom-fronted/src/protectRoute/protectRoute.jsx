import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = () => {
    const { user } = useContext(AuthContext);
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    console.log(user)

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token); // Convert token existence to boolean
    }, [user]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Prevents flashing effect
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
