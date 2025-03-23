import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function TeacherDashboard() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/auth/verify", { withCredentials: true })
            .then((response) => {
                setUser(response.data.user);
            })
            .catch(() => {
                console.log("User not authenticated");
            });
    }, []);


    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-100 min-h-screen">
            {/* Quick Stats */}
            <div className="col-span-1 md:col-span-3 bg-white shadow-lg rounded-2xl p-6 text-center">
                {user && <h1 className="text-3xl font-bold text-blue-600 mb-2">Welcome, {user.name}!</h1> }
                <p className="text-gray-500">Your dashboard to manage sessions and materials.</p>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white shadow-md rounded-xl p-4">
                <h2 className="text-xl font-semibold text-blue-500 mb-4">Upcoming Sessions</h2>
                <ul className="space-y-2">
                    <li className="p-2 bg-blue-50 rounded-md">Data Structures - Room A101 (10:00 AM - 12:00 PM)</li>
                    <li className="p-2 bg-blue-50 rounded-md">Web Development - Room B202 (2:00 PM - 4:00 PM)</li>
                    <li className="p-2 bg-blue-50 rounded-md">AI Basics - Room C303 (4:30 PM - 6:30 PM)</li>
                </ul>
            </div>

            {/* Actions */}
            <div className="bg-white shadow-md rounded-xl p-4">
                <h2 className="text-xl font-semibold text-blue-500 mb-4">Actions</h2>
                <Link to="/teacher/create-session" className="block bg-blue-500 text-white text-center py-2 px-4 rounded-md mb-2">Create New Session</Link>
                <Link to="/teacher/upload-material" className="block bg-green-500 text-white text-center py-2 px-4 rounded-md">Upload Materials</Link>
            </div>

            {/* Profile and Settings */}
            <div className="bg-white shadow-md rounded-xl p-4">
                <h2 className="text-xl font-semibold text-blue-500 mb-4">Profile & Settings</h2>
                <Link to="/teacher/profile" className="block bg-yellow-500 text-white text-center py-2 px-4 rounded-md">Edit Profile</Link>
            </div>
        </div>
    );
}
