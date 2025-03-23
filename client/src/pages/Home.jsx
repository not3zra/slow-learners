import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Classroom Booking for Slow Learner Sessions
      </h1>
      <p className="text-gray-700 mb-6">
        A smart way to manage classroom sessions for slow learners.
      </p>

      {/* Auth Options */}
      <div className="flex gap-6">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
          onClick={() => navigate("/signup")}
        >
          Signup
        </button>
      </div>
    </div>
  );
}