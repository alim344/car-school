import "../style/VehicleDetailsModal.css";


export default function VehicleDetailsModal({ isOpen, vehicle, onClose, onAssign }) {
    if (!isOpen || !vehicle) return null;

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case "AVAILABLE": return "status-available";
            case "IN_USE": return "status-in-use";
            case "OUT_OF_SERVICE": return "status-out-of-service";
            case "RESERVE": return "status-reserve";
            default: return "";
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case "AVAILABLE": return "✅";
            case "IN_USE": return "🚗";
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

                <div className="modal-footer">
                    {vehicle.status === "AVAILABLE" && (
                        <button 
                            className="assign-from-modal-btn" 
                            onClick={handleAssign}
                        >
                             Assign Vehicle
                        </button>
                    )}
                    <button className="modal-close-btn-bottom" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}