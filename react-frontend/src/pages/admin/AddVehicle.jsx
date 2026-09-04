import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../style/AddVehicle.css";

export default function AddVehicle() {
    const navigate = useNavigate();
    const token = localStorage.getItem("userToken");
    
    const [brands, setBrands] = useState([]);
    const [loadingBrands, setLoadingBrands] = useState(false);
    
    const [formData, setFormData] = useState({
        registrationNumber: "",
        brand_id: "",
        brand: "",
        model: "",
        colour: "",
        year: "",
        currentMileage: "",
        registrationExpiryDate: "",
        instructorEmail: ""
    });
    
    const [isNewBrand, setIsNewBrand] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchBrands = async () => {
            setLoadingBrands(true);
            try {
                const response = await axios.get(
                    "http://localhost:8080/vehicle/get-brands",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setBrands(response.data);
            } catch (error) {
                console.error("Error fetching brands:", error);
                setError("Failed to load brands. Please try again.");
            } finally {
                setLoadingBrands(false);
            }
        };
        fetchBrands();
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "brandSelection") {
            if (value === "new") {
                setIsNewBrand(true);
                setFormData(prev => ({
                    ...prev,
                    brand_id: "",
                    brand: "",
                    model: "",
                    colour: "",
                    year: ""
                }));
            } else {
                setIsNewBrand(false);
                const selectedBrand = brands.find(b => b.brand_id === parseInt(value));
                if (selectedBrand) {
                    setFormData(prev => ({
                        ...prev,
                        brand_id: selectedBrand.brand_id,
                        brand: selectedBrand.brand,
                        model: selectedBrand.model,
                        colour: selectedBrand.colour || "",
                        year: selectedBrand.year || ""
                    }));
                }
            }
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!formData.registrationNumber) {
            setError("Registration number is required.");
            setLoading(false);
            return;
        }

        if (isNewBrand) {
            if (!formData.brand || !formData.model) {
                setError("Brand and model are required when creating a new brand.");
                setLoading(false);
                return;
            }
        } else if (!formData.brand_id) {
            setError("Please select a brand or create a new one.");
            setLoading(false);
            return;
        }

        const vehicleDTO = {
            registrationNumber: formData.registrationNumber,
            brand_id: isNewBrand ? null : parseInt(formData.brand_id),
            brand: isNewBrand ? formData.brand : null,
            model: isNewBrand ? formData.model : null,
            colour: isNewBrand ? formData.colour : null,
            year: isNewBrand ? formData.year : null,
            currentMileage: formData.currentMileage ? parseInt(formData.currentMileage) : null,
            registrationExpiryDate: formData.registrationExpiryDate || null,
            instructorEmail: formData.instructorEmail || null
        };

        try {
             await axios.post(
                "http://localhost:8080/vehicle/add",
                vehicleDTO,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setSuccess(true);
            setFormData({
                registrationNumber: "",
                brand_id: "",
                brand: "",
                model: "",
                colour: "",
                year: "",
                currentMileage: "",
                registrationExpiryDate: "",
                instructorEmail: ""
            });
            setIsNewBrand(false);

            setTimeout(() => {
                navigate("/admin/vehicles");
            }, 2000);

        } catch (error) {
            console.error("Error adding vehicle:", error);
            setError(error.response?.data?.message || "Failed to add vehicle. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/admin/vehicles");
    };

    return (
        <div className="add-vehicle-container">
            <div className="add-vehicle-card">
                <div className="add-vehicle-header">
                    <h1>Add New Vehicle</h1>
                    <p className="add-vehicle-subtitle">Enter the vehicle details below to add it to the fleet</p>
                </div>

                {error && (
                    <div className="add-vehicle-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="add-vehicle-success">
                         Vehicle added successfully! Redirecting...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="add-vehicle-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Registration Number <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="registrationNumber"
                                value={formData.registrationNumber}
                                onChange={handleChange}
                                placeholder="e.g., AB-123-CD"
                                className="form-input"
                                required
                                disabled={loading || success}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Brand Selection <span className="required">*</span>
                            </label>
                            <select
                                name="brandSelection"
                                onChange={handleChange}
                                className="form-input"
                                disabled={loading || success || loadingBrands}
                                value={isNewBrand ? "new" : formData.brand_id || ""}
                            >
                                <option value="">Select a brand...</option>
                                {brands.map((brand) => (
                                    <option key={brand.brand_id} value={brand.brand_id}>
                                        {brand.brand} {brand.model} {brand.year ? `(${brand.year})` : ''}
                                        {brand.colour ? ` - ${brand.colour}` : ''}
                                    </option>
                                ))}
                                <option value="new">+ Create New Brand</option>
                            </select>
                            {loadingBrands && (
                                <span className="form-hint">Loading brands...</span>
                            )}
                            {!loadingBrands && brands.length === 0 && (
                                <span className="form-hint">No brands available. Create a new one.</span>
                            )}
                        </div>
                    </div>

                    {isNewBrand && (
                        <div className="new-brand-section">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        Brand <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        placeholder="e.g., Toyota"
                                        className="form-input"
                                        required
                                        disabled={loading || success}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Model <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleChange}
                                        placeholder="e.g., Corolla"
                                        className="form-input"
                                        required
                                        disabled={loading || success}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        Colour
                                    </label>
                                    <div className="colour-input-wrapper">
                                        <input
                                            type="text"
                                            name="colour"
                                            value={formData.colour}
                                            onChange={handleChange}
                                            placeholder="e.g., Red"
                                            className="form-input colour-text-input"
                                            disabled={loading || success}
                                        />
                                        {formData.colour && (
                                            <span 
                                                className="colour-preview"
                                                style={{ backgroundColor: formData.colour.toLowerCase() }}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Year
                                    </label>
                                    <input
                                        type="number"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        placeholder="e.g., 2020"
                                        className="form-input"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        disabled={loading || success}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {!isNewBrand && formData.brand_id && (
                        <div className="selected-brand-info">
                            <p className="brand-info-text">
                                <span className="brand-info-label">Selected Brand:</span>
                                {formData.brand} {formData.model} 
                                {formData.year ? ` (${formData.year})` : ''}
                                {formData.colour ? ` - ${formData.colour}` : ''}
                            </p>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Current Mileage
                            </label>
                            <input
                                type="number"
                                name="currentMileage"
                                value={formData.currentMileage}
                                onChange={handleChange}
                                placeholder="e.g., 15000"
                                className="form-input"
                                min="0"
                                disabled={loading || success}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Registration Expiry Date
                            </label>
                            <input
                                type="date"
                                name="registrationExpiryDate"
                                value={formData.registrationExpiryDate}
                                onChange={handleChange}
                                className="form-input"
                                disabled={loading || success}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">
                                Instructor Email (Optional)
                            </label>
                            <input
                                type="email"
                                name="instructorEmail"
                                value={formData.instructorEmail}
                                onChange={handleChange}
                                placeholder="instructor@carschool.com"
                                className="form-input"
                                disabled={loading || success}
                            />
                        </div>

                        <div className="form-group">
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading || success}
                        >
                            {loading ? "Adding Vehicle..." : "Add Vehicle"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}