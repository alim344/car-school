import "../style/ConfirmModal.css";



export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay" onClick={onCancel}>
            <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
                <p className="confirm-modal-message">{message}</p>
                <div className="confirm-modal-actions">
                    <button className="confirm-modal-no" onClick={onCancel}>
                        No
                    </button>
                    <button className="confirm-modal-yes" onClick={onConfirm}>
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
}
