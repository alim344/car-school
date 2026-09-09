
import "../style/PracticalClassModal.css"

export default function PracticalClassModal({
    selectedClass,
    onClose,
    isCandidateView = false,
    onAccept,
    onDecline,
    onCancel
}) {

    if (!selectedClass) {
        return null;
    }

    const props = selectedClass.extendedProps;

    const status =
        props.status?.toLowerCase() || "";

    const isPending =
        props.status === "PENDING";

     const isAccepted =
        props.status === "ACCEPTED";

    const isFutureClass = () => {
        const now = new Date();
        const classStart = new Date(selectedClass.start);
        return classStart > now;
    };

    const showCandidateActions =
        isCandidateView && isPending && isFutureClass();

    const showCancelAction = 
        (isCandidateView && isAccepted && isFutureClass()) ||
        (!isCandidateView && (isPending || isAccepted) && isFutureClass());


    const formatTime = (date) => {
        if (!date) {
            return "-";
        }

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });
    };


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
                            {formatTime(selectedClass.start)}
                            {" - "}
                            {formatTime(selectedClass.end)}
                        </strong>

                    </div>

                     <div className={`class-info status-${status}`}>
                                <span>Status</span>
                                <strong>{props.status}</strong>
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


                    {showCandidateActions ? (

                        <div className="pending-class-actions">

                            <div className="pending-action-buttons">

                                <button
                                    className="decline-class-button"
                                    onClick={() =>
                                        onDecline(selectedClass.id)
                                    }
                                >
                                    Decline
                                </button>


                                <button
                                    className="accept-class-button"
                                    onClick={() =>
                                        onAccept(selectedClass.id)
                                    }
                                >
                                    Accept
                                </button>

                            </div>

                        </div>

                    ) : showCancelAction ? (
                        <div className="accepted-class-actions">
                            <div className="accepted-action-buttons">
                                <button
                                    className="cancel-class-button"
                                    onClick={() =>
                                        onCancel(selectedClass.id)
                                    }
                                >
                                    Cancel Class
                                </button>
                            </div>
                        </div>
                    ) : null}

                </div>

            </div>

        </div>
    );
}