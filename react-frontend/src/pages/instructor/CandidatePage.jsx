import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../style/CandidatePage.css";
import GradeLineChart from "../../components/GradeLineChart";


const TRAINING_STATUS_LABELS = {
  THEORY: "Theory",
  PRACTICAL: "Practical",
  PASSED: "Passed",
  PENDING: "Pending",
  EXAM_SCHEDULED: "Exam scheduled",
};

const CLASS_STATUS_LABELS = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  STARTED: "In progress",
  ENDED: "Ended",
  BAD_END: "Interrupted",
  CANCELLED: "Cancelled",
};

const EXAM_STATUS_LABELS = {
  SCHEDULED: "Scheduled",
  PASSED: "Passed",
  FAILED: "Failed",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
  FINISHED: "Finished",
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

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAvgGrade(value) {
  if (value == null) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return n.toFixed(2);
}


function getNextClass(classes) {
  const now = new Date();

  const DEAD_STATUSES = new Set(["CANCELLED", "REJECTED", "ENDED", "BAD_END"]);

  const future = classes.filter((c) => {
    if (!c.scheduledStartTime) return false;
    const start = new Date(c.scheduledStartTime);
    if (Number.isNaN(start.getTime())) return false;
    if (start <= now) return false;
    return !DEAD_STATUSES.has(c.classStatus);
  });

  if (future.length === 0) return null;

  const accepted = future.filter((c) => c.classStatus === "ACCEPTED" || c.classStatus === "STARTED");
  const pending = future.filter((c) => c.classStatus === "PENDING");
  const pool = accepted.length > 0 ? accepted : pending;

  if (pool.length === 0) return null;

  return pool.sort(
    (a, b) => new Date(a.scheduledStartTime) - new Date(b.scheduledStartTime)
  )[0];
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
        const res = await fetch(`http://localhost:8080/practical-class/candidate/${id}`, {
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
  const gradeList = Array.isArray(candidate.gradeList)? candidate.gradeList : [];
  const statusKey = (candidate.trainingStatus || "").toLowerCase();
  const examList = Array.isArray(candidate.examList) ? candidate.examList  : [];

  const cancelledCount = classes.filter( (c) => c.classStatus === "CANCELLED").length;

  const isPractical = candidate.trainingStatus === "PRACTICAL";
  const nextClass = isPractical ? getNextClass(classes) : null;

 
  return (
    <div className="candidate-page">
      <button
        type="button"
        className="candidate-page__back-btn"
        onClick={() => navigate("/instructor/candidates")}
      >
        ← Back to candidates
      </button>
   
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

             <span className="candidate-page__stat">
              <span className="candidate-page__stat-label">Avg grade</span>
              <span className="candidate-page__stat-value candidate-page__stat-value--grade">
                {formatAvgGrade(candidate.avgGrade)}
              </span>
            </span>

            <span className="candidate-page__stat">
              <span className="candidate-page__stat-label">Cancellations</span>
              <span
                className={`candidate-page__stat-value ${
                  cancelledCount > 0 ? "candidate-page__stat-value--warn" : ""
                }`}
              >
                {cancelledCount}
              </span>
            </span>

          </div>
        </div>
      </header>


      {isPractical && (
        <div
          className={`candidate-page__next-class ${
            !nextClass ? "candidate-page__next-class--empty" : ""
          }`}
        >
          <span className="candidate-page__next-class-label">
            {nextClass ? "Next class" : "No upcoming classes"}
          </span>

          {nextClass ? (
            <>
              <span className="candidate-page__next-class-time">
                {formatDateTime(nextClass.scheduledStartTime)}
              </span>
              {nextClass.location && (
                <span className="candidate-page__next-class-location">
                  📍 {nextClass.location}
                </span>
              )}
              <span
                className={`candidate-page__badge candidate-page__badge--${(
                  nextClass.classStatus || ""
                ).toLowerCase()}`}
              >
                {CLASS_STATUS_LABELS[nextClass.classStatus] ||
                  nextClass.classStatus ||
                  "—"}
              </span>
            </>
          ) : (
            <span className="candidate-page__next-class-hint">
              Nothing is scheduled for this candidate right now.
            </span>
          )}
        </div>
      )}

      {examList.length > 0 && (
        <section className="candidate-page__exams">
          <header className="candidate-page__exams-header">
            <h2>Exams</h2>
            <span className="candidate-page__section-count">
              {examList.length}{" "}
              {examList.length === 1 ? "exam" : "exams"}
            </span>
          </header>

          <div className="candidate-page__exams-list">
            {examList.map((exam) => {
              const examStatusKey = (exam.status || "").toLowerCase();
              return (
                <div
                  key={exam.id}
                  className={`candidate-page__exam-card candidate-page__exam-card--${examStatusKey}`}
                >
                  <div className="candidate-page__exam-main">
                    <span className="candidate-page__exam-date">
                      {formatDate(exam.dateTime)}
                    </span>
                    <span
                      className={`candidate-page__badge candidate-page__badge--${examStatusKey}`}
                    >
                      {EXAM_STATUS_LABELS[exam.status] || exam.status || "—"}
                    </span>
                  </div>

                  <div className="candidate-page__exam-meta">
                    {exam.score != null && (
                      <span className="candidate-page__exam-score">
                        Score: <strong>{exam.score}</strong>
                      </span>
                    )}
                    {exam.admin_name && (
                      <span className="candidate-page__exam-admin">
                        Examiner: {exam.admin_name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}


       <hr className="candidate-page__divider" />

      <section className="candidate-page__chart-section">
        <header className="candidate-page__section-header">
          <h2>Grade progression</h2>
          <span className="candidate-page__section-count">
            {gradeList.length}{" "}
            {gradeList.length === 1 ? "graded class" : "graded classes"}
          </span>
        </header>
        <GradeLineChart grades={gradeList} />
      </section>

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