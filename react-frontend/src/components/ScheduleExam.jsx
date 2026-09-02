import { useState, useEffect } from "react";
import axios from "axios";

export default function ScheduleExam({ isOpen, onClose, onSuccess, token }) {
    const [pendingCandidates, setPendingCandidates] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [formData, setFormData] = useState({
        candidate_email: "",
        instructor_email: "",
        dateTime: ""
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const loadFormData = async () => {
            setFormError(null);
            setFormSuccess(false);
            try {
                const candidatesResponse = await axios.get(
                    "http://localhost:8080/candidate/pending",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setPendingCandidates(candidatesResponse.data);

                const instructorsResponse = await axios.get(
                    "http://localhost:8080/instructor/getAll",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setInstructors(instructorsResponse.data);
            } catch (error) {
                console.error("Error loading form data:", error);
                setFormError("Failed to load form data. Please try again.");
            }
        };

        loadFormData();
    }, [isOpen, token]);

    if (!isOpen) return null;

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClose = () => {
        setFormData({
            candidate_email: "",
            instructor_email: "",
            dateTime: ""
        });
        setFormError(null);
        setFormSuccess(false);
        onClose();
    };

    const handleScheduleExam = async (e) => {
        e.preventDefault();

        if (!formData.candidate_email || !formData.instructor_email || !formData.dateTime) {
            setFormError("Please fill in all fields");
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
                    },
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

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content schedule-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Schedule New Exam</h2>
                    <button className="modal-close-btn" onClick={handleClose}>✕</button>
                </div>

                <form onSubmit={handleScheduleExam} className="schedule-form">
                    <div className="form-group">
                        <label className="form-label">
                            Candidate <span className="required">*</span>
                        </label>
                        <select
                            name="candidate_email"
                            value={formData.candidate_email}
                            onChange={handleFormChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select a candidate...</option>
                            {pendingCandidates.map((candidate) => (
                                <option key={candidate.id} value={candidate.email}>
                                    {candidate.firstName} {candidate.lastName} ({candidate.email}) - {candidate.numberOfClassesLeft} classes left
                                </option>
                            ))}
                        </select>
                        {pendingCandidates.length === 0 && (
                            <p className="form-hint">No pending candidates available</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Instructor <span className="required">*</span>
                        </label>
                        <select
                            name="instructor_email"
                            value={formData.instructor_email}
                            onChange={handleFormChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select an instructor...</option>
                            {instructors.map((instructor) => (
                                <option key={instructor.email} value={instructor.email}>
                                    {instructor.name} ({instructor.email})
                                </option>
                            ))}
                        </select>
                        {instructors.length === 0 && (
                            <p className="form-hint">No instructors available</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Date & Time <span className="required">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            name="dateTime"
                            value={formData.dateTime}
                            onChange={handleFormChange}
                            className="form-input"
                            required
                        />
                    </div>

                    {formError && (
                        <div className="form-error">
                            <span className="error-icon">⚠️</span> {formError}
                        </div>
                    )}

                    {formSuccess && (
                        <div className="form-success">
                            <span className="success-icon">✅</span> Exam scheduled successfully!
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
                            disabled={formLoading || formSuccess}
                        >
                            {formLoading ? (
                                <>
                                    <span className="spinner-small"></span> Scheduling...
                                </>
                            ) : (
                                "Schedule Exam"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}