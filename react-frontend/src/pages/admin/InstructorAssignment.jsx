import { useEffect, useMemo, useState } from "react";
import "../../style/InstructorAssignment.css";

export default function InstructorAssignment() {
    const token = localStorage.getItem("userToken");

    const [candidates, setCandidates] = useState([]);
    const [instructors, setInstructors] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [selectedInstructorId, setSelectedInstructorId] = useState(null);
    const [selectedCandidateEmails, setSelectedCandidateEmails] = useState([]);

    const [searchCandidate, setSearchCandidate] = useState("");
    const [searchInstructor, setSearchInstructor] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [candRes, instRes] = await Promise.all([
                    fetch("http://localhost:8080/admin/get-candidates", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch("http://localhost:8080/admin/get-instructors", {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                if (!candRes.ok) throw new Error(`Candidates didnt load`);
                if (!instRes.ok) throw new Error(`Instructors didnt load`);

                const cands = await candRes.json();
                const insts = await instRes.json();

                if (!cancelled) {
                    setCandidates(cands);
                    setInstructors(insts);
                }
            } catch (err) {
                if (!cancelled) setError(err.message || "Failed to load data.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [token]);

    const selectedInstructor = useMemo(
        () => instructors.find(i => i.id === selectedInstructorId) || null,
        [instructors, selectedInstructorId]
    );

    const maxSelectable = selectedInstructor?.availableSpots ?? 0;
    const atLimit = selectedInstructor != null &&
        selectedCandidateEmails.length >= maxSelectable;

    const filteredCandidates = useMemo(() => {
        const t = searchCandidate.trim().toLowerCase();
        if (!t) return candidates;
        return candidates.filter(c =>
            (c.name || "").toLowerCase().includes(t) ||
            (c.email || "").toLowerCase().includes(t)
        );
    }, [candidates, searchCandidate]);

    const filteredInstructors = useMemo(() => {
        const t = searchInstructor.trim().toLowerCase();
        if (!t) return instructors;
        return instructors.filter(i =>
            (i.name || "").toLowerCase().includes(t) ||
            (i.email || "").toLowerCase().includes(t)
        );
    }, [instructors, searchInstructor]);

    const handleSelectInstructor = (instructor) => {
        if (selectedInstructorId === instructor.id) {
  
            setSelectedInstructorId(null);
            setSelectedCandidateEmails([]);
            return;
        }
        setSelectedInstructorId(instructor.id);
   
        setSelectedCandidateEmails(prev =>
            prev.slice(0, instructor.availableSpots ?? 0)
        );
    };

    const handleToggleCandidate = (candidate) => {
        if (!selectedInstructor) {
            alert("Pick an instructor first.");
            return;
        }

        setSelectedCandidateEmails(prev => {
            const exists = prev.includes(candidate.email);
            if (exists) {
                return prev.filter(e => e !== candidate.email);
            }
            if (prev.length >= maxSelectable) {
                alert(
                    `You can assign at most ${maxSelectable} candidate${
                        maxSelectable === 1 ? "" : "s"
                    } to ${selectedInstructor.name}.`
                );
                return prev;
            }
            return [...prev, candidate.email];
        });
    };

    const handleAssign = async () => {
        if (!selectedInstructor) {
            alert("Please select an instructor.");
            return;
        }
        if (selectedCandidateEmails.length === 0) {
            alert("Please select at least one candidate.");
            return;
        }
        if (selectedCandidateEmails.length > maxSelectable) {
            alert(
                `Only ${maxSelectable} spot${
                    maxSelectable === 1 ? "" : "s"
                } available for ${selectedInstructor.name}.`
            );
            return;
        }

        const dto = {
            inst_id: selectedInstructor.id,
            instructor_email: selectedInstructor.email,
            candidate_emails: selectedCandidateEmails
        };

        setSaving(true);
        try {
            const res = await fetch(
                "http://localhost:8080/admin/assign-inst",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(dto)
                }
            );

            if (!res.ok) {
          
                const msg = await res.text().catch(() => "");
                throw new Error(msg || `HTTP ${res.status}`);
            }

  
            setCandidates(prev =>
                prev.filter(c => !selectedCandidateEmails.includes(c.email))
            );

  
            setInstructors(prev =>
                prev.map(i =>
                    i.id === selectedInstructor.id
                        ? {
                            ...i,
                            availableSpots:
                                (i.availableSpots ?? 0) -
                                selectedCandidateEmails.length
                        }
                        : i
                )
            );

            setSelectedCandidateEmails([]);
            setSelectedInstructorId(null);
            alert("Candidates assigned successfully.");
        } catch (err) {
            console.error("Error assigning:", err);
            alert("Could not assign: " + (err.message || "unknown error"));
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setSelectedInstructorId(null);
        setSelectedCandidateEmails([]);
    };

  
    if (loading) {
        return <div className="inst-assign"><p>Loading…</p></div>;
    }

    if (error) {
        return (
            <div className="inst-assign">
                <div className="inst-assign__error">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="inst-assign">
            <div className="inst-assign__header">
                <h1>Instructor Assignment</h1>
                <p className="inst-assign__subtitle">
                    Pick one instructor, then choose the candidates to assign.
                    
                </p>
            </div>

            <div className="inst-assign__columns">
                <section className="inst-assign__panel">
                    <div className="inst-assign__panel-header">
                        <h2>Instructors</h2>
                        <span className="inst-assign__count">
                            {filteredInstructors.length}
                        </span>
                    </div>

                    <input
                        type="text"
                        placeholder="Search instructors…"
                        value={searchInstructor}
                        onChange={e => setSearchInstructor(e.target.value)}
                        className="inst-assign__search"
                    />

                    <div className="inst-assign__list">
                        {filteredInstructors.length === 0 && (
                            <p className="inst-assign__empty">
                                No instructors found.
                            </p>
                        )}

                        {filteredInstructors.map(i => {
                            const selected = selectedInstructorId === i.id;
                            const noSpots = (i.availableSpots ?? 0) <= 0;

                            return (
                                <button
                                    key={i.id}
                                    type="button"
                                    className={`inst-assign__row inst-assign__row--button ${
                                        selected ? "inst-assign__row--selected" : ""
                                    } ${noSpots ? "inst-assign__row--disabled" : ""}`}
                                    onClick={() =>
                                        !noSpots && handleSelectInstructor(i)
                                    }
                                    disabled={noSpots}
                                >
                                    <div className="inst-assign__radio">
                                        <span
                                            className={`inst-assign__radio-dot ${
                                                selected
                                                    ? "inst-assign__radio-dot--on"
                                                    : ""
                                            }`}
                                        />
                                    </div>
                                    <div className="inst-assign__row-info">
                                        <span className="inst-assign__row-name">
                                            {i.name}
                                        </span>
                                        <span className="inst-assign__row-meta">
                                            {i.email}
                                            {i.category ? ` · ${i.category}` : ""}
                                        </span>
                                    </div>
                                    <span className="inst-assign__spots">
                                        {i.availableSpots ?? 0} spot
                                        {(i.availableSpots ?? 0) === 1 ? "" : "s"}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>


          
                <section className="inst-assign__panel">
                    <div className="inst-assign__panel-header">
                        <h2>Candidates</h2>
                        <span className="inst-assign__count">
                            {filteredCandidates.length}
                        </span>
                    </div>

                    <input
                        type="text"
                        placeholder="Search candidates…"
                        value={searchCandidate}
                        onChange={e => setSearchCandidate(e.target.value)}
                        className="inst-assign__search"
                    />

                    <div className="inst-assign__list">
                        {filteredCandidates.length === 0 && (
                            <p className="inst-assign__empty">
                                No candidates found.
                            </p>
                        )}

                        {filteredCandidates.map(c => {
                            const checked = selectedCandidateEmails.includes(c.email);
                            const disabled =
                                !selectedInstructor ||
                                (!checked && atLimit);

                            return (
                                <label
                                    key={c.id}
                                    className={`inst-assign__row ${
                                        checked ? "inst-assign__row--checked" : ""
                                    } ${disabled ? "inst-assign__row--disabled" : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        disabled={disabled}
                                        onChange={() => handleToggleCandidate(c)}
                                    />
                                    <div className="inst-assign__row-info">
                                        <span className="inst-assign__row-name">
                                            {c.name}
                                        </span>
                                        <span className="inst-assign__row-meta">
                                            {c.email}
                                            {c.category ? ` · ${c.category}` : ""}
                                        </span>
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </section>

          
                
            </div>

            
            <div className="inst-assign__footer">
                <button
                    type="button"
                    className="inst-assign__btn inst-assign__btn--ghost"
                    onClick={handleCancel}
                    disabled={saving || (!selectedInstructor && selectedCandidateEmails.length === 0)}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="inst-assign__btn inst-assign__btn--primary"
                    onClick={handleAssign}
                    disabled={
                        saving ||
                        !selectedInstructor ||
                        selectedCandidateEmails.length === 0
                    }
                >
                    {saving ? "Assigning…" : "Assign Candidates"}
                </button>
            </div>
        </div>
    );
}