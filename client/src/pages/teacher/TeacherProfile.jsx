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
        setTeacherData({
          id: user._id,
          name: user.name,
          email: user.email,
          subjects: user.subjectsTeaching || "No subjects added to display",
        });
        setLoading(false);
      })
      .catch(() => console.log("User not authenticated"));
  }, []);

  const [newSubject, setNewSubject] = useState("");

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      axios
        .put(
          `http://localhost:5000/api/users/teacher/${teacherData.id}/add-subject`,
          { subject: newSubject.trim() },
          { withCredentials: true }
        )
        .then((response) =>
          setTeacherData({ ...teacherData, subjects: response.data.subjectsTeaching })
        )
        .catch((error) => console.log(error));
    }
  };

  const handleEditDetail = (field, value) => {
    setTeacherData({ ...teacherData, [field]: value });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <p className="text-xl text-blue-500">Loading... Please wait</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg border-t-4 border-blue-500">
        <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-6">
          Teacher Profile
        </h1>

        {/* Name Field */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Name
          </label>
          <input
            type="text"
            value={teacherData.name}
            onChange={(e) => handleEditDetail("name", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email Field */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            value={teacherData.email}
            onChange={(e) => handleEditDetail("email", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Subjects Section */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Subjects Teaching
          </label>
          {teacherData.subjects !== "No subjects added to display" ? (
            <ul className="bg-gray-100 p-3 rounded-lg border">
              {teacherData.subjects.map((subject, index) => (
                <li
                  key={index}
                  className="py-1 px-2 bg-blue-100 rounded-md mb-1"
                >
                  {subject}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No subjects added yet.</p>
          )}

          {/* Add Subject Field */}
          <div className="flex items-center gap-3 mt-3">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Add new subject"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleAddSubject}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition w-1/3"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
