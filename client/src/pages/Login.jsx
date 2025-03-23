import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/users/login", 
                { email, password }, 
                { withCredentials: true } 
            );
            const { role } = response.data.user; 
            if (role === "teacher") {
                navigate("/teacher/dashboard");
            } else if (role === "student") {
                navigate("/student/home");
            } else {
                navigate("/");
            }
        } catch (err) {
            setError("Invalid credentials or server error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
            >
                <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
                {error && <p className="text-red-500 text-center mb-2">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-2"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md mb-4"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
