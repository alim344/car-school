import { useEffect, useState } from "react";
import WeeklyCalendar from "../../components/WeeklyCalendar";
import PracticalClassModal from "../../components/PracticalClassModal";
import CreateClassModal from "../../components/CreateClassModal";
import MakeScheduleModal from "../../components/MakeScheduleModal";
import ManualScheduleSidebar from "../../components/ManualScheduleSidebar";

import "../../style/InstructorSchedule.css";

export default function InstructorSchedule() {

    

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newClassStart, setNewClassStart] = useState(null);
    const [newClassEnd, setNewClassEnd] = useState(null);

  

    const [makeScheduleOpen, setMakeScheduleOpen] = useState(false);

    

    const [manualMode, setManualMode] = useState(false);
    const [candidatePreferences, setCandidatePreferences] = useState([]);
    const [selectedCandidateEmail, setSelectedCandidateEmail] = useState("");

  

    const [manualDrafts, setManualDrafts] = useState([]);

    const [classRequests, setClassRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [acceptRequestOpen, setAcceptRequestOpen] = useState(false);
 

    const token = localStorage.getItem("userToken");


    useEffect(() => {
        fetch("http://localhost:8080/schedule/inst/get", {
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

        fetch("http://localhost:8080/schedule/inst/requests", {
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
                setClassRequests(data);
            })
            .catch(error => {
                console.error("Error fetching class requests:", error);
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


    const requestEvents = selectedRequest
        ? [{
            id: `request-${selectedRequest.id}`,
            start: `${selectedRequest.date}T${selectedRequest.startTime}`,
            end: `${selectedRequest.date}T${selectedRequest.endTime}`,
            display: "background",
            classNames: ["selected-request"],
            extendedProps: {
                request: true
            }
        }]
        : [];

    

    const draftEvents = manualDrafts.map((draft, index) => ({
        id: `manual-draft-${index}`,
        title: draft.candidateName,
        start: draft.startTime,
        end: draft.endTime,
        classNames: [
            "manual-draft-event"
        ],
        extendedProps: {
            status: "DRAFT",
            location: draft.location,
            candidateEmail: draft.candidateEmail,
            isDraft: true
        }
    }));

   

    const selectedCandidate = candidatePreferences.find(
        candidate => candidate.candidateEmail === selectedCandidateEmail
    );

    

    const preferenceEvents =
        selectedCandidate?.prefDTOList?.map(pref => ({
            id: `preference-${pref.id}`,
            start: `${pref.date}T${pref.startTime}`,
            end: `${pref.date}T${pref.endTime}`,
            display: "background",
            classNames: ["selected-preference"],
            extendedProps: {
                preference: true
            }
        })) || [];

    

    const calendarEvents = [
        ...preferenceEvents,
         ...requestEvents,
        ...events,
        ...draftEvents
    ];

    const hasOverlap = (start, end) => {

        const existingOverlap = classes.some(cls => {
            const existingStart = new Date(cls.scheduledStartTime);
            const existingEnd = new Date(cls.scheduledEndTime);

            return start < existingEnd && end > existingStart;
        });

        const draftOverlap = manualDrafts.some(draft => {
            const draftStart = new Date(draft.startTime);
            const draftEnd = new Date(draft.endTime);

            return start < draftEnd && end > draftStart;
        });

        return existingOverlap || draftOverlap;
    };

    const handleRequestClick = (request) => {
        setSelectedRequest(prev =>
            prev?.id === request.id ? null : request
        );
    };


    const handleDeclineRequest = async (requestId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/schedule/inst/delete/${requestId}`,
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

            setClassRequests(prev =>
                prev.filter(request => request.id !== requestId)
            );

            if (selectedRequest?.id === requestId) {
                setSelectedRequest(null);
            }

        } catch (error) {
            console.error("Error declining request:", error);
            alert("Could not decline the request.");
        }
    };

    const handleAcceptRequest = (request) => {
        setSelectedRequest(request);

        setNewClassStart(
            new Date(`${request.date}T${request.startTime}`)
        );

        setNewClassEnd(
            new Date(`${request.date}T${request.endTime}`)
        );

        setCreateModalOpen(false);
        setManualMode(false);
        setAcceptRequestOpen(true);
    };

   

    const handleMakeSchedule = async (option) => {
        if (option === "manual") {
            try {
                const response = await fetch(
                    "http://localhost:8080/schedule/inst/candidate-prefs",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                console.log("Candidate preferences:", data);

                setCandidatePreferences(data);
                setManualMode(true);
                setMakeScheduleOpen(false);
                setSelectedCandidateEmail("");
                setManualDrafts([]);

            } catch (error) {
                console.error("Error fetching candidate preferences:", error);
            }
            return;
        }

        if (option === "copy") {
            try {
                const [copyResponse, prefsResponse] = await Promise.all([
                    fetch("http://localhost:8080/schedule/inst/copy", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),

                    fetch("http://localhost:8080/schedule/inst/candidate-prefs", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ]);

                if (!copyResponse.ok) {
                    throw new Error(`Copy HTTP ${copyResponse.status}`);
                }

                if (!prefsResponse.ok) {
                    throw new Error(`Preferences HTTP ${prefsResponse.status}`);
                }

                const copiedClasses = await copyResponse.json();
                const preferences = await prefsResponse.json();

                console.log("Copied classes:", copiedClasses);
                console.log("Candidate preferences:", preferences);

                const drafts = copiedClasses.map(cls => {
                    const candidate = preferences.find(
                        c => c.candidateEmail === cls.candidateEmail
                    );

                    return {
                        candidateEmail: cls.candidateEmail,
                        candidateName: candidate?.name || cls.candidateEmail,
                        startTime: cls.startTime,
                        endTime: cls.endTime,
                        location: cls.location || ""
                    };
                });

                setCandidatePreferences(preferences);
                setManualDrafts(drafts);

                setManualMode(true);
                setMakeScheduleOpen(false);

                setSelectedCandidateEmail("");
                setNewClassStart(null);
                setNewClassEnd(null);

            } catch (error) {
                console.error("Error copying schedule:", error);
                alert("Could not copy the schedule.");
            }

            return;
        }
    };

   

    const handleTimeSelect = (info) => {


        const now = new Date();

        if (info.start < now) {
            alert("You cannot create a class in the past.");
            return;
        }

        if (info.end <= now) {
            alert("You cannot create a class in the past.");
            return;
        }

        if (acceptRequestOpen) {
            setNewClassStart(info.start);
            setNewClassEnd(info.end);
            return;
        }

        if (hasOverlap(info.start, info.end)) {
            alert("You already have a class scheduled during this time.");
            return;
        }

        if (manualMode) {
            setNewClassStart(info.start);
            setNewClassEnd(info.end);
            return;
        }

        setNewClassStart(info.start);
        setNewClassEnd(info.end);
        setCreateModalOpen(true);
    };

    const handleClearTime = () => {
        setNewClassStart(null);
        setNewClassEnd(null);
    };

  

    const handleEventClick = (info) => {
        if (info.event.display === "background") {
            return;
        }

        if (info.event.extendedProps?.isDraft) {
            return;
        }

        setSelectedClass(info.event);
    };

   

    const handleAddManualDraft = (draft) => {
        setManualDrafts(prev => [...prev, draft]);
        setNewClassStart(null);
        setNewClassEnd(null);
    };

   

    const handleRemoveManualDraft = (index) => {
        setManualDrafts(prev => prev.filter((_, i) => i !== index));
    };

   

    const handleSaveManualSchedule = async () => {
        if (manualDrafts.length === 0) {
            alert("There are no classes to save.");
            return;
        }

        const dtos = manualDrafts.map(draft => ({
            candidateEmail: draft.candidateEmail,
            startTime: draft.startTime,
            endTime: draft.endTime,
            location: draft.location || ""
        }));

        try {
            const response = await fetch(
                "http://localhost:8080/schedule/inst/create-manual",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(dtos)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const savedClasses = await response.json();

            setClasses(prev => [...prev, ...savedClasses]);
            setManualDrafts([]);
            setManualMode(false);
            setSelectedCandidateEmail("");
            setCandidatePreferences([]);

        } catch (error) {
            console.error("Error saving manual schedule:", error);
            alert("Could not save the schedule.");
        }
    };

    

    const handleExitManualMode = () => {
        if (manualDrafts.length > 0) {
            const confirmed = window.confirm(
                "You have unsaved classes. Are you sure you want to leave?"
            );
            if (!confirmed) {
                return;
            }
        }

        setManualMode(false);
        setSelectedCandidateEmail("");
        setCandidatePreferences([]);
        setManualDrafts([]);
        setNewClassStart(null);
        setNewClassEnd(null);
    };

   

    const handleCandidateSelect = (email) => {
        setSelectedCandidateEmail(email);
        setNewClassStart(null);
        setNewClassEnd(null);
    };

    

    const handleClassCreated = (newClass) => {
        if (manualMode) {
            handleAddManualDraft({
                candidateEmail: newClass.candidateEmail,
                candidateName: newClass.candidateName,
                startTime: newClass.scheduledStartTime,
                endTime: newClass.scheduledEndTime,
                location: newClass.location
            });
        } else {
            setClasses(prev => [...prev, newClass]);


            if (acceptRequestOpen && selectedRequest) {
                const requestId = selectedRequest.id;

                setClassRequests(prev =>
                    prev.filter(request => request.id !== requestId)
                );

                setSelectedRequest(null);
                setAcceptRequestOpen(false);
            }
        }
        setCreateModalOpen(false);
    };

   

    return (
        <div className="schedule-container">

           
            <div className="calendar-section">
                <WeeklyCalendar
                    events={calendarEvents}
                    preferenceEvents={preferenceEvents}
                    onTimeSelect={handleTimeSelect}
                    onEventClick={handleEventClick}
                />
            </div>

         
            <div className="schedule-sidebar">

                {!manualMode && !createModalOpen && !acceptRequestOpen && (
                    <div className="sidebar-default">
                        <h2>Schedule</h2>
                        <button
                            className="make-schedule-button"
                            onClick={() => setMakeScheduleOpen(true)}
                        >
                             Make Schedule
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

                        <div className="requests-section">
                            <div className="requests-header">
                                <h3>Requests</h3>
                                <span className="requests-count">
                                    {classRequests.length}
                                </span>
                            </div>

                            <div className="requests-list">
                                    {classRequests.length === 0 ? (
                                        <p className="no-requests">
                                            No pending requests.
                                        </p>
                                    ) : (
                                    classRequests.map(request => (
                                       <div
                                            className={`request-item ${
                                                selectedRequest?.id === request.id ? "selected-request-item" : ""
                                            }`}
                                            key={request.id}
                                            onClick={() => handleRequestClick(request)}
                                        >
                                            <span className="request-name">
                                                {request.candidate_name}
                                            </span>

                                            <div className="request-actions">
                                                <button
                                                    className="request-decline-button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeclineRequest(request.id);
                                                    }}
                                                    title="Decline request"
                                                >
                                                    ×
                                                </button>

                                               <button 
                                                    className="request-accept-button" 
                                                    onClick={(e) => { 
                                                        e.stopPropagation();
                                                        handleAcceptRequest(request);
                                                    }} 
                                                    title="Accept request"
                                                >
                                                    ✓
                                                </button>
                                            </div>
                                        </div>
                                                                                ))
                                    )}
                                </div>
                        </div>





                    </div>
                )}

                {createModalOpen && !manualMode && !acceptRequestOpen &&(
                    <div className="sidebar-create-form">
                        <CreateClassModal
                            isOpen={createModalOpen}
                            initialStart={newClassStart}
                            initialEnd={newClassEnd}
                            onClose={() => setCreateModalOpen(false)}
                            onCreated={handleClassCreated}
                        />
                    </div>
                )}

                {manualMode && (
                    <ManualScheduleSidebar
                        candidatePreferences={candidatePreferences}
                        selectedCandidateEmail={selectedCandidateEmail}
                        onCandidateSelect={handleCandidateSelect}
                        selectedCandidate={selectedCandidate}
                        newClassStart={newClassStart}
                        newClassEnd={newClassEnd}
                        manualDrafts={manualDrafts}
                        onAddDraft={handleAddManualDraft}
                        onRemoveDraft={handleRemoveManualDraft}
                        onSave={handleSaveManualSchedule}
                        onCancel={handleExitManualMode}
                        onTimeSelect={handleClearTime}
                    />
                )}

                 {acceptRequestOpen && selectedRequest && (
                    <CreateClassModal
                        isOpen={acceptRequestOpen}
                        request={selectedRequest}
                        initialStart={newClassStart}
                        initialEnd={newClassEnd}
                        onClose={() => {
                            setAcceptRequestOpen(false);
                            setSelectedRequest(null);
                            setNewClassStart(null);
                            setNewClassEnd(null);
                        }}
                        onCreated={handleClassCreated}
                    />
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

          

            {createModalOpen && manualMode && (
                <CreateClassModal
                    isOpen={createModalOpen}
                    initialStart={newClassStart}
                    initialEnd={newClassEnd}
                    onClose={() => setCreateModalOpen(false)}
                    onCreated={handleClassCreated}
                />
            )}

           

           
        </div>
    );
}