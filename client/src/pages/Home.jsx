import { useState } from "react";

export default function Home() {
  const [userType, setUserType] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Classroom Booking for Slow Learner Sessions
      </h1>
      <p className="text-gray-700 mb-6">
        A smart way to manage classroom sessions for slow learners.
      </p>

      {/* Login Options */}
      <div className="flex gap-6">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => setUserType("admin")}
        >
          Admin Login
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
          onClick={() => setUserType("teacher")}
        >
          Teacher Login
        </button>
        <button
          className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition"
          onClick={() => setUserType("student")}
        >
          Student Login
        </button>
      </div>

      {/* Display Login Type */}
      {userType && (
        <div className="mt-6 p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800">
            Redirecting to {userType} login...
          </h2>
        </div>
      )}
    </div>
  );
}
