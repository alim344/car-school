import { useEffect, useMemo, useState } from "react";
import "../../style/InstructorChangeRequests.css";
import { useNavigate } from "react-router-dom";

const STATUS_FILTERS = [
    { value: "ALL", label: "All" },
    { value: "PENDING", label: "Pending" },
    { value: "ACCEPTED", label: "Accepted" },
    { value: "DECLINED", label: "Declined" },
];

const STATUS_LABELS = {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    DECLINED: "Declined",
};

export default function InstructorChangeRequests() {
    const token = localStorage.getItem("userToken");

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actingOn, setActingOn] = useState(null); 

    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(
                    "http://localhost:8080/candidate/change-getALl",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                if (!res.ok) {
                    const msg = await res.text().catch(() => "");
                    throw new Error(msg || `HTTP ${res.status}`);
                }
                const data = await res.json();
                if (!cancelled) {
                    data.sort((a, b) =>
                        (b.requestDate || "").localeCompare(a.requestDate || "")
                    );
                    setRequests(data);
                }
            } catch (err) {
                if (!cancelled) setError(err.message || "Failed to load requests.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, [token]);

    const counts = useMemo(() => {
        const c = { ALL: requests.length, PENDING: 0, ACCEPTED: 0, DECLINED: 0 };
        requests.forEach(r => {
            if (c[r.status] != null) c[r.status] += 1;
        });
        return c;
    }, [requests]);

    const filtered = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return requests.filter(r => {
            if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
            if (
                term &&
                !(r.candidateName || "").toLowerCase().includes(term) &&
                !(r.candidateEmail || "").toLowerCase().includes(term) &&
                !(r.instructorName || "").toLowerCase().includes(term) &&
                !(r.instructorEmail || "").toLowerCase().includes(term) &&
                !(r.reason || "").toLowerCase().includes(term)
            ) {
                return false;
            }
            return true;
        });
    }, [requests, statusFilter, searchTerm]);

    const setStatusLocally = (id, newStatus) => {
        setRequests(prev =>
            prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
        );
    };

    const handleAccept = async (request) => {
        if (request.status !== "PENDING") return;
        if (!window.confirm(`Accept change request from ${request.candidateName}?`)) return;

        setActingOn(request.id);
        try {
            const res = await fetch(
                `http://localhost:8080/candidate/change-accept/${request.id}`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(msg || `HTTP ${res.status}`);
            }
            setStatusLocally(request.id, "ACCEPTED");
        } catch (err) {
            console.error("Accept failed:", err);
            alert("Could not accept: " + (err.message || "unknown error"));
        } finally {
            setActingOn(null);
        }
    };

    const handleDecline = async (request) => {
        if (request.status !== "PENDING") return;
        if (!window.confirm(`Decline change request from ${request.candidateName}?`)) return;

        setActingOn(request.id);
        try {
            const res = await fetch(
                `http://localhost:8080/candidate/change-decline/${request.id}`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            if (!res.ok) {
                const msg = await res.text().catch(() => "");
                throw new Error(msg || `HTTP ${res.status}`);
            }
            setStatusLocally(request.id, "DECLINED");
        } catch (err) {
            console.error("Decline failed:", err);
            alert("Could not decline: " + (err.message || "unknown error"));
        } finally {
            setActingOn(null);
        }
    };

    if (loading) {
        return <div className="chg-req"><p>Loading requests…</p></div>;
    }

    if (error) {
        return (
            <div className="chg-req">
                <div className="chg-req__error">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="chg-req">

             <button
                type="button"
                className="chg-req__back-btn"
                onClick={() => navigate("/admin/assign")}
            >
                ← Back to assignment
            </button>
            <div className="chg-req__header">
                <div className="chg-req__header-text">
                    <h1>Instructor Change Requests</h1>
                    <p className="chg-req__subtitle">
                        {filtered.length} of {requests.length} request
                        {requests.length === 1 ? "" : "s"}
                    </p>
                </div>
            </div>

            <div className="chg-req__toolbar">
                <div className="chg-req__tabs">
                    {STATUS_FILTERS.map(f => (
                        <button
                            key={f.value}
                            type="button"
                            className={`chg-req__tab ${
                                statusFilter === f.value ? "chg-req__tab--active" : ""
                            }`}
                            onClick={() => setStatusFilter(f.value)}
                        >
                            {f.label}
                            <span className="chg-req__tab-count">
                                {counts[f.value] ?? 0}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="chg-req__search">
                    <input
                        type="text"
                        placeholder="Search by name, email or reason…"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {requests.length === 0 && (
                <div className="chg-req__empty">
                    No change requests have been submitted yet.
                </div>
            )}

            {requests.length > 0 && filtered.length === 0 && (
                <div className="chg-req__empty">
                    No requests match your filters.
                </div>
            )}

            {filtered.length > 0 && (
                <div className="chg-req__list">
                    {filtered.map(r => {
                        const busy = actingOn === r.id;
                        return (
                            <article
                                key={r.id}
                                className={`chg-req__card chg-req__card--${r.status.toLowerCase()}`}
                            >
                                <div className="chg-req__card-top">
                                    <span
                                        className={`chg-req__badge chg-req__badge--${r.status.toLowerCase()}`}
                                    >
                                        {STATUS_LABELS[r.status] || r.status}
                                    </span>
                                    <span className="chg-req__date">
                                        {r.requestDate
                                            ? new Date(r.requestDate).toLocaleDateString()
                                            : "—"}
                                    </span>
                                </div>

                                <div className="chg-req__parties">
                                    <div className="chg-req__party">
                                        <span className="chg-req__party-role">
                                            Candidate
                                        </span>
                                        <span className="chg-req__party-name">
                                            {r.candidateName}
                                        </span>
                                        <span className="chg-req__party-meta">
                                            {r.candidateEmail}
                                        </span>
                                    </div>

                                    <div className="chg-req__arrow">→</div>

                                    <div className="chg-req__party">
                                        <span className="chg-req__party-role">
                                            Complains about
                                        </span>
                                        <span className="chg-req__party-name">
                                            {r.instructorName}
                                        </span>
                                        <span className="chg-req__party-meta">
                                            {r.instructorEmail}
                                        </span>
                                    </div>
                                </div>

                                {r.reason && (
                                    <div className="chg-req__reason">
                                        <span className="chg-req__reason-label">
                                            Reason
                                        </span>
                                        <p>{r.reason}</p>
                                    </div>
                                )}

                                {r.status === "PENDING" && (
                                    <div className="chg-req__actions">
                                        <button
                                            type="button"
                                            className="chg-req__btn chg-req__btn--decline"
                                            onClick={() => handleDecline(r)}
                                            disabled={busy}
                                        >
                                            {busy ? "…" : "Decline"}
                                        </button>
                                        <button
                                            type="button"
                                            className="chg-req__btn chg-req__btn--accept"
                                            onClick={() => handleAccept(r)}
                                            disabled={busy}
                                        >
                                            {busy ? "…" : "Accept"}
                                        </button>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
}