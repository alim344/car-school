import { useEffect, useMemo, useState } from "react";
import "../../style/AllInstructors.css";

const TRAINING_STATUS_LABELS = {
    PRACTICAL: "Practical",
    PENDING: "Pending",
    EXAM_SCHEDULED: "Exam scheduled",
    PASSED: "Passed",
};

export default function AllInstructors() {
    const token = localStorage.getItem("userToken");

    const [groups, setGroups] = useState([]);   
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [freeing, setFreeing] = useState(null);  

    const [deactivating, setDeactivating] = useState(null); 
    const [activating, setActivating] = useState(null); 


    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("http://localhost:8080/admin/inst-cand", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) {
                    const msg = await res.text().catch(() => "");
                    throw new Error(msg || `HTTP ${res.status}`);
                }
                const data = await res.json();
                if (!cancelled) setGroups(data);
            } catch (err) {
                if (!cancelled) setError(err.message || "Failed to load instructors.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [token]);

    const filteredGroups = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return groups;
        return groups.filter(g =>
            (g.instructorName || "").toLowerCase().includes(term) ||
            (g.instructorEmail || "").toLowerCase().includes(term)
        );
    }, [groups, searchTerm]);

    const totalCandidates = useMemo(
        () => groups.reduce((sum, g) => sum + (g.candidates?.length || 0), 0),
        [groups]
    );

    const handleFreeCandidates = async (group) => {
        const emails = (group.candidates || []).map(c => c.email);
        if (emails.length === 0) return;

        if (!window.confirm(
            `Free all ${emails.length} candidate${emails.length === 1 ? "" : "s"} assigned to ${group.instructorName}?`
        )) return;

        setFreeing(group.instructorEmail);
        try {
            const res = await fetch(
                "http://localhost:8080/candidate/freeCandidates",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(emails),
                }
            );
            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(msg || `HTTP ${res.status}`);
            }

      
            setGroups(prev =>
                prev.map(g =>
                    g.instructorEmail === group.instructorEmail
                        ? { ...g, candidates: [] }
                        : g
                )
            );
        } catch (err) {
            console.error("Free candidates failed:", err);
            alert("Could not free candidates: " + (err.message || "unknown error"));
        } finally {
            setFreeing(null);
        }
    };


    const handleActivate = async (group) => {
            if (!window.confirm(
                `Reactivate ${group.instructorName}?\n\nThey will be able to log in and receive candidates again.`
            )) return;

            setActivating(group.instructorEmail);
            try {
                const res = await fetch(
                    `http://localhost:8080/admin/activate/${encodeURIComponent(group.instructorEmail)}`,
                    {
                        method: "PATCH",
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                if (!res.ok) {
                    const msg = await res.text().catch(() => "");
                    throw new Error(msg || `HTTP ${res.status}`);
                }

                setGroups(prev =>
                    prev.map(g =>
                        g.instructorEmail === group.instructorEmail
                            ? { ...g, active: true }
                            : g
                    )
                );
            } catch (err) {
                console.error("Activate failed:", err);
                alert("Could not activate: " + (err.message || "unknown error"));
            } finally {
                setActivating(null);
            }
        };


    const handleDeactivate = async (group) => {
        if (!window.confirm(
            `Deactivate ${group.instructorName}?\n\nThey will no longer be able to log in or receive candidates.`
        )) return;

        setDeactivating(group.instructorEmail);
        try {
            const res = await fetch(
                `http://localhost:8080/admin/inactivate/${encodeURIComponent(group.instructorEmail)}`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(msg || `HTTP ${res.status}`);
            }

            setExpandedEmail(prev =>
                prev === group.instructorEmail ? null : prev
            );
        } catch (err) {
            console.error("Deactivate failed:", err);
            alert("Could not deactivate: " + (err.message || "unknown error"));
        } finally {
            setDeactivating(null);
        }
    };

    const handleViewCandidates = (group) => {
        setExpandedEmail(prev =>
            prev === group.instructorEmail ? null : group.instructorEmail
        );
    };

    const [expandedEmail, setExpandedEmail] = useState(null);

    if (loading) {
        return <div className="all-instructors"><p>Loading instructors…</p></div>;
    }

    if (error) {
        return (
            <div className="all-instructors">
                <div className="all-instructors__error">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="all-instructors">
            <div className="all-instructors__header">
                <div>
                    <h1>Instructors</h1>
                    <p className="all-instructors__subtitle">
                        {filteredGroups.length} of {groups.length} instructor
                        {groups.length === 1 ? "" : "s"} · {totalCandidates} candidate
                        {totalCandidates === 1 ? "" : "s"} assigned
                    </p>
                </div>
            </div>

            <div className="all-instructors__toolbar">
                <div className="all-instructors__search">
                    <input
                        type="text"
                        placeholder="Search by instructor name or email…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {groups.length === 0 && (
                <div className="all-instructors__empty">
                    No instructors found.
                </div>
            )}

            {groups.length > 0 && filteredGroups.length === 0 && (
                <div className="all-instructors__empty">
                    No instructors match your search.
                </div>
            )}

            <div className="all-instructors__list">
                {filteredGroups.map(group => {
                    const candidates = group.candidates || [];
                    const expanded = expandedEmail === group.instructorEmail;
                    const busy = freeing === group.instructorEmail;

                    return (
                        <section
                            key={group.instructorEmail}
                            className={`all-instructors__group ${!group.active ? "all-instructors__group--inactive" : ""}`}
                        >
                            <header className="all-instructors__group-header">
                                <div className="all-instructors__group-info">
                                    <span className="all-instructors__group-name">
                                        {group.instructorName}
                                         {!group.active && (
                                                <span className="all-instructors__inactive-tag">
                                                    INACTIVE
                                                </span>
                                            )}
                                    </span>
                                    <span className="all-instructors__group-email">
                                        {group.instructorEmail}
                                    </span>
                                </div>

                                <div className="all-instructors__group-actions">
                                    <span
                                        className={`all-instructors__count ${
                                            candidates.length === 0
                                                ? "all-instructors__count--empty"
                                                : ""
                                        }`}
                                    >
                                        {candidates.length} candidate
                                        {candidates.length === 1 ? "" : "s"}
                                    </span>

                                    {candidates.length > 0 && (
                                        <button
                                            type="button"
                                            className="all-instructors__view-btn"
                                            onClick={() => handleViewCandidates(group)}
                                        >
                                            {expanded ? "Hide" : "View candidates"}
                                        </button>
                                    )}

                                    {candidates.length > 0 && (
                                        <button
                                            type="button"
                                            className="all-instructors__free-btn"
                                            onClick={() => handleFreeCandidates(group)}
                                            disabled={busy}
                                        >
                                            {busy ? "Freeing…" : "Free candidates"}
                                        </button>
                                    )}
                                     {group.active ? (
                                            <button
                                                type="button"
                                                className="all-instructors__deactivate-btn"
                                                onClick={() => handleDeactivate(group)}
                                                disabled={deactivating === group.instructorEmail}
                                                title="Deactivate this instructor"
                                            >
                                                {deactivating === group.instructorEmail
                                                    ? "…"
                                                    : "Deactivate"}
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="all-instructors__activate-btn"
                                                onClick={() => handleActivate(group)}
                                                disabled={activating === group.instructorEmail}
                                                title="Reactivate this instructor"
                                            >
                                                {activating === group.instructorEmail ? "…" : "Reactivate"}
                                            </button>
                                        )}
                                </div>
                            </header>

                            {expanded && candidates.length > 0 && (
                                <ul className="all-instructors__candidate-list">
                                    {candidates.map(c => (
                                        <li
                                            key={c.email}
                                            className="all-instructors__candidate"
                                        >
                                            <div className="all-instructors__candidate-info">
                                                <span className="all-instructors__candidate-name">
                                                    {c.firstName} {c.lastName}
                                                </span>
                                                <span className="all-instructors__candidate-email">
                                                    {c.email}
                                                </span>
                                            </div>

                                            <div className="all-instructors__candidate-meta">
                                                <span className="all-instructors__candidate-chip">
                                                    {c.category || "—"}
                                                </span>
                                                <span
                                                    className={`all-instructors__status all-instructors__status--${(
                                                        c.trainingStatus || ""
                                                    ).toLowerCase()}`}
                                                >
                                                    {TRAINING_STATUS_LABELS[c.trainingStatus] ||
                                                        c.trainingStatus ||
                                                        "—"}
                                                </span>
                                                <span className="all-instructors__candidate-left">
                                                    {c.numberOfClassesLeft ?? 0} left
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {expanded && candidates.length === 0 && (
                                <p className="all-instructors__no-candidates">
                                    No candidates assigned to this instructor.
                                </p>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}