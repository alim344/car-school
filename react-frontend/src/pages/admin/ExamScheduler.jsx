import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "../../style/ExamScheduler.css"

export default function ExamScheduler() {
    const [filteredExams, setFilteredExams] = useState([]);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [showExamDetails, setShowExamDetails] = useState(false);
    
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
    }, [token]);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        
        loadExams("ALL");
        
        // Cleanup function
        return () => {
            hasFetched.current = false;
        };
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
                <h1> Exam Management</h1>
                <p className="exam-subtitle">View and manage all practical exams</p>
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
                            <div className="empty-icon">📭</div>
                            <h3>No exams found</h3>
                            <p>There are no {activeFilter.toLowerCase()} exams available.</p>
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