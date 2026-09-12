import { useEffect, useMemo, useState } from "react";
import "../../style/CandidateNotifications.css";


const TYPE_LABELS = {
  CLASS_FINISHED: "Class finished",
  CLASS_SCHEDULED: "Class scheduled",
  CLASS_CANCELLED: "Class cancelled",
  CLASS_REQUEST_ACCEPTED: "Request accepted",
  CLASS_REQUEST_DENIED: "Request denied",
  LAST_CLASS_REMINDER: "Last class reminder",
  INSTRUCTOR_ON_LEAVE: "Instructor on leave",
  EXAM_SCHEDULED: "Exam scheduled",
  EXAM_CANCELLED: "Exam cancelled",
  EXAM_PASS: "Exam passed",
  EXAM_FAIL: "Exam failed",
};

const TYPE_ICONS = {
  CLASS_FINISHED: "🏁",
  CLASS_SCHEDULED: "📅",
  CLASS_CANCELLED: "❌",
  CLASS_REQUEST_ACCEPTED: "✅",
  CLASS_REQUEST_DENIED: "🚫",
  LAST_CLASS_REMINDER: "⏰",
  INSTRUCTOR_ON_LEAVE: "🌴",
  EXAM_SCHEDULED: "📝",
  EXAM_CANCELLED: "🚫",
  EXAM_PASS: "🎉",
  EXAM_FAIL: "💔",
};

const TYPE_CATEGORY = {
  CLASS_FINISHED: "class",
  CLASS_SCHEDULED: "class",
  CLASS_CANCELLED: "class",
  CLASS_REQUEST_ACCEPTED: "class",
  CLASS_REQUEST_DENIED: "class",
  LAST_CLASS_REMINDER: "class",
  INSTRUCTOR_ON_LEAVE: "class",
  EXAM_SCHEDULED: "exam",
  EXAM_CANCELLED: "exam",
  EXAM_PASS: "exam",
  EXAM_FAIL: "exam",
};

const CATEGORY_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "class", label: "Classes" },
  { value: "exam", label: "Exams" },
];

export default function CandidateNotifications() {
  const token = localStorage.getItem("userToken");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchNotifications() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8080/notif/getAll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          const sorted = [...data].sort((a, b) => b.id - a.id);
          setNotifications(sorted);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load notifications.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchNotifications();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredNotifications = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return notifications.filter((n) => {
      if (categoryFilter !== "ALL" && TYPE_CATEGORY[n.type] !== categoryFilter) {
        return false;
      }
      if (
        term &&
        !(n.title || "").toLowerCase().includes(term) &&
        !(n.body || "").toLowerCase().includes(term)
      ) {
        return false;
      }
      return true;
    });
  }, [notifications, categoryFilter, searchTerm]);

  const counts = useMemo(() => {
    const c = { ALL: notifications.length, class: 0, exam: 0 };
    notifications.forEach((n) => {
      const cat = TYPE_CATEGORY[n.type];
      if (cat) c[cat] = (c[cat] || 0) + 1;
    });
    return c;
  }, [notifications]);

  return (
    <div className="candidate-notifications">
      <div className="candidate-notifications__header">
        <div>
          <h1>Notifications</h1>
          <p className="candidate-notifications__subtitle">
            {loading
              ? "Loading notifications…"
              : `${filteredNotifications.length} of ${notifications.length} notification${
                  notifications.length === 1 ? "" : "s"
                }`}
          </p>
        </div>
      </div>

      {!loading && !error && notifications.length > 0 && (
        <div className="candidate-notifications__toolbar">
          <div className="candidate-notifications__tabs">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`candidate-notifications__tab ${
                  categoryFilter === cat.value
                    ? "candidate-notifications__tab--active"
                    : ""
                }`}
                onClick={() => setCategoryFilter(cat.value)}
              >
                {cat.label}
                <span className="candidate-notifications__tab-count">
                  {counts[cat.value] ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div className="candidate-notifications__search">
            <input
              type="text"
              placeholder="Search notifications…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="candidate-notifications__error">
          Couldn't load notifications: {error}
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="candidate-notifications__empty">
          <span className="candidate-notifications__empty-icon">🔔</span>
          <p>You have no notifications yet.</p>
        </div>
      )}

      {!loading &&
        !error &&
        notifications.length > 0 &&
        filteredNotifications.length === 0 && (
          <div className="candidate-notifications__empty">
            <span className="candidate-notifications__empty-icon">🔍</span>
            <p>No notifications match your filters.</p>
          </div>
        )}

      {!loading && filteredNotifications.length > 0 && (
        <div className="candidate-notifications__list">
          {filteredNotifications.map((notif) => {
            const category = TYPE_CATEGORY[notif.type] || "class";
            return (
              <button
                key={notif.id}
                type="button"
                className={`candidate-notifications__card candidate-notifications__card--${category}`}
                onClick={() => setSelected(notif)}
              >
                <div
                  className={`candidate-notifications__icon candidate-notifications__icon--${category}`}
                >
                  {TYPE_ICONS[notif.type] || "🔔"}
                </div>

                <div className="candidate-notifications__content">
                  <div className="candidate-notifications__card-header">
                    <h3>{notif.title || TYPE_LABELS[notif.type] || notif.type}</h3>
                    <span
                      className={`candidate-notifications__badge candidate-notifications__badge--${category}`}
                    >
                      {TYPE_LABELS[notif.type] || notif.type}
                    </span>
                  </div>
                  <p className="candidate-notifications__body">{notif.body}</p>
                </div>

                <span className="candidate-notifications__chevron">›</span>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <NotificationModal
          notification={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function NotificationModal({ notification, onClose }) {
  const category = TYPE_CATEGORY[notification.type] || "class";
  const icon = TYPE_ICONS[notification.type] || "🔔";

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="candidate-notifications__modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        className="candidate-notifications__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-modal-title"
      >
        <div className="candidate-notifications__modal-header">
          <div className="candidate-notifications__modal-title-group">
            <div
              className={`candidate-notifications__icon candidate-notifications__icon--${category}`}
            >
              {icon}
            </div>
            <h2 id="notification-modal-title">
              {notification.title || TYPE_LABELS[notification.type] || notification.type}
            </h2>
          </div>
          <button
            type="button"
            className="candidate-notifications__modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="candidate-notifications__modal-body">
          <div className="candidate-notifications__field">
            <span className="candidate-notifications__field-label">Type</span>
            <span
              className={`candidate-notifications__badge candidate-notifications__badge--${category}`}
            >
              {TYPE_LABELS[notification.type] || notification.type}
            </span>
          </div>

          <div className="candidate-notifications__field candidate-notifications__field--block">
            <span className="candidate-notifications__field-label">Message</span>
            <p>{notification.body || "—"}</p>
          </div>

          {notification.objectId != null && (
            <div className="candidate-notifications__field">
              <span className="candidate-notifications__field-label">
                Related item
              </span>
              <span>#{notification.objectId}</span>
            </div>
          )}
        </div>

        <div className="candidate-notifications__modal-actions">
          <button
            type="button"
            className="candidate-notifications__close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}