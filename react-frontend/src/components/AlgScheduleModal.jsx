import { useState } from "react";
import "../style/AlgScheduleModal.css"

export default function AlgScheduleModal({ isOpen, onClose, onSubmit, candidates, loading }) {
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [fullDayOff, setFullDayOff] = useState("");
    const [lightDays, setLightDays] = useState([]);

    if (!isOpen) return null;

    const daysOfWeek = [
        { value: "MONDAY", label: "Monday" },
        { value: "TUESDAY", label: "Tuesday" },
        { value: "WEDNESDAY", label: "Wednesday" },
        { value: "THURSDAY", label: "Thursday" },
        { value: "FRIDAY", label: "Friday" },
        { value: "SATURDAY", label: "Saturday" },
        { value: "SUNDAY", label: "Sunday" }
    ];

    const handleCandidateToggle = (email) => {
        setSelectedCandidates(prev => {
            if (prev.includes(email)) {
                return prev.filter(e => e !== email);
            } else {
                if (prev.length >= 12) {
                    alert("Maximum 12 candidates allowed");
                    return prev;
                }
                return [...prev, email];
            }
        });
    };

    const handleLightDayToggle = (day) => {
        setLightDays(prev => {
            if (prev.includes(day)) {
                return prev.filter(d => d !== day);
            } else {
                if (prev.length >= 2) {
                    alert("Maximum 2 light days allowed");
                    return prev;
                }
                return [...prev, day];
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (selectedCandidates.length === 0) {
            alert("Please select at least one candidate.");
            return;
        }

        if (selectedCandidates.length > 12) {
            alert("Maximum 12 candidates allowed.");
            return;
        }

        const dto = {
            candidate_emails: selectedCandidates,
            fullDayOff: fullDayOff || null,
            lightDays: lightDays
        };

        onSubmit(dto);
    };

    const handleClose = () => {
        setSelectedCandidates([]);
        setFullDayOff("");
        setLightDays([]);
        onClose();
    };

    const selectAllCandidates = () => {
        if (candidates.length <= 12) {
            setSelectedCandidates(candidates.map(c => c.email));
        } else {
            alert("Too many candidates. Please select up to 12.");
        }
    };

    const clearAllCandidates = () => {
        setSelectedCandidates([]);
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content alg-schedule-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Algorithm Schedule Generator</h2>
                    <button className="modal-close-btn" onClick={handleClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="alg-schedule-form">
                    <div className="form-group">
                        <div className="form-label-group">
                            <label className="form-label">
                                Select Candidates <span className="required">*</span>
                            </label>
                            <span className="candidate-count">({selectedCandidates.length}/12)</span>
                            <div className="candidate-actions">
                                <button 
                                    type="button" 
                                    className="candidate-select-all"
                                    onClick={selectAllCandidates}
                                >
                                    Select All
                                </button>
                                <button 
                                    type="button" 
                                    className="candidate-clear-all"
                                    onClick={clearAllCandidates}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                        <div className="candidates-grid">
                            {candidates.length === 0 ? (
                                <p className="no-candidates">No candidates available</p>
                            ) : (
                                candidates.map(candidate => (
                                    <div 
                                        key={candidate.email} 
                                        className={`candidate-checkbox ${selectedCandidates.includes(candidate.email) ? 'selected' : ''}`}
                                        onClick={() => handleCandidateToggle(candidate.email)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCandidates.includes(candidate.email)}
                                            onChange={() => {}}
                                            id={`candidate-${candidate.email}`}
                                        />
                                        <label htmlFor={`candidate-${candidate.email}`}>
                                            {candidate.firstName} {candidate.lastName}
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Full Day Off <span className="optional">(Optional)</span>
                        </label>
                        <select
                            value={fullDayOff}
                            onChange={(e) => setFullDayOff(e.target.value)}
                            className="form-select"
                        >
                            <option value="">None</option>
                            {daysOfWeek.map(day => (
                                <option key={day.value} value={day.value}>
                                    {day.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <div className="form-label-group">
                            <label className="form-label">
                                Light Days <span className="optional">(Optional - Max 2)</span>
                            </label>
                            <span className="light-day-count">({lightDays.length}/2)</span>
                        </div>
                        <div className="light-days-grid">
                            {daysOfWeek.map(day => {
                                const isSelected = lightDays.includes(day.value);
                                const isDisabled = lightDays.length >= 2 && !isSelected;
                                return (
                                    <div 
                                        key={day.value} 
                                        className={`light-day-checkbox ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                                        onClick={() => !isDisabled && handleLightDayToggle(day.value)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => {}}
                                            disabled={isDisabled}
                                            id={`lightday-${day.value}`}
                                        />
                                        <label htmlFor={`lightday-${day.value}`}>
                                            {day.label}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    

                    <div className="form-actions">
                        <button
                            type="button"
                            className="form-cancel-btn"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="form-submit-btn"
                            disabled={loading || selectedCandidates.length === 0}
                        >
                            {loading ? "Generating..." : "Generate Schedule"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}