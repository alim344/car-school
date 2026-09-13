import { useEffect, useState } from "react";
import axios from "axios";
import "../../style/InstructorProfile.css";



const CATEGORY_LABELS = {
  AM: "AM",
  A1: "A1",
  A2: "A2",
  A: "A",
  B1: "B1",
  B: "B",
  BE: "BE",
  C1: "C1",
  C1E: "C1E",
  C: "C",
  CE: "CE",
  D1: "D1",
  D1E: "D1E",
  D: "D",
  DE: "DE",
  F: "F",
  M: "M",
};

const DOCUMENT_TYPE_LABELS = {
  DRIVING_LICENSE: "Driving license",
  INSTRUCTOR_LICENSE: "Instructor license",
  MEDICAL_CERTIFICATE: "Medical certificate",
};


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

function daysUntil(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  return diff;
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

export default function InstructorProfile() {
 
  const token = localStorage.getItem("userToken");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:8080/instructor/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setProfile(res.data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load profile."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <div className="instructor-profile">
        <div className="instructor-profile__state">Loading profile…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="instructor-profile">
        <div className="instructor-profile__state instructor-profile__state--error">
          Couldn't load profile: {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="instructor-profile">
        <div className="instructor-profile__state">Profile not found.</div>
      </div>
    );
  }

  const initials = getInitials(profile.name);
  const documents = Array.isArray(profile.documents) ? profile.documents : [];

  const sortedDocuments = [...documents].sort((a, b) => {
    if (!a.expiryDate) return 1;
    if (!b.expiryDate) return -1;
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });

  return (
    <div className="instructor-profile">
      <header className="instructor-profile__header">
        <div className="instructor-profile__avatar">
          <span className="instructor-profile__avatar-initials">{initials}</span>
        </div>

        <div className="instructor-profile__identity">
          <h1 className="instructor-profile__name">
            {profile.name || "Unnamed instructor"}
          </h1>
          <p className="instructor-profile__email">{profile.email || "—"}</p>

          <div className="instructor-profile__quick-stats">
            <span className="instructor-profile__stat">
              <span className="instructor-profile__stat-label">Category</span>
              <span className="instructor-profile__stat-value">
                {profile.category
                  ? CATEGORY_LABELS[profile.category] || profile.category
                  : "—"}
              </span>
            </span>

            <span className="instructor-profile__stat">
              <span className="instructor-profile__stat-label">
                Active vehicle
              </span>
              <span className="instructor-profile__stat-value">
                {profile.activeVehicleRegistration || "—"}
              </span>
            </span>

            <span className="instructor-profile__stat">
              <span className="instructor-profile__stat-label">
                Primary vehicle
              </span>
              <span className="instructor-profile__stat-value">
                {profile.primaryVehicleRegistration || "—"}
              </span>
            </span>

            <span className="instructor-profile__stat">
              <span className="instructor-profile__stat-label">Documents</span>
              <span className="instructor-profile__stat-value">
                {documents.length}
              </span>
            </span>
          </div>
        </div>
      </header>

      <hr className="instructor-profile__divider" />

      <section className="instructor-profile__section">
        <header className="instructor-profile__section-header">
          <div>
            <h2>Documents</h2>
            <span className="instructor-profile__section-count">
              {documents.length}{" "}
              {documents.length === 1 ? "document" : "documents"}
            </span>
          </div>
        </header>

        {documents.length === 0 ? (
          <div className="instructor-profile__empty">
         
            <p>No documents on file.</p>
          </div>
        ) : (
          <div className="instructor-profile__doc-grid">
            {sortedDocuments.map((doc) => {
              const label =
                DOCUMENT_TYPE_LABELS[doc.documentType] ||
                doc.documentType ||
                "Document";

              const days = daysUntil(doc.expiryDate);
              const isExpired = days != null && days < 0;
              const isExpiringSoon =
                days != null && days >= 0 && days <= 30;

              const statusClass = isExpired
                ? "expired"
                : isExpiringSoon
                ? "soon"
                : "ok";

              const statusLabel = isExpired
                ? "Expired"
                : isExpiringSoon
                ? "Expiring soon"
                : "Valid";

              return (
                <div
                  key={doc.id}
                  className={`instructor-profile__doc-card instructor-profile__doc-card--${statusClass}`}
                >

                  <div className="instructor-profile__doc-body">
                    <h3 className="instructor-profile__doc-title">{label}</h3>
                    <p className="instructor-profile__doc-expiry">
                      Expires: <strong>{formatDate(doc.expiryDate)}</strong>
                    </p>
                    <span
                      className={`instructor-profile__doc-status instructor-profile__doc-status--${statusClass}`}
                    >
                      {statusLabel}
                      {days != null && days >= 0 && days <= 30 && (
                        <>
                          {" "}
                          · {days} {days === 1 ? "day" : "days"} left
                        </>
                      )}
                      {days != null && days < 0 && (
                        <>
                          {" "}
                          · {Math.abs(days)}{" "}
                          {Math.abs(days) === 1 ? "day" : "days"} ago
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}