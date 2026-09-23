import "../style/ExamDetailsModal.css";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";

export default function ExamDetailsModal({ isOpen, exam, onClose,onCancel }) {

    const [isCancelling, setIsCancelling] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    if (!isOpen || !exam) return null;

    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            
            case 'FAILED':
                return '#ef4444';
            case 'SCHEDULED':
                return '#3b82f6';
            case 'CANCELLED':
                return '#6b7280';
            case 'COMPLETED':
                return '#22c55e';
            default:
                return '#6b7280';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCancel = () => {
        setConfirmOpen(true);
    };

    const confirmCancel = async () => {
        setConfirmOpen(false);
        setIsCancelling(true);
        try {
            await onCancel(exam);
        } catch (error) {
            console.error("Error cancelling exam:", error);
            alert("Failed to cancel exam. Please try again.");
        } finally {
            setIsCancelling(false);
        }
    };

    const isScheduled = exam.status?.toUpperCase() === 'SCHEDULED';
    const isCancelled = exam.status?.toUpperCase() === 'CANCELLED';


    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Exam Details</h2>
                     <div className="modal-header-actions">
                        {isScheduled && (
                            <button 
                                className="cancel-exam-btn" 
                                onClick={handleCancel}
                                disabled={isCancelling}
                            >
                                {isCancelling ? 'Cancelling...' : 'Cancel Exam'}
                            </button>
                        )}
                        {isCancelled && (
                            <span className="cancelled-badge">Cancelled</span>
                        )}
                        <button className="close-button" onClick={onClose}>×</button>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="exam-info">
                        <div className="info-row">
                            <span className="info-label">Candidate:</span>
                            <span className="info-value">{exam.candidate_name || 'N/A'}</span>
                        </div>
                        
                        <div className="info-row">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{exam.candidate_email || 'N/A'}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">Date & Time:</span>
                            <span className="info-value">{formatDate(exam.dateTime)}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">Admin:</span>
                            <span className="info-value">{exam.admin_name || 'N/A'}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">Admin Email:</span>
                            <span className="info-value">{exam.admin_email || 'N/A'}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">Status:</span>
                            <span 
                                className="info-value status-badge"
                                style={{ 
                                    backgroundColor: getStatusColor(exam.status),
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    display: 'inline-block'
                                }}
                            >
                                {exam.status || 'N/A'}
                            </span>
                        </div>

                        {exam.score !== null && exam.score !== undefined && (
                            <div className="info-row">
                                <span className="info-label">Score:</span>
                                <span className="info-value score-value">
                                    {exam.score}
                                    {exam.status?.toUpperCase() === 'PASSED' && ' ✅'}
                                    {exam.status?.toUpperCase() === 'FAILED' && ' ❌'}
                                </span>
                            </div>
                        )}

                        
                    </div>
                </div>

                
            </div>

            <ConfirmModal
                isOpen={confirmOpen}
                message={`Are you sure you want to cancel the exam for ${exam.candidate_name}?`}
                onConfirm={confirmCancel}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}