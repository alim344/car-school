import { useEffect, useMemo, useState } from "react";
import "../../style/AllInstructors.css";
import ConfirmModal from "../../components/ConfirmModal";


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

    const [selectingFor, setSelectingFor] = useState(null);       
    const [selectedEmails, setSelectedEmails] = useState([]);      

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);

    const askConfirm = (message, action) => {
        setConfirmMessage(message);
        setConfirmAction(() => action);
        setConfirmOpen(true);
    };

    const handleConfirmYes = () => {
        setConfirmOpen(false);
        confirmAction?.();
    };


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

        const startSelecting = (group) => {
            setSelectingFor(group.instructorEmail);
            setSelectedEmails([]);
        };

        const cancelSelecting = () => {
            setSelectingFor(null);
            setSelectedEmails([]);
        };

        const toggleCandidateSelection = (email) => {
            setSelectedEmails(prev =>
                prev.includes(email)
                    ? prev.filter(e => e !== email)
                    : [...prev, email]
            );
        };

        const toggleSelectAll = (group) => {
            const emails = (group.candidates || []).map(c => c.email);
            setSelectedEmails(prev =>
                prev.length === emails.length ? [] : emails
            );
        };

        const handleFreeSelected = (group) => {
            if (selectedEmails.length === 0) return;

            askConfirm(
                `Free ${selectedEmails.length} candidate${selectedEmails.length === 1 ? "" : "s"} from ${group.instructorName}?`,
                async () => {
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
                                body: JSON.stringify(selectedEmails),
                            }
                        );
                        if (!res.ok) {
                            const msg = await res.text().catch(() => "");
                            throw new Error(msg || `HTTP ${res.status}`);
                        }

                        setGroups(prev =>
                            prev.map(g =>
                                g.instructorEmail === group.instructorEmail
                                    ? {
                                        ...g,
                                        candidates: (g.candidates || []).filter(
                                            c => !selectedEmails.includes(c.email)
                                        ),
                                    }
                                    : g
                            )
                        );

                        setSelectingFor(null);
                        setSelectedEmails([]);
                    } catch (err) {
                        console.error("Free candidates failed:", err);
                        alert("Could not free candidates: " + (err.message || "unknown error"));
                    } finally {
                        setFreeing(null);
                    }
                }
            );
        };

        const handleActivate = (group) => {
            askConfirm(
                `Reactivate ${group.instructorName}?\n\nThey will be able to log in and receive candidates again.`,
                async () => {
                    setActivating(group.instructorEmail);
                    try {
                        const res = await fetch(
                            `http://localhost:8080/admin/activate/${encodeURIComponent(group.instructorEmail)}`,
                            { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
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
                }
            );
        };

        const handleDeactivate = (group) => {
            askConfirm(
                `Deactivate ${group.instructorName}?\n\nThey will no longer be able to log in or receive candidates.`,
                async () => {
                    setDeactivating(group.instructorEmail);
                    try {
                        const res = await fetch(
                            `http://localhost:8080/admin/inactivate/${encodeURIComponent(group.instructorEmail)}`,
                            { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
                        );
                        if (!res.ok) {
                            const msg = await res.text().catch(() => "");
                            throw new Error(msg || `HTTP ${res.status}`);
                        }

                        setGroups(prev =>
                            prev.map(g =>
                                g.instructorEmail === group.instructorEmail
                                    ? { ...g, active: false, candidates: [] }
                                    : g
                            )
                        );

                        setExpandedEmail(prev =>
                            prev === group.instructorEmail ? null : prev
                        );

                        if (selectingFor === group.instructorEmail) {
                            setSelectingFor(null);
                            setSelectedEmails([]);
                        }
                    } catch (err) {
                        console.error("Deactivate failed:", err);
                        alert("Could not deactivate: " + (err.message || "unknown error"));
                    } finally {
                        setDeactivating(null);
                    }
                }
            );
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
                    const isSelecting = selectingFor === group.instructorEmail;

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
                                    {!isSelecting && (
                                        <>
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
                                                    onClick={() => startSelecting(group)}
                                                >
                                                    Free candidates
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
                                                    {deactivating === group.instructorEmail ? "…" : "Deactivate"}
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
                                        </>
                                    )}

                                    {isSelecting && (
                                        <>
                                            <span className="all-instructors__select-count">
                                                {selectedEmails.length} of {candidates.length} selected
                                            </span>

                                            <button
                                                type="button"
                                                className="all-instructors__select-all-btn"
                                                onClick={() => toggleSelectAll(group)}
                                            >
                                                {selectedEmails.length === candidates.length
                                                    ? "Clear all"
                                                    : "Select all"}
                                            </button>

                                            <button
                                                type="button"
                                                className="all-instructors__free-btn"
                                                onClick={() => handleFreeSelected(group)}
                                                disabled={
                                                    selectedEmails.length === 0 || busy
                                                }
                                            >
                                                {busy
                                                    ? "Freeing…"
                                                    : `Free selected (${selectedEmails.length})`}
                                            </button>

                                            <button
                                                type="button"
                                                className="all-instructors__cancel-btn"
                                                onClick={cancelSelecting}
                                                disabled={busy}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </header>

                           {(expanded || isSelecting) && candidates.length > 0 && (
                                <ul className="all-instructors__candidate-list">
                                    {candidates.map(c => {
                                        const checked = selectedEmails.includes(c.email);
                                        return (
                                            <li
                                                key={c.email}
                                                className={`all-instructors__candidate ${
                                                    isSelecting ? "all-instructors__candidate--selectable" : ""
                                                } ${checked ? "all-instructors__candidate--checked" : ""}`}
                                                onClick={
                                                    isSelecting
                                                        ? () => toggleCandidateSelection(c.email)
                                                        : undefined
                                                }
                                                role={isSelecting ? "button" : undefined}
                                                tabIndex={isSelecting ? 0 : undefined}
                                                onKeyDown={
                                                    isSelecting
                                                        ? (e) => {
                                                            if (e.key === "Enter" || e.key === " ") {
                                                                e.preventDefault();
                                                                toggleCandidateSelection(c.email);
                                                            }
                                                        }
                                                        : undefined
                                                }
                                            >
                                                {isSelecting && (
                                                    <input
                                                        type="checkbox"
                                                        className="all-instructors__candidate-checkbox"
                                                        checked={checked}
                                                        onChange={() => toggleCandidateSelection(c.email)}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                )}

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
                                        );
                                    })}
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
            <ConfirmModal
                isOpen={confirmOpen}
                message={confirmMessage}
                onConfirm={handleConfirmYes}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}