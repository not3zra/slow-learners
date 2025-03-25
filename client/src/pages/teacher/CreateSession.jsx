import { useEffect, useState } from "react";
import axios from "axios";
import {
  MultiDropDown,
  Select,
  TimeRangePicker,
  Button,
  Input,
} from "../../components";

export default function CreateSession() {
  const [previewMode, setPreviewMode] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null); // For feedback

  const [user, setUser] = useState(null);
  const [clsrooms, setClsRooms] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        console.log("User not authenticated");
      });
    // TODO: Fetch only available classrooms
    axios
      .get("http://localhost:5000/api/classrooms/list", {
        withCredentials: true,
      })
      .then((response) => setClsRooms(response.data.classrooms))
      .catch(() => {
        console.log("Error");
      });
  }, []);

  const [sessionData, setSessionData] = useState({
    subject: "",
    timeSlot: { startTime: null, endTime: null },
    sessionType: "Single",
    dates: [],
    classroom: undefined,
    maxSeats: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData({ ...sessionData, [name]: value });
  };

  const handleWeekLong = (e) => {
    const { name, value } = e.target;
    const getDatesUntilSunday = (selectedDate) => {
      const date = new Date(selectedDate);
      const dayOfWeek = date.getDay();

      const dates = [];
      for (let i = 0; i <= 6 - dayOfWeek; i++) {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + i);
        dates.push(nextDate.toISOString().split("T")[0]); // Format as YYYY-MM-DD
      }
      return dates;
    };
    setSessionData({ ...sessionData, dates: getDatesUntilSunday(value) });
  };

  const handleSemesterLong = (daysSelected) => {
    console.log("Inside");
    const getSemesterDates = (days) => {
      const today = new Date();
      let semesterStart, semesterEnd;

      // Determine the current semester based on the month
      if (today.getMonth() >= 5 && today.getMonth() <= 10) {
        // Fall Semester [June to November]
        semesterStart = new Date(today.getFullYear(), 5, 1);
        semesterEnd = new Date(today.getFullYear(), 10, 30);
      } else {
        // Winter Semester [December to May]
        semesterStart = new Date(
          today.getMonth() === 11
            ? today.getFullYear()
            : today.getFullYear() - 1,
          11,
          1
        );
        semesterEnd = new Date(
          today.getMonth() === 11
            ? today.getFullYear() + 1
            : today.getFullYear(),
          4,
          31
        );
      }

      const result = [];

      let currentDate = new Date(semesterStart);
      while (currentDate <= semesterEnd) {
        const currentDayName = currentDate.toLocaleDateString("en-US", {
          weekday: "long",
        });

        if (days.includes(currentDayName)) {
          result.push(new Date(currentDate));
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return result.map((date) => date.toISOString().split("T")[0]); // Return in YYYY-MM-DD format
    };
    setSessionData({ ...sessionData, dates: getSemesterDates(daysSelected) });
  };

  const handleSubmit = () => {
    var finalData = {
      ...sessionData,
      maxSeats: parseInt(sessionData.maxSeats),
      sessionName: `${sessionData.subject}-${sessionData.sessionType}-${sessionData.timeSlot.startTime}-${sessionData.timeSlot.endTime}-${sessionData.classroom}`,
      teacherId: user._id,
    };
    axios
      .post("http://localhost:5000/api/sessions/create", finalData, {
        withCredentials: true,
      })
      .then((response) => {
        setSubmissionMessage({
          type: "success",
          text: "Session created successfully!",
        });
      })
      .catch((error) => {
        setSubmissionMessage({
          type: "error",
          text: "Error creating session. Please try again." + error.message,
        });
      });
  };

  // TODO: Fetch available Classrooms based on the session date and times
  useEffect(() => {}, [sessionData.dates]);

  useEffect(() => console.log(sessionData), [sessionData]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg">
        {submissionMessage && (
          <div
            className={`text-center p-3 rounded-lg mb-4 ${
              submissionMessage.type === "success"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {submissionMessage.text}
          </div>
        )}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            {previewMode ? "Review your selections" : "Create a Session"}
          </h1>
        </div>
        {!previewMode && (
          <div>
            <Select
              label="Select Subject"
              name="subject"
              options={
                user
                  ? user.subjectsTeaching
                  : ["No Subjects.Please add more via your profile"]
              }
              onChange={handleChange}
              value={sessionData.subject || ""}
            />
            <br></br>
            <label className="block text-sm font-medium mb-1">
              Select time slot
            </label>
            <TimeRangePicker
              onTimeSelect={(time) => {
                setSessionData({
                  ...sessionData,
                  timeSlot: {
                    startTime: time.startTime,
                    endTime: time.endTime,
                  },
                });
              }}
            />
            <br></br>
            <Select
              label="Choose session type"
              name="sessionType"
              options={[
                {
                  value: "Single",
                  title: "Create the session only for the single day",
                },
                {
                  value: "Week-Long",
                  title: "Create the session for a whole week",
                },
                {
                  value: "Semester-Long",
                  title: "Create the session for the whole of current semester",
                },
                {
                  value: "Custom",
                  title: "Create the session on custom dates",
                },
              ]}
              onChange={handleChange}
              value={sessionData.sessionType}
            />
            <br></br>
            {sessionData.sessionType === "Single" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select date
                </label>
                <input
                  type="date"
                  onChange={(e) =>
                    setSessionData({
                      ...sessionData,
                      dates: [e.target.value],
                    })
                  }
                  className="p-2 border rounded w-full"
                />
              </div>
            )}
            {sessionData.sessionType === "Week-Long" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select The Start Date for the classes to start for that whole
                  week
                </label>
                <input
                  type="date"
                  onChange={(e) => handleWeekLong(e)}
                  className="p-2 border rounded w-full"
                />
              </div>
            )}
            {sessionData.sessionType === "Semester-Long" && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select the days for the classes to be scheduled
                </label>
                <MultiDropDown
                  options={[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ]}
                  defaultOptionText="Select the day(s)"
                  selectedOptionText="Selected Days are"
                  onSelectionChange={handleSemesterLong}
                />
              </div>
            )}
            {/* TODO: CUSTOM DATES */}
            <br></br>
            <Select
              label="Select Classroom"
              name="classroom"
              options={clsrooms.map((cls) => cls.name)}
              onChange={handleChange}
              value={sessionData.classroom || ""}
            />
            <br></br>
            <Input
              name="maxSeats"
              value={sessionData.maxSeats}
              onChange={handleChange}
              placeholder="Enter capacity"
            />
            <br></br>
            <Button
              label="Confirm"
              name="confirm"
              onClick={() => setPreviewMode(true)}
            />
          </div>
        )}
        {previewMode && (
          <div className="p-6 border rounded-xl shadow-lg bg-white space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-bold">📚 Subject:</span>
                <span>{sessionData.subject || "Not selected"}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">🕒 Time Slot:</span>
                <span>
                  {sessionData.timeSlot.startTime || "N/A"} -{" "}
                  {sessionData.timeSlot.endTime || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">📅 Session Type:</span>
                <span>{sessionData.sessionType}</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-bold">📋 Dates:</span>
                <div className="ml-2">
                  {sessionData.dates.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {sessionData.dates.map((date, index) => (
                        <li key={index}>{date}</li>
                      ))}
                    </ul>
                  ) : (
                    <span>No dates selected</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">🏫 Classroom:</span>
                <span>{sessionData.classroom || "Not selected"}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold">🪑 Maximum Seats:</span>
                <span>{sessionData.maxSeats || "Not specified"}</span>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 w-1/3"
                onClick={handleSubmit}
              >
                ✅ Confirm
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 w-1/3"
                onClick={() => setPreviewMode(false)}
              >
                🔄 Go Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
