import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const { login, setUser } = useContext(AuthContext);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
     
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Please enter both username and password");
            return;
        }

        const success = await login(username, password);
        console.log({username, password});
        if (success) {
            setUser(username)
            navigate("/homepage");
        } else {
            alert("Login failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white max-w-md w-full border rounded-md shadow-md p-8">
                {/* Logo */}
                <div className="flex items-center justify-center mb-6">
                    <img
                        src="/Image/mushroom.png"
                        alt="App Mushroom IOT"
                        className="w-10 h-10 mr-2"
                    />
                    <h1 className="text-2xl font-bold">App Mushroom IOT</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <div className="group w-72 md:w-80 lg:w-96">
                            <label htmlFor="username" className="label-input">
                                Username
                            </label>
                            <div className="relative flex items-center space-x-2">
                                {/* SVG Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 448 512"
                                    className="w-5 h-5"
                                >
                                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                                </svg>

                                {/* Input */}
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    className="text-input"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="group w-72 md:w-80 lg:w-96">
                            <label htmlFor="password" className="label-input">
                                Password
                            </label>
                            <div className="flex-input">
                                {/* SVG Icon */}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    className="w-5 h-5"
                                >
                                    <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z" />
                                </svg>
                                {/* Input */}
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="text-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-400 text-white py-2 rounded-md cursor-pointer hover:bg-gray-300 transition duration-200"
                    >
                        Log-in
                    </button>
                </form>

                {/* Register */}
                <div className="text-center mt-4">
                    <button
                        onClick={() => navigate("/register")}
                        className="font-semibold text-black hover:underline"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
