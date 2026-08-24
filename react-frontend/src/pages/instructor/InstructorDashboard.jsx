import NavBar from "../../components/NavBar";
import { useState,useEffect } from "react";
import axios from "axios";
import '../../style/InstructorDashboard.css'
import SessionClassCard from "../../components/SessionClassCard";

function InfoCard({title,number}){

    return(
        <div className="card">
        <div className="card-component">
            <div className="card-title">
            <h1>{title}</h1>
            </div>
            <div className="card-number">
                <h3>{number}</h3>
            </div>
        </div>

    </div>
    );

}

function formatTime(dateString) {
    if (!dateString) return "--:--";
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function EndedClassCard({pc}){
    return(
        <div className="class-card ended-card">
            <div className="class-card-name">{pc.candidateName}</div>
            <div className="class-card-times">
                <span>{formatTime(pc.scheduledStartTime)}</span>
                <span className="time-separator">–</span>
                <span>{formatTime(pc.scheduledEndTime)}</span>
            </div>
        </div>
    );
}

function CanceledClassCard({pc}){
    return(
        <div className="class-card ended-card">
            <div className="class-card-name">{pc.candidateName}</div>
            <div className="class-card-times">
                <span>{formatTime(pc.scheduledStartTime)}</span>
                <span className="time-separator">–</span>
                <span>{formatTime(pc.scheduledEndTime)}</span>
            </div>
        </div>
    );
}


function AcceptedClassCard({ pc, onStart, onCancel }) {
    return (
        <div className="class-card accepted-card">
            <div className="class-card-name">{pc.candidateName}</div>
            <div className="class-card-location">
                 {pc.location}
            </div>
            <div className="class-card-times">
                <span>{formatTime(pc.scheduledStartTime)}</span>
                <span className="time-separator">–</span>
                <span>{formatTime(pc.scheduledEndTime)}</span>
            </div>
             
            <div className="class-card-actions">
                <button className="start-btn" onClick={() => onStart(pc.id)}>Start</button>
                <button className="cancel-btn" onClick={() => onCancel(pc.id)}>Cancel</button>
            </div>
        </div>
    );
}

function InterruptedClassCard({ pc }) {
    return (
        <div className="class-card interrupted-card">
            <div className="class-card-name">{pc.candidateName}</div>
            <div className="class-card-times">
                <span>{formatTime(pc.scheduledStartTime)}</span>
                <span className="time-separator">–</span>
                <span>{formatTime(pc.scheduledEndTime)}</span>
            </div>
            <div className="interruption-reason">
                 {pc.interruptionReason || "Interrupted"}
            </div>
        </div>
    );
}


export default function InstructorDashboard() {
  
    const [dashboardData, setDashboardData] = useState(null);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const token  = localStorage.getItem("userToken");

    function sortByStartTime(classes) {
        return [...classes].sort(
            (a, b) => new Date(a.scheduledStartTime) - new Date(b.scheduledStartTime)
        );
    }   

    useEffect(()=>{
        const fetchDashboard = async () => {

            try{

                
                
                setLoading(true);
                const response = await axios.get('http://localhost:8080/instructor/dashboard',{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                 })

                 setDashboardData(response.data);



            }catch(error){
                alert(error);
                setError('Failed to load dashboard data.');
            }finally {
                setLoading(false);
            }


        }


        fetchDashboard();

    },[]);

     const updateClassStatus = (classId, newStatus) => {
        setDashboardData(prev => ({
            ...prev,
            todayClasses: prev.todayClasses.map(pc =>
                pc.id === classId ? { ...pc, classStatus: newStatus } : pc
            )
        }));
    };

    const refreshDashboard = async () => {

        const fetchDashboard = async () => {

            try{

                
                
                setLoading(true);
                const response = await axios.get('http://localhost:8080/instructor/dashboard',{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                 })

                 setDashboardData(response.data);



            }catch(error){
                alert(error);
                setError('Failed to load dashboard data.');
            }finally {
                setLoading(false);
            }


        }

        await fetchDashboard();
    };


    const handleStart = async (classId) => {
        try{
            
            await axios.patch(`http://localhost:8080/practical-class/start/${classId}`,  {},                                    // empty request body
            {                                      
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            updateClassStatus(classId,"STARTED");

        }catch(error){
            alert(error);
        }
    };

    const handleCancel = async (classId) => {
        const confirmed = window.confirm("Are you sure you want to cancel this class?");
        if (!confirmed) return;

        try{
            
            await axios.patch(`http://localhost:8080/practical-class/cancel/${classId}`,  {},                                    // empty request body
            {                                      
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            updateClassStatus(classId,"CANCELLED");

        }catch(error){
            alert(error);
        }
    };

    const handleEndClass = async () => {
        await refreshDashboard();
    };

    const handleInterruptClass = async () => {
        await refreshDashboard();
    };



    if (loading) return <div className="loading">Loading dashboard...</div>;
    if (error) return <div className="error">{error}</div>;


    const sessionClasses = sortByStartTime(
        dashboardData.todayClasses.filter(pc => pc.classStatus === "STARTED")
    );
    const acceptedClasses = sortByStartTime(
        dashboardData.todayClasses.filter(pc => pc.classStatus === "ACCEPTED")
     );
    const endedClasses = sortByStartTime(
        dashboardData.todayClasses.filter(pc => pc.classStatus === "ENDED")
    );
    const canceledClasses = sortByStartTime(
        dashboardData.todayClasses.filter(pc => pc.classStatus === "CANCELLED")
    );
  const interruptedClasses = sortByStartTime(
        dashboardData.todayClasses.filter(pc => pc.classStatus === "BAD_END")
    );



    return(

        <div className="dashboard-page">
            <NavBar showAuthButtons= {false}/>

            
                <div className="dashboard-cards">
                    <InfoCard title={"Number of students"} number={dashboardData?.studentsNum}></InfoCard>
                    <InfoCard title={"Classes today"} number={dashboardData?.todayClassesNum}></InfoCard>
                    <InfoCard title={"Number of requests"} number={dashboardData?.requestNum}></InfoCard>
                </div>

                <hr className="divider" />

                <div className="classes">
                

                    <div className="class-section">
                        <div className="class-header">
                            <span>Current Session</span>
                        </div>
                        <div className="class-list">
                            {sessionClasses.length === 0 && (
                                <div className="empty-state">No active session</div>
                            )}
                            {sessionClasses.map(pc => (
                                <SessionClassCard key={pc.id} pc={pc} onEndClass={handleEndClass}
                                    onInterruptClass={handleInterruptClass}/>
                            ))}
                        </div>
                    </div>

                    <div className="class-section">
                        <div className="class-header">
                            <span>Upcoming Classes</span>
                        </div>
                        <div className="class-list">
                            {acceptedClasses.length === 0 && (
                                <div className="empty-state">No upcoming classes</div>
                            )}
                            {acceptedClasses.map(pc => (
                                <AcceptedClassCard
                                    key={pc.id}
                                    pc={pc}
                                    onStart = {handleStart}
                                    onCancel={handleCancel}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="class-section">
                        <div className="class-header">
                            <span>Ended Classes</span>
                        </div>
                        <div className="class-list">
                            {endedClasses.length === 0 && (
                                <div className="empty-state">No ended classes</div>
                            )}
                            {endedClasses.map(pc => (
                                <EndedClassCard key={pc.id} pc={pc} />
                            ))}
                        </div>
                    </div>

                    <div className="class-section">
                        <div className="canceled-header">
                            <span>Canceled Classes</span>
                        </div>
                        <div className="class-list">
                            {canceledClasses.length === 0 && (
                                <div className="empty-state">No canceled classes</div>
                            )}
                            {canceledClasses.map(pc => (
                                <CanceledClassCard key={pc.id} pc={pc} />
                            ))}
                        </div>
                    </div>

                    {interruptedClasses.length > 0 && (
                        <div className="class-section">
                            <div className="canceled-header">
                                <span>Interrupted Classes</span>
                            </div>
                            <div className="class-list">
                                {interruptedClasses.map(pc => (
                                    <InterruptedClassCard key={pc.id} pc={pc} />
                                ))}
                            </div>
                        </div>
                    )}


                
            </div>


            

        </div>

    );



}