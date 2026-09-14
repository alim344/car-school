import { useState } from "react";
import "../style/RequestInstructorModal.css";

export default function RequestInstructorModal({
  isOpen,
  onClose,
  onSubmit,
  currentInstructor = null,
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget && !submitting) {
      onClose();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = reason.trim();
    if (!trimmed) {
      setError("Please add a short reason for the change.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ reason: trimmed });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit the request."
      );
      setSubmitting(false);
    }
  }

  return (
    <div
      className="request-inst-modal__backdrop"
      onClick={handleBackdropClick}
    >
      <div
        className="request-inst-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-inst-modal-title"
      >
        <div className="request-inst-modal__header">
          <h3 id="request-inst-modal-title">Request new instructor</h3>
          <button
            type="button"
            className="request-inst-modal__close"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form className="request-inst-modal__form" onSubmit={handleSubmit}>
          {currentInstructor?.name && (
            <div className="request-inst-modal__current">
              <span className="request-inst-modal__current-label">
                Current instructor
              </span>
              <span className="request-inst-modal__current-name">
                {currentInstructor.name}
              </span>
            </div>
          )}

          {error && (
            <div className="request-inst-modal__error">⚠️ {error}</div>
          )}

          <label className="request-inst-modal__field">
            <span>Why do you want a new instructor? *</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Tell us briefly why you'd like to change instructors…"
              disabled={submitting}
              required
            />
          </label>

          <div className="request-inst-modal__actions">
            <button
              type="button"
              className="request-inst-modal__btn request-inst-modal__btn--ghost"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="request-inst-modal__btn request-inst-modal__btn--primary"
              disabled={submitting || !reason.trim()}
            >
              {submitting ? "Submitting…" : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}