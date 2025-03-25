import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./SessionCalender.css";
import { Button } from "../../components";

export default function ViewSingleSession() {
  const { id } = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/sessions/${id}`, {
        withCredentials: true,
      })
      .then((response) => setSession(response.data.session))
      .catch(() => console.log("Error fetching session details"));
  }, [id]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-500">Loading session details...</div>
      </div>
    );
  }

  console.log(session.dates)
  const markedDates = session.dates.map((date) => new Date(date));

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const isMarked = markedDates.some(
        (markedDate) =>
          date.getFullYear() === markedDate.getFullYear() &&
          date.getMonth() === markedDate.getMonth() &&
          date.getDate() === markedDate.getDate()
      );

      return isMarked ? <div className="highlight"></div> : null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-md space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          {session.subject || "Session Details"}
        </h1>

        <div className="space-y-4 text-gray-700">
          <div>
            <strong>🕒 Time Slot:</strong> {session.timeSlot.startTime} -{" "}
            {session.timeSlot.endTime}
          </div>
          <div>
            <strong>🏫 Classroom:</strong>{" "}
            {session.classroom || "Not specified"}
          </div>
          <div>
            <strong>🪑 Maximum Seats:</strong>{" "}
            {session.maxSeats || "Not specified"}
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-700 mb-2">
            📅 Scheduled Dates
          </h2>
          <Calendar tileContent={tileContent} />
        </div>

        <div className="flex justify-between mt-6">
          <Button
            label="📝 Mark Attendance"
            name="mark-attendance"
            onClick={() => console.log("Mark Attendance Clicked")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-1/2"
          />
          <Button
            label="📁 Upload Materials"
            name="upload-materials"
            onClick={() => console.log("Upload Materials Clicked")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg w-1/2"
          />
        </div>
      </div>
    </div>
  );
}
