import { useState, useEffect } from "react";
import axios from "axios";
import "../style/ScheduleExam.css"

export default function ScheduleExam({ isOpen, onClose, onSuccess, token }) {
    const [pendingCandidates, setPendingCandidates] = useState([]);
    const [availableAdmins, setAvailableAdmins] = useState([]);

    const [formData, setFormData] = useState({
        candidate_email: "",
        dateTime: "",
        admin_email: ""
    });

    const [loadingCandidates, setLoadingCandidates] = useState(false);
    const [loadingAdmins, setLoadingAdmins] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;


        const loadCandidates = async () => {
            setFormError(null);
            setFormSuccess(false);
            setLoadingCandidates(true);
            try {
                const candidatesResponse = await axios.get(
                    "http://localhost:8080/candidate/pending",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                if (isMounted) {
                    setPendingCandidates(candidatesResponse.data);
                }
            } catch (error) {
                console.error("Error loading candidates:", error);
                if (isMounted) {
                    setFormError("Failed to load pending candidates. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setLoadingCandidates(false);
                }
            }
        };

        loadCandidates();

        return () => {
            isMounted = false;
        };
    }, [isOpen, token]);

    const [lastFetchedDateTime, setLastFetchedDateTime] = useState(null);

    const fetchAvailableAdmins = async (dateTime) => {
        setLoadingAdmins(true);
        setFormError(null);
        try {
            const response = await axios.post(
                "http://localhost:8080/p-exam/admin/get-available",
                { dateTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAvailableAdmins(response.data);
            setLastFetchedDateTime(dateTime);
        } catch (error) {
            console.error("Error loading available admins:", error);
            setFormError("Failed to fetch available admins for the selected time.");
            setAvailableAdmins([]);
        } finally {
            setLoadingAdmins(false);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "dateTime") {
                updated.admin_email = "";
                
                setAvailableAdmins([]);
            }
            return updated;
        });
    };

    const handleDateTimeBlur = (e) => {

        if (e.relatedTarget && e.relatedTarget.classList.contains("modal-close-btn")) {
            return;
        }
        const value = formData.dateTime;
        if (!value || value.length < 16) return;      
        if (value === lastFetchedDateTime) return;    
        fetchAvailableAdmins(value);
    };

    const handleClose = () => {
        setFormData({
            candidate_email: "",
            admin_email: "",
            dateTime: ""
        });
        setAvailableAdmins([]);
        setFormError(null);
        setFormSuccess(false);
        onClose();
    };

    const handleScheduleExam = async (e) => {
        e.preventDefault();


        if (!formData.candidate_email || !formData.dateTime || !formData.admin_email) {
            setFormError("Please select a candidate, date/time, and available admin.");
            return;
        }

        setFormLoading(true);
        setFormError(null);

        try {
            await axios.post(
                "http://localhost:8080/p-exam/admin/schedule",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setFormSuccess(true);
            setFormError(null);

            setTimeout(() => {
                handleClose();
                if (onSuccess) onSuccess();
            }, 2000);
        } catch (error) {
            console.error("Error scheduling exam:", error);
            setFormError(error.response?.data?.message || "Failed to schedule exam. Please try again.");
        } finally {
            setFormLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content schedule-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Schedule New Exam</h2>
                    <button type="button" className="modal-close-btn" onClick={handleClose}>✕</button>
                </div>

                <form onSubmit={handleScheduleExam} className="schedule-form">
                    <div className="form-group">
                        <label className="form-label">
                            1. Select Candidate <span className="required">*</span>
                        </label>
                        <select
                            name="candidate_email"
                            value={formData.candidate_email}
                            onChange={handleFormChange}
                            className="form-select"
                            required
                            disabled={loadingCandidates}
                        >
                            <option value="">Select a candidate...</option>
                            {pendingCandidates.map((candidate) => (
                                <option key={candidate.id || candidate.email} value={candidate.email}>
                                    {candidate.firstName} {candidate.lastName} ({candidate.email}) - {candidate.numberOfClassesLeft} classes left
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            2. Date & Time <span className="required">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="dateTime"
                            value={formData.dateTime}
                            onChange={handleFormChange}
                            onBlur={handleDateTimeBlur}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            3. Select Available Admin <span className="required">*</span>
                        </label>
                        <select
                            name="admin_email"
                            value={formData.admin_email}
                            onChange={handleFormChange}
                            className="form-select"
                            required
                            disabled={!formData.dateTime || loadingAdmins}
                        >
                            <option value="">
                                {!formData.dateTime
                                    ? "Please select date & time first..."
                                    : loadingAdmins
                                    ? "Checking availability..."
                                    : "Select an admin..."}
                            </option>
                            {availableAdmins.map((admin) => (
                                <option key={admin.email} value={admin.email}>
                                    {admin.name} ({admin.email})
                                </option>
                            ))}
                        </select>

                        {formData.dateTime &&
                        !loadingAdmins &&
                        formData.dateTime === lastFetchedDateTime &&
                        availableAdmins.length === 0 && (
                            <p className="form-hint error-hint">No admins available at this time slot.</p>
                        )}
                    </div>

                    {formError && (
                        <div className="form-error">
                             {formError}
                        </div>
                    )}

                    {formSuccess && (
                        <div className="form-success">
                            Exam scheduled successfully!
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="form-cancel-btn"
                            onClick={handleClose}
                            disabled={formLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="form-submit-btn"
                            disabled={
                                formLoading || 
                                formSuccess || 
                                !formData.candidate_email || 
                                !formData.dateTime || 
                                !formData.admin_email
                            }
                        >
                            {formLoading ? "Scheduling..." : "Schedule Exam"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}