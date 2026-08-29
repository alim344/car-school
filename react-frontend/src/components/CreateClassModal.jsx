import { useEffect, useState } from "react";

export default function CreateClassModal({
    isOpen,
    onClose,
    initialStart,
    initialEnd,
    onCreated
}) {
    const [candidates, setCandidates] = useState([]);
    const [candidateEmail, setCandidateEmail] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");

    const token = localStorage.getItem("userToken");

    // Fetch candidates when modal opens
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        fetch("http://localhost:8080/candidate/instructor-get", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                return response.json();
            })
            .then(data => {
                setCandidates(data);
            })
            .catch(error => {
                console.error("Error fetching candidates:", error);
            });
    }, [isOpen, token]);

    const formatDateTimeLocal = (date) => {
        if (!date) {
            return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalStartTime =
            startTime || formatDateTimeLocal(initialStart);

        const finalEndTime =
            endTime || formatDateTimeLocal(initialEnd);

        const createClassDTO = {
            candidateEmail,
            startTime: finalStartTime,
            endTime: finalEndTime,
            location
        };

        console.log("Sending:", createClassDTO);

        try {
            const response = await fetch(
                "http://localhost:8080/schedule/inst/create-class",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(createClassDTO)
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            onCreated(data);
            onClose();

            
            setCandidateEmail("");
            setStartTime("");
            setEndTime("");
            setLocation("");

        } catch (error) {
            console.error("Error creating class:", error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="sidebar-form-content">

            <div className="sidebar-form-header">
                <h3>Create a Class</h3>

                <button
                    type="button"
                    className="sidebar-form-close"
                    onClick={onClose}
                >
                    ×
                </button>
            </div>

            <form
                className="create-class-form"
                onSubmit={handleSubmit}
            >

            

                <div className="form-group">
                    <label>Candidate</label>

                    <select
                        value={candidateEmail}
                        onChange={(e) =>
                            setCandidateEmail(e.target.value)
                        }
                        required
                    >
                        <option value="">
                            Select candidate
                        </option>

                        {candidates.map(candidate => (
                            <option
                                key={candidate.id}
                                value={candidate.email}
                            >
                                {candidate.firstName}{" "}
                                {candidate.lastName}
                            </option>
                        ))}
                    </select>
                </div>


               

                <div className="form-group">
                    <label>Start time</label>

                    <input
                        type="datetime-local"
                        value={
                            startTime ||
                            formatDateTimeLocal(initialStart)
                        }
                        onChange={(e) =>
                            setStartTime(e.target.value)
                        }
                        required
                    />
                </div>


               

                <div className="form-group">
                    <label>End time</label>

                    <input
                        type="datetime-local"
                        value={
                            endTime ||
                            formatDateTimeLocal(initialEnd)
                        }
                        onChange={(e) =>
                            setEndTime(e.target.value)
                        }
                        required
                    />
                </div>


             



          

                <div className="sidebar-form-buttons">

                    <button
                        type="button"
                        onClick={onClose}
                        className="cancel-button"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="create-button"
                    >
                        Create Class
                    </button>

                </div>

            </form>

        </div>
    );
}