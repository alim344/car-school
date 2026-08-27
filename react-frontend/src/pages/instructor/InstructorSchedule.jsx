import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import PracticalClassModal from "../../components/PracticalClassModal";
import CreateClassModal from "../../components/CreateClassModal";

import "../../style/InstructorSchedule.css";

export default function InstructorSchedule() {

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newClassStart, setNewClassStart] = useState(null);
    const [newClassEnd, setNewClassEnd] = useState(null);

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
        <div className="schedule-container">

            <div className="schedule-header">

                <h2>Create Schedule</h2>

                <button
                    className="create-class-button"
                    onClick={() => {
                        setNewClassStart(null);
                        setNewClassEnd(null);
                        setCreateModalOpen(true);
                    }}
                >
                    + Create a Class
                </button>

            </div>
            <div className="instructor-calendar">

                <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={events}
                    height="auto"
                    slotMinTime="07:00:00"
                    slotMaxTime="22:00:00"
                    allDaySlot={false}

                    select={(info) => {
                        setNewClassStart(info.start);
                        setNewClassEnd(info.end);
                        setCreateModalOpen(true);
                    }}

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

            
                <PracticalClassModal
                    selectedClass={selectedClass}
                    onClose={() => setSelectedClass(null)}
                />

                <CreateClassModal
                    key={`${newClassStart}-${newClassEnd}`}
                    isOpen={createModalOpen}
                    initialStart={newClassStart}
                    initialEnd={newClassEnd}
                    onClose={() => setCreateModalOpen(false)}
                    onCreated={(newClass) => {
                        setClasses(prev => [...prev, newClass]);
                    }}
                />
                            

            </div>
        </div>
    );
}