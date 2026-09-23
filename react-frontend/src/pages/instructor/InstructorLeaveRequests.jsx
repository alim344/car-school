import NavBar from "../../components/NavBar";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import '../../style/InstructorLeaveRequest.css';
import CreateLeaveRequestModal from "../../components/CreateLeaveRequest";


function LeaveCard({ request }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'status-pending';
            case 'APPROVED':
                return 'status-approved';
            case 'REJECTED':
                return 'status-rejected';
            case 'USED':
                return 'status-used';
            default:
                return '';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'SICK':
                return '🤒';
            case 'VACATION':
                return '🏖️';
            case 'PERSONAL':
                return '👤';
            default:
                return '📅';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '--';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="leave-card">
            <div className="leave-card-header">
                <div className="leave-type">
                    <span className="type-icon">{getTypeIcon(request.type)}</span>
                    <span className="type-name">{request.type}</span>
                </div>
                <div className={`leave-status ${getStatusColor(request.status)}`}>
                    {request.status}
                </div>
            </div>
            
            <div className="leave-card-body">
                <div className="leave-dates">
                    <div className="date-range">
                        <span className="date-label">From:</span>
                        <span className="date-value">{formatDate(request.startDate)}</span>
                    </div>
                    <div className="date-range">
                        <span className="date-label">To:</span>
                        <span className="date-value">{formatDate(request.endDate)}</span>
                    </div>
                </div>
                
                {request.reason && (
                    <div className="leave-reason">
                        <span className="reason-label">Reason:</span>
                        <span className="reason-value">{request.reason}</span>
                    </div>
                )}
                
                {request.adminComment && (
                    <div className="leave-admin-comment">
                        <span className="admin-label">Admin Comment:</span>
                        <span className="admin-value">{request.adminComment}</span>
                    </div>
                )}
                
                <div className="leave-meta">
                    <span className="meta-item">
                        Requested: {formatDate(request.requestedAt)}
                    </span>
                    {request.resolvedAt && (
                        <span className="meta-item">
                            Resolved: {formatDate(request.resolvedAt)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function LeaveSection({ title, icon, requests }) {
    if (requests.length === 0) {
        return null;
    }

    return (
        <div className="leave-section">
            <div className="leave-section-header">
                <span className="section-icon">{icon}</span>
                <h2 className="section-title">{title}</h2>
                <span className="section-count">{requests.length}</span>
            </div>
            <div className="leave-list">
                {requests.map(request => (
                    <LeaveCard key={request.id} request={request} />
                ))}
            </div>
        </div>
    );
}

export default function InstructorLeaveRequest() {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const token = localStorage.getItem("userToken");

    useEffect(() => {
    let ignore = false;

    async function load() {
        try {
            const response = await axios.get(
                'http://localhost:8080/leave/inst/get',
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (ignore) return;

            const allRequests = response.data;
            const yearRequests = allRequests.filter(request => {
                const startDate = new Date(request.startDate);
                return startDate.getFullYear() === currentYear;
            });

            setLeaveRequests(yearRequests);
            setError(null);
        } catch (error) {
            if (ignore) return;
            console.error("Error fetching leave requests:", error);
            setError('Failed to load leave requests.');
        } finally {
            if (!ignore) setLoading(false);
        }
    }

    load();
    return () => { ignore = true; };
}, [token, currentYear]);

const fetchLeaveRequests = useCallback(async () => {
    try {
        const response = await axios.get(
            'http://localhost:8080/leave/inst/get',
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const yearRequests = response.data.filter(request =>
            new Date(request.startDate).getFullYear() === currentYear
        );
        setLeaveRequests(yearRequests);
        setError(null);
    } catch (error) {
        console.error("Error fetching leave requests:", error);
        setError('Failed to load leave requests.');
    } finally {
        setLoading(false);
    }
}, [token, currentYear]);

    const handleCreateRequest = async (formData) => {
        setIsSubmitting(true);
        try {
            await axios.post(
                'http://localhost:8080/leave/inst/create',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setIsModalOpen(false);
            await fetchLeaveRequests(); 

        } catch (error) {
            console.error("Error creating leave request:", error);
            alert(' Failed to submit leave request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const goToPreviousYear = () => {
        setCurrentYear(prev => prev - 1);
    };

    const goToNextYear = () => {
        setCurrentYear(prev => prev + 1);
    };

    const goToCurrentYear = () => {
        setCurrentYear(new Date().getFullYear());
    };

    const sickRequests = leaveRequests.filter(req => req.type === 'SICK');
    const vacationRequests = leaveRequests.filter(req => req.type === 'VACATION');
    const personalRequests = leaveRequests.filter(req => req.type === 'PERSONAL');

    if (loading) {
        return (
            <div className="leave-page">
                <NavBar showAuthButtons={false} />
                <div className="loading-state">Loading leave requests...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="leave-page">
                <NavBar showAuthButtons={false} />
                <div className="error-state">{error}</div>
            </div>
        );
    }

    const totalRequests = leaveRequests.length;

    return (
        <div className="leave-page">
            <NavBar showAuthButtons={false} />
            
            <div className="leave-container">
                <div className="leave-header">
                    <div className="leave-title-section">
                        <div className="title-left">
                            <h1> Leave Requests</h1>
                            <div className="year-navigation">
                                <button 
                                    className="year-nav-btn"
                                    onClick={goToPreviousYear}
                                >
                                    ◀
                                </button>
                                <span className="year-badge">{currentYear}</span>
                                <button 
                                    className="year-nav-btn"
                                    onClick={goToNextYear}
                                >
                                    ▶
                                </button>
                                <button 
                                    className="year-nav-btn current-year-btn"
                                    onClick={goToCurrentYear}
                                >
                                    Today
                                </button>
                            </div>
                        </div>
                        <button 
                            className="create-request-btn"
                            onClick={() => setIsModalOpen(true)}
                        >
                             New Request
                        </button>
                    </div>
                    <div className="leave-summary">
                        <span className="summary-item">
                            Total: <strong>{totalRequests}</strong>
                        </span>
                        <span className="summary-item">
                            Sick: <strong>{sickRequests.length}</strong>
                        </span>
                        <span className="summary-item">
                            Vacation: <strong>{vacationRequests.length}</strong>
                        </span>
                        <span className="summary-item">
                            Personal: <strong>{personalRequests.length}</strong>
                        </span>
                    </div>
                </div>

                {totalRequests === 0 ? (
                    <div className="empty-state">
                        <p>No leave requests for {currentYear}</p>
                        <button 
                            className="empty-create-btn"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Create Your First Request
                        </button>
                    </div>
                ) : (
                    <div className="leave-sections">
                        <LeaveSection 
                            title="Sick Leave" 
                            
                            requests={sickRequests} 
                        />
                        <LeaveSection 
                            title="Vacation" 
                           
                            requests={vacationRequests} 
                        />
                        <LeaveSection 
                            title="Personal Leave" 
                            requests={personalRequests} 
                        />
                    </div>
                )}
            </div>

            <CreateLeaveRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateRequest}
                loading={isSubmitting}
            />
        </div>
    );
}