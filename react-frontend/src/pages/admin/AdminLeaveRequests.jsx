import { useEffect, useMemo, useState } from "react";
import "../../style/AdminLeaveRequests.css";




const STATUS_LABELS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  USED: "Used",
};

const TYPE_LABELS = {
  SICK: "Sick",
  VACATION: "Vacation",
  PERSONAL: "Personal",
};

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function matchesStartDate(searchValue, startDate) {
 
  if (!searchValue || !startDate) return true;
  return startDate.slice(0, 10) === searchValue;
}

function daysBetween(start, end) {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : null;
}

export default function AdminLeaveRequests() {
    const token = localStorage.getItem("userToken");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [nameSearch, setNameSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchRequests() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8080/leave/getAll", {
          headers: {
       
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          setRequests(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load leave requests.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchRequests();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredRequests = useMemo(() => {
    const name = nameSearch.trim().toLowerCase();
    return requests.filter((req) => {
      if (typeFilter !== "ALL" && req.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && req.status !== statusFilter) return false;
      if (name && !(req.instructorName || "").toLowerCase().includes(name)) {
        return false;
      }
      if (dateSearch && !matchesStartDate(dateSearch, req.startDate)) {
        return false;
      }
      return true;
    });
  }, [requests, typeFilter, statusFilter, nameSearch, dateSearch]);

  const hasActiveFilters =
    typeFilter !== "ALL" || statusFilter !== "ALL" || nameSearch || dateSearch;

  function clearFilters() {
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setNameSearch("");
    setDateSearch("");
  }

  function handleResolved(updated) {
    setRequests((prev) =>
      prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r))
    );
    setSelected((prev) => (prev ? { ...prev, ...updated } : prev));
  }

  return (
    <div className="admin-leave-requests">
      <div className="admin-leave-requests__header">
        <h1>Leave Requests</h1>
        <p className="admin-leave-requests__subtitle">
          {loading
            ? "Loading requests…"
            : `${filteredRequests.length} of ${requests.length} request${
                requests.length === 1 ? "" : "s"
              }`}
        </p>
      </div>

      {!loading && !error && (
        <div className="admin-leave-requests__filters">
          <div className="admin-leave-requests__filter-field">
            <label htmlFor="filter-type">Type</label>
            <select
              id="filter-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All types</option>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-leave-requests__filter-field">
            <label htmlFor="filter-status">Status</label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-leave-requests__filter-field">
            <label htmlFor="filter-name">Instructor</label>
            <input
              id="filter-name"
              type="text"
              placeholder="Search by name…"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>

          <div className="admin-leave-requests__filter-field">
            <label htmlFor="filter-date">Start date</label>
            <input
              id="filter-date"
              type="date"
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="admin-leave-requests__clear-filters"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="admin-leave-requests__error">
          Couldn't load leave requests: {error}
        </div>
      )}

      {!loading && !error && requests.length > 0 && filteredRequests.length === 0 && (
        <div className="admin-leave-requests__empty">
          No requests match your filters.
        </div>
      )}

      {!loading && !error && requests.length === 0 && (
        <div className="admin-leave-requests__empty">
          No leave requests yet.
        </div>
      )}

      {!loading && filteredRequests.length > 0 && (
        <div className="admin-leave-requests__table-wrapper">
          <table className="admin-leave-requests__table">
            <thead>
              <tr>
                <th>Instructor</th>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Requested</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr
                  key={req.id}
                  className="admin-leave-requests__row"
                  onClick={() => setSelected(req)}
                >
                  <td>{req.instructorName}</td>
                  <td>{TYPE_LABELS[req.type] || req.type}</td>
                  <td>{formatDate(req.startDate)}</td>
                  <td>{formatDate(req.endDate)}</td>
                  <td>
                    <span
                      className={`admin-leave-requests__status admin-leave-requests__status--${(
                        req.status || ""
                      ).toLowerCase()}`}
                    >
                      {STATUS_LABELS[req.status] || req.status}
                    </span>
                  </td>
                  <td>{formatDateTime(req.requestedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <LeaveRequestModal
          request={selected}
          onClose={() => setSelected(null)}
          onResolved={handleResolved}
        />
      )}
    </div>
  );
}

function LeaveRequestModal({ request, onClose, onResolved }) {

    const token = localStorage.getItem("userToken");
  const duration = daysBetween(request.startDate, request.endDate);
  const isPending = request.status === "PENDING";

  const [comment, setComment] = useState(request.adminComment || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  async function submitDecision(accepted) {
    if (!comment.trim()) {
      setSubmitError("Add a comment before submitting.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("http://localhost:8080/leave/handle", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: request.id,
          accepted,
          response: comment.trim(),
        }),
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      onResolved({
        id: request.id,
        status: accepted ? "APPROVED" : "REJECTED",
        adminComment: comment.trim(),
        resolvedAt: new Date().toISOString(),
      });
    } catch (err) {
      setSubmitError(err.message || "Failed to submit your response.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="admin-leave-requests__modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div
        className="admin-leave-requests__modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-request-modal-title"
      >
        <div className="admin-leave-requests__modal-header">
          <h2 id="leave-request-modal-title">{request.instructorName}</h2>
          <button
            type="button"
            className="admin-leave-requests__modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="admin-leave-requests__modal-body">
          <div className="admin-leave-requests__field">
            <span className="admin-leave-requests__field-label">Email</span>
            <span>{request.instructorEmail || "—"}</span>
          </div>

          <div className="admin-leave-requests__field">
            <span className="admin-leave-requests__field-label">Status</span>
            <span
              className={`admin-leave-requests__status admin-leave-requests__status--${(
                request.status || ""
              ).toLowerCase()}`}
            >
              {STATUS_LABELS[request.status] || request.status}
            </span>
          </div>

          <div className="admin-leave-requests__field">
            <span className="admin-leave-requests__field-label">Type</span>
            <span>{TYPE_LABELS[request.type] || request.type}</span>
          </div>

          <div className="admin-leave-requests__field">
            <span className="admin-leave-requests__field-label">Dates</span>
            <span>
              {formatDate(request.startDate)} – {formatDate(request.endDate)}
              {duration ? ` (${duration} day${duration === 1 ? "" : "s"})` : ""}
            </span>
          </div>

          <div className="admin-leave-requests__field">
            <span className="admin-leave-requests__field-label">
              Remaining leave days
            </span>
            <span>{request.remainingLeaveDays}</span>
          </div>

          <div className="admin-leave-requests__field admin-leave-requests__field--block">
            <span className="admin-leave-requests__field-label">Reason</span>
            <p>{request.reason || "—"}</p>
          </div>

          {isPending ? (
            <div className="admin-leave-requests__field admin-leave-requests__field--block">
              <span className="admin-leave-requests__field-label">
                Your comment
              </span>
              <textarea
                className="admin-leave-requests__comment-input"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Explain your decision before approving or rejecting…"
                disabled={submitting}
              />
            </div>
          ) : (
            <div className="admin-leave-requests__field admin-leave-requests__field--block">
              <span className="admin-leave-requests__field-label">
                Admin comment
              </span>
              <p>{request.adminComment || "—"}</p>
            </div>
          )}

          <div className="admin-leave-requests__field">
            <span className="admin-leave-requests__field-label">
              Requested at
            </span>
            <span>{formatDateTime(request.requestedAt)}</span>
          </div>

          <div className="admin-leave-requests__field">
            <span className="admin-leave-requests__field-label">
              Resolved at
            </span>
            <span>{formatDateTime(request.resolvedAt)}</span>
          </div>

          {submitError && (
            <div className="admin-leave-requests__error">{submitError}</div>
          )}
        </div>

        {isPending && (
          <div className="admin-leave-requests__modal-actions">
            <button
              type="button"
              className="admin-leave-requests__reject-btn"
              onClick={() => submitDecision(false)}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Reject"}
            </button>
            <button
              type="button"
              className="admin-leave-requests__approve-btn"
              onClick={() => submitDecision(true)}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Approve"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
