export default function MakeScheduleModal({ isOpen, onClose, onSelect }) {

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="class-modal-overlay"
            onClick={onClose}
        >
            <div
                className="make-schedule-modal"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="class-modal-header">
                    <h2>Make Schedule</h2>
                    <button
                        className="class-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="make-schedule-body">
                    <p className="make-schedule-description">
                        How would you like to create this week's schedule?
                    </p>

                    <div className="make-schedule-options">
                        <button
                            className="schedule-option manual"
                            onClick={() => onSelect('manual')}
                        >
                            <div className="option-content">
                                <h4>Manual Schedule</h4>
                                <p>Create schedule from scratch by selecting time slots</p>
                            </div>
                        </button>

                        <button
                            className="schedule-option copy"
                            onClick={() => onSelect('copy')}
                        >
                            <div className="option-content">
                                <h4>Copy Last Week</h4>
                                <p>Copy all classes from the previous week's schedule</p>
                            </div>
                        </button>

                         <button
                            className="schedule-option alg"
                            onClick={() => onSelect('alg')}
                        >
                            <div className="option-content">
                                <h4>Algorithm</h4>
                                <p>Computer generated schedule based on time preferences</p>
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}