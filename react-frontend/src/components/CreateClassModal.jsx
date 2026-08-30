import { useEffect, useState } from "react";

export default function CreateClassModal({
    isOpen,
    onClose,
    initialStart,
    initialEnd,
    onCreated,
    request = null

}) {
    const [candidates, setCandidates] = useState([]);
    const [candidateEmail, setCandidateEmail] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [location, setLocation] = useState("");

    const token = localStorage.getItem("userToken");

    const finalCandidateEmail = request
    ? request.candidate_email
    : candidateEmail;

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

    const getMinDateTime = () => {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const getMinimumEndTime = () => {
        const selectedStart = startTime || computedStart;

        if (!selectedStart) {
            return getMinDateTime();
        }

        const date = new Date(selectedStart);
        date.setMinutes(date.getMinutes() + 1);

        return formatDateTimeLocal(date);
    };

    

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

    const formatRequestDateTime = (date, time) => {
        if (!date || !time) {
            return "";
        }

        return `${date}T${time.substring(0, 5)}`;
    };

    const computedStart = initialStart
        ? formatDateTimeLocal(initialStart)
        : (request ? formatRequestDateTime(request.date, request.startTime) : "");

    const computedEnd = initialEnd
        ? formatDateTimeLocal(initialEnd)
    : (request ? formatRequestDateTime(request.date, request.endTime) : "");

    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = request
            ? `http://localhost:8080/schedule/inst/request-class/${request.id}`
            : "http://localhost:8080/schedule/inst/create-class";

        const method = request ? "PATCH" : "POST";

        const finalStartTime = startTime || computedStart;
        const finalEndTime = endTime || computedEnd;

        const now = new Date();
        const selectedStart = new Date(finalStartTime);
        const selectedEnd = new Date(finalEndTime);

        if (selectedStart < now) {
            alert("You cannot create a class in the past.");
            return;
        }

        if (selectedEnd <= now) {
            alert("The class end time must be in the future.");
            return;
        }

        if (selectedEnd <= selectedStart) {
            alert("End time must be after start time.");
            return;
        }

        const createClassDTO = {
            candidateEmail: finalCandidateEmail,   
            startTime: finalStartTime,
            endTime: finalEndTime,
            location
        };

        console.log("Sending:", createClassDTO);

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(createClassDTO)
            });

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

                    {request ? (
                        <div className="request-candidate-info">
                            <strong>{request.candidate_name}</strong>
                            <span>{request.candidate_email}</span>
                        </div>
                    ) : (
                        <select 
                            value={candidateEmail}
                            onChange={(e) => setCandidateEmail(e.target.value)}
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
                                    {" — "}
                                  {candidate.numberOfClassesLeft} 
                                </option>
                            ))}
                        </select>
                    )}
                </div>


               

                <div className="form-group">
                    <label>Start time</label>

                    <input 
                        type="datetime-local"
                        min={getMinDateTime()}
                        value={startTime || computedStart}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                    />
                </div>


               

                <div className="form-group">
                    <label>End time</label>

                   <input
                        type="datetime-local"
                        min={getMinimumEndTime()}
                        value={endTime || computedEnd}
                        onChange={(e) => setEndTime(e.target.value)}
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