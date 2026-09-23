import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/InstructorRequestVehicle.css";
import ConfirmModal from "../../components/ConfirmModal";


export default function InstructorRequestVehicle() {
    const navigate = useNavigate();
    const token = localStorage.getItem("userToken");

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mileageSearchTerm, setMileageSearchTerm] = useState("");
    const [brandSearchTerm, setBrandSearchTerm] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showVehicleDetails, setShowVehicleDetails] = useState(false);

    const [latestRequest, setLatestRequest] = useState(null);
    const [loadingRequest, setLoadingRequest] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);


    const askConfirm = (message, action) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setConfirmOpen(true);
    };

    const handleConfirmYes = () => {
        setConfirmOpen(false);
        confirmAction?.();
    };

    const hasFetched = useRef(false);

    const fetchVehicles = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(
                "http://localhost:8080/vehicle/getByStatus/AVAILABLE",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setVehicles(response.data);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            setError("Failed to load available vehicles. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchLatestRequest = useCallback(async () => {
        setLoadingRequest(true);
        try {
            const response = await axios.get(
                "http://localhost:8080/car-request/inst/get-latest",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setLatestRequest(response.data);
        } catch (error) {
            if (error.response?.status === 404) {
                setLatestRequest(null);
            } else {
                console.error("Error fetching latest request:", error);
            }
        } finally {
            setLoadingRequest(false);
        }
    }, [token]);

   
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchVehicles();
        fetchLatestRequest();
    }, [fetchVehicles, fetchLatestRequest]);

    const searchedVehicles = useMemo(() => {
        return vehicles.filter((vehicle) => {
            const brandMatches = (vehicle.brand || "")
                .toLowerCase()
                .includes(brandSearchTerm.toLowerCase());
            const mileageMatches = vehicle.currentMileage !== null && vehicle.currentMileage !== undefined
                ? vehicle.currentMileage <= (parseInt(mileageSearchTerm) || Infinity)
                : true;
            return brandMatches && mileageMatches;
        });
    }, [vehicles, brandSearchTerm, mileageSearchTerm]);

    const formatDate = (dateString) => {
        if (!dateString) return "--";
        const date = new Date(dateString);
        return date.toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleMoreInfoClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowVehicleDetails(true);
    };

    const closeVehicleDetails = () => {
        setShowVehicleDetails(false);
        setSelectedVehicle(null);
    };

    const handleRequestClick = (vehicle) => {
        if (latestRequest?.status === 'PENDING') {
            alert("You have a pending request. Please wait for it to be resolved before making a new request.");
            return;
        }

        askConfirm(`Are you sure you want to request vehicle ${vehicle.registrationNumber}?`, async () => {
            try {
                const instructorEmail = localStorage.getItem("userEmail");
                const requestData = {
                    instructor_email: instructorEmail,
                    vehicle_id: vehicle.id
                };

                await axios.post(
                    "http://localhost:8080/car-request/inst/create",
                    requestData,
                    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
                );

                await fetchLatestRequest();
            } catch (error) {
                console.error("Error creating request:", error);
                alert(error.response?.data?.message || "Failed to submit request. Please try again.");
            }
        });
    };



    const handlePickUp = () => {
        if (!latestRequest) {
            alert("No request found.");
            return;
        }

        if (latestRequest.status !== 'ACCEPTED') {
            alert("This request has not been accepted yet.");
            return;
        }

        if (latestRequest.pickedUp) {
            alert("This vehicle has already been picked up.");
            return;
        }

        askConfirm("Are you sure you want to pick up this vehicle?", async () => {
            setLoadingRequest(true);
            try {
                const payload = {
                    id: latestRequest.id,
                    instructor_email: latestRequest.instructor_email,
                    vehicle_id: latestRequest.vehicle_id
                };

                await axios.patch(
                    "http://localhost:8080/car-request/inst/set-primary-car",
                    payload,
                    { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
                );

                await fetchLatestRequest();
                await fetchVehicles();
            } catch (error) {
                console.error("Error picking up vehicle:", error);
                alert(error.response?.data?.message || "Failed to pick up vehicle. Please try again.");
            } finally {
                setLoadingRequest(false);
            }
        });
    };




    return (
        <div className="instructor-request-container">
            <div className="instructor-request-header">
                <div className="header-content">
                    <div>
                        <h1>Request a Vehicle</h1>
                        <p className="request-subtitle">Browse available vehicles and submit a request</p>
                    </div>
                    <button className="back-btn" onClick={() => navigate("/instructor/vehicle")}>
                        ← Back to My Vehicles
                    </button>
                </div>
            </div>
         
           <div className="latest-request-container">
                {loadingRequest ? (
                    <div className="latest-request-loading">Loading request status...</div>
                ) : latestRequest ? (
                    <div className={`latest-request status-${latestRequest.status?.toLowerCase()}`}>
                        <div className="request-info">
                            <span className="request-label"> Latest Request:</span>
                            <span className="request-vehicle">
                                {latestRequest.registrationNumber 
                                    ? `Vehicle: ${latestRequest.registrationNumber}` 
                                    : `Vehicle ID: ${latestRequest.vehicle_id}`}
                            </span>
                            <span className={`request-status status-${latestRequest.status?.toLowerCase()}`}>
                                Status: {latestRequest.status || 'N/A'}
                            </span>
                            <span className="request-date">
                                {latestRequest.request_date ? new Date(latestRequest.request_date).toLocaleDateString() : ''}
                            </span>
                            {latestRequest.pickedUp && (
                                <span className="picked-up-badge"> Picked Up</span>
                            )}
                        </div>
                        
                        {latestRequest.status === 'PENDING' && (
                            <div className="pending-warning">
                                 Your request is pending approval. You cannot make new requests until it's resolved.
                            </div>
                        )}
                        
                        {latestRequest.status === 'ACCEPTED' && !latestRequest.pickedUp && (
                            <div className="approved-warning">
                                 Your request was accepted! Click the button below to pick up your vehicle.
                                <button 
                                    className="pickup-btn" 
                                    onClick={handlePickUp}
                                    disabled={loadingRequest}
                                >
                                    {loadingRequest ? "Processing..." : "📋 Pick Up"}
                                </button>
                            </div>
                        )}
                        
                        {latestRequest.status === 'ACCEPTED' && latestRequest.pickedUp && (
                            <div className="picked-up-warning">
                                ✅ Vehicle has been picked up.
                            </div>
                        )}
                        
                        {latestRequest.status === 'DECLINED' && (
                            <div className="rejected-warning">
                                ❌ Your request was declined. You can make a new request.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="latest-request none">
                        <span className="request-label">📋 No recent requests</span>
                        <span className="request-hint">You can request a vehicle below</span>
                    </div>
                )}
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by brand..."
                    value={brandSearchTerm}
                    onChange={(e) => setBrandSearchTerm(e.target.value)}
                    className="vehicle-search-input"
                />
                <input
                    type="number"
                    placeholder="Search by max mileage..."
                    value={mileageSearchTerm}
                    onChange={(e) => setMileageSearchTerm(e.target.value)}
                    className="vehicle-search-input"
                    min="0"
                />
            </div>

            {loading && (
                <div className="loading-container">
                    <div className="loader"></div>
                    <p>Loading available vehicles...</p>
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
                <div className="vehicles-grid">
                    {searchedVehicles.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🚗</div>
                            <h3>No vehicles available</h3>
                            <p>There are no available vehicles at the moment.</p>
                        </div>
                    ) : (
                        searchedVehicles.map((vehicle) => (
                            <div key={vehicle.id} className="vehicle-card">
                                <div className="vehicle-card-header">
                                    <div className="vehicle-registration">
                                        <span className="registration-number">{vehicle.registrationNumber}</span>
                                    </div>
                                    <span className="status-badge status-available">
                                        ✅ Available
                                    </span>
                                </div>

                                <div className="vehicle-card-body">
                                    <div className="vehicle-info">
                                        <div className="info-item">
                                            <span className="info-label">🚗 Brand</span>
                                            <span className="info-value">{vehicle.brand || "N/A"}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">📋 Model</span>
                                            <span className="info-value">{vehicle.model || "N/A"}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">🎨 Colour</span>
                                            <span className="info-value">
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
                                        <div className="info-item">
                                            <span className="info-label">📅 Year</span>
                                            <span className="info-value">{vehicle.year || "N/A"}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">📊 Mileage</span>
                                            <span className="info-value">{vehicle.currentMileage || "N/A"} km</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">📅 Registration Expiry</span>
                                            <span className="info-value">{formatDate(vehicle.registrationExpiryDate)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="vehicle-card-footer">
                                    <button
                                        className="more-info-btn"
                                        onClick={() => handleMoreInfoClick(vehicle)}
                                    >
                                        More Info →
                                    </button>
                                    
                                    <button
                                        className="request-btn"
                                        onClick={() => handleRequestClick(vehicle)}
                                        disabled={latestRequest?.status === 'PENDING'}
                                    >
                                        📋 Request
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showVehicleDetails && selectedVehicle && (
                <div className="modal-overlay" onClick={closeVehicleDetails}>
                    <div className="modal-content vehicle-details-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Vehicle Details</h2>
                            <button className="modal-close-btn" onClick={closeVehicleDetails}>✕</button>
                        </div>

                        <div className="vehicle-details">
                            <div className="detail-section">
                                <h3 className="section-title">Registration Information</h3>
                                <div className="detail-row">
                                    <span className="detail-label">Registration Number</span>
                                    <span className="detail-value registration-number-highlight">{selectedVehicle.registrationNumber}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Status</span>
                                    <span className="status-badge status-available">
                                        ✅ Available
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Registration Expiry</span>
                                    <span className="detail-value">{formatDate(selectedVehicle.registrationExpiryDate)}</span>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3 className="section-title">Vehicle Specifications</h3>
                                <div className="detail-row">
                                    <span className="detail-label">Brand</span>
                                    <span className="detail-value">{selectedVehicle.brand || "N/A"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Model</span>
                                    <span className="detail-value">{selectedVehicle.model || "N/A"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Colour</span>
                                    <span className="detail-value">
                                        {selectedVehicle.colour ? (
                                            <span className="colour-display">
                                                <span
                                                    className="colour-swatch"
                                                    style={{ backgroundColor: selectedVehicle.colour.toLowerCase() }}
                                                ></span>
                                                {selectedVehicle.colour}
                                            </span>
                                        ) : "N/A"}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Year</span>
                                    <span className="detail-value">{selectedVehicle.year || "N/A"}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Current Mileage</span>
                                    <span className="detail-value">{selectedVehicle.currentMileage || "N/A"} km</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                message={confirmMessage}
                onConfirm={handleConfirmYes}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}