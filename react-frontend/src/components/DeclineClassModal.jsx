import "../style/DeclineModal.css";

export default function DeclineClassModal({
    isOpen,
    onClose,
    onSkipWeek,
    onReschedule
}) {

    if (!isOpen) {
        return null;
    }

    return (

        <div
            className="class-modal-overlay"
            onClick={onClose}
        >

            <div
                className="decline-class-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="class-modal-header">

                    <h2>
                        Decline Class
                    </h2>

                    <button
                        className="class-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                <div className="decline-class-body">

                    <p>
                        What would you like to do?
                    </p>


                    <div className="decline-options">

                        <button
                            className="skip-week-button"
                            onClick={onSkipWeek}
                        >
                            Skip this week
                        </button>


                        <button
                            className="reschedule-class-button"
                            onClick={onReschedule}
                        >
                            Reschedule class
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}