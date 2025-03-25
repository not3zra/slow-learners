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
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white w-full max-w-6xl p-8 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Your Sessions</h1>
        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((session) => (
              <Link
                key={session._id}
                to={`/teacher/view-session/${session._id}`}
                className="block p-4 bg-gray-700 text-white text-lg font-medium rounded-lg shadow-md hover:bg-gray-800 transition-all"
              >
                {session.sessionName}
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
