import { useEffect, useReducer } from "react";
import axios from "axios";
import "../style/AssignVehicleModal.css";

const ACTIONS = {
    SET_INSTRUCTORS: 'SET_INSTRUCTORS',
    SET_LOADING: 'SET_LOADING',
    SET_SELECTED_INSTRUCTOR: 'SET_SELECTED_INSTRUCTOR',
    SET_ASSIGNING: 'SET_ASSIGNING',
    SET_ERROR: 'SET_ERROR',
    SET_SUCCESS: 'SET_SUCCESS',
    RESET_STATE: 'RESET_STATE'
};

const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_INSTRUCTORS:
            return { ...state, instructors: action.payload, loading: false };
        case ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload };
        case ACTIONS.SET_SELECTED_INSTRUCTOR:
            return { ...state, selectedInstructor: action.payload };
        case ACTIONS.SET_ASSIGNING:
            return { ...state, assigning: action.payload };
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload };
        case ACTIONS.SET_SUCCESS:
            return { ...state, success: action.payload };
        case ACTIONS.RESET_STATE:
            return {
                ...state,
                selectedInstructor: null,
                error: null,
                success: false,
                instructors: [],
                loading: false,
                assigning: false
            };
        default:
            return state;
    }
};

export default function AssignVehicleModal({ isOpen, vehicle, onClose, onAssign }) {
    const token = localStorage.getItem("userToken");

    const [state, dispatch] = useReducer(reducer, {
        instructors: [],
        loading: false,
        selectedInstructor: null,
        assigning: false,
        error: null,
        success: false
    });

    const { instructors, loading, selectedInstructor, assigning, error, success } = state;

    const fetchInstructors = async () => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: ACTIONS.SET_ERROR, payload: null });
        
        try {
            const response = await axios.get(
                "http://localhost:8080/vehicle/get-inst",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            dispatch({ type: ACTIONS.SET_INSTRUCTORS, payload: response.data });
        } catch (error) {
            console.error("Error fetching instructors:", error);
            dispatch({ type: ACTIONS.SET_ERROR, payload: "Failed to load instructors. Please try again." });
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    useEffect(() => {
        if (isOpen && vehicle) {
            dispatch({ type: ACTIONS.RESET_STATE });
            fetchInstructors();
        }
    }, [isOpen, vehicle]);

    const handleAssign = async () => {
        if (!selectedInstructor) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: "Please select an instructor." });
            return;
        }

        dispatch({ type: ACTIONS.SET_ASSIGNING, payload: true });
        dispatch({ type: ACTIONS.SET_ERROR, payload: null });

        const assignData = {
            id: vehicle.id,
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

            dispatch({ type: ACTIONS.SET_SUCCESS, payload: true });
            setTimeout(() => {
                if (onAssign) {
                    onAssign(vehicle.id, selectedInstructor);
                }
                onClose();
            }, 1500);
        } catch (error) {
            console.error("Error assigning vehicle:", error);
            dispatch({ 
                type: ACTIONS.SET_ERROR, 
                payload: error.response?.data?.message || "Failed to assign vehicle. Please try again." 
            });
        } finally {
            dispatch({ type: ACTIONS.SET_ASSIGNING, payload: false });
        }
    };

    if (!isOpen || !vehicle) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content assign-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Assign Vehicle</h2>
                    <button className="modal-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="assign-modal-body">
                    <div className="vehicle-info-section">
                        <p className="assign-vehicle-registration">
                            <span className="label">Vehicle:</span>
                            <span className="value">{vehicle.registrationNumber}</span>
                        </p>
                        <p className="assign-vehicle-details">
                            {vehicle.brand} {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ''}
                            {vehicle.colour && ` - ${vehicle.colour}`}
                        </p>
                    </div>

                    <div className="instructor-selection">
                        <label className="form-label">
                            Select Instructor <span className="required">*</span>
                        </label>

                        {loading && (
                            <div className="loading-instructors">
                                <div className="loader-small"></div>
                                <span>Loading instructors...</span>
                            </div>
                        )}

                        {error && (
                            <div className="assign-error">
                                 {error}
                                <button onClick={fetchInstructors} className="retry-small-btn">
                                    Retry
                                </button>
                            </div>
                        )}

                        {!loading && !error && instructors.length === 0 && (
                            <div className="no-instructors">
                                <p>No instructors available for assignment.</p>
                            </div>
                        )}

                        {!loading && !error && instructors.length > 0 && (
                            <div className="instructors-list">
                                {instructors.map((instructor) => (
                                    <div
                                        key={instructor.email}
                                        className={`instructor-item ${selectedInstructor?.email === instructor.email ? 'selected' : ''}`}
                                        onClick={() => dispatch({ 
                                            type: ACTIONS.SET_SELECTED_INSTRUCTOR, 
                                            payload: instructor 
                                        })}
                                    >
                                        <div className="instructor-info">
                                            <span className="instructor-name">{instructor.name}</span>
                                            <span className="instructor-email">{instructor.email}</span>
                                        </div>
                                        {instructor.needsReserve && (
                                            <span className="needs-reserve-badge">Needs Reserve</span>
                                        )}
                                        {selectedInstructor?.email === instructor.email && (
                                            <span className="check-mark">✓</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {success && (
                        <div className="assign-success">
                             Vehicle assigned successfully!
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose} disabled={assigning}>
                        Cancel
                    </button>
                    <button
                        className="assign-btn-modal"
                        onClick={handleAssign}
                        disabled={assigning || !selectedInstructor || success}
                    >
                        {assigning ? "Assigning..." : "Assign Vehicle"}
                    </button>
                </div>
            </div>
        </div>
    );
}