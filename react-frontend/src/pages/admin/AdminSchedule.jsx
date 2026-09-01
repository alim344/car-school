import { useEffect, useState } from "react";
import "../../style/AdminSchedule.css";
import WeeklyCalendar from "../../components/WeeklyCalendar";
import ExamDetailsModal from "../../components/ExamDetailsModal";

export default function AdminSchedule() {
    const [events, setEvents] = useState([]);
    const [exams, setExams] = useState([]); 
    const [selectedExam, setSelectedExam] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const token = localStorage.getItem("userToken");

    useEffect(() => {
        fetch("http://localhost:8080/p-exam/admin/schedule", {
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
                setExams(data);
                
                const transformedEvents = data.map(exam => ({
                    id: exam.id,
                    title: exam.candidate_name || "Exam",
                    start: exam.dateTime,
                    end: exam.dateTime,
                    classNames: [
                        `exam-status-${exam.status?.toLowerCase() || 'scheduled'}`
                    ],
                    extendedProps: {
                        status: exam.status,
                        score: exam.score,
                        candidateEmail: exam.candidate_email,
                        candidateName: exam.candidate_name,
                        adminEmail: exam.admin_email,
                        adminName: exam.admin_name
                    }
                }));
                setEvents(transformedEvents);
            })
            .catch(error => {
                console.error("Error fetching schedule:", error);
            });
    }, [token]);

    const handleEventClick = (info) => {
        const examId = Number(info.event.id);
        const exam = exams.find(e => e.id === examId);
        
        if (exam) {
            setSelectedExam(exam);
            setModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedExam(null);
    };

    const handleCancelExam = async (examToCancel) => {
        try {
            const response = await fetch("http://localhost:8080/p-exam/admin/cancel", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: examToCancel.id,
                    status: "CANCELLED"
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const updatedExam = await response.json();
            
            setExams(prev => 
                prev.map(exam => 
                    exam.id === updatedExam.id ? updatedExam : exam
                )
            );

            setEvents(prev => 
                prev.map(event => 
                    Number(event.id) === updatedExam.id 
                        ? {
                            ...event,
                            classNames: [`exam-status-cancelled`],
                            extendedProps: {
                                ...event.extendedProps,
                                status: updatedExam.status
                            }
                        }
                        : event
                )
            );

            handleCloseModal();
            
            alert(`Exam for ${examToCancel.candidate_name} has been cancelled successfully.`);
        } catch (error) {
            console.error("Error cancelling exam:", error);
            throw error;
        }
    };

    return (
        <div className="admin-schedule-container">
            <div className="admin-calendar-section">
                <WeeklyCalendar
                    events={events}
                    onEventClick={handleEventClick}
                    onTimeSelect={() => {}}
                />
            </div>

            <ExamDetailsModal
                isOpen={modalOpen}
                exam={selectedExam}
                onClose={handleCloseModal}
                onCancel={handleCancelExam}
            />
        </div>
    );
}