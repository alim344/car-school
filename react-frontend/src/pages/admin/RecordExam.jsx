import { useState, useEffect } from "react";
import axios from "axios";
import "../../style/RecordExam.css";

export default function RecordExam() {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedExam, setSelectedExam] = useState(null);
    const [score, setScore] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [modalError, setModalError] = useState(null);

    const token = localStorage.getItem("userToken");

   const fetchExams = async (dateVal) => {
        if (!dateVal) return;

        try {
            const response = await axios.post(
                "http://localhost:8080/p-exam/getByDate",
                {
                    dateTime: `${dateVal}T00:00`,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setExams(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching exams by date:", err);
            setError("Failed to load exams for the selected date.");
            setExams([]);
        }
    };

    useEffect(() => {
        if (!selectedDate) return;

        const loadExams = async () => {
            setLoading(true);

            await fetchExams(selectedDate);

            setLoading(false);
        };

        loadExams();
    }, [selectedDate, token]);

    const openRecordModal = (exam) => {
        setSelectedExam(exam);
        setScore(exam.score !== null && exam.score !== undefined ? exam.score : "");
        setModalError(null);
    };

    const closeModal = () => {
        setSelectedExam(null);
        setScore("");
        setModalError(null);
    };

    const handleGradeSubmit = async (status) => {
        if (score === "" || isNaN(score) || Number(score) < 0) {
            setModalError("Please enter a valid non-negative numeric score.");
            return;
        }

        setSubmitting(true);
        setModalError(null);

        const endpoint = status === "PASS" ? "/p-exam/admin/pass" : "/p-exam/admin/fail";
        const payload = {
            ...selectedExam,
            score: Number(score),
        };

        try {
            await axios.patch(`http://localhost:8080${endpoint}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            closeModal();
            fetchExams(selectedDate);
        } catch (err) {
            console.error(`Error submitting ${status}:`, err);
            setModalError(`Failed to update exam status. Please try again.`);
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return "--";
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "SCHEDULED": return "status-scheduled";
            case "COMPLETED": 
            case "PASSED": return "status-passed";
            case "FAILED": return "status-failed";
            case "CANCELLED": return "status-cancelled";
            default: return "";
        }
    };

    return (
        <div className="exam-scheduler-container">
            <div className="exam-header">
                <div className="header-content">
                    <div>
                        <h1>Record Practical Exams</h1>
                        <p className="exam-subtitle">Select a date to evaluate and log candidate exam scores</p>
                    </div>
                </div>
            </div>

            <div className="search-container" style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontWeight: "600" }}>
                    Select Exam Date:
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="candidate-search-input"
                        style={{ maxWidth: "250px" }}
                    />
                </label>
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading exams for {selectedDate}...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={() => fetchExams(selectedDate)} className="retry-btn">
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="exams-grid">
                    {exams.length === 0 ? (
                        <div className="empty-state">
                            <h3>No exams scheduled</h3>
                            <p>There are no practical exams found for {selectedDate}.</p>
                        </div>
                    ) : (
                        exams.map((exam) => (
                            <div key={exam.id} className="exam-card">
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
                                            <span className="info-label"> Time</span>
                                            <span className="info-value">{formatTime(exam.dateTime)}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label"> Witness</span>
                                            <span className="info-value">{exam.admin_name}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label"> Current Score</span>
                                            <span className="info-value score-value">
                                                {exam.score !== null && exam.score !== undefined ? exam.score : "--"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="exam-card-footer">
                                    <button 
                                        className="schedule-exam-btn" 
                                        style={{ width: "100%", justifyContent: "center" }}
                                        onClick={() => openRecordModal(exam)}
                                    >
                                        Record Result
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedExam && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Record Score</h2>
                            <button className="modal-close-btn" onClick={closeModal}>✕</button>
                        </div>

                        <div className="exam-details" style={{ gap: "15px" }}>
                            <div className="detail-row">
                                <span className="detail-label">Candidate</span>
                                <span className="detail-value">{selectedExam.candidate_name}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Witness</span>
                                <span className="detail-value">{selectedExam.admin_name}</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "10px" }}>
                                <label style={{ fontWeight: "600" }}>Exam Score:</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Enter points/score"
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    className="candidate-search-input"
                                />
                            </div>

                            {modalError && (
                                <p style={{ color: "#ef4444", fontSize: "14px", margin: "0" }}>
                                    {modalError}
                                </p>
                            )}
                        </div>

                        <div className="modal-footer" style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                            <button
                                className="retry-btn"
                                style={{ backgroundColor: "#ef4444", color: "#fff", borderColor: "transparent" }}
                                disabled={submitting}
                                onClick={() => handleGradeSubmit("FAIL")}
                            >
                                {submitting ? "Saving..." : "Fail"}
                            </button>
                            <button
                                className="schedule-exam-btn"
                                style={{ backgroundColor: "#10b981" }}
                                disabled={submitting}
                                onClick={() => handleGradeSubmit("PASS")}
                            >
                                {submitting ? "Saving..." : "Pass"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}