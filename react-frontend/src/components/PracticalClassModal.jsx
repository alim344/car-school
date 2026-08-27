export default function PracticalClassModal({ selectedClass, onClose }) {

    if (!selectedClass) {
        return null;
    }

    const props = selectedClass.extendedProps;
     const status = props.status?.toLowerCase() || '';

    return (
        <div
            className="class-modal-overlay"
            onClick={onClose}
        >
            <div
                className="class-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="class-modal-header">
                    <h2>
                        {selectedClass.title}
                    </h2>

                    <button
                        className="class-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="class-modal-body">

                    <div className="class-info">
                        <span>Time</span>
                        <strong>
                            {selectedClass.start?.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false
                            })}
                            {" - "}
                            {selectedClass.end?.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false
                            })}
                        </strong>
                    </div>

                    <div className={`class-info status-${status}`}>
                        <span>Status</span>
                        <strong>
                            {props.status}
                        </strong>
                    </div>

                    <div className="class-info">
                        <span>Candidate email</span>
                        <strong>
                            {props.candidateEmail || "-"}
                        </strong>
                    </div>

                    <div className="class-info">
                        <span>Location</span>
                        <strong>
                            {props.location || "-"}
                        </strong>
                    </div>

                    <div className="class-info">
                        <span>Route ID</span>
                        <strong>
                            {props.routeId ?? "-"}
                        </strong>
                    </div>

                    <div className="class-info">
                        <span>Grade</span>
                        <strong>
                            {props.grade ?? "-"}
                        </strong>
                    </div>

                    <div className="class-info">
                        <span>Comment</span>
                        <strong>
                            {props.comment || "-"}
                        </strong>
                    </div>

                    <div className="class-info">
                        <span>Remarks</span>
                        <strong>
                            {props.remarks || "-"}
                        </strong>
                    </div>

                </div>

            </div>
        </div>
    );
}