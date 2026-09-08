import { useEffect, useState } from "react";

import WeeklyCalendar from "../../components/WeeklyCalendar";
import "../../style/CandidateSchedule.css"
import PracticalClassModal from "../../components/PracticalClassModal";
import DeclineClassModal from "../../components/DeclineClassModal";
import RescheduleClassModal from "../../components/RescheduleCLassModal";


export default function CandidateSchedule(){

    const [classes, setClasses] = useState([]);

    const [selectedClass, setSelectedClass] = useState(null);

    const [declineModalOpen, setDeclineModalOpen] = useState(false);

    const [classToDecline, setClassToDecline] = useState(null);

    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    

   
    const token = localStorage.getItem("userToken");
    
    
        useEffect(() => {
            fetch("http://localhost:8080/schedule/cand/get-cand", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    setClasses(data);
                })
                .catch(error => {
                    console.error("Error fetching schedule:", error);
                });
        }, [token]);

        const handleDeclineClick = (classId) => {

            const classToDecline = classes.find(
                cls => cls.id === Number(classId)
            );

            setClassToDecline(classToDecline);

            setSelectedClass(null);

            setDeclineModalOpen(true);
        };



        const handleAcceptClass = async (classId) => {

            try {

                const response = await fetch(
                    `http://localhost:8080/schedule/cand/accept-class/${classId}`,
                    {
                        method: "PATCH",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                setClasses(prev =>
                    prev.map(cls =>
                        cls.id === Number(classId)
                            ? {
                                ...cls,
                                classStatus: "ACCEPTED"
                            }
                            : cls
                    )
                );

                setSelectedClass(null);

            } catch (error) {

                console.error("Error accepting class:", error);
                alert("Could not accept the class.");

            }
        };


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


    const handleRescheduleRequest = async (dto) => {

        try {

            const response = await fetch(
                "http://localhost:8080/schedule/cand/request-class",
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify(dto)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            setClasses(prev =>
                prev.filter(
                    cls => cls.id !== dto.id
                )
            );

            setRescheduleModalOpen(false);

            setClassToDecline(null);

            alert("Reschedule request submitted successfully.");

        } catch (error) {

            console.error(
                "Error requesting reschedule:",
                error
            );

            alert(
                "Could not submit reschedule request."
            );

        }
    };
        
    const handleEventClick = (info) => {
        setSelectedClass(info.event);
    };


    const handleSkipWeek = async () => {

            if (!classToDecline) {
                return;
            }

            try {

                const response = await fetch(
                    `http://localhost:8080/schedule/cand/decline-class/${classToDecline.id}`,
                    {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                setClasses(prev =>
                    prev.filter(
                        cls => cls.id !== classToDecline.id
                    )
                );

                setDeclineModalOpen(false);
                setClassToDecline(null);

            } catch (error) {

                console.error("Error declining class:", error);
                alert("Could not decline the class.");

            }
        };
    
        const handleOpenReschedule = () => {

            setDeclineModalOpen(false);

            setRescheduleModalOpen(true);
        };

        const handleCancelClass = async (classId) => {
            try {
                const response = await fetch(
                    `http://localhost:8080/practical-class/cancel/${classId}`,
                    {
                        method: "PATCH",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                // Update the class status to CANCELLED in the UI
                setClasses(prev =>
                    prev.map(cls =>
                        cls.id === Number(classId)
                            ? {
                                ...cls,
                                classStatus: "CANCELLED"
                            }
                            : cls
                    )
                );

                setSelectedClass(null);
                alert("Class cancelled successfully.");

            } catch (error) {
                console.error("Error cancelling class:", error);
                alert("Could not cancel the class.");
            }
        };


    return(

        <div className="candidate-schedule-container">
            
                    <div className="candidate-calendar-section">
                        <WeeklyCalendar
                            events={events}
                            onEventClick={handleEventClick}
                            onTimeSelect={() => {}}
                        />
                    </div>


                    <PracticalClassModal
                        selectedClass={selectedClass}
                        onClose={() => setSelectedClass(null)}
                        isCandidateView={true}
                        onAccept={handleAcceptClass}
                        onDecline={handleDeclineClick}
                        onCancel={handleCancelClass}
                    />

                     <DeclineClassModal
                        isOpen={declineModalOpen}
                        onClose={() => {
                            setDeclineModalOpen(false);
                            setClassToDecline(null);
                        }}
                        onSkipWeek={handleSkipWeek}
                        onReschedule={handleOpenReschedule}
                       
                    />


                    <RescheduleClassModal
                        isOpen={rescheduleModalOpen}
                        classToReschedule={classToDecline}
                        onClose={() => {
                            setRescheduleModalOpen(false);
                            setClassToDecline(null);
                        }}
                        onSubmit={handleRescheduleRequest}
                    />
                </div>

    );


}