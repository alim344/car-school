import { useState, useEffect } from "react";
import axios from "axios";
import "../style/VehicleDetailsModal.css";

export default function VehicleDetailsModal({ isOpen, vehicle, onClose, onAssign, onFix }) {

    const [malfunction, setMalfunction] = useState(null);
    const [loadingMalfunction, setLoadingMalfunction] = useState(false);
    const [malfunctionError, setMalfunctionError] = useState(null);

    const [fixing, setFixing] = useState(false);

     const token = localStorage.getItem("userToken");

    useEffect(() => {
            if (!isOpen || !vehicle || vehicle.status !== "OUT_OF_SERVICE") {
                return;
            }

            let cancelled = false;

            const fetchMalfunction = async () => {
                setLoadingMalfunction(true);
                setMalfunctionError(null);

                try {
                    const res = await axios.get(
                        `http://localhost:8080/vehicle/record-get/${vehicle.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (!cancelled) {
                        setMalfunction(res.data);
                    }
                } catch (err) {
                    console.error("Error fetching malfunction record:", err);

                    if (!cancelled) {
                        setMalfunctionError("Could not load malfunction info.");
                    }
                } finally {
                    if (!cancelled) {
                        setLoadingMalfunction(false);
                    }
                }
            };

            fetchMalfunction();

            return () => {
                cancelled = true;
            };
        }, [isOpen, vehicle, token]);

                if (!isOpen || !vehicle) return null;



    const getStatusBadgeClass = (status) => {
        switch(status) {
            case "AVAILABLE": return "status-available";
            case "IN_USE": return "status-in-use";
            case "OUT_OF_SERVICE": return "status-out-of-service";
            case "WAITING_FOR_PICKUP": return "status-waiting-for-pickup";
            case "RESERVE": return "status-reserve";
            default: return "";
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case "AVAILABLE": return "✅";
            case "IN_USE": return "🚗";
            case "WAITING_FOR_PICKUP": return "⏳";
            case "OUT_OF_SERVICE": return "🔧";
            case "RESERVE": return "📅";
            default: return "";
        }
    };

    const formatFullDate = (dateString) => {
        if (!dateString) return "--";
        const date = new Date(dateString);
        return date.toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleAssign = () => {
        if (onAssign) {
            onAssign(vehicle);
        }
    };

     const handleFix = async () => {
        if (!window.confirm(`Are you sure you want to mark vehicle ${vehicle.registrationNumber} as fixed?`)) {
            return;
        }

        setFixing(true);
        try {
            await axios.patch(
                `http://localhost:8080/vehicle/fix/${vehicle.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            
            if (onFix) {
                onFix(vehicle.id);
            }

          
            onClose();

        } catch (error) {
            console.error("Error fixing vehicle:", error);
            alert("Failed to mark vehicle as fixed. Please try again.");
        } finally {
            setFixing(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content vehicle-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Vehicle Details</h2>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="vehicle-details">
                    <div className="detail-section">
                        <h3 className="section-title">Registration Information</h3>
                        <div className="detail-row">
                            <span className="detail-label">Registration Number</span>
                            <span className="detail-value registration-number-highlight">{vehicle.registrationNumber}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Status</span>
                            <span className={`status-badge ${getStatusBadgeClass(vehicle.status)}`}>
                                {getStatusIcon(vehicle.status)} {vehicle.status.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Registration Expiry</span>
                            <span className="detail-value">{formatFullDate(vehicle.registrationExpiryDate)}</span>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3 className="section-title">Vehicle Specifications</h3>
                        <div className="detail-row">
                            <span className="detail-label">Brand</span>
                            <span className="detail-value">{vehicle.brand || "N/A"}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Model</span>
                            <span className="detail-value">{vehicle.model || "N/A"}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Colour</span>
                            <span className="detail-value">
                                {vehicle.colour ? (
                                    <span className="colour-display">
                                        <span 
                                            className="colour-swatch" 
                                            style={{ backgroundColor: vehicle.colour.toLowerCase() }}
                                        ></span>
                                        {vehicle.colour}
                                    </span>
                                ) : "N/A"}
                            </span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Year</span>
                            <span className="detail-value">{vehicle.year || "N/A"}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Current Mileage</span>
                            <span className="detail-value">{vehicle.currentMileage || "N/A"} km</span>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3 className="section-title">Instructor Information</h3>
                        <div className="detail-row">
                            <span className="detail-label">Instructor Name</span>
                            <span className="detail-value">{vehicle.instructor_name || "Unassigned"}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Instructor Email</span>
                            <span className="detail-value">{vehicle.instructor_email || "N/A"}</span>
                        </div>
                    </div>
                </div>

                {vehicle.status === "OUT_OF_SERVICE" && (
                    <div className="detail-section">
                        <h3 className="section-title">Malfunction Information</h3>

                        {loadingMalfunction && <p>Loading malfunction info...</p>}
                        {malfunctionError && <p className="error-text">{malfunctionError}</p>}

                        {malfunction && (
                            <>
                                <div className="detail-row">
                                    <span className="detail-label">Reported On</span>
                                    <span className="detail-value">{formatFullDate(malfunction.malfunctionDate)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Status</span>
                                    <span className="detail-value">
                                        {malfunction.fixed ? "✅ Fixed" : "🔧 Not Fixed"}
                                    </span>
                                </div>
                                {malfunction.fixed && (
                                    <div className="detail-row">
                                        <span className="detail-label">Fixed On</span>
                                        <span className="detail-value">{formatFullDate(malfunction.fixedDate)}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                <div className="modal-footer">
                    {vehicle.status === "AVAILABLE" && (
                        <button 
                            className="assign-from-modal-btn" 
                            onClick={handleAssign}
                        >
                            📋 Assign Vehicle
                        </button>
                    )}

                    {vehicle.status === "OUT_OF_SERVICE" && malfunction && !malfunction.fixed && (
                        <button 
                            className="fix-vehicle-btn" 
                            onClick={handleFix}
                            disabled={fixing}
                        >
                            {fixing ? "Fixing..." : "🔧 Mark as Fixed"}
                        </button>
                    )}
                    {vehicle.status === "OUT_OF_SERVICE" && malfunction && malfunction.fixed && (
                        <span className="already-fixed-badge">✅ Vehicle is fixed</span>
                    )}
                    
                    <button className="modal-close-btn-bottom" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}