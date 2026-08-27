import { useState } from "react";

export default function ManualScheduleSidebar({
    candidatePreferences,
    selectedCandidateEmail,
    onCandidateSelect,
    selectedCandidate,
    newClassStart,
    newClassEnd,
    manualDrafts,
    onAddDraft,
    onRemoveDraft,
    onSave,
    onCancel,
    onTimeSelect
}) {
    const [location, setLocation] = useState("");

    const formatTime = (date) => {
        if (!date) return null;
        return {
            date: date.toLocaleDateString([], { month: '2-digit', day: '2-digit' }),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        };
    };

    const handleAddDraft = () => {
        if (!selectedCandidate) {
            alert('Please select a candidate first.');
            return;
        }
        if (!newClassStart || !newClassEnd) {
            alert('Please select a time slot on the calendar.');
            return;
        }

        const draft = {
            candidateEmail: selectedCandidate.candidateEmail,
            candidateName: selectedCandidate.name,
            startTime: newClassStart.toISOString(),
            endTime: newClassEnd.toISOString(),
            location: location
        };

        onAddDraft(draft);
        setLocation("");
        onTimeSelect(null, null);
    };

    const startTime = formatTime(newClassStart);
    const endTime = formatTime(newClassEnd);

    return (
        <div className="manual-schedule-sidebar">

            
            <div className="manual-sidebar-header">
                <h2>Manual Schedule</h2>
                <button
                    className="manual-close-button"
                    onClick={onCancel}
                >
                    ×
                </button>
            </div>

           
            <div className="form-group">
                <label>Candidate</label>
                <select
                    value={selectedCandidateEmail}
                    onChange={(e) => {
                        onCandidateSelect(e.target.value);
                    }}
                >
                    <option value="">Select candidate</option>
                    {candidatePreferences.map(candidate => (
                        <option
                            key={candidate.candidateEmail}
                            value={candidate.candidateEmail}
                        >
                            {candidate.name}
                        </option>
                    ))}
                </select>
            </div>

        
            {selectedCandidate && (
                <div className="selected-candidate-info">
                    <strong>{selectedCandidate.name}</strong>
                    <span>{selectedCandidate.candidateEmail}</span>
                </div>
            )}

           

            

       
            <div className="selected-time-display">
                <div className="time-display-item">
                    <span className="time-label">Start Time</span>
                    <span className={`time-value ${!newClassStart ? 'placeholder' : ''}`}>
                        {newClassStart && startTime
                            ? `${startTime.date} ${startTime.time}`
                            : 'Select on calendar'
                        }
                    </span>
                </div>
                <div className="time-display-item">
                    <span className="time-label">End Time</span>
                    <span className={`time-value ${!newClassEnd ? 'placeholder' : ''}`}>
                        {newClassEnd && endTime
                            ? `${endTime.date} ${endTime.time}`
                            : 'Select on calendar'
                        }
                    </span>
                </div>
            </div>

           

        
            <button
                className="add-draft-button"
                onClick={handleAddDraft}
                disabled={!selectedCandidate || !newClassStart || !newClassEnd}
            >
                + Add to Draft
            </button>

       
            <div className="draft-classes-section">
                <div className="draft-header">
                    <h3>Draft Classes</h3>
                    <span className="draft-count">{manualDrafts.length}</span>
                </div>

                {manualDrafts.length === 0 && (
                    <div className="no-drafts">
                        No classes added yet. Select a candidate and time, then click "Add to Draft".
                    </div>
                )}

                {manualDrafts.map((draft, index) => (
                    <div className="draft-class-item" key={index}>
                        <div className="draft-class-info">
                            <span className="draft-name">{draft.candidateName}</span>
                            <span className="draft-time">
                                {new Date(draft.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} 
                                - 
                                {new Date(draft.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </span>
                            {draft.location && (
                                <span className="draft-location">📍 {draft.location}</span>
                            )}
                        </div>
                        <button
                            className="remove-draft-button"
                            onClick={() => onRemoveDraft(index)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

     
            <div className="manual-sidebar-buttons">
                <button
                    className="cancel-manual-button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    className="save-schedule-button"
                    onClick={onSave}
                    disabled={manualDrafts.length === 0}
                >
                    Save Schedule ({manualDrafts.length})
                </button>
            </div>

        </div>
    );
}