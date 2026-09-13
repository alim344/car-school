import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../style/CandidateProfile.css";
import GradeLineChart from "../../components/GradeLineChart";
import ExamDetailsModal from "../../components/ExamDetailsModal";

const EXAM_STATUS_LABELS = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  FAILED: "Failed",
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

function getInitials(first, last) {
  const f = (first || "").trim();
  const l = (last || "").trim();
  const initials =
    (f ? f[0].toUpperCase() : "") + (l ? l[0].toUpperCase() : "");
  return initials || "?";
}

function getNextClass(classes) {
  const now = new Date();
  const DEAD = new Set(["CANCELLED", "REJECTED", "ENDED", "BAD_END"]);

  const future = classes.filter((c) => {
    if (!c.scheduledStartTime) return false;
    const start = new Date(c.scheduledStartTime);
    if (Number.isNaN(start.getTime())) return false;
    if (start <= now) return false;
    return !DEAD.has(c.classStatus);
  });

  if (future.length === 0) return null;

  const accepted = future.filter(
    (c) => c.classStatus === "ACCEPTED" || c.classStatus === "STARTED"
  );
  const pending = future.filter((c) => c.classStatus === "PENDING");
  const pool = accepted.length > 0 ? accepted : pending;
  if (pool.length === 0) return null;

  return pool.sort(
    (a, b) => new Date(a.scheduledStartTime) - new Date(b.scheduledStartTime)
  )[0];
}



