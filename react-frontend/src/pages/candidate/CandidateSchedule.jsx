import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import WeeklyCalendar from "../../components/WeeklyCalendar";
import "../../style/CandidateSchedule.css"
import PracticalClassModal from "../../components/PracticalClassModal";
import DeclineClassModal from "../../components/DeclineClassModal";
import RescheduleClassModal from "../../components/RescheduleCLassModal";
import { buildLeaveEvents, toBlockedRanges } from "../../utils/leaveEvents";


export default function CandidateSchedule(){

    const [classes, setClasses] = useState([]);
    const [leaves, setLeaves] = useState([]);

    const [selectedClass, setSelectedClass] = useState(null);

    const location = useLocation();

    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);

    const [declineModalOpen, setDeclineModalOpen] = useState(
        () => !!(location.state?.openDecline && location.state?.classToDecline)
    );
    const [classToDecline, setClassToDecline] = useState(
        () => location.state?.classToDecline ?? null
    );
    
    const leaveEvents = buildLeaveEvents(leaves, { source: "instructor" });

    const navigate = useNavigate();
    
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





                fetch("http://localhost:8080/leave/cand-get", {
                    headers: { Authorization: `Bearer ${token}` }
                })
                    .then(response => {
                        if (!response.ok) throw new Error(`HTTP ${response.status}`);
                        return response.json();
                    })
                    .then(data => setLeaves(data))
                    .catch(error => console.error("Error fetching instructor leaves:", error));
        }, [token]);

        const handleDeclineClick = (classId) => {

            const classToDecline = classes.find(
                cls => cls.id === Number(classId)
            );

            setClassToDecline(classToDecline);

            setSelectedClass(null);

            setDeclineModalOpen(true);
        };


        useEffect(() => {
            if (location.state?.openDecline) {
                navigate(location.pathname, { replace: true, state: {} });
            }
            
        }, []);


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
        if (info.event.display === "background") return;
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

            } catch (error) {
                console.error("Error cancelling class:", error);
                alert("Could not cancel the class.");
            }
        };


    return(

        <div className="candidate-schedule-container">
            
                    <div className="candidate-calendar-section">
                        <WeeklyCalendar
                            events={[...leaveEvents, ...events]}
                            blockedRanges={toBlockedRanges(leaves)}
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