import { useState } from "react";
import "../style/RescheduleCLassModal.css";

export default function RescheduleClassModal({
    isOpen,
    classId,
    onClose,
    onSubmit
}) {

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");


    if (!isOpen) {
        return null;
    }


    const handleSubmit = (e) => {

        e.preventDefault();

        onSubmit({
            id: Number(classId),
            date,
            startTime,
            endTime,
            location
        });

    };


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
                        Reschedule Class
                    </h2>


                    <button
                        className="class-modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                <form
                    className="reschedule-class-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Date
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Start Time
                        </label>

                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) =>
                                setStartTime(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            End Time
                        </label>

                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) =>
                                setEndTime(e.target.value)
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Location
                        </label>

                        <input
                            type="text"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="reschedule-class-button"
                    >
                        Request Reschedule
                    </button>

                </form>

            </div>

        </div>
    );
}