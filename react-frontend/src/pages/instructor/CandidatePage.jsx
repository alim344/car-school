import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../style/CandidatePage.css";

const API_URL = "http://localhost:8080";

const TRAINING_STATUS_LABELS = {
  THEORY: "Theory",
  PRACTICAL: "Practical",
  PASSED: "Passed",
  PENDING: "Pending",
  EXAM_SCHEDULED: "Exam scheduled",
};

const CLASS_STATUS_LABELS = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
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

export default function CandidatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCandidate() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/practical-class/candidate/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) setCandidate(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load candidate.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) fetchCandidate();
    return () => {
      cancelled = true;
    };
  }, [id]);

  function getInitials(c) {
    if (!c) return "?";
    const f = (c.firstName || "").trim();
    const l = (c.lastName || "").trim();
    const initials =
      (f ? f[0].toUpperCase() : "") + (l ? l[0].toUpperCase() : "");
    return initials || "?";
  }

  function goToClass(cls) {
    navigate(`/instructor/candidates/${id}/class/${cls.id}`, {
      state: { classItem: cls, candidateId: id },
    });
  }

  if (loading) {
    return (
      <div className="candidate-page">
        <div className="candidate-page__loading">Loading candidate…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-page">
        <div className="candidate-page__error">
          Couldn't load candidate: {error}
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="candidate-page">
        <div className="candidate-page__empty">Candidate not found.</div>
      </div>
    );
  }

  const fullName =
    `${candidate.firstName || ""} ${candidate.lastName || ""}`.trim() ||
    "Unnamed candidate";

  const classes = Array.isArray(candidate.classes) ? candidate.classes : [];
  const statusKey = (candidate.trainingStatus || "").toLowerCase();

  return (
    <div className="candidate-page">
   
      <header className="candidate-page__header">
        <div className="candidate-page__avatar">
          <span className="candidate-page__avatar-initials">
            {getInitials(candidate)}
          </span>
        </div>

        <div className="candidate-page__identity">
          <h1 className="candidate-page__name">{fullName}</h1>
          <p className="candidate-page__email">{candidate.email || "—"}</p>

          <div className="candidate-page__quick-stats">
            <span className="candidate-page__stat">
              <span className="candidate-page__stat-label">Category</span>
              <span className="candidate-page__stat-value">
                {candidate.category || "—"}
              </span>
            </span>

            <span className="candidate-page__stat">
              <span className="candidate-page__stat-label">Status</span>
              <span
                className={`candidate-page__badge candidate-page__badge--${statusKey}`}
              >
                {TRAINING_STATUS_LABELS[candidate.trainingStatus] ||
                  candidate.trainingStatus ||
                  "—"}
              </span>
            </span>

            <span className="candidate-page__stat">
              <span className="candidate-page__stat-label">Classes</span>
              <span className="candidate-page__stat-value">
                {candidate.numberOfCompletedClasses ?? 0} /{" "}
                {candidate.totalNumberOfClasses ?? 0}
              </span>
            </span>

            <span className="candidate-page__stat">
              <span className="candidate-page__stat-label">Left</span>
              <span className="candidate-page__stat-value">
                {candidate.numberOfClassesLeft ?? 0}
              </span>
            </span>
          </div>
        </div>
      </header>

      <hr className="candidate-page__divider" />

    
      <section className="candidate-page__section">
        <header className="candidate-page__section-header">
          <h2>Practical classes</h2>
          <span className="candidate-page__section-count">
            {classes.length} {classes.length === 1 ? "class" : "classes"}
          </span>
        </header>

        {classes.length === 0 ? (
          <div className="candidate-page__empty-inline">
            No classes yet for this candidate.
          </div>
        ) : (
          <div className="candidate-page__table-wrapper">
            <table className="candidate-page__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Grade</th>
                 
                </tr>
              </thead>
              <tbody>
                {classes.map((cls, index) => {
                  const classStatusKey = (cls.classStatus || "").toLowerCase();
                  return (
                    <tr key={cls.id} className="candidate-page__row" onClick={() => goToClass(cls)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          goToClass(cls);
                        }
                      }}
                      role="button">
                      <td>{index + 1}</td>
                      <td>{formatDateTime(cls.scheduledStartTime)}</td>
                      <td>{formatDateTime(cls.scheduledEndTime)}</td>
                      <td>
                        <span
                          className={`candidate-page__badge candidate-page__badge--${classStatusKey}`}
                        >
                          {CLASS_STATUS_LABELS[cls.classStatus] ||
                            cls.classStatus ||
                            "—"}
                        </span>
                        {cls.lastClass && (
                          <span className="candidate-page__tag">last</span>
                        )}
                      </td>
                      <td>{cls.location || "—"}</td>
                      <td>{cls.grade ?? "—"}</td>
                      
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}