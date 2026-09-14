import { useEffect, useState } from "react";

import WeeklyCalendar from "../../components/WeeklyCalendar";
import TimePrefForm from "../../components/TimePrefModal";

import "../../style/CandidatePreference.css";
import {
    buildLeaveEvents,isOverlappingLeave,toBlockedRanges} from "../../utils/leaveEvents";

export default function CandidatePreference() {

    const [candidateEmail, setCandidateEmail] = useState(null);
    const [prefs, setPrefs] = useState([]);              
    const [hasExistingPreference, setHasExistingPreference] = useState(false);

    const [formOpen, setFormOpen] = useState(false);
    const [newPrefStart, setNewPrefStart] = useState(null);
    const [newPrefEnd, setNewPrefEnd] = useState(null);
    const [preferenceStatus,setPreferenceStatus] = useState(null);

    const [leaves, setLeaves] = useState([]);

    const token = localStorage.getItem("userToken");

    const hasDrafts = prefs.some(p => !p.id.startsWith("existing-"));

    const leaveEvents = buildLeaveEvents(leaves, { source: "instructor" });

    useEffect(() => {
        fetch("http://localhost:8080/pref/candidate/get", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                setCandidateEmail(data.candidateEmail);
                setPreferenceStatus(data.status); 

                const list = data.prefDTOList || [];

                setHasExistingPreference(data.status != null);

                if (list.length > 0) {
                    setHasExistingPreference(true);

                    setPrefs(list.map((pref, index) => ({
                        id: `existing-${index}`,
                        start: new Date(`${pref.date}T${pref.startTime}`),
                        end: new Date(`${pref.date}T${pref.endTime}`),
                        location: ""   
                    })));
                }
            })
            .catch(error => {
                console.error("Error fetching candidate preference:", error);
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

    const getNextWeekRange = () => {
        const today = new Date();
        const day = today.getDay();
        const daysUntilNextMonday = day === 0 ? 1 : 8 - day;

        const nextMonday = new Date(today);
        nextMonday.setDate(today.getDate() + daysUntilNextMonday);
        nextMonday.setHours(0, 0, 0, 0);

        const nextSunday = new Date(nextMonday);
        nextSunday.setDate(nextMonday.getDate() + 7);

        return { start: nextMonday, end: nextSunday };
    };

    const nextWeekRange = getNextWeekRange();

    const preferenceEvents = prefs.map(pref => ({
        id: pref.id,
        start: pref.start,
        end: pref.end,
        display: "background",
        classNames: [
        pref.id.startsWith("existing-")
            ? "candidate-preference-saved"
            : "candidate-preference-draft"
        ],
        extendedProps: { preference: true }
    }));

    const handleTimeSelect = (info) => {
        if (!formOpen) return; 

        const now = new Date();
        if (info.start < now || info.end <= now) {
            alert("You cannot set a preference in the past.");
            return;
        }
        if (info.end < info.start) {
            alert("Start time has to be before end time");
            return;
        }

         if (hasOverlap(info.start, info.end)) {
            alert("This time overlaps with an existing preference.");
            return;
        }

        if (isOverlappingLeave(info.start, info.end, leaves)) {
            alert("Your instructor is on leave on this day.");
            return;
        }


        setNewPrefStart(info.start);
        setNewPrefEnd(info.end);
    };

    const handleOpenForm = () => {
        setFormOpen(true);
        setNewPrefStart(null);
        setNewPrefEnd(null);
    };

    const handleCloseForm = () => {
        setFormOpen(false);
        setNewPrefStart(null);
        setNewPrefEnd(null);
        setPrefs(prev => prev.filter(p => p.id.startsWith("existing-")));
    };


    const hasOverlap = (start, end) => {
        return prefs.some(pref => {
            return start < pref.end && end > pref.start;
        });
    };

    const handleAddDraft = (draft) => {

        if (hasOverlap(draft.start, draft.end)) {
            alert("This time overlaps with an existing preference.");
            return;
        }
        setPrefs(prev => [...prev, draft]);
        setNewPrefStart(null);
        setNewPrefEnd(null);
    };

    const handleRemovePref = (id) => {
        setPrefs(prev => prev.filter(p => p.id !== id));
    };

    const formatDate = (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const formatTimeForBackend = (date) =>
        `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;

    const handleSavePreference = async () => {
        if (prefs.length === 0) {
            alert("Add at least one time preference first.");
            return;
        }

        const dto = {
            candidateEmail,
            prefDTOList: prefs.map(p => ({
                date: formatDate(p.start),
                startTime: formatTimeForBackend(p.start),
                endTime: formatTimeForBackend(p.end)
            }))
        };

        try {
            const response = await fetch(
                `http://localhost:8080/pref/${hasExistingPreference ? "update" : "save"}`,
                {
                    method: hasExistingPreference ? "PATCH" : "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(dto)
                }
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            setHasExistingPreference(true);
            setPreferenceStatus("SUBMITTED");
            setPrefs(prev => prev.map(p => ({ ...p, id: `existing-${p.id}` })));
            setFormOpen(false);
            setNewPrefStart(null);
            setNewPrefEnd(null);

        } catch (error) {
            console.error("Error saving preference:", error);
            alert("Could not save preference.");
        }
    };

    const handleSetNoPreference = async () => {
        try {
            const response = await fetch(
                "http://localhost:8080/pref/setNoPreference",
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            setPrefs([]);
            setHasExistingPreference(true);
            setPreferenceStatus("NO_PREFERENCE");
            setFormOpen(false);
            setNewPrefStart(null);
            setNewPrefEnd(null);

        } catch (error) {
            console.error("Error setting no preference:", error);
            alert("Could not set no preference.");
        }
    };

    return (
        <div className="candidate-preference-container">

            <div className="candidate-preference-calendar">
                <WeeklyCalendar
                    events={[]}
                    preferenceEvents={[...leaveEvents, ...preferenceEvents]}
                    blockedRanges={toBlockedRanges(leaves)}
                    onTimeSelect={handleTimeSelect}
                    onEventClick={() => {}}
                    initialDate={nextWeekRange.start}
                    validRange={{
                        start: nextWeekRange.start,
                        end: nextWeekRange.end
                    }}
                    disableNavigation={true}
                    selectable={formOpen}
                />
            </div>

            <div className="candidate-preference-sidebar">
                <h2>Preference</h2>

                {preferenceStatus === "NO_PREFERENCE" && !hasDrafts && (
                    <p className="no-preference-banner">
                        You've set no preference for next week.
                    </p>
                )}

                

                {!formOpen && (
                    <>
                        <button
                            className="add-time-pref-button"
                            onClick={handleOpenForm}
                        >
                            + Add Time Pref
                        </button>

                        <button
                            className="no-preference-button"
                            onClick={handleSetNoPreference}
                            disabled={hasDrafts}
                        >
                            No Preference This Week
                        </button>
                    </>
                )}

                {formOpen && (
                    <TimePrefForm
                        newPrefStart={newPrefStart}
                        newPrefEnd={newPrefEnd}
                        onAddDraft={handleAddDraft}
                        onClose={handleCloseForm}
                    />
                )}

                <div className="pref-list-section">
                    <div className="pref-list-header">
                        <h3>Time Preferences</h3>
                        <span className="pref-count">{prefs.length}</span>
                    </div>

                    {prefs.length === 0 && (
                        <div className="no-prefs">
                            No time preferences yet.
                        </div>
                    )}

                    {prefs.map(pref => (
                        <div className="pref-item" key={pref.id}>
                            <div className="pref-item-info">
                                <span className="pref-date">
                                    {pref.start.toLocaleDateString([], { month: '2-digit', day: '2-digit' })}
                                </span>
                                <span className="pref-time">
                                    {pref.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                    {' - '}
                                    {pref.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </span>
                                {pref.location && (
                                    <span className="pref-location">📍 {pref.location}</span>
                                )}
                            </div>
                            <button
                                className="remove-pref-button"
                                onClick={() => handleRemovePref(pref.id)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {hasDrafts && (
                    <button
                        className="save-preference-button"
                        onClick={handleSavePreference}
                    >
                        Save Next Week Preference
                    </button>
                )}
            </div>

        </div>
    );
}