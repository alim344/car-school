import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/AssignAllReview.css";
import ConfirmModal from "../../components/ConfirmModal";

export default function AssignAllReview() {
    const navigate = useNavigate();
    const token = localStorage.getItem("userToken");

    const [assignments, setAssignments] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);


    useEffect(() => {
        let cancelled = false;

        async function loadProposal() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    "http://localhost:8080/admin/assign-all",
                    {
                        method: "PATCH",
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                if (!res.ok) {
                    const msg = await res.text().catch(() => "");
                    throw new Error(msg || `HTTP ${res.status}`);
                }

                const data = await res.json();
                if (!cancelled) setAssignments(data);
            } catch (err) {
                if (!cancelled) setError(err.message || "Failed to load proposal.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadProposal();
        return () => { cancelled = true; };
    }, [token]);


    const grouped = useMemo(() => {
        const map = new Map();
        assignments.forEach(a => {
            if (!map.has(a.instructorEmail)) {
                map.set(a.instructorEmail, {
                    instructorEmail: a.instructorEmail,
                    instructorName: a.instructorName,
                    candidates: []
                });
            }
            map.get(a.instructorEmail).candidates.push(a);
        });
        return Array.from(map.values());
    }, [assignments]);

 
    const totalAssigned = assignments.length;
    const totalInstructors = grouped.length;

    const handleRemoveCandidate = (candidateEmail) => {
        setAssignments(prev =>
            prev.filter(a => a.candidateEmail !== candidateEmail)
        );
    };

    const handleRemoveInstructor = (instructorEmail) => {
        setAssignments(prev =>
            prev.filter(a => a.instructorEmail !== instructorEmail)
        );
    };

    const handleSave = async () => {
        if (assignments.length === 0) {
            alert("Nothing to save — all candidates were removed.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(
                "http://localhost:8080/admin/save-assigned",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(assignments)
                }
            );

            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(msg || `HTTP ${res.status}`);
            }

       
            navigate("/admin/assign");
        } catch (err) {
            console.error("Save failed:", err);
            alert("Could not save: " + (err.message || "unknown error"));
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (assignments.length === 0) {
            navigate("/admin/assign");
            return;
        }
        setConfirmOpen(true);
    };

    if (loading) {
        return <div className="assign-review"><p>Loading proposal…</p></div>;
    }

    if (error) {
        return (
            <div className="assign-review">
                <div className="assign-review__error">Error: {error}</div>
                <button
                    type="button"
                    className="assign-review__btn assign-review__btn--ghost"
                    onClick={() => navigate("/admin/assign")}
                >
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className="assign-review">
             <button
                type="button"
                className="assign-review__back-btn"
                onClick={() => navigate("/admin/assign")}
            >
                ← Back to assignment
            </button>
            <div className="assign-review__header">
                <div className="assign-review__header-text">
                    <h1>Auto-Assignment Proposal</h1>
                    <p className="assign-review__subtitle">
                        {totalAssigned} candidate{totalAssigned === 1 ? "" : "s"} across{" "}
                        {totalInstructors} instructor{totalInstructors === 1 ? "" : "s"}.
                        Remove anyone you don't want to assign yet, then save.
                    </p>
                </div>

            </div>

            {grouped.length === 0 && (
                <div className="assign-review__empty">
                    No candidates available to assign. Everyone is either
                    already assigned or has no matching instructor.
                </div>
            )}

            <div className="assign-review__groups">
                {grouped.map(group => (
                    <section
                        key={group.instructorEmail}
                        className="assign-review__group"
                    >
                        <div className="assign-review__group-header">
                            <div className="assign-review__group-info">
                                <span className="assign-review__group-name">
                                    {group.instructorName}
                                </span>
                                <span className="assign-review__group-meta">
                                    {group.instructorEmail}
                                </span>
                            </div>
                            <div className="assign-review__group-right">
                                <span className="assign-review__group-count">
                                    {group.candidates.length} candidate
                                    {group.candidates.length === 1 ? "" : "s"}
                                </span>
                                <button
                                    type="button"
                                    className="assign-review__group-remove"
                                    onClick={() =>
                                        handleRemoveInstructor(group.instructorEmail)
                                    }
                                    title="Remove all candidates for this instructor"
                                >
                                    Remove all
                                </button>
                            </div>
                        </div>

                        <ul className="assign-review__candidate-list">
                            {group.candidates.map(c => (
                                <li
                                    key={c.candidateEmail}
                                    className="assign-review__candidate"
                                >
                                    <div className="assign-review__candidate-info">
                                        <span className="assign-review__candidate-name">
                                            {c.candidateName}
                                        </span>
                                        <span className="assign-review__candidate-meta">
                                            {c.candidateEmail}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="assign-review__remove-btn"
                                        onClick={() =>
                                            handleRemoveCandidate(c.candidateEmail)
                                        }
                                        title="Don't assign this candidate yet"
                                        aria-label={`Remove ${c.candidateName}`}
                                    >
                                        ×
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            {grouped.length > 0 && (
                <div className="assign-review__footer">
                    <button
                        type="button"
                        className="assign-review__btn assign-review__btn--ghost"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="assign-review__btn assign-review__btn--primary"
                        onClick={handleSave}
                        disabled={saving || assignments.length === 0}
                    >
                        {saving ? "Saving…" : `Save ${totalAssigned} Assignment${totalAssigned === 1 ? "" : "s"}`}
                    </button>
                </div>
            )}
            <ConfirmModal
                isOpen={confirmOpen}
                message="Discard this proposal and go back?"
                onConfirm={() => {
                    setConfirmOpen(false);
                    navigate("/admin/assign");
                }}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}