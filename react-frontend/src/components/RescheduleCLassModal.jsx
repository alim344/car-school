import { useState } from "react";
import "../style/RescheduleCLassModal.css";

export default function RescheduleClassModal({
    isOpen,
    classToReschedule,
    onClose,
    onSubmit
}) {

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");


    const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};


const getWeekRange = () => {

        if (!classToReschedule?.scheduledStartTime) {
            return {
                minDate: "",
                maxDate: ""
            };
        }

        const classDate = new Date(
            classToReschedule.scheduledStartTime
        );

        const day = classDate.getDay();

        const mondayOffset =
            day === 0 ? -6 : 1 - day;

        const monday = new Date(classDate);
        monday.setDate(
            classDate.getDate() + mondayOffset
        );

        const sunday = new Date(monday);
        sunday.setDate(
            monday.getDate() + 6
        );

        return {
            minDate: formatDate(monday),
            maxDate: formatDate(sunday)
        };
    };

    const { minDate, maxDate } = getWeekRange();

    const getToday = () => {
        return formatDate(new Date());
    };

    const today = getToday();

    const actualMinDate =
        minDate && minDate > today
            ? minDate
            : today;


    if (!isOpen) {
        return null;
    }


    const handleSubmit = (e) => {

        e.preventDefault();

        const selectedStart =
        new Date(`${date}T${startTime}`);

        const selectedEnd =
            new Date(`${date}T${endTime}`);

        const now = new Date();

        if (selectedStart < now) {
            alert("You cannot reschedule a class in the past.");
            return;
        }

        if (selectedEnd <= selectedStart) {
            alert("End time must be after start time.");
            return;
        }

        if (
            date < actualMinDate ||
            date > maxDate
        ) {
            alert(
                "You can only reschedule the class within its original week."
            );
            return;
        }

        onSubmit({
            id: Number(classToReschedule.id),
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
                            min={actualMinDate}
                            max={maxDate}
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