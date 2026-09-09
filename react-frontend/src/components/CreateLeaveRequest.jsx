import { useState } from "react";

import "../style/CreateLeaveRequest.css";


export default function CreateLeaveRequestModal({ isOpen, onClose, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        type: 'VACATION',
        startDate: '',
        endDate: '',
        reason: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.type) newErrors.type = 'Type is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.endDate) newErrors.endDate = 'End date is required';
        if (formData.startDate && formData.endDate && new Date(formData.startDate) > new Date(formData.endDate)) {
            newErrors.endDate = 'End date must be after start date';
        }
        if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'VACATION',
            startDate: '',
            endDate: '',
            reason: ''
        });
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2> Create Leave Request</h2>
                    <button className="modal-close-btn" onClick={handleClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Leave Type *</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className={`form-select ${errors.type ? 'error' : ''}`}
                        >
                            <option value="VACATION"> Vacation</option>
                            <option value="SICK"> Sick Leave</option>
                            <option value="PERSONAL"> Personal Leave</option>
                        </select>
                        {errors.type && <span className="error-message">{errors.type}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Start Date *</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className={`form-input ${errors.startDate ? 'error' : ''}`}
                            />
                            {errors.startDate && <span className="error-message">{errors.startDate}</span>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">End Date *</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className={`form-input ${errors.endDate ? 'error' : ''}`}
                            />
                            {errors.endDate && <span className="error-message">{errors.endDate}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Reason *</label>
                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            className={`form-textarea ${errors.reason ? 'error' : ''}`}
                            placeholder="Please provide a reason for your leave request..."
                            rows="4"
                        />
                        {errors.reason && <span className="error-message">{errors.reason}</span>}
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}