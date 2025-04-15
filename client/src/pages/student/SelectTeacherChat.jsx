import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SelectTeacherChat() {
  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [chatStates, setChatStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch student data
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        setStudent(response.data.user);
      })
      .catch((err) => {
        console.error("User not authenticated:", err);
        setError("Failed to authenticate user");
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch sessions and teachers
  useEffect(() => {
    if (!student) return;

    setLoading(true);
    axios
      .get(`http://localhost:5000/api/bookings/student/${student._id}`, {
        withCredentials: true,
      })
      .then(async (res) => {
        const sessionData = res.data.sessions || res.data;
        setSessions(sessionData);

        const teacherIds = [
          ...new Set(
            sessionData
              .map((booking) => booking.sessionId?.teacherId)
              .filter(Boolean)
          ),
        ];

        try {
          const userRes = await axios.get("http://localhost:5000/api/users", {
            withCredentials: true,
          });

          const teacherDetails = userRes.data.filter(
            (user) => user.role === "teacher" && teacherIds.includes(user._id)
          );
          setTeachers(teacherDetails);

          // Check conversation status for each teacher
          for (const teacher of teacherDetails) {
            try {
              const res = await axios.get(
                `http://localhost:5000/api/chat/conversation/${student._id}/${teacher._id}`,
                { withCredentials: true }
              );
              setChatStates((prev) => ({
                ...prev,
                [teacher._id]: res.data.length > 0,
              }));
            } catch {
              setChatStates((prev) => ({
                ...prev,
                [teacher._id]: false,
              }));
            }
          }
        } catch (userErr) {
          console.error("Failed to fetch teachers:", userErr);
          setError("Failed to load teachers");
        }
      })
      .catch((err) => {
        console.error("Booking fetch error:", err);
        setError("Failed to load bookings");
      })
      .finally(() => setLoading(false));
  }, [student]);

  if (error) {
    return <div className="p-6 text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat with a Teacher</h1>
      {loading ? (
        <div className="text-center p-4">Loading...</div>
      ) : teachers.length === 0 ? (
        <div className="text-center p-4 text-gray-500">No teachers found</div>
      ) : (
        <ul className="space-y-3">
          {teachers
            .filter((teacher) => teacher && teacher._id)
            .map((teacher) => (
              <li
                key={teacher._id}
                className="p-4 border rounded shadow cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/student/chat/${teacher._id}`)}
              >
                <p className="font-semibold">{teacher.name}</p>
                <p className="text-sm text-gray-600">{teacher.email}</p>
                <p className="text-sm mt-2 text-blue-500">
                  {chatStates[teacher._id] ? "Continue Chat" : "Start Chat"}
                </p>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}