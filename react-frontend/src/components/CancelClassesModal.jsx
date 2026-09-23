import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import "../style/CancelClassesModal.css";


export default function CancelClassesModal({ isOpen, onClose, token, onCancelled }) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        setStartDate("");
        setEndDate("");
        setError(null);
        onClose();
    };

    const buildRange = () => {
        const startTime = `${startDate}T00:00:00`;
        const endTime = `${endDate}T23:59:59`;
        return { startTime, endTime };
    };

    const minSelectableDate = (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const y = tomorrow.getFullYear();
        const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
        const d = String(tomorrow.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    })();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (!startDate || !endDate) {
            setError("Please select both a start and end date.");
            return;
        }

        if (endDate < startDate) {
            setError("End date must be on or after the start date.");
            return;
        }

        setConfirmOpen(true);
    };

    const doCancel = async () => {
        setConfirmOpen(false);
        setLoading(true);
        setError(null);

        try {
            const { startTime, endTime } = buildRange();

            const response = await fetch(
                "http://localhost:8080/practical-class/cancel-period",
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ startTime, endTime })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const cancelledClasses = await response.json();
            onCancelled(cancelledClasses);
            handleClose();

        } catch (err) {
            console.error("Error cancelling classes:", err);
            setError("Failed to cancel classes. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDateForMessage = (value) => {
        if (!value) return "";
        const date = new Date(`${value}T00:00:00`);
        return date.toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content cancel-classes-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Cancel Classes</h2>
                    <button className="modal-close-btn" onClick={handleClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="cancel-classes-form">
                    <p className="cancel-classes-hint">
                        Choose a date range. All of your classes scheduled on those days will be cancelled.
                    </p>

                    {error && (
                        <div className="cancel-classes-error">⚠️ {error}</div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Start date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="form-input"
                            required
                            disabled={loading}
                            min={minSelectableDate}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">End date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="form-input"
                            required
                            disabled={loading}
                            min={startDate || minSelectableDate}
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Cancelling..." : "Cancel Classes"}
                        </button>
                    </div>
                </form>

                <ConfirmModal
                    isOpen={confirmOpen}
                    message={
                        `Are you sure you want to cancel ALL classes from ${formatDateForMessage(startDate)} to ${formatDateForMessage(endDate)}?\n\n` +
                        "This action cannot be undone."
                    }
                    onConfirm={doCancel}
                    onCancel={() => setConfirmOpen(false)}
                />
            </div>
        </div>
    );
}
