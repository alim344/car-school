import { useState, useEffect } from "react";
import axios from "axios";
import '../style/SessionClassCard.css';
import LocationNotes from './LocationNotesMap';

function formatTime(dateString) {
    if (!dateString) return "--:--";
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function SessionClassCard({ pc, onEndClass, onInterruptClass }) {
    const [routes, setRoutes] = useState([]);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [routeLoading, setRouteLoading] = useState(false);

    const [showEndModal, setShowEndModal] = useState(false);
    const [showLastClassModal, setShowLastClassModal] = useState(false);
    const [showExtraClassesModal, setShowExtraClassesModal] = useState(false);
    const [extraClasses, setExtraClasses] = useState("");

    const [grade, setGrade] = useState("");
    const [remarks, setRemarks] = useState("");
    const [comment, setComment] = useState("");
    const [endLoading, setEndLoading] = useState(false);

    const [showInterruptModal, setShowInterruptModal] = useState(false);
    const [interruptReason, setInterruptReason] = useState("");
    const [interruptNote, setInterruptNote] = useState("");
    const [interruptLoading, setInterruptLoading] = useState(false);

    const token = localStorage.getItem("userToken");

    useEffect(() => {
        let ignore = false;

        async function loadRoutes() {
            try {
                const response = await axios.get("http://localhost:8080/route/getAll", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!ignore) {
                    setRoutes(response.data);
                }
            } catch (error) {
                if (!ignore) {
                    console.error("Error fetching routes:", error);
                }
            }
        }

        loadRoutes();

        return () => {
            ignore = true;
        };
    }, [token]);

    const handleRouteSelect = (routeId) => {
        if (!routeId) {
            setSelectedRoute(null);
            return;
        }
        const route = routes.find((r) => r.id === parseInt(routeId));
        setSelectedRoute(route);
    };

    const getRandomRoute = async () => {
        setRouteLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/route/getRandom", {
                headers: { Authorization: `Bearer ${token}` },
                params: { email: pc.candidateEmail }
            });
            setSelectedRoute(response.data);
        } catch (error) {
            console.error("Error getting random route:", error);
            alert("Failed to get random route");
        } finally {
            setRouteLoading(false);
        }
    };

    const handleEndClassButtonClick = () => {
        if (pc.lastClass) {
            setShowLastClassModal(true);
        } else {
            setShowEndModal(true);
        }
    };

    const submitEndClass = async (lastClassValue, extraClassesValue) => {
        if (!grade) {
            alert("Please select a grade");
            return;
        }

        setEndLoading(true);
        try {
            const endClassData = {
                id: pc.id,
                grade: parseInt(grade),
                remarks: remarks,
                comment: comment,
                routeId: selectedRoute?.id || null,
                lastClass: lastClassValue,
                extraClasses: extraClassesValue
            };

            console.log("Ending class with data:", endClassData);

            await axios.patch(
                "http://localhost:8080/practical-class/endClass",
                endClassData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setShowEndModal(false);
            setShowLastClassModal(false);
            setShowExtraClassesModal(false);
            alert("Class ended successfully!");
            if (onEndClass) onEndClass(pc);
        } catch (error) {
            console.error("Error ending class:", error);
            console.error("Error response:", error.response?.data);
            alert(error.response?.data?.message || "Failed to end class");
        } finally {
            setEndLoading(false);
        }
    };

    const handleEndClass = () => submitEndClass(false, null);

    const handleFinishCourse = () => submitEndClass(true, null);

    const handleConfirmExtraClasses = () => {
        const num = parseInt(extraClasses, 10);
        if (!extraClasses || isNaN(num) || num <= 0) {
            alert("Please enter a valid number of extra classes");
            return;
        }
        submitEndClass(false, num);
    };

    const handleInterrupt = async () => {
        if (!interruptReason) {
            alert("Please select a reason for interruption");
            return;
        }

        setInterruptLoading(true);
        try {
            const interruptData = {
                classId: pc.id,
                reason: interruptReason,
                note: interruptNote
            };

            console.log("Interrupting class with data:", interruptData);

            await axios.patch(
                `http://localhost:8080/practical-class/interrupt`,
                interruptData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setShowInterruptModal(false);

            if (onInterruptClass) onInterruptClass(pc);
        } catch (error) {
            console.error("Error interrupting class:", error);
            console.error("Error response:", error.response?.data);
            alert(error.response?.data?.message || "Failed to interrupt class");
        } finally {
            setInterruptLoading(false);
        }
    };

    return (
        <div className="session-card">
            <div className='front-card'>
                <div className="name">{pc.candidateName}</div>
                <div className="times">
                    <span>{formatTime(pc.scheduledStartTime)}</span>
                    <span className="time-separator">–</span>
                    <span>{formatTime(pc.scheduledEndTime)}</span>
                </div>
            </div>

            <div className='locationBorder'>
                <div className="location">{pc.location}</div>
            </div>

            <div className='route-card'>
                <div className='route-word'>
                    <h3>ROUTE</h3>
                </div>
                <div className="route-selector-wrapper">
                    <select
                        className="route-dropdown"
                        value={selectedRoute?.id || ""}
                        onChange={(e) => handleRouteSelect(e.target.value)}
                    >
                        <option value="">No route selected</option>
                        {routes.map((route) => (
                            <option key={route.id} value={route.id}>
                                {route.name}
                            </option>
                        ))}
                    </select>
                    <button
                        className="random-route-btn"
                        onClick={getRandomRoute}
                        disabled={routeLoading}
                    >
                        {routeLoading ? "Loading..." : "Random"}
                    </button>
                </div>
            </div>

            <LocationNotes classId={pc.id} />

            <div className="grade-remarks-section">
                <div className="section-title">
                    <h2> Class Evaluation</h2>
                </div>

                <div className="grade-input">
                    <label>Grade (1-5):</label>
                    <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="grade-select"
                    >
                        <option value="">Select grade...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Below Average</option>
                        <option value="3">3 - Average</option>
                        <option value="4">4 - Good</option>
                        <option value="5">5 - Excellent</option>
                    </select>
                </div>

                <div className="remarks-input">
                    <label>Remarks:</label>
                    <input
                        type="text"
                        placeholder="Enter remarks..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="remarks-input-field"
                    />
                </div>

                <div className="comment-input">
                    <label>Comment:</label>
                    <textarea
                        placeholder="Additional comments..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows="2"
                        className="comment-textarea"
                    />
                </div>
            </div>

            <div className="class-card-actions">
                <button
                    className="interrupt-btn"
                    onClick={() => setShowInterruptModal(true)}
                >
                     Interrupt Class
                </button>
                <button
                    className="end-btn"
                    onClick={handleEndClassButtonClick}
                >
                     End Class
                </button>
            </div>

            {showEndModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3> End Class</h3>
                        <p>Are you sure you want to end this class?</p>
                        <div className="modal-actions">
                            <button
                                className="modal-confirm-btn"
                                onClick={handleEndClass}
                                disabled={endLoading}
                            >
                                {endLoading ? "Processing..." : "Yes, End Class"}
                            </button>
                            <button
                                className="modal-cancel-btn"
                                onClick={() => setShowEndModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showLastClassModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Finished All Classes</h3>
                        <p>This candidate has finished all their scheduled classes. What would you like to do?</p>
                        <div className="modal-actions">
                            <button
                                className="modal-confirm-btn"
                                onClick={() => {
                                    setShowLastClassModal(false);
                                    setShowExtraClassesModal(true);
                                }}
                                disabled={endLoading}
                            >
                                Add Extra Classes
                            </button>
                            <button
                                className="modal-confirm-btn"
                                onClick={handleFinishCourse}
                                disabled={endLoading}
                            >
                                {endLoading ? "Processing..." : "Finish the Course"}
                            </button>
                            <button
                                className="modal-cancel-btn"
                                onClick={() => setShowLastClassModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showExtraClassesModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add Extra Classes</h3>
                        <p>How many extra classes should be added?</p>
                        <div className="form-group">
                            <input
                                type="number"
                                min="1"
                                placeholder="Number of extra classes"
                                value={extraClasses}
                                onChange={(e) => setExtraClasses(e.target.value)}
                                className="remarks-input-field"
                            />
                        </div>
                        <div className="modal-actions">
                            <button
                                className="modal-confirm-btn"
                                onClick={handleConfirmExtraClasses}
                                disabled={endLoading}
                            >
                                {endLoading ? "Processing..." : "End"}
                            </button>
                            <button
                                className="modal-cancel-btn"
                                onClick={() => {
                                    setShowExtraClassesModal(false);
                                    setExtraClasses("");
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showInterruptModal && (
                <div className="modal-overlay">
                    <div className="modal-content interrupt-modal">
                        <h3> Interrupt Class</h3>
                        <p>Please provide the reason for interruption:</p>

                        <div className="interrupt-form">
                            <div className="form-group">
                                <label>Reason for interruption:</label>
                                <select
                                    value={interruptReason}
                                    onChange={(e) => setInterruptReason(e.target.value)}
                                    className="interrupt-select"
                                >
                                    <option value="">Select reason...</option>
                                    <option value="ACCIDENT">Accident</option>
                                    <option value="VEHICLE_MALFUNCTION">Vehicle Malfunction</option>
                                    <option value="WEATHER">Weather</option>
                                    <option value="CANDIDATE_ILLNESS">Candidate Illness</option>
                                    <option value="INSTRUCTOR_EMERGENCY">Instructor Emergency</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Note:</label>
                                <textarea
                                    placeholder="Add details about the interruption..."
                                    value={interruptNote}
                                    onChange={(e) => setInterruptNote(e.target.value)}
                                    rows="3"
                                    className="interrupt-textarea"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="modal-confirm-btn interrupt"
                                onClick={handleInterrupt}
                                disabled={interruptLoading}
                            >
                                {interruptLoading ? "Processing..." : "Confirm Interruption"}
                            </button>
                            <button
                                className="modal-cancel-btn"
                                onClick={() => setShowInterruptModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}