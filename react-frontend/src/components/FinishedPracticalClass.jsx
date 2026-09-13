import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "../style/FinishedPracticalClass.css";
import RouteNotesMap from "../components/RouteNotesMap";

const API_URL = "http://localhost:8080";

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

function formatDuration(start, end) {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const mins = Math.round((e - s) / 60000);
  if (mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h}h ${m}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export default function FinishedPracticalClass() {
  const { classId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const role = location.state?.role || "instructor";

  const passed = location.state?.classItem || null;
  const candidateId = location.state?.candidateId || null;

  const [classItem, setClassItem] = useState(passed);
  const [loading, setLoading] = useState(!passed);
  const [error, setError] = useState(null);

  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState(null);

  useEffect(() => {
    if (passed) return;
    let cancelled = false;

    async function fetchClass() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/practical-class/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) setClassItem(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load class.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchClass();
    return () => {
      cancelled = true;
    };
  }, [classId, passed]);

  function goBack() {
    if (role === "candidate") {
      navigate("/candidate/classes");
      return;
    }
    if (candidateId) {
      navigate(`/instructor/candidates/${candidateId}`);
    } else {
      navigate(-1);
    }
  }


  async function handleAccept() {
    if (!classItem) return;
    setAccepting(true);
    setAcceptError(null);
    try {
      const res = await fetch(
        `${API_URL}/schedule/cand/accept-class/${classItem.id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      setClassItem((prev) =>
        prev ? { ...prev, classStatus: "ACCEPTED" } : prev
      );
    } catch (err) {
      setAcceptError(err.message || "Could not accept the class.");
    } finally {
      setAccepting(false);
    }
  }

  function handleDecline() {
    if (!classItem) return;
    navigate("/candidate", {
      state: {
        openDecline: true,
        classToDecline: {
          id: classItem.id,
          scheduledStartTime: classItem.scheduledStartTime,
          scheduledEndTime: classItem.scheduledEndTime,
          location: classItem.location,
          candidateName: classItem.candidateName,
        },
      },
    });
  }

  if (loading) {
    return (
      <div className="finished-class">
        <div className="finished-class__loading">Loading class…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="finished-class">
        <div className="finished-class__error">
          Couldn't load class: {error}
        </div>
        <button
          type="button"
          className="finished-class__back-btn"
          onClick={goBack}
        >
          ← Back
        </button>
      </div>
    );
  }

  if (!classItem) {
    return (
      <div className="finished-class">
        <div className="finished-class__empty">Class not found.</div>
        <button
          type="button"
          className="finished-class__back-btn"
          onClick={goBack}
        >
          ← Back
        </button>
      </div>
    );
  }

  const statusKey = (classItem.classStatus || "").toLowerCase();
  const duration = formatDuration(
    classItem.scheduledStartTime,
    classItem.scheduledEndTime
  );

  return (
    <div className="finished-class">
      <button
        type="button"
        className="finished-class__back-btn"
        onClick={goBack}
      >
        ← Back
      </button>

      <header className="finished-class__header">
        <div className="finished-class__title-group">
          <h1>Class details</h1>
          
          <p className="finished-class__subtitle">
            {classItem.candidateName || "—"}
            {classItem.candidateEmail ? ` · ${classItem.candidateEmail}` : ""}
          </p>
        </div>
        

        <div className="finished-class__header-badges">
          {role === "candidate" && classItem.classStatus === "PENDING" && (
            <div className="finished-class__actions">
              <button
                type="button"
                className="finished-class__action-btn finished-class__action-btn--accept"
                onClick={handleAccept}
                disabled={accepting}
              >
                {accepting ? "Accepting…" : "✓ Accept"}
              </button>
              <button
                type="button"
                className="finished-class__action-btn finished-class__action-btn--decline"
                onClick={handleDecline}
                disabled={accepting}
              >
                ✕ Decline
              </button>
              {acceptError && (
                <span className="finished-class__action-error">⚠️ {acceptError}</span>
              )}
            </div>
          )}
          <span
            className={`finished-class__badge finished-class__badge--${statusKey}`}
          >
            {CLASS_STATUS_LABELS[classItem.classStatus] ||
              classItem.classStatus ||
              "—"}
          </span>
          {classItem.lastClass && (
            <span className="finished-class__tag">last class</span>
          )}
        </div>

        
      </header>

      <hr className="finished-class__divider" />

      <section className="finished-class__grid">
        <div className="finished-class__card">
          <span className="finished-class__label">Start</span>
          <span className="finished-class__value">
            {formatDateTime(classItem.scheduledStartTime)}
          </span>
        </div>

        <div className="finished-class__card">
          <span className="finished-class__label">End</span>
          <span className="finished-class__value">
            {formatDateTime(classItem.scheduledEndTime)}
          </span>
        </div>

        <div className="finished-class__card">
          <span className="finished-class__label">Duration</span>
          <span className="finished-class__value">{duration || "—"}</span>
        </div>

        <div className="finished-class__card">
          <span className="finished-class__label">Location</span>
          <span className="finished-class__value">
            {classItem.location || "—"}
          </span>
        </div>

        <div className="finished-class__card">
          <span className="finished-class__label">Grade</span>
          <span className="finished-class__value">
            {classItem.grade ?? "—"}
          </span>
        </div>

        <div className="finished-class__card">
          <span className="finished-class__label">Route</span>
          <span className="finished-class__value">
            {classItem.routeId != null ? `#${classItem.routeId}` : "—"}
          </span>
        </div>
      </section>

      <section className="finished-class__blocks">
        <div className="finished-class__block">
          <h2 className="finished-class__block-title">Comment</h2>
          <p className="finished-class__block-body">
            {classItem.comment || "No comment added."}
          </p>
        </div>

        <div className="finished-class__block">
          <h2 className="finished-class__block-title">Remarks</h2>
          <p className="finished-class__block-body">
            {classItem.remarks || "No remarks added."}
          </p>
        </div>
      </section>
      <RouteNotesMap classId={classId} />

    </div>
  );
}