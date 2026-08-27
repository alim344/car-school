import { useEffect, useState } from "react";
import WeeklyCalendar from "../../components/WeeklyCalendar";
import PracticalClassModal from "../../components/PracticalClassModal";
import CreateClassModal from "../../components/CreateClassModal";
import MakeScheduleModal from "../../components/MakeScheduleModal";

import "../../style/InstructorSchedule.css";

export default function InstructorSchedule() {

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newClassStart, setNewClassStart] = useState(null);
    const [newClassEnd, setNewClassEnd] = useState(null);

    const [makeScheduleOpen, setMakeScheduleOpen] = useState(false);

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

    const handleMakeSchedule = (option) => {
        console.log("Selected option:", option);
        
        
        if (option === 'manual') {
            setMakeScheduleOpen(false);
        } else if (option === 'copy') {
            setMakeScheduleOpen(false);
        }
    };


    return (
        <div className="schedule-container">

            <div className="calendar-section">
                <WeeklyCalendar
                    events={events}
                    onTimeSelect={(info) => {
                        setNewClassStart(info.start);
                        setNewClassEnd(info.end);
                        setCreateModalOpen(true);
                    }}
                    onEventClick={(info) => {
                        setSelectedClass(info.event);
                    }}
                />
            </div>

            {/* Sidebar with two views */}
            <div className="schedule-sidebar">
                
                {!createModalOpen && (
                    <div className="sidebar-default">
                        <h2>Schedule</h2>
                         <button
                            className="make-schedule-button"
                            onClick={() => setMakeScheduleOpen(true)}
                        >
                            📅 Make Schedule
                        </button>

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
                )}

               
                {createModalOpen && (
                    <div className="sidebar-create-form">
                        <CreateClassModal
                            isOpen={createModalOpen}
                            initialStart={newClassStart}
                            initialEnd={newClassEnd}
                            onClose={() => setCreateModalOpen(false)}
                            onCreated={(newClass) => {
                                setClasses(prev => [...prev, newClass]);
                                setCreateModalOpen(false);
                            }}
                        />
                    </div>
                )}

            </div>

            <PracticalClassModal
                selectedClass={selectedClass}
                onClose={() => setSelectedClass(null)}
            />


            <MakeScheduleModal
                isOpen={makeScheduleOpen}
                onClose={() => setMakeScheduleOpen(false)}
                onSelect={handleMakeSchedule}
            />

        </div>
    );
}