import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "../../style/InstructorSchedule.css";

export default function InstructorSchedule() {

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    const token = localStorage.getItem("userToken");

    useEffect(() => {
        fetch("http://localhost:8080/schedule/get-inst", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setClasses(data);
            })
            .catch(error => {
                console.error("Error fetching schedule:", error);
            });
    }, [token]);

    const events = classes.map(cls => ({
        id: cls.id,
        title: cls.candidateName,
        start: cls.scheduledStartTime,
        end: cls.scheduledEndTime,
        classNames: [
            `class-status-${cls.classStatus.toLowerCase()}`
        ],

        extendedProps: {
            status: cls.classStatus,
            location: cls.location,
            comment: cls.comment,
            candidateEmail: cls.candidateEmail,
            routeId: cls.routeId,
            grade: cls.grade,
            remarks: cls.remarks
        }
    }));

    return (
        <div className="instructor-calendar">

            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={events}
                height="auto"
                slotMinTime="07:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={false}

                slotLabelFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }}

                eventTimeFormat={{
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                }}

                eventContent={(eventInfo) => (
                    <div className="calendar-event">
                        <div className="calendar-event-time">
                            {eventInfo.timeText}
                        </div>

                        <div className="calendar-event-name">
                            {eventInfo.event.title}
                        </div>

                        <div className="calendar-event-status">
                            {eventInfo.event.extendedProps.status}
                        </div>
                    </div>
                )}

                eventClick={(info) => {
                    setSelectedClass(info.event);
                }}
            />

           

            {selectedClass && (
                <div
                    className="class-modal-overlay"
                    onClick={() => setSelectedClass(null)}
                >
                    <div
                        className="class-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="class-modal-header">
                            <h2>
                                {selectedClass.title}
                            </h2>

                            <button
                                className="class-modal-close"
                                onClick={() => setSelectedClass(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="class-modal-body">

                            <div className="class-info">
                                <span>Time</span>
                                <strong>
                                    {selectedClass.start?.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false
                                    })}
                                    {" - "}
                                    {selectedClass.end?.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false
                                    })}
                                </strong>
                            </div>

                            <div className="class-info">
                                <span>Status</span>
                                <strong>
                                    {selectedClass.extendedProps.status}
                                </strong>
                            </div>

                            <div className="class-info">
                                <span>Candidate email</span>
                                <strong>
                                    {selectedClass.extendedProps.candidateEmail || "-"}
                                </strong>
                            </div>

                            <div className="class-info">
                                <span>Location</span>
                                <strong>
                                    {selectedClass.extendedProps.location || "-"}
                                </strong>
                            </div>

                            <div className="class-info">
                                <span>Route ID</span>
                                <strong>
                                    {selectedClass.extendedProps.routeId || "-"}
                                </strong>
                            </div>

                            <div className="class-info">
                                <span>Grade</span>
                                <strong>
                                    {selectedClass.extendedProps.grade ?? "-"}
                                </strong>
                            </div>

                            <div className="class-info">
                                <span>Comment</span>
                                <strong>
                                    {selectedClass.extendedProps.comment || "-"}
                                </strong>
                            </div>

                            <div className="class-info">
                                <span>Remarks</span>
                                <strong>
                                    {selectedClass.extendedProps.remarks || "-"}
                                </strong>
                            </div>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}