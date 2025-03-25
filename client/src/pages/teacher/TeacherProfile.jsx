import axios from "axios";
import { useEffect, useState } from "react";

export default function TeacherProfile() {
  const [loading, setLoading] = useState(true);

  const [teacherData, setTeacherData] = useState({
    id: 0,
    name: "Null",
    email: "Null",
    subjects: "No subjects added to display",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        const user = response.data.user;
        console.log(user);
        setTeacherData({
          id: user._id,
          name: user.name,
          email: user.email,
          subjects: user.subjectsTeaching || "No subjects added to display",
        });
        setLoading(false);
      })
      .catch(() => {
        console.log("User not authenticated");
      });
  }, []);

  const [newSubject, setNewSubject] = useState("");

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      axios
        .put(
          `http://localhost:5000/api/users/teacher/${teacherData.id}/add-subject`,
          {
            subject: newSubject.trim(),
          },
          { withCredentials: true }
        )
        .then((response) => setTeacherData({...teacherData, subjects:response.data.subjectsTeaching}))
        .catch((error) => console.log(error));
    }
  };

  const handleEditDetail = (field, value) => {
    setTeacherData({ ...teacherData, [field]: value });
  };

  if (loading) return <div>Loading.. Please wait</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Teacher Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={teacherData.name}
            onChange={(e) => handleEditDetail("name", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={teacherData.email}
            onChange={(e) => handleEditDetail("email", e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Subjects Teaching</label>
          {teacherData.subjects != "No subjects added to display" && (
            <ul className="list-disc pl-4 mb-2">
              {teacherData.subjects.map((subject, index) => (
                <li key={index}>{subject}</li>
              ))}
            </ul>
          )}
          {teacherData.subjects == "No subjects added to display" && (
            <p>No Subjects to display</p>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add new subject"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleAddSubject}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700 transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
