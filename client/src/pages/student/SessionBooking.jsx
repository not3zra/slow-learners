import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function SessionBooking() {
  const [user, setUser] = useState({});
  const [programmeSessions, setProgrammeSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTeacher, setSearchTeacher] = useState("");
  const [searchSubject, setSearchSubject] = useState("");
  const [bookingStatus, setBookingStatus] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        const user = response.data.user;
        setUser(user);
        axios
          .get("http://localhost:5000/api/sessions/programme", {
            withCredentials: true,
            params: { name: user.programme },
          })
          .then((response) => {
            setProgrammeSessions(response.data.sessions);
            setFilteredSessions(response.data.sessions);
          })
          .catch((error) => console.log(error));
      })
      .catch(() => console.log("User not authenticated"));
  }, []);

  const handleSearch = () => {
    let filtered = programmeSessions;
    if (searchTeacher.trim()) {
      filtered = filtered.filter((session) =>
        session.teacher.name.toLowerCase().includes(searchTeacher.toLowerCase())
      );
    }
    if (searchSubject.trim()) {
      filtered = filtered.filter((session) =>
        session.sessionName.toLowerCase().includes(searchSubject.toLowerCase())
      );
    }
    setFilteredSessions(filtered);
  };

  const handleBook = (sessionId) => {
    const postReq = {
      sessionId: sessionId,
      studentId: user._id,
    };

    axios
      .post("http://localhost:5000/api/bookings/create", postReq, {
        withCredentials: true,
      })
      .then((response) => {
        setBookingStatus((prev) => ({
          ...prev,
          [sessionId]: { success: true, message: "Booking successful!" },
        }));
      })
      .catch((error) => {
        const errorMsg =
          error.response?.data?.message || "Booking failed. Try again.";
        setBookingStatus((prev) => ({
          ...prev,
          [sessionId]: { success: false, message: errorMsg },
        }));
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6 flex flex-col items-center">
      <div className="bg-white w-full max-w-5xl p-8 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Search for Sessions
        </h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Teacher Name"
            value={searchTeacher}
            onChange={(e) => setSearchTeacher(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2"
          />
          <input
            type="text"
            placeholder="Search by Subject Name"
            value={searchSubject}
            onChange={(e) => setSearchSubject(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {filteredSessions.map((session) => (
          <div
            key={session._id}
            className="border p-4 rounded shadow bg-gray-50"
          >
            {bookingStatus[session._id] && (
              <p
                className={`mt-2 text-sm ${
                  bookingStatus[session._id].success
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {bookingStatus[session._id].message}
              </p>
            )}
            <h2 className="text-xl font-semibold text-blue-700">
              {session.subject}
            </h2>
            <p className="text-sm text-gray-600">
              Session Name: {session.sessionName}
            </p>
            <p className="text-sm text-gray-600">
              Classroom: {session.classroom}
            </p>
            <p className="text-sm text-gray-600">Type: {session.sessionType}</p>
            <p className="text-sm text-gray-600">
              Time: {session.timeSlot.startTime} - {session.timeSlot.endTime}
            </p>
            <p className="text-sm text-gray-600">
              Dates: {session.dates.join(", ")}
            </p>
            <p className="text-sm text-gray-600">
              Available Seats: {session.maxSeats - session.bookedSeats}
            </p>
            <p className="text-sm text-gray-600">
              Max Seats: {session.maxSeats}
            </p>
            <p className="text-sm text-gray-600">
              Teacher: {session.teacherId?.name}
            </p>

            <button
              onClick={() => handleBook(session._id)}
              className="inline-block mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
