import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import "../../style/InstructorVehicle.css";

export default function InstructorVehicle() {
    
    const token = localStorage.getItem("userToken");

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateData, setUpdateData] = useState({
        mileage: "",
        registrationExpiryDate: ""
    });
    const [updating, setUpdating] = useState(false);
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    
    const [reportingOutOfService, setReportingOutOfService] = useState(false);
    const [processingAction, setProcessingAction] = useState(false);

    const hasFetched = useRef(false);

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                "http://localhost:8080/vehicle/inst/get",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setVehicles(response.data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            setError("Failed to load vehicles. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchVehicles();
    }, [fetchVehicles]);

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case "IN_USE": return "status-in-use";
            case "RESERVE": return "status-reserve";
            case "OUT_OF_SERVICE": return "status-out-of-service";
            default: return "";
        }
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case "IN_USE": return "🚗";
            case "RESERVE": return "📅";
            case "OUT_OF_SERVICE": return "🔧";
            default: return "";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "--";
        const date = new Date(dateString);
        return date.toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleUpdateClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setUpdateData({
            mileage: vehicle.currentMileage || "",
            registrationExpiryDate: vehicle.registrationExpiryDate || ""
        });
        setUpdateError(null);
        setUpdateSuccess(false);
        setShowUpdateModal(true);
    };

    const handleUpdateChange = (e) => {
        const { name, value } = e.target;
        setUpdateData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setUpdateError(null);
        setUpdateSuccess(false);

        const payload = {
            id: selectedVehicle.id,
            mileage: parseInt(updateData.mileage),
            registrationExpiryDate: updateData.registrationExpiryDate
        };

        try {
            await axios.patch(
                "http://localhost:8080/vehicle/inst/update",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setUpdateSuccess(true);
            
            setVehicles(prev =>
                prev.map(v =>
                    v.id === selectedVehicle.id
                        ? {
                            ...v,
                            currentMileage: payload.mileage,
                            registrationExpiryDate: payload.registrationExpiryDate
                        }
                        : v
                )
            );

            setTimeout(() => {
                setShowUpdateModal(false);
                setSelectedVehicle(null);
                setUpdateSuccess(false);
            }, 1500);

        } catch (error) {
            console.error("Error updating vehicle:", error);
            setUpdateError(error.response?.data?.message || "Failed to update vehicle. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    const handleReportOutOfService = async (vehicleId) => {
        if (!window.confirm("Are you sure you want to report this vehicle as out of service?")) {
            return;
        }

        setReportingOutOfService(true);
        try {
            await axios.patch(
                `http://localhost:8080/vehicle/inst/out-of-service/${vehicleId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVehicles(prev =>
                prev.map(v =>
                    v.id === vehicleId
                        ? { ...v, status: "OUT_OF_SERVICE" }
                        : v
                )
            );

        } catch (error) {
            console.error("Error reporting out of service:", error);
            alert("Failed to report vehicle as out of service. Please try again.");
        } finally {
            setReportingOutOfService(false);
        }
    };

    const handleMakeReserveAvailable = async (vehicleId) => {
        if (!window.confirm("Are you sure you want to make this reserve vehicle available?")) {
            return;
        }

        setProcessingAction(true);
        try {
            await axios.patch(
                `http://localhost:8080/vehicle/make-reserve-available/${vehicleId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVehicles(prev =>
                prev.map(v =>
                    v.id === vehicleId
                        ? { ...v, status: "AVAILABLE" }
                        : v
                )
            );
        } catch (error) {
            console.error("Error setting reserve vehicle available:", error);
            alert(error.response?.data?.message || "Failed to make reserve vehicle available.");
        } finally {
            setProcessingAction(false);
        }
    };

    const handleActivateVehicle = async (vehicleId) => {
        if (!window.confirm("Are you sure you want to activate this primary vehicle?")) {
            return;
        }

        setProcessingAction(true);
        try {
            await axios.patch(
                `http://localhost:8080/vehicle/activate/${vehicleId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setVehicles(prev =>
                prev.map(v =>
                    v.id === vehicleId
                        ? { ...v, status: "IN_USE" }
                        : v
                )
            );
        } catch (error) {
            console.error("Error activating primary vehicle:", error);
            alert(error.response?.data?.message || "Failed to activate primary vehicle. Make sure you don't already have an active vehicle.");
        } finally {
            setProcessingAction(false);
        }
    };

    return (
        <div className="instructor-vehicle-container">
            <div className="instructor-vehicle-header">
                <div className="header-content">
                    <div>
                        <h1>My Vehicles</h1>
                        <p className="vehicle-subtitle">View and manage your assigned vehicles</p>
                    </div>
                    <div className="vehicle-count">
                        Total: {vehicles.length} {vehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
                    </div>
                </div>
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading vehicles...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <p>{error}</p>
                    <button onClick={fetchVehicles} className="retry-btn">
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="vehicles-table-container">
                    {vehicles.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🚗</div>
                            <h3>No vehicles assigned</h3>
                            <p>You don't have any vehicles assigned to you yet.</p>
                        </div>
                    ) : (
                        <table className="vehicles-table">
                            <thead>
                                <tr>
                                    <th>Registration</th>
                                    <th>Brand</th>
                                    <th>Model</th>
                                    <th>Colour</th>
                                    <th>Year</th>
                                    <th>Mileage</th>
                                    <th>Reg. Expiry</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicles.map((vehicle) => (
                                    <tr key={vehicle.id} className={`vehicle-row status-${vehicle.status.toLowerCase()}`}>
                                        <td>
                                            <span className="registration-number">{vehicle.registrationNumber}</span>
                                        </td>
                                        <td>{vehicle.brand || "N/A"}</td>
                                        <td>{vehicle.model || "N/A"}</td>
                                        <td>
                                            {vehicle.colour ? (
                                                <span className="colour-display">
                                                    <span 
                                                        className="colour-swatch" 
                                                        style={{ backgroundColor: vehicle.colour.toLowerCase() }}
                                                    ></span>
                                                    {vehicle.colour}
                                                </span>
                                            ) : "N/A"}
                                        </td>
                                        <td>{vehicle.year || "N/A"}</td>
                                        <td>
                                            <span className="mileage-value">
                                                {vehicle.currentMileage || "0"} km
                                            </span>
                                        </td>
                                        <td>{formatDate(vehicle.registrationExpiryDate)}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusBadgeClass(vehicle.status)}`}>
                                                {getStatusIcon(vehicle.status)} {vehicle.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {vehicle.status === "IN_USE" && (
                                                    <>
                                                        <button 
                                                            className="update-btn" 
                                                            onClick={() => handleUpdateClick(vehicle)}
                                                            title="Update vehicle details"
                                                        >
                                                            ✏️ Update
                                                        </button>
                                                        <button 
                                                            className="out-of-service-btn" 
                                                            onClick={() => handleReportOutOfService(vehicle.id)}
                                                            disabled={reportingOutOfService}
                                                            title="Report out of service"
                                                        >
                                                            🔧 Report OOS
                                                        </button>
                                                    </>
                                                )}

                                                {vehicle.status === "RESERVE" && (
                                                    <>
                                                        <button 
                                                            className="update-btn" 
                                                            onClick={() => handleUpdateClick(vehicle)}
                                                            title="Update vehicle details"
                                                        >
                                                            ✏️ Update
                                                        </button>
                                                        <button 
                                                            className="make-available-btn" 
                                                            onClick={() => handleMakeReserveAvailable(vehicle.id)}
                                                            disabled={processingAction}
                                                            title="Make vehicle available for assignment"
                                                        >
                                                            ✅ Make Available
                                                        </button>
                                                    </>
                                                )}

                                                {vehicle.status === "OUT_OF_SERVICE" && (
                                                    <button 
                                                        className="activate-btn" 
                                                        onClick={() => handleActivateVehicle(vehicle.id)}
                                                        disabled={processingAction}
                                                        title="Activate primary vehicle"
                                                    >
                                                        ⚡ Activate
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {showUpdateModal && selectedVehicle && (
                <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
                    <div className="modal-content update-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Update Vehicle</h2>
                            <button className="modal-close-btn" onClick={() => setShowUpdateModal(false)}>✕</button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="update-form">
                            <div className="vehicle-info-summary">
                                <p className="update-vehicle-registration">
                                    {selectedVehicle.registrationNumber}
                                </p>
                                <p className="update-vehicle-details">
                                    {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year})
                                </p>
                            </div>

                            {updateError && (
                                <div className="update-error">
                                    <span className="error-icon">⚠️</span> {updateError}
                                </div>
                            )}

                            {updateSuccess && (
                                <div className="update-success">
                                    <span className="success-icon">✅</span> Vehicle updated successfully!
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">
                                    Mileage (km) <span className="required">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="mileage"
                                    value={updateData.mileage}
                                    onChange={handleUpdateChange}
                                    placeholder="Enter current mileage"
                                    className="form-input"
                                    min="0"
                                    required
                                    disabled={updating || updateSuccess}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    Registration Expiry Date <span className="required">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="registrationExpiryDate"
                                    value={updateData.registrationExpiryDate}
                                    onChange={handleUpdateChange}
                                    className="form-input"
                                    required
                                    disabled={updating || updateSuccess}
                                />
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowUpdateModal(false)}
                                    disabled={updating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={updating || updateSuccess}
                                >
                                    {updating ? "Updating..." : "Update Vehicle"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}