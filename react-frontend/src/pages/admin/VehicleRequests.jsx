import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import axios from "axios";
import "../../style/VehicleRequest.css"

export default function VehicleRequests() {
    const token = localStorage.getItem("userToken");

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [instructorSearchTerm, setInstructorSearchTerm] = useState("");
    const [processingId, setProcessingId] = useState(null);

    const hasFetched = useRef(false);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                "http://localhost:8080/car-request/getAll",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setRequests(response.data);
        } catch (error) {
            console.error("Error fetching requests:", error);
            setError("Failed to load requests. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchRequests();
    }, [fetchRequests]);

    const filteredRequests = useMemo(() => {
        return requests.filter((request) => {
            const registrationMatches = (request.registrationNumber || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const instructorMatches = (request.instructor_name || "")
                .toLowerCase()
                .includes(instructorSearchTerm.toLowerCase());
            return registrationMatches && instructorMatches;
        });
    }, [requests, searchTerm, instructorSearchTerm]);

    const formatDate = (dateString) => {
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

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case "PENDING": return "status-pending";
            case "APPROVED": return "status-approved";
            case "REJECTED": return "status-rejected";
            case "CANCELLED": return "status-cancelled";
            default: return "";
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case "PENDING": return "⏳";
            case "APPROVED": return "✅";
            case "REJECTED": return "❌";
            case "CANCELLED": return "🚫";
            default: return "";
        }
    };

    const handleAccept = async (request) => {
        if (!window.confirm(`Accept request from ${request.instructor_name} for vehicle ${request.registrationNumber}?`)) {
            return;
        }

        setProcessingId(request.id);
        try {
            await axios.patch(
                "http://localhost:8080/car-request/accept",
                request,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setRequests(prev =>
                prev.map(r =>
                    r.id === request.id
                        ? { ...r, status: "APPROVED" }
                        : r
                )
            );

        } catch (error) {
            console.error("Error accepting request:", error);
            alert("Failed to accept request. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    const handleDecline = async (request) => {
        if (!window.confirm(`Decline request from ${request.instructor_name} for vehicle ${request.registrationNumber}?`)) {
            return;
        }

        setProcessingId(request.id);
        try {
            await axios.patch(
                "http://localhost:8080/car-request/decline",
                request,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setRequests(prev =>
                prev.map(r =>
                    r.id === request.id
                        ? { ...r, status: "REJECTED" }
                        : r
                )
            );

        } catch (error) {
            console.error("Error declining request:", error);
            alert("Failed to decline request. Please try again.");
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="vehicle-requests-container">
            <div className="vehicle-requests-header">
                <div>
                    <h1>Vehicle Change Requests</h1>
                    <p className="requests-subtitle">Manage instructor vehicle change requests</p>
                </div>
                <div className="requests-count">
                    Total: {requests.length} {requests.length === 1 ? 'Request' : 'Requests'}
                    {requests.filter(r => r.status === "PENDING").length > 0 && (
                        <span className="pending-count">
                            ({requests.filter(r => r.status === "PENDING").length} pending)
                        </span>
                    )}
                </div>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by registration number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <input
                    type="text"
                    placeholder="Search by instructor name..."
                    value={instructorSearchTerm}
                    onChange={(e) => setInstructorSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading requests...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={fetchRequests} className="retry-btn">
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="requests-grid">
                    {filteredRequests.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>No requests found</h3>
                            <p>There are no vehicle change requests at the moment.</p>
                        </div>
                    ) : (
                        filteredRequests.map((request) => (
                            <div key={request.id} className="request-card">
                                <div className="request-card-header">
                                    <div className="request-info">
                                        <span className="instructor-name">{request.instructor_name}</span>
                                        <span className="instructor-email">{request.instructor_email}</span>
                                    </div>
                                    <span className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                                        {getStatusIcon(request.status)} {request.status}
                                    </span>
                                </div>

                                <div className="request-card-body">
                                    <div className="request-details">
                                        <div className="detail-item">
                                            <span className="detail-label">🚗 Vehicle</span>
                                            <span className="detail-value registration-number">
                                                {request.registrationNumber}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">📋 Vehicle Status</span>
                                            <span className="detail-value">{request.vehicle_status?.replace('_', ' ') || 'N/A'}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">📅 Request Date</span>
                                            <span className="detail-value">{formatDate(request.request_date)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="request-card-footer">
                                    {request.status === "PENDING" && (
                                        <>
                                            <button
                                                className="decline-btn"
                                                onClick={() => handleDecline(request)}
                                                disabled={processingId === request.id}
                                            >
                                                {processingId === request.id ? "Processing..." : "❌ Decline"}
                                            </button>
                                            <button
                                                className="accept-btn"
                                                onClick={() => handleAccept(request)}
                                                disabled={processingId === request.id}
                                            >
                                                {processingId === request.id ? "Processing..." : "✅ Accept"}
                                            </button>
                                        </>
                                    )}
                                    {request.status !== "PENDING" && (
                                        <span className={`status-text status-${request.status?.toLowerCase()}`}>
                                            {request.status === "APPROVED" && "✅ Approved"}
                                            {request.status === "REJECTED" && "❌ Rejected"}
                                            {request.status === "CANCELLED" && "🚫 Cancelled"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}