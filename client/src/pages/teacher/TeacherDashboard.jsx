import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);

        axios
          .get("http://localhost:5000/api/sessions/list", {
            params: { teacherId: response.data.user._id },
            withCredentials: true,
          })
          .then((response) => {
            const today = new Date();

            const upcomingSessions = response.data.sessions.reduce(
              (acc, session) => {
                const validDates = session.dates
                  .filter((date) => new Date(date) >= today)
                  .map((date) => ({
                    name: session.sessionName,
                    timeSlot: session.timeSlot,
                    date: date,
                  }));

                return [...acc, ...validDates];
              },
              []
            );

            // Sort upcoming sessions by date
            const sortedSessions = upcomingSessions.sort(
              (a, b) => new Date(a.date) - new Date(b.date)
            );

            setUpcoming(sortedSessions.slice(0,sortedSessions.length<5?sortedSessions.length:5)); // Only show 5 upcoming sessions
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 min-h-screen">

      {/* Welcome Card */}
      <div className="md:col-span-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-xl rounded-2xl p-6 text-center">
        {user && (
          <h1 className="text-4xl font-extrabold mb-2">
            Welcome, {user.name}!
          </h1>
        )}
        <p className="text-lg">Manage your sessions and materials effortlessly.</p>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          📅 Upcoming Sessions
        </h2>
        {upcoming.length > 0 ? (
          <div className="space-y-3">
            {upcoming.map((val, idx) => (
              <div
                key={idx}
                className="p-4 border-l-4 border-green-500 rounded-lg bg-green-50 flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {val.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    📆 {val.date} | 🕒 {val.timeSlot.startTime} -{" "}
                    {val.timeSlot.endTime}
                  </p>
                </div>
                <span className="text-sm text-green-600 font-medium">
                  ✅ Scheduled
                </span>
              </div>
            ))}
          </div>
        ) : (
          <h4 className="text-xl font-semibold text-red-500 mb-4">
            ❌ No upcoming sessions
          </h4>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-500 mb-4">🔧 Actions</h2>
        <Link
          to="/teacher/create-session"
          className="block bg-blue-500 text-white text-center py-3 px-4 rounded-md mb-3 hover:bg-blue-600 transition"
        >
          ➕ Create New Session
        </Link>
        <Link
          to="/teacher/view-sessions"
          className="block bg-green-500 text-white text-center py-3 px-4 rounded-md hover:bg-green-600 transition"
        >
          📂 View Sessions
        </Link>
      </div>

      {/* Profile and Settings */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-blue-500 mb-4">
          🔒 Profile & Settings
        </h2>
        <Link
          to="/teacher/profile"
          className="block bg-yellow-500 text-white text-center py-3 px-4 rounded-md hover:bg-yellow-600 transition"
        >
          ✏️ Edit Profile
        </Link>
      </div>
    </div>
  );
}
