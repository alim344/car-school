import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "../../style/ExamScheduler.css";

export default function ExamScheduler() {
    const [filteredExams, setFilteredExams] = useState([]);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [showExamDetails, setShowExamDetails] = useState(false);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    
    // Form states
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

    const hasFetched = useRef(false);
    const token = localStorage.getItem("userToken");

    const filters = [
        { key: "ALL", label: "All Exams", endpoint: "/admin/getAll" },
        { key: "SCHEDULED", label: "Scheduled", endpoint: "/admin/getScheduled" },
        { key: "COMPLETED", label: "Passed", endpoint: "/admin/getPassed" },
        { key: "FAILED", label: "Failed", endpoint: "/admin/getFailed" },
        { key: "CANCELLED", label: "Cancelled", endpoint: "/admin/getCancelled" },
    ];

    const loadExams = useCallback(async (filterKey) => {
        setLoading(true);
        setError(null);
        
        const filter = filters.find(f => f.key === filterKey);
        if (!filter) return;

        try {
            const response = await axios.get(
                `http://localhost:8080/p-exam${filter.endpoint}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setFilteredExams(response.data);
            setActiveFilter(filterKey);
        } catch (error) {
            console.error("Error fetching exams:", error);
            setError("Failed to load exams. Please try again.");
            setFilteredExams([]);
        } finally {
            setLoading(false);
        }
    }, [token, filters]);

    const loadFormData = useCallback(async () => {
        try {
            // Fetch pending candidates
            const candidatesResponse = await axios.get(
                "http://localhost:8080/candidate/pending",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPendingCandidates(candidatesResponse.data);

            // Fetch all instructors
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
    }, [token]);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        loadExams("ALL");
    }, [loadExams]);

    const handleFilterChange = (filterKey) => {
        if (filterKey === activeFilter) return;
        loadExams(filterKey);
    };

    const handleExamClick = (exam) => {
        setSelectedExam(exam);
        setShowExamDetails(true);
    };

    const closeExamDetails = () => {
        setShowExamDetails(false);
        setSelectedExam(null);
    };

    const openScheduleForm = async () => {
        setShowScheduleForm(true);
        setFormError(null);
        setFormSuccess(false);
        await loadFormData();
    };

    const closeScheduleForm = () => {
        setShowScheduleForm(false);
        setFormData({
            candidate_email: "",
            instructor_email: "",
            dateTime: ""
        });
        setFormError(null);
        setFormSuccess(false);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleScheduleExam = async (e) => {
        e.preventDefault();
        
        // Validate form
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
                        'Content-Type': 'application/json'
                    },
                }
            );

            setFormSuccess(true);
            setFormError(null);
            
            // Reset form after successful submission
            setTimeout(() => {
                closeScheduleForm();
                // Refresh the exam list
                loadExams(activeFilter);
            }, 2000);
            
        } catch (error) {
            console.error("Error scheduling exam:", error);
            setFormError(error.response?.data?.message || "Failed to schedule exam. Please try again.");
        } finally {
            setFormLoading(false);
        }
    };

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case "SCHEDULED": return "status-scheduled";
            case "COMPLETED": return "status-passed";
            case "FAILED": return "status-failed";
            case "CANCELLED": return "status-cancelled";
            default: return "";
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "--";
        const date = new Date(dateString);
        return date.toLocaleString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="exam-scheduler-container">
            <div className="exam-header">
                <div className="header-content">
                    <div>
                        <h1>Exam Management</h1>
                        <p className="exam-subtitle">View, manage and schedule practical exams</p>
                    </div>
                    <button className="schedule-exam-btn" onClick={openScheduleForm}>
                        <span className="plus-icon">+</span> Schedule Exam
                    </button>
                </div>
            </div>

            <div className="filter-tabs">
                {filters.map((filter) => (
                    <button
                        key={filter.key}
                        className={`filter-tab ${activeFilter === filter.key ? "active" : ""}`}
                        onClick={() => handleFilterChange(filter.key)}
                        disabled={loading}
                    >
                        {filter.label}
                        {activeFilter === filter.key && (
                            <span className="filter-count">{filteredExams.length}</span>
                        )}
                    </button>
                ))}
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading exams...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => loadExams(activeFilter)} className="retry-btn">
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="exams-grid">
                    {filteredExams.length === 0 ? (
                        <div className="empty-state">
                            <h3>No exams found</h3>
                            <p>There are no {activeFilter.toLowerCase()} exams available.</p>
                            <button className="schedule-from-empty-btn" onClick={openScheduleForm}>
                                Schedule an Exam
                            </button>
                        </div>
                    ) : (
                        filteredExams.map((exam) => (
                            <div
                                key={exam.id}
                                className="exam-card"
                                onClick={() => handleExamClick(exam)}
                            >
                                <div className="exam-card-header">
                                    <div className="exam-candidate">
                                        <span className="candidate-name">{exam.candidate_name}</span>
                                    </div>
                                    <span className={`status-badge ${getStatusBadgeClass(exam.status)}`}>
                                        {exam.status}
                                    </span>
                                </div>
                                
                                <div className="exam-card-body">
                                    <div className="exam-info">
                                        <div className="info-item">
                                            <span className="info-label"> Date & Time</span>
                                            <span className="info-value">{formatDateTime(exam.dateTime)}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label"> Instructor</span>
                                            <span className="info-value">{exam.instructor_name}</span>
                                        </div>
                                        {exam.score !== null && exam.score !== undefined && (
                                            <div className="info-item">
                                                <span className="info-label"> Score</span>
                                                <span className="info-value score-value">{exam.score}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="exam-card-footer">
                                    <button className="view-details-btn">View Details →</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showScheduleForm && (
                <div className="modal-overlay" onClick={closeScheduleForm}>
                    <div className="modal-content schedule-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2> Schedule New Exam</h2>
                            <button className="modal-close-btn" onClick={closeScheduleForm}>✕</button>
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
                                    onClick={closeScheduleForm}
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
            )}

            {/* Exam Details Modal */}
            {showExamDetails && selectedExam && (
                <div className="modal-overlay" onClick={closeExamDetails}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Exam Details</h2>
                            <button className="modal-close-btn" onClick={closeExamDetails}>✕</button>
                        </div>
                        
                        <div className="exam-details">
                            <div className="detail-row">
                                <span className="detail-label">Candidate</span>
                                <span className="detail-value">{selectedExam.candidate_name}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Email</span>
                                <span className="detail-value">{selectedExam.candidate_email}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Instructor</span>
                                <span className="detail-value">{selectedExam.instructor_name}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Instructor Email</span>
                                <span className="detail-value">{selectedExam.instructor_email}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Date & Time</span>
                                <span className="detail-value">{formatDateTime(selectedExam.dateTime)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Status</span>
                                <span className={`status-badge ${getStatusBadgeClass(selectedExam.status)}`}>
                                    {selectedExam.status}
                                </span>
                            </div>
                            {selectedExam.score !== null && selectedExam.score !== undefined && (
                                <div className="detail-row">
                                    <span className="detail-label">Score</span>
                                    <span className="detail-value score-value">{selectedExam.score}</span>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="modal-close-btn-bottom" onClick={closeExamDetails}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}