
import { useEffect, useMemo, useState } from "react";
import "../../style/InstructorNotifications.css";


const TYPE_LABELS = {
  CLASS_CANCELLED_BY_CANDIDATE: "Class cancelled",
  NEW_CLASS_REQUEST: "New class request",
  WEEKLY_SCHEDULE_REMINDER: "Weekly schedule",
  CAR_FIXED: "Car fixed",
  INSTRUCTOR_VEHICLE_REQUEST_ACCEPTED: "Vehicle request accepted",
  INSTRUCTOR_VEHICLE_REQUEST_DENIED: "Vehicle request denied",
  INSTRUCTOR_LEAVE_REQUEST_ACCEPTED: "Leave request accepted",
  INSTRUCTOR_LEAVE_REQUEST_DENIED: "Leave request denied",
  NEW_CAR_ASSIGNED: "New car assigned",
  RESERVE_ASSIGNED: "Reserve assigned",
};

const TYPE_ICONS = {
  CLASS_CANCELLED_BY_CANDIDATE: "❌",
  NEW_CLASS_REQUEST: "📩",
  WEEKLY_SCHEDULE_REMINDER: "🗓️",
  CAR_FIXED: "🔧",
  INSTRUCTOR_VEHICLE_REQUEST_ACCEPTED: "✅",
  INSTRUCTOR_VEHICLE_REQUEST_DENIED: "🚫",
  INSTRUCTOR_LEAVE_REQUEST_ACCEPTED: "✅",
  INSTRUCTOR_LEAVE_REQUEST_DENIED: "🚫",
  NEW_CAR_ASSIGNED: "🚗",
  RESERVE_ASSIGNED: "📌",
};

const TYPE_CATEGORY = {
  CLASS_CANCELLED_BY_CANDIDATE: "schedule",
  NEW_CLASS_REQUEST: "schedule",
  WEEKLY_SCHEDULE_REMINDER: "schedule",
  CAR_FIXED: "vehicle",
  INSTRUCTOR_VEHICLE_REQUEST_ACCEPTED: "vehicle",
  INSTRUCTOR_VEHICLE_REQUEST_DENIED: "vehicle",
  NEW_CAR_ASSIGNED: "vehicle",
  RESERVE_ASSIGNED: "vehicle",
  INSTRUCTOR_LEAVE_REQUEST_ACCEPTED: "leave",
  INSTRUCTOR_LEAVE_REQUEST_DENIED: "leave",
};

const CATEGORY_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "schedule", label: "Schedule" },
  { value: "vehicle", label: "Vehicle" },
  { value: "leave", label: "Leave" },
];

export default function InstructorNotifications() {
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
    const c = { ALL: notifications.length, schedule: 0, vehicle: 0, leave: 0 };
    notifications.forEach((n) => {
      const cat = TYPE_CATEGORY[n.type];
      if (cat) c[cat] = (c[cat] || 0) + 1;
    });
    return c;
  }, [notifications]);

  return (
    <div className="instructor-notifications">
      <div className="instructor-notifications__header">
        <div>
          <h1>Notifications</h1>
          <p className="instructor-notifications__subtitle">
            {loading
              ? "Loading notifications…"
              : `${filteredNotifications.length} of ${notifications.length} notification${
                  notifications.length === 1 ? "" : "s"
                }`}
          </p>
        </div>
      </div>

      {!loading && !error && notifications.length > 0 && (
        <div className="instructor-notifications__toolbar">
          <div className="instructor-notifications__tabs">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`instructor-notifications__tab ${
                  categoryFilter === cat.value
                    ? "instructor-notifications__tab--active"
                    : ""
                }`}
                onClick={() => setCategoryFilter(cat.value)}
              >
                {cat.label}
                <span className="instructor-notifications__tab-count">
                  {counts[cat.value] ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div className="instructor-notifications__search">
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
        <div className="instructor-notifications__error">
          Couldn't load notifications: {error}
        </div>
      )}

      {!loading && !error && notifications.length === 0 && (
        <div className="instructor-notifications__empty">
          <span className="instructor-notifications__empty-icon">🔔</span>
          <p>You have no notifications yet.</p>
        </div>
      )}

      {!loading &&
        !error &&
        notifications.length > 0 &&
        filteredNotifications.length === 0 && (
          <div className="instructor-notifications__empty">
            <span className="instructor-notifications__empty-icon">🔍</span>
            <p>No notifications match your filters.</p>
          </div>
        )}

      {!loading && filteredNotifications.length > 0 && (
        <div className="instructor-notifications__list">
          {filteredNotifications.map((notif) => {
            const category = TYPE_CATEGORY[notif.type] || "schedule";
            return (
              <button
                key={notif.id}
                type="button"
                className={`instructor-notifications__card instructor-notifications__card--${category}`}
                onClick={() => setSelected(notif)}
              >
                <div
                  className={`instructor-notifications__icon instructor-notifications__icon--${category}`}
                >
                  {TYPE_ICONS[notif.type] || "🔔"}
                </div>

                <div className="instructor-notifications__content">
                  <div className="instructor-notifications__card-header">
                    <h3>{notif.title || TYPE_LABELS[notif.type] || notif.type}</h3>
                    <span
                      className={`instructor-notifications__badge instructor-notifications__badge--${category}`}
                    >
                      {TYPE_LABELS[notif.type] || notif.type}
                    </span>
                  </div>
                  <p className="instructor-notifications__body">{notif.body}</p>
                </div>

                <span className="instructor-notifications__chevron">›</span>
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
  const category = TYPE_CATEGORY[notification.type] || "schedule";
  const icon = TYPE_ICONS[notification.type] || "🔔";

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="instructor-notifications__modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        className="instructor-notifications__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-modal-title"
      >
        <div className="instructor-notifications__modal-header">
          <div className="instructor-notifications__modal-title-group">
            <div
              className={`instructor-notifications__icon instructor-notifications__icon--${category}`}
            >
              {icon}
            </div>
            <h2 id="notification-modal-title">
              {notification.title || TYPE_LABELS[notification.type] || notification.type}
            </h2>
          </div>
          <button
            type="button"
            className="instructor-notifications__modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="instructor-notifications__modal-body">
          <div className="instructor-notifications__field">
            <span className="instructor-notifications__field-label">Type</span>
            <span
              className={`instructor-notifications__badge instructor-notifications__badge--${category}`}
            >
              {TYPE_LABELS[notification.type] || notification.type}
            </span>
          </div>

          <div className="instructor-notifications__field instructor-notifications__field--block">
            <span className="instructor-notifications__field-label">Message</span>
            <p>{notification.body || "—"}</p>
          </div>

          {notification.objectId != null && (
            <div className="instructor-notifications__field">
              <span className="instructor-notifications__field-label">
                Related item
              </span>
              <span>#{notification.objectId}</span>
            </div>
          )}
        </div>

        <div className="instructor-notifications__modal-actions">
          <button
            type="button"
            className="instructor-notifications__close-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}