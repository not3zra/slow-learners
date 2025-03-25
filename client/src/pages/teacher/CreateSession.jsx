import { useEffect, useState } from "react";
import axios from "axios";
import { Select, TimeRangePicker } from "../../components";

export default function CreateSession() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth/verify", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        console.log("User not authenticated");
      });
  }, []);

  const [sessionData, setSessionData] = useState({
    subject: "",
    timeSlot: { startTime: null, endTime: null },
    sessionType: "Single",
    dates: [],
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

  const handleSubmit = () => {
    console.log("Session Data:", sessionData);
    // Submit logic goes here
  };

  useEffect(() => console.log(sessionData), [sessionData]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Create a Session</h1>
        </div>
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
              timeSlot: { startTime: time.startTime, endTime: time.endTime },
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
              Select The Start Date for the classes to start for that whole week
            </label>
            <input
              type="date"
              onChange={(e) => handleWeekLong(e)}
              className="p-2 border rounded w-full"
            />
          </div>
        )}
        {/* {sessionData.sessionType === "Semester-Long" && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Select the days for the classes to be scheduled
            </label>

          </div>
        )} */}
      </div>
    </div>
  );
}
