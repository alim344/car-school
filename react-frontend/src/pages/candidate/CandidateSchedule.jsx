import { useEffect, useState } from "react";

import WeeklyCalendar from "../../components/WeeklyCalendar";
import "../../style/CandidateSchedule.css"


export default function CandidateSchedule(){

    const [classes, setClasses] = useState([]);

   
    const token = localStorage.getItem("userToken");
    
    
        useEffect(() => {
            fetch("http://localhost:8080/schedule/get-cand", {
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

    

    


    return(

        <div className="candidate-schedule-container">
            
                    <div className="candidate-calendar-section">
                        <WeeklyCalendar
                            events={events}
                            onEventClick={() => {}}
                            onTimeSelect={() => {}}
                        />
                    </div>
                </div>

    );


}