import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/AssignVehiclePage.css";

export default function AssignVehiclePage() {
    const navigate = useNavigate();
    const token = localStorage.getItem("userToken");

    const [vehicles, setVehicles] = useState([]);
    const [loadingVehicles, setLoadingVehicles] = useState(false);
    const [vehicleSearchTerm, setVehicleSearchTerm] = useState("");
    const [brandSearchTerm, setBrandSearchTerm] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const [instructors, setInstructors] = useState([]);
    const [loadingInstructors, setLoadingInstructors] = useState(false);
    const [instructorSearchTerm, setInstructorSearchTerm] = useState("");
    const [selectedInstructor, setSelectedInstructor] = useState(null);

    const [assigning, setAssigning] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const hasFetched = useRef(false);

    
    const fetchVehicles = useCallback(async () => {
        setLoadingVehicles(true);
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
            setError("Failed to load vehicles.");
        } finally {
            setLoadingVehicles(false);
        }
    }, [token]);

   
    const fetchInstructors = useCallback(async () => {
        setLoadingInstructors(true);
        try {
            const response = await axios.get(
                "http://localhost:8080/vehicle/get-inst",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setInstructors(response.data);
        } catch (error) {
            console.error("Error fetching instructors:", error);
            setError("Failed to load instructors.");
        } finally {
            setLoadingInstructors(false);
        }
    }, [token]);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchVehicles();
        fetchInstructors();
    }, [fetchVehicles, fetchInstructors]);

    const filteredVehicles = useMemo(() => {
        return vehicles.filter((vehicle) => {
            const registrationMatches = (vehicle.registrationNumber || "")
                .toLowerCase()
                .includes(vehicleSearchTerm.toLowerCase());
            const brandMatches = (vehicle.brand || "")
                .toLowerCase()
                .includes(brandSearchTerm.toLowerCase());
            return registrationMatches && brandMatches;
        });
    }, [vehicles, vehicleSearchTerm, brandSearchTerm]);

    const filteredInstructors = useMemo(() => {
        return instructors.filter((instructor) =>
            (instructor.name || "")
                .toLowerCase()
                .includes(instructorSearchTerm.toLowerCase())
        );
    }, [instructors, instructorSearchTerm]);

    const handleVehicleSelect = (vehicle) => {
        setSelectedVehicle(selectedVehicle?.id === vehicle.id ? null : vehicle);
        setError(null);
        setSuccess(false);
    };

    const handleInstructorSelect = (instructor) => {
        setSelectedInstructor(selectedInstructor?.email === instructor.email ? null : instructor);
        setError(null);
        setSuccess(false);
    };

    const handleAssign = async () => {
        if (!selectedVehicle) {
            setError("Please select a vehicle.");
            return;
        }
        if (!selectedInstructor) {
            setError("Please select an instructor.");
            return;
        }

        setAssigning(true);
        setError(null);

        const assignData = {
            id: selectedVehicle.id,
            instructor_email: selectedInstructor.email
        };

        try {
            await axios.patch(
                "http://localhost:8080/vehicle/assign",
                assignData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setSuccess(true);
            
            setVehicles(prev => prev.filter(v => v.id !== selectedVehicle.id));
            setSelectedVehicle(null);
            setSelectedInstructor(null);

            setTimeout(() => {
                setSuccess(false);
                navigate("/admin/vehicles");
            }, 2000);
        } catch (error) {
            console.error("Error assigning vehicle:", error);
            setError(error.response?.data?.message || "Failed to assign vehicle. Please try again.");
        } finally {
            setAssigning(false);
        }
    };

    return (
        <div className="assign-vehicle-page">
            <div className="assign-page-header">
                <button className="back-btn" onClick={() => navigate("/admin/vehicles")}>
                    ← Back to Vehicles
                </button>
                <h1>Assign Vehicle to Instructor</h1>
            </div>

            {error && (
                <div className="assign-page-error">
                    <span className="error-icon">⚠️</span> {error}
                </div>
            )}

            {success && (
                <div className="assign-page-success">
                    Vehicle assigned successfully!
                </div>
            )}

            <div className="assign-page-content">
                <div className="assign-panel vehicles-panel">
                    <div className="panel-header">
                        <h2>Available Vehicles</h2>
                        <span className="panel-count">{filteredVehicles.length}</span>
                    </div>

                    <div className="panel-search">
                        <input
                            type="text"
                            placeholder="Search by registration..."
                            value={vehicleSearchTerm}
                            onChange={(e) => setVehicleSearchTerm(e.target.value)}
                            className="panel-search-input"
                        />
                        <input
                            type="text"
                            placeholder="Search by brand..."
                            value={brandSearchTerm}
                            onChange={(e) => setBrandSearchTerm(e.target.value)}
                            className="panel-search-input"
                        />
                    </div>

                    {loadingVehicles ? (
                        <div className="panel-loading">
                            <div className="loader-small"></div>
                            <span>Loading vehicles...</span>
                        </div>
                    ) : filteredVehicles.length === 0 ? (
                        <div className="panel-empty">
                            <p>No available vehicles found.</p>
                        </div>
                    ) : (
                        <div className="panel-list">
                            {filteredVehicles.map((vehicle) => (
                                <div
                                    key={vehicle.id}
                                    className={`panel-item ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
                                    onClick={() => handleVehicleSelect(vehicle)}
                                >
                                    <div className="item-info">
                                        <span className="item-title">{vehicle.registrationNumber}</span>
                                        <span className="item-subtitle">
                                            {vehicle.brand} {vehicle.model}
                                            {vehicle.colour && ` - ${vehicle.colour}`}
                                        </span>
                                    </div>
                                    {selectedVehicle?.id === vehicle.id && (
                                        <span className="check-mark">✓</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

          
                <div className="assign-panel instructors-panel">
                    <div className="panel-header">
                        <h2>Instructors</h2>
                        <span className="panel-count">{filteredInstructors.length}</span>
                    </div>

                    <div className="panel-search">
                        <input
                            type="text"
                            placeholder="Search by instructor name..."
                            value={instructorSearchTerm}
                            onChange={(e) => setInstructorSearchTerm(e.target.value)}
                            className="panel-search-input"
                        />
                    </div>

                    {loadingInstructors ? (
                        <div className="panel-loading">
                            <div className="loader-small"></div>
                            <span>Loading instructors...</span>
                        </div>
                    ) : filteredInstructors.length === 0 ? (
                        <div className="panel-empty">
                            <p>No instructors available.</p>
                        </div>
                    ) : (
                        <div className="panel-list">
                            {filteredInstructors.map((instructor) => (
                                <div
                                    key={instructor.email}
                                    className={`panel-item ${selectedInstructor?.email === instructor.email ? 'selected' : ''}`}
                                    onClick={() => handleInstructorSelect(instructor)}
                                >
                                    <div className="item-info">
                                        <span className="item-title">{instructor.name}</span>
                                        <span className="item-subtitle">{instructor.email}</span>
                                    </div>
                                    <div className="item-actions">
                                        {instructor.needsReserve && (
                                            <span className="needs-reserve-badge">Needs Reserve</span>
                                        )}
                                        {selectedInstructor?.email === instructor.email && (
                                            <span className="check-mark">✓</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

    
            <div className="assign-page-actions">
                <button 
                    className="assign-cancel-btn" 
                    onClick={() => navigate("/admin/vehicles")}
                    disabled={assigning}
                >
                    Cancel
                </button>
                <button
                    className="assign-submit-btn"
                    onClick={handleAssign}
                    disabled={assigning || !selectedVehicle || !selectedInstructor}
                >
                    {assigning ? "Assigning..." : "Assign Vehicle"}
                </button>
            </div>
        </div>
    );
}