import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/CandidateClasses.css";



const CLASS_STATUS_LABELS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  STARTED: "In progress",
  ENDED: "Ended",
  BAD_END: "Interrupted",
  CANCELLED: "Cancelled",
};

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CandidateClasses() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    let cancelled = false;

    async function fetchClasses() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8080/practical-class/report`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) setClasses(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load classes.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchClasses();
    return () => {
      cancelled = true;
    };
  }, [token]);

  function goToClass(cls) {
    navigate(`/candidate/classes/${cls.id}`, {
      state: { classItem: cls },
    });
  }


  const counts = {
    ALL: classes.length,
    PENDING: 0,
    ACCEPTED: 0,
    STARTED: 0,
    ENDED: 0,
    CANCELLED: 0,
    BAD_END: 0,
    REJECTED: 0,
  };
  classes.forEach((c) => {
    if (counts[c.classStatus] != null) counts[c.classStatus] += 1;
  });

  const STATUS_FILTERS = [
    { key: "ALL", label: "All" },
    { key: "ACCEPTED", label: "Accepted" },
    { key: "PENDING", label: "Pending" },
    { key: "STARTED", label: "In progress" },
    { key: "ENDED", label: "Ended" },
    { key: "CANCELLED", label: "Cancelled" },
    { key: "BAD_END", label: "Interrupted" },
    { key: "REJECTED", label: "Rejected" },
  ];

  const filtered =
    statusFilter === "ALL"
      ? classes
      : classes.filter((c) => c.classStatus === statusFilter);

  if (loading) {
    return (
      <div className="candidate-classes">
        <div className="candidate-classes__state">Loading classes…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-classes">
        <div className="candidate-classes__state candidate-classes__state--error">
          Couldn't load classes: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-classes">
      <header className="candidate-classes__header">
        <div>
          <h1>My classes</h1>
          <p className="candidate-classes__subtitle">
            {filtered.length} of {classes.length} class
            {classes.length === 1 ? "" : "es"}
          </p>
        </div>
      </header>

      {classes.length > 0 && (
        <div className="candidate-classes__filters">
          {STATUS_FILTERS.map((f) => {
            const count = counts[f.key] ?? 0;
            if (f.key !== "ALL" && count === 0) return null;
            return (
              <button
                key={f.key}
                type="button"
                className={`candidate-classes__pill ${
                  statusFilter === f.key ? "candidate-classes__pill--active" : ""
                }`}
                onClick={() => setStatusFilter(f.key)}
              >
                {f.label}
                <span className="candidate-classes__pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {classes.length === 0 ? (
        <div className="candidate-classes__empty">
          <span className="candidate-classes__empty-icon">🚗</span>
          <p>You have no practical classes yet.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="candidate-classes__empty">
          <span className="candidate-classes__empty-icon">🔍</span>
          <p>No classes match this filter.</p>
        </div>
      ) : (
        <div className="candidate-classes__table-wrapper">
          <table className="candidate-classes__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Location</th>
                <th>Grade</th>
                <th aria-label="Open"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cls, index) => {
                const key = (cls.classStatus || "").toLowerCase();
                return (
                  <tr
                    key={cls.id}
                    className="candidate-classes__row"
                    onClick={() => goToClass(cls)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goToClass(cls);
                      }
                    }}
                    role="button"
                  >
                    <td>{index + 1}</td>
                    <td>{formatDateTime(cls.scheduledStartTime)}</td>
                    <td>{formatDateTime(cls.scheduledEndTime)}</td>
                    <td>
                      <span
                        className={`candidate-classes__badge candidate-classes__badge--${key}`}
                      >
                        {CLASS_STATUS_LABELS[cls.classStatus] ||
                          cls.classStatus ||
                          "—"}
                      </span>
                      {cls.lastClass && (
                        <span className="candidate-classes__tag">last</span>
                      )}
                    </td>
                    <td>{cls.location || "—"}</td>
                    <td>{cls.grade ?? "—"}</td>
                    <td className="candidate-classes__cell-chevron">
                      <span className="candidate-classes__chevron">›</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}