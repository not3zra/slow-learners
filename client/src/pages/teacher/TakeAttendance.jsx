import { useState, useEffect } from "react";
import axios from "axios";
import Button from "../../components/Button";
import { useNavigate, useParams } from "react-router-dom";

export default function TakeAttendance() {
    const navigate = useNavigate();    
    const { sessionId, date: sessionDate } = useParams(); // ✅ get date from params
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [bookingList, setBookingList] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [markedAttendance, setMarkedAttendance] = useState({});
    const [tempAttendance, setTempAttendance] = useState({});

    useEffect(() => {
        if (!sessionId || !sessionDate) return;
        axios.get(`http://localhost:5000/api/attendance/session/${sessionId}`, {
            params: { date: sessionDate },
            withCredentials: true,
        })
            .then(response => {
                const statusMap = {};
                response.data.forEach(entry => {
                    statusMap[entry.student._id] = entry.status;
                });
                setMarkedAttendance(statusMap);
            })
            .catch(() => {});
    }, [sessionId, sessionDate]);

    useEffect(() => {
        axios.get("http://localhost:5000/auth/verify", { withCredentials: true })
            .then(response => {
                setUser(response.data.user);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!user || !user._id) return;
        axios.get("http://localhost:5000/api/sessions/list", { 
            params: { teacherId: user._id }, 
            withCredentials: true 
        })
            .then(response => {
                setSessions(response.data.sessions || response.data);
            })
            .catch(() => {});
    }, [user]);

    useEffect(() => {
        if (!sessionId) return;
        axios.get(`http://localhost:5000/api/bookings/${sessionId}`, { withCredentials: true })
            .then(response => {
                const sortedBookings = response.data.sort((a, b) => {
                    const regA = a.studentId.registerNumber.slice(-4);
                    const regB = b.studentId.registerNumber.slice(-4);
                    return regA.localeCompare(regB, undefined, { numeric: true });
                });
                setBookingList(sortedBookings);
            })
            .catch(() => {});
    }, [sessionId]);

    const handleAttendance = (studentId, status) => {
        setTempAttendance(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const confirmAttendance = async () => {
        if (Object.keys(tempAttendance).length === 0) {
            alert("No attendance changes to confirm.");
            return;
        }

        try {
            for (const studentId of Object.keys(tempAttendance)) {
                await axios.delete(
                    `http://localhost:5000/api/attendance/delete/${studentId}/${sessionId}`,
                    {
                        params: { date: sessionDate },
                        withCredentials: true,
                    }
                );
            }

            for (const [studentId, status] of Object.entries(tempAttendance)) {
                await axios.post(
                    "http://localhost:5000/api/attendance/",
                    {
                        student: studentId,
                        session: sessionId,
                        date: sessionDate, 
                        status: status,
                        markedBy: user._id,
                    },
                    { withCredentials: true }
                );
            }

            setStatusMessage("Attendance confirmed!");
            setTimeout(() => setStatusMessage(""), 2000);
            setMarkedAttendance(tempAttendance);
            setTempAttendance({});
            setTimeout(() => {
                navigate(`/teacher/view-session/${sessionId}`);
            }, 1000);
        } catch (error) {
            alert("Failed to confirm attendance. Error:", error);
        }
    };

    return (
        <div className="flex flex-col">
            <h1 className="text-center text-4xl font-bold">Attendance</h1>
            <br />
            {statusMessage && <p className="text-center text-green-600">{statusMessage}</p>}
            <h2 className="text-lg font-bold">Students</h2>
            <br />
            {bookingList.map((booking) => {
                const studentId = booking.studentId._id;
                const attendanceStatus = tempAttendance[studentId] || markedAttendance[studentId];

                return (
                    <div key={studentId} className="p-4 border rounded shadow-md mb-2 flex justify-between items-center">
                        <div className="flex flex-col justify-between items-start w-1/2">
                            <h3 className="text-lg font-bold">{booking.studentId.name}</h3>
                            <p className="text-gray-600">{booking.studentId.registerNumber}</p>
                            {attendanceStatus && (
                                <p className="text-sm text-blue-500 font-semibold">Marked: {attendanceStatus}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Button
                                label="Present"
                                variant="success"
                                onClick={() => handleAttendance(studentId, "Present")}
                            />
                            <Button
                                label="Absent"
                                variant="danger"
                                onClick={() => handleAttendance(studentId, "Absent")}
                            />
                        </div>
                    </div>
                );
            })}

            <div className="text-center mt-4">
                <Button label="Confirm Attendance" variant="primary" onClick={confirmAttendance} />
            </div>
        </div>
    );
}
