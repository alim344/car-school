import { useEffect, useState } from "react";
import WeeklyCalendar from "../../components/WeeklyCalendar";
import PracticalClassModal from "../../components/PracticalClassModal";
import CreateClassModal from "../../components/CreateClassModal";
import MakeScheduleModal from "../../components/MakeScheduleModal";
import ManualScheduleSidebar from "../../components/ManualScheduleSidebar";

import "../../style/InstructorSchedule.css";

export default function InstructorSchedule() {

    // =========================================================
    // EXISTING CLASSES
    // =========================================================

    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    // =========================================================
    // NORMAL CREATE CLASS
    // =========================================================

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newClassStart, setNewClassStart] = useState(null);
    const [newClassEnd, setNewClassEnd] = useState(null);

    // =========================================================
    // MAKE SCHEDULE MODAL
    // =========================================================

    const [makeScheduleOpen, setMakeScheduleOpen] = useState(false);

    // =========================================================
    // MANUAL SCHEDULE
    // =========================================================

    const [manualMode, setManualMode] = useState(false);
    const [candidatePreferences, setCandidatePreferences] = useState([]);
    const [selectedCandidateEmail, setSelectedCandidateEmail] = useState("");

    // =========================================================
    // MANUAL DRAFT CLASSES
    // =========================================================

    const [manualDrafts, setManualDrafts] = useState([]);

    // =========================================================
    // TOKEN
    // =========================================================

    const token = localStorage.getItem("userToken");

    // =========================================================
    // GET EXISTING CLASSES
    // =========================================================

    useEffect(() => {
        fetch("http://localhost:8080/schedule/get-inst", {
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

    // =========================================================
    // EXISTING CLASSES → FULLCALENDAR EVENTS
    // =========================================================

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

    // =========================================================
    // MANUAL DRAFTS → FULLCALENDAR EVENTS
    // =========================================================

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

    // =========================================================
    // FIND SELECTED CANDIDATE
    // =========================================================

    const selectedCandidate = candidatePreferences.find(
        candidate => candidate.candidateEmail === selectedCandidateEmail
    );

    // =========================================================
    // SELECTED CANDIDATE PREFERENCES
    // =========================================================

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

    // =========================================================
    // ALL CALENDAR EVENTS
    // =========================================================

    const calendarEvents = [
        ...preferenceEvents,
        ...events,
        ...draftEvents
    ];

    // =========================================================
    // MAKE SCHEDULE
    // =========================================================

    const handleMakeSchedule = async (option) => {
        if (option === "manual") {
            try {
                const response = await fetch(
                    "http://localhost:8080/schedule/candidate-prefs",
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
            setMakeScheduleOpen(false);
            // Copy functionality can be implemented later.
        }
    };

    // =========================================================
    // CALENDAR TIME SELECT
    // =========================================================

    const handleTimeSelect = (info) => {
        if (manualMode) {
            setNewClassStart(info.start);
            setNewClassEnd(info.end);
            return;
        }

        setNewClassStart(info.start);
        setNewClassEnd(info.end);
        setCreateModalOpen(true);
    };

    // Clear selected time (used by ManualScheduleSidebar)
    const handleClearTime = () => {
        setNewClassStart(null);
        setNewClassEnd(null);
    };

    // =========================================================
    // CALENDAR EVENT CLICK
    // =========================================================

    const handleEventClick = (info) => {
        if (info.event.display === "background") {
            return;
        }

        if (info.event.extendedProps?.isDraft) {
            return;
        }

        setSelectedClass(info.event);
    };

    // =========================================================
    // ADD MANUAL DRAFT
    // =========================================================

    const handleAddManualDraft = (draft) => {
        setManualDrafts(prev => [...prev, draft]);
        // Clear selected time after adding
        setNewClassStart(null);
        setNewClassEnd(null);
    };

    // =========================================================
    // REMOVE MANUAL DRAFT
    // =========================================================

    const handleRemoveManualDraft = (index) => {
        setManualDrafts(prev => prev.filter((_, i) => i !== index));
    };

    // =========================================================
    // SAVE MANUAL SCHEDULE
    // =========================================================

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
                "http://localhost:8080/schedule/create-manual",
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

    // =========================================================
    // EXIT MANUAL MODE
    // =========================================================

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

    // =========================================================
    // HANDLE CANDIDATE SELECT
    // =========================================================

    const handleCandidateSelect = (email) => {
        setSelectedCandidateEmail(email);
        setNewClassStart(null);
        setNewClassEnd(null);
    };

    // =========================================================
    // HANDLE CREATE CLASS FROM MODAL
    // =========================================================

    const handleClassCreated = (newClass) => {
        if (manualMode) {
            // Add as draft
            handleAddManualDraft({
                candidateEmail: newClass.candidateEmail,
                candidateName: newClass.candidateName,
                startTime: newClass.scheduledStartTime,
                endTime: newClass.scheduledEndTime,
                location: newClass.location
            });
        } else {
            // Normal mode - add to classes directly
            setClasses(prev => [...prev, newClass]);
        }
        setCreateModalOpen(false);
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="schedule-container">

            {/* =================================================
                CALENDAR
            ================================================= */}

            <div className="calendar-section">
                <WeeklyCalendar
                    events={calendarEvents}
                    preferenceEvents={preferenceEvents}
                    onTimeSelect={handleTimeSelect}
                    onEventClick={handleEventClick}
                />
            </div>

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <div className="schedule-sidebar">

                {/* NORMAL SIDEBAR */}
                {!manualMode && !createModalOpen && (
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

                {/* NORMAL CREATE CLASS FORM */}
                {createModalOpen && !manualMode && (
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

                {/* MANUAL SCHEDULE SIDEBAR */}
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
            </div>

            {/* =================================================
                PRACTICAL CLASS MODAL
            ================================================= */}

            <PracticalClassModal
                selectedClass={selectedClass}
                onClose={() => setSelectedClass(null)}
            />

            {/* =================================================
                MAKE SCHEDULE MODAL
            ================================================= */}

            <MakeScheduleModal
                isOpen={makeScheduleOpen}
                onClose={() => setMakeScheduleOpen(false)}
                onSelect={handleMakeSchedule}
            />

            {/* =================================================
                NORMAL CREATE CLASS MODAL (when in manual mode)
            ================================================= */}

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