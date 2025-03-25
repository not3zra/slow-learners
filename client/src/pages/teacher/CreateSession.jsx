import { useEffect, useState } from "react";
import axios from "axios";
import { MultiDropDown, Select, TimeRangePicker, Button } from "../../components";

export default function CreateSession() {
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
    console.log("Session Data:", sessionData);
    // Submit logic goes here
  };

  // TODO: Fetch available Classrooms based on the session date and times
  useEffect(() => {}, [sessionData.dates]);

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
        <Button label="Confirm" name="confirm"  />
      </div>
    </div>
  );
}
