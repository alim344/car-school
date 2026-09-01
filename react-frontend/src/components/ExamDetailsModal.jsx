import "../style/ExamDetailsModal.css";


export default function ExamDetailsModal({ isOpen, exam, onClose }) {
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

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Exam Details</h2>
                    <button className="close-button" onClick={onClose}>×</button>
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

                        {exam.status?.toUpperCase() === 'FAILED' && (
                            <div className="info-row failed-message">
                                <span className="info-label">Note:</span>
                                <span className="info-value" style={{ color: '#ef4444' }}>
                                    Candidate did not pass this exam
                                </span>
                            </div>
                        )}

                        {exam.status?.toUpperCase() === 'PASSED' && (
                            <div className="info-row passed-message">
                                <span className="info-label">Note:</span>
                                <span className="info-value" style={{ color: '#22c55e' }}>
                                    Candidate successfully passed this exam
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="close-modal-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}