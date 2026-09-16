import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/InstructorCandidates.css";

const STATUS_LABELS = {
  PRACTICAL: "Practical",
  PENDING: "Pending",
  EXAM_SCHEDULED: "Exam scheduled",
  PASSED: "Passed",
};


const STATUS_ORDER = ["PRACTICAL", "PENDING", "EXAM_SCHEDULED", "PASSED"];

export default function InstructorCandidates() {
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    let cancelled = false;

    async function fetchCandidates() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:8080/candidate/inst-getAll", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) setCandidates(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load candidates.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCandidates();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCandidates = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return candidates.filter((c) => {
      if (statusFilter !== "ALL" && c.trainingStatus !== statusFilter) {
        return false;
      }
      if (term) {
        const full = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
        const email = (c.email || "").toLowerCase();
        if (!full.includes(term) && !email.includes(term)) return false;
      }
      return true;
    });
  }, [candidates, statusFilter, searchTerm]);

  const grouped = useMemo(() => {
    const map = {};
    STATUS_ORDER.forEach((s) => (map[s] = []));
    filteredCandidates.forEach((c) => {
      if (map[c.trainingStatus]) map[c.trainingStatus].push(c);
    });
    return map;
  }, [filteredCandidates]);

  const counts = useMemo(() => {
    const c = { ALL: candidates.length };
    STATUS_ORDER.forEach((s) => (c[s] = 0));
    candidates.forEach((cand) => {
      if (c[cand.trainingStatus] != null) c[cand.trainingStatus] += 1;
    });
    return c;
  }, [candidates]);

  function getInitials(candidate) {
    const first = (candidate.firstName || "").trim();
    const last = (candidate.lastName || "").trim();
    const f = first ? first[0].toUpperCase() : "";
    const l = last ? last[0].toUpperCase() : "";
    const initials = (f + l) || "?";
    return initials;
  }

  function goToCandidate(candidate) {
    navigate(`/instructor/candidates/${candidate.id}`);
  }

  return (
    <div className="instructor-candidates">
      <div className="instructor-candidates__header">
        <div>
          <h1>My Candidates</h1>
          <p className="instructor-candidates__subtitle">
            {loading
              ? "Loading candidates…"
              : `${filteredCandidates.length} of ${candidates.length} candidate${
                  candidates.length === 1 ? "" : "s"
                }`}
          </p>
        </div>
         
      </div>

      {!loading && !error && candidates.length > 0 && (
        <div className="instructor-candidates__toolbar">

            <div className="instructor-candidates__search">
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                 />
           </div>

          <div className="instructor-candidates__tabs">
            <button
              type="button"
              className={`instructor-candidates__tab ${
                statusFilter === "ALL" ? "instructor-candidates__tab--active" : ""
              }`}
              onClick={() => setStatusFilter("ALL")}
            >
              All
              <span className="instructor-candidates__tab-count">
                {counts.ALL}
              </span>
            </button>
            {STATUS_ORDER.map((status) => (
              <button
                key={status}
                type="button"
                className={`instructor-candidates__tab ${
                  statusFilter === status
                    ? "instructor-candidates__tab--active"
                    : ""
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {STATUS_LABELS[status]}
                <span className="instructor-candidates__tab-count">
                  {counts[status] ?? 0}
                </span>
              </button>
            ))}
          </div>

         
        </div>
      )}

      {error && (
        <div className="instructor-candidates__error">
          Couldn't load candidates: {error}
        </div>
      )}

      {!loading && !error && candidates.length === 0 && (
        <div className="instructor-candidates__empty">
          <p>You have no assigned candidates yet.</p>
        </div>
      )}

      {!loading &&
        !error &&
        candidates.length > 0 &&
        filteredCandidates.length === 0 && (
          <div className="instructor-candidates__empty">
            <p>No candidates match your filters.</p>
          </div>
        )}

      {!loading && filteredCandidates.length > 0 && (
        <div className="instructor-candidates__groups">
          {STATUS_ORDER.map((status) => {
            const list = grouped[status] || [];
            if (list.length === 0) return null;
            const statusKey = status.toLowerCase();

            return (
              <section
                key={status}
                className={`instructor-candidates__group instructor-candidates__group--${statusKey}`}
              >
                <header className="instructor-candidates__group-header">
                  <div className="instructor-candidates__group-title">
                    
                    <h2>{STATUS_LABELS[status]}</h2>
                    <span
                      className={`instructor-candidates__badge instructor-candidates__badge--${statusKey}`}
                    >
                      {list.length}
                    </span>
                  </div>
                </header>

                <div className="instructor-candidates__grid">
                  {list.map((candidate) => (
                    <button
                      key={candidate.id}
                      type="button"
                      className="instructor-candidates__card"
                      onClick={() => goToCandidate(candidate)}
                    >
                      <div className="instructor-candidates__avatar">
                        <span className="instructor-candidates__avatar-fallback">
                          {getInitials(candidate)}
                        </span>
                      </div>

                      <div className="instructor-candidates__card-body">
                        <h3>
                          {candidate.firstName} {candidate.lastName}
                        </h3>
                        <p className="instructor-candidates__email">
                          {candidate.email}
                        </p>

                        <div className="instructor-candidates__meta">
                          <span className="instructor-candidates__meta-item">
                            <span className="instructor-candidates__meta-label">
                              Category
                            </span>
                            <span className="instructor-candidates__meta-value">
                              {candidate.category}
                            </span>
                          </span>
                          <span className="instructor-candidates__meta-item">
                            <span className="instructor-candidates__meta-label">
                              Classes left
                            </span>
                            <span className="instructor-candidates__meta-value">
                              {candidate.numberOfClassesLeft}
                            </span>
                          </span>
                        </div>
                      </div>

                      <span className="instructor-candidates__chevron">›</span>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}