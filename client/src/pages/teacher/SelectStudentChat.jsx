import { useEffect, useState } from "react";
import axios from "axios";
import Chat from "../../components/Chat";

export default function SelectStudentChat() {
  const [teacher, setTeacher] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Get teacher info on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((res) => setTeacher(res.data.user))
      .catch((err) => console.error("Error verifying teacher:", err));
  }, []);

  // Get sessions owned by teacher
  useEffect(() => {
    if (!teacher?._id) return;

    axios
    .get("http://localhost:5000/api/sessions/list", {
        params: { teacherId: teacher._id },
        withCredentials: true,
      })
      .then((res) => setSessions(res.data.sessions))
      .catch((err) => console.error("Error fetching sessions:", err));
  }, [teacher]);

  // Fetch all bookings for the teacher's sessions
  useEffect(() => {
    if (sessions.length === 0) return;

    const fetchAllBookings = async () => {
      try {
        const all = await Promise.all(
          sessions.map((session) =>
            axios.get(`http://localhost:5000/api/bookings/session/${session._id}`, {
              withCredentials: true,
            })
          )
        );

        const bookings = all.flatMap((res) => res.data);
        setBookings(bookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchAllBookings();
  }, [sessions]);

  // Get unique students
  const uniqueStudents = Array.from(
    new Map(
      bookings.map((b) => [b.studentId._id, b.studentId])
    ).values()
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Select a Student to Chat</h2>
      <div className="flex gap-4">
        <div className="w-1/3 space-y-2">
          {uniqueStudents.map((student) => (
            <button
              key={student._id}
              className={`block w-full text-left px-4 py-2 rounded border ${
                selectedStudent?._id === student._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedStudent(student)}
            >
              {student.name}
            </button>
          ))}
        </div>

        <div className="w-2/3">
          {selectedStudent ? (
            <Chat senderId={teacher._id} recipientId={selectedStudent._id} />
          ) : (
            <p>Select a student to start chatting.</p>
            
          )}
        </div>
      </div>
    </div>
  );
}