export default function CandidateOwnProfile() {

  const token = localStorage.getItem("userToken");


  const PROFILE_URL =  `http://localhost:8080/practical-class/getProfile`


  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const [selectedExam, setSelectedExam] = useState(null);


  useEffect(() => {
   
    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(PROFILE_URL, {
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
  }, [PROFILE_URL, token]);

  const classes = useMemo(
    () => (Array.isArray(profile?.classes) ? profile.classes : []),
    [profile]
  );
  const examList = useMemo(
    () => (Array.isArray(profile?.examList) ? profile.examList : []),
    [profile]
  );
  const gradeList = useMemo(
    () => (Array.isArray(profile?.gradeList) ? profile.gradeList : []),
    [profile]
  );

  const nextClass = useMemo(() => getNextClass(classes), [classes]);

  const isPractical = profile?.trainingStatus === "PRACTICAL";
  const progressPct = profile
    ? Math.min(
        100,
        Math.round(
          ((profile.numberOfCompletedClasses || 0) /
            (profile.totalNumberOfClasses || 1)) *
            100
        )
      )
    : 0;

  if (loading) {
    return (
      <div className="candidate-own-profile">
        <div className="candidate-own-profile__state">Loading profile…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-own-profile">
        <div className="candidate-own-profile__state candidate-own-profile__state--error">
          Couldn't load profile: {error}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="candidate-own-profile">
        <div className="candidate-own-profile__state">Profile not found.</div>
      </div>
    );
  }

  const fullName =
    `${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
    "Unnamed candidate";

  const initials = getInitials(profile.firstName, profile.lastName);

  async function handleCancelExam(exam) {
        if (!exam) return;
    
        try {
            const res = await axios.patch(
            "http://localhost:8080/p-exam/cancel",
            {
                id: exam.id,
            
                status: exam.status,
            },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            }
            );

            const updated = res.data;

            setProfile((prev) => {
            if (!prev) return prev;
            const list = Array.isArray(prev.examList) ? prev.examList : [];
            return {
                ...prev,
                examList: list.map((e) =>
                e.id === exam.id ? { ...e, ...updated } : e
                ),
            };
            });

            setSelectedExam((prev) => (prev ? { ...prev, ...updated } : prev));
        } catch (err) {
            console.error("Error cancelling exam:", err);
            throw err; 
        }
    }

  return (
    <div className="candidate-own-profile">
      <header className="candidate-own-profile__header">
        <div className="candidate-own-profile__avatar">
          <span className="candidate-own-profile__avatar-initials">
            {initials}
          </span>
        </div>

        <div className="candidate-own-profile__identity">
          <h1 className="candidate-own-profile__name">{fullName}</h1>
          <p className="candidate-own-profile__email">{profile.email || "—"}</p>

          <div className="candidate-own-profile__quick-stats">
            <span className="candidate-own-profile__stat">
              <span className="candidate-own-profile__stat-label">Category</span>
              <span className="candidate-own-profile__stat-value">
                {profile.category || "—"}
              </span>
            </span>

            

            <span className="candidate-own-profile__stat">
              <span className="candidate-own-profile__stat-label">
                Avg grade
              </span>
              <span className="candidate-own-profile__stat-value candidate-own-profile__stat-value--grade">
                {profile.avgGrade != null
                  ? Number(profile.avgGrade).toFixed(2)
                  : "—"}
              </span>
            </span>
          </div>
        </div>
      </header>

      <hr className="candidate-own-profile__divider" />

      <section className="candidate-own-profile__progress">
        <div className="candidate-own-profile__progress-header">
          <span className="candidate-own-profile__progress-title">
            Practical classes
          </span>
          <span className="candidate-own-profile__progress-value">
            {profile.numberOfCompletedClasses ?? 0} /{" "}
            {profile.totalNumberOfClasses ?? 0}
          </span>
        </div>

        <div className="candidate-own-profile__progress-bar">
          <div
            className="candidate-own-profile__progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="candidate-own-profile__progress-footer">
          <span>{progressPct}% complete</span>
          <span>
            {profile.numberOfClassesLeft ?? 0} classes left
            {profile.numberOfClassesLeft > 0 ? " until your exam" : ""}
          </span>
        </div>
      </section>

      {isPractical && (
        <div
          className={`candidate-own-profile__next-class ${
            !nextClass ? "candidate-own-profile__next-class--empty" : ""
          }`}
        >
          <span className="candidate-own-profile__next-class-label">
            {nextClass ? "Next class" : "No upcoming classes"}
          </span>

          {nextClass ? (
            <>
              <span className="candidate-own-profile__next-class-time">
                {formatDateTime(nextClass.scheduledStartTime)}
              </span>
              {nextClass.location && (
                <span className="candidate-own-profile__next-class-location">
                  📍 {nextClass.location}
                </span>
              )}
              <span
                className={`candidate-own-profile__badge candidate-own-profile__badge--${(
                  nextClass.classStatus || ""
                ).toLowerCase()}`}
              >
                {CLASS_STATUS_LABELS[nextClass.classStatus] ||
                  nextClass.classStatus}
              </span>
            </>
          ) : (
            <span className="candidate-own-profile__next-class-hint">
              Nothing is scheduled yet — your instructor will add classes soon.
            </span>
          )}
        </div>
      )}

      
      <hr className="candidate-own-profile__divider" />

      


      {examList.length > 0 && (
        <section className="candidate-own-profile__section">
          <header className="candidate-own-profile__section-header">
            <h2>Exams</h2>
            <span className="candidate-own-profile__section-count">
              {examList.length} {examList.length === 1 ? "exam" : "exams"}
            </span>
          </header>

          <div className="candidate-own-profile__exams-list">
            {[...examList]
              .map((exam) => {
                const key = (exam.status || "").toLowerCase();
                return (
                  <div
                    key={exam.id}
                    type = "button"
                    className={`candidate-own-profile__exam-card candidate-own-profile__exam-card--${key}`}
                    onClick={() => setSelectedExam(exam)}
                  >
                    <div className="candidate-own-profile__exam-main">
                      <span className="candidate-own-profile__exam-date">
                        {formatDate(exam.dateTime)}
                      </span>
                      <span
                        className={`candidate-own-profile__badge candidate-own-profile__badge--${key}`}
                      >
                        {EXAM_STATUS_LABELS[exam.status] || exam.status || "—"}
                      </span>
                    </div>

                    <div className="candidate-own-profile__exam-meta">
                      {exam.score != null && (
                        <span className="candidate-own-profile__exam-score">
                          Score: <strong>{exam.score}</strong>
                        </span>
                      )}
                      {exam.admin_name && (
                        <span>Examiner: {exam.admin_name}</span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      <hr className="candidate-own-profile__divider" />

     
      <section className="candidate-own-profile__section">
        <header className="candidate-own-profile__section-header">
          <h2>Your performance</h2>
          <span className="candidate-own-profile__section-count">
            {gradeList.length}{" "}
            {gradeList.length === 1 ? "graded class" : "graded classes"}
          </span>
        </header>
        <GradeLineChart grades={gradeList} />
      </section>

      <ExamDetailsModal
        isOpen={!!selectedExam}
        exam={selectedExam}
        onClose={() => setSelectedExam(null)}
        onCancel={handleCancelExam}
        />

      
      
    </div>
  );
}