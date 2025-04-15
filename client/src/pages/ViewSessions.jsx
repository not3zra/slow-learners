import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ViewSessions() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => setUser(response.data.user))
      .catch(() => console.log("User not authenticated"));
  }, []);

  useEffect(() => {
    if (user) {
      if (user.role == "teacher") {
        axios
          .get("http://localhost:5000/api/sessions/list", {
            params: { teacherId: user._id },
            withCredentials: true,
          })
          .then((response) => setSessions(response.data.sessions))
          .catch((error) =>
            console.log("User not authenticated: " + error.message)
          );
      }
      if (user.role === "student") {
        axios
          .get(`http://localhost:5000/api/sessions/list/${user._id}`, {
            withCredentials: true,
          })
          .then((response) => {
            const bookings = response.data.sessions;
            const sessionDetails = bookings.map((booking) => booking.sessionId);
            setSessions(sessionDetails);
          })
          .catch((error) =>
            console.log("Error fetching student sessions: " + error.message)
          );
      }      
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 flex flex-col items-center">
      <div className="bg-white w-full max-w-5xl p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Your Sessions
        </h1>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <Link
                key={session._id}
                to={`/${user.role}/view-session/${session._id}`}
                className="block p-4 border border-gray-300 bg-white text-gray-800 text-lg font-medium rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
              >
                <div className="flex justify-between items-center">
                  <span>{session.sessionName}</span>
                  <span className="text-sm text-gray-500">
                    📅 {session.dates[0]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No sessions found.</p>
        )}
      </div>
    </div>
  );
}
