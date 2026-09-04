import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import '../../style/AdminVehicle.css';
import VehicleDetailsModal from "../../components/VehicleDetailsModal";

const filters = [
    { key: "ALL", label: "All Vehicles", endpoint: "/getAll" },
    { key: "AVAILABLE", label: "Available", endpoint: "/getByStatus/AVAILABLE" },
    { key: "IN_USE", label: "In Use", endpoint: "/getByStatus/IN_USE" },
    { key: "OUT_OF_SERVICE", label: "Out of Service", endpoint: "/getByStatus/OUT_OF_SERVICE" },
    { key: "RESERVE", label: "Reserve", endpoint: "/getByStatus/RESERVE" },
];

export default function VehicleManagement() {
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [brandSearchTerm, setBrandSearchTerm] = useState("");
    const [instructorSearchTerm, setInstructorSearchTerm] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showVehicleDetails, setShowVehicleDetails] = useState(false);

    const hasFetched = useRef(false);
    const token = localStorage.getItem("userToken");

    const loadVehicles = useCallback(async (filterKey) => {
        setLoading(true);
        setError(null);

        const filter = filters.find(f => f.key === filterKey);
        if (!filter) return;

        try {
            const response = await axios.get(
                `http://localhost:8080/vehicle${filter.endpoint}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setFilteredVehicles(response.data);
            setFilteredVehicles(response.data);
            setActiveFilter(filterKey);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
            setError("Failed to load vehicles. Please try again.");
            setFilteredVehicles([]);
            setFilteredVehicles([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        loadVehicles("ALL");
    }, [loadVehicles]);

    const handleFilterChange = (filterKey) => {
        if (filterKey === activeFilter) return;
        loadVehicles(filterKey);
    };

    const getStatusBadgeClass = (status) => {
        switch(status) {
            case "AVAILABLE": return "status-available";
            case "IN_USE": return "status-in-use";
            case "OUT_OF_SERVICE": return "status-out-of-service";
            case "RESERVE": return "status-reserve";
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

   const searchedVehicles = filteredVehicles.filter((vehicle) => {
        const registrationMatches = (vehicle.registrationNumber || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const brandMatches = (vehicle.brand || "")
            .toLowerCase()
            .includes(brandSearchTerm.toLowerCase());

        const instructorMatches = (vehicle.instructor_name || "")
            .toLowerCase()
            .includes(instructorSearchTerm.toLowerCase());

        return registrationMatches && brandMatches && instructorMatches;
    });

    const handleAssignClick = (vehicle) => {
        console.log("Assign vehicle:", vehicle);
        alert(`Assigning vehicle ${vehicle.registrationNumber} to an instructor`);
    };

     const handleMoreInfoClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowVehicleDetails(true);
    };

    const closeVehicleDetails = () => {
        setShowVehicleDetails(false);
        setSelectedVehicle(null);
    };

    return (
        <div className="vehicle-management-container">
            <div className="vehicle-header">
                <div className="header-content">
                    <div>
                        <h1>Vehicle Management</h1>
                        <p className="vehicle-subtitle">View and manage all school vehicles</p>
                    </div>
                    <div className="vehicle-buttons">
                        <button className="add-vehicle-btn">
                            <span className="plus-icon">+</span> Add Vehicle
                        </button>
                        <button className="assign-vehicle-btn">
                             Assign Vehicle
                        </button>
                    </div>
                </div>
            </div>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by registration number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="vehicle-search-input"
                />
                <input
                    type="text"
                    placeholder="Search by brand..."
                    value={brandSearchTerm}
                    onChange={(e) => setBrandSearchTerm(e.target.value)}
                    className="vehicle-search-input "
                />
                
                <input
                    type="text"
                    placeholder="Search by instructor name..."
                    value={instructorSearchTerm}
                    onChange={(e) => setInstructorSearchTerm(e.target.value)}
                    className="vehicle-search-input"
                />
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
                    </button>
                ))}
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
                    <button onClick={() => loadVehicles(activeFilter)} className="retry-btn">
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && (
                <div className="vehicles-grid">
                    {searchedVehicles.length === 0 ? (
                        <div className="empty-state">
                            <h3>No vehicles found</h3>
                            <p>There are no {activeFilter.toLowerCase()} vehicles available.</p>
                            <button className="add-from-empty-btn">
                                + Add a Vehicle
                            </button>
                        </div>
                    ) : (
                        searchedVehicles.map((vehicle) => (
                            <div key={vehicle.id} className="vehicle-card">
                                <div className="vehicle-card-header">
                                    <div className="vehicle-registration">
                                        <span className="registration-number">{vehicle.registrationNumber}</span>
                                    </div>
                                    <span className={`status-badge ${getStatusBadgeClass(vehicle.status)}`}>
                                    </span>
                                </div>

                                <div className="vehicle-card-body">
                                    <div className="vehicle-info">
                                        <div className="info-item">
                                            <span className="info-label"> Status</span>
                                            <span className="info-value">{vehicle.status.replace('_', ' ')}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label"> Instructor</span>
                                            <span className="info-value">{vehicle.instructor_name || "Unassigned"}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label"> Instructor Email</span>
                                            <span className="info-value">{vehicle.instructor_email || "N/A"}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label"> Registration Expiry</span>
                                            <span className="info-value">{formatDate(vehicle.registrationExpiryDate)}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label"> Mileage</span>
                                            <span className="info-value">{vehicle.currentMileage || "N/A"} km</span>
                                        </div>
                                    </div>
                                </div>

                                  <div className="vehicle-card-footer">
                                        {vehicle.status === "AVAILABLE" && (
                                            <button 
                                                className="assign-btn" 
                                                onClick={() => handleAssignClick(vehicle)}
                                            >
                                                 Assign
                                            </button>
                                            
                                        )}
                                         <button 
                                            className="more-info-btn" 
                                            onClick={() => handleMoreInfoClick(vehicle)}
                                        >
                                            More Info →
                                        </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

              <VehicleDetailsModal
                isOpen={showVehicleDetails}
                vehicle={selectedVehicle}
                onClose={closeVehicleDetails}
                onAssign={handleAssignClick}
            />



        </div>
    );
}