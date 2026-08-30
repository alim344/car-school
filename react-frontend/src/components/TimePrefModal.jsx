import { useState } from "react";
import "../style/TimePrefModal.css"

export default function TimePrefForm({
    newPrefStart,
    newPrefEnd,
    onAddDraft,
    onClose
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
        if (!newPrefStart || !newPrefEnd) {
            alert("Please select a time slot on the calendar.");
            return;
        }

        onAddDraft({
            id: `pref-${Date.now()}`,
            start: newPrefStart,
            end: newPrefEnd,
            location
        });

        setLocation("");
    };

    const startTime = formatTime(newPrefStart);
    const endTime = formatTime(newPrefEnd);

    return (
        <div className="time-pref-form">
            <div className="time-pref-form-header">
                <h3>Add Time Preference</h3>
                <button className="time-pref-close-button" onClick={onClose}>×</button>
            </div>

            <div className="form-group">
                <label>Location</label>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Optional"
                />
            </div>

            <div className="selected-time-display">
                <div className="time-display-item">
                    <span className="time-label">Start Time</span>
                    <span className={`time-value ${!newPrefStart ? 'placeholder' : ''}`}>
                        {newPrefStart && startTime
                            ? `${startTime.date} ${startTime.time}`
                            : 'Select on calendar'}
                    </span>
                </div>
                <div className="time-display-item">
                    <span className="time-label">End Time</span>
                    <span className={`time-value ${!newPrefEnd ? 'placeholder' : ''}`}>
                        {newPrefEnd && endTime
                            ? `${endTime.date} ${endTime.time}`
                            : 'Select on calendar'}
                    </span>
                </div>
            </div>

            <button
                className="add-draft-button"
                onClick={handleAddDraft}
                disabled={!newPrefStart || !newPrefEnd}
            >
                + Add to Draft
            </button>
        </div>
    );
}