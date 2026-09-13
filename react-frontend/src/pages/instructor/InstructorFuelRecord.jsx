import { useEffect,  useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../style/InstructorFuelRecord.css";



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

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthAgoISO() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}


export default function InstructorFuelRecord() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("userToken");

  const passedVehicle = location.state?.vehicle || null;

  const [vehicle, setVehicle] = useState(passedVehicle);
  const [records, setRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [startDate, setStartDate] = useState(monthAgoISO());
  const [endDate, setEndDate] = useState(todayISO());

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    refuelDate: todayISO(),
    liters: "",
    totalCost: "",
    mileageAtRefuel: "",
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (passedVehicle) return;
    let cancelled = false;

    async function fetchVehicle() {
      try {
        const res = await axios.get(`http://localhost:8080/vehicle/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setVehicle(res.data);
      } catch (err) {
        console.error("Failed to load vehicle:", err);
      }
    }

    if (id) fetchVehicle();
    return () => {
      cancelled = true;
    };
  }, [id, passedVehicle, token]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function fetchRecords() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:8080/fuel/get-inst/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { start: startDate, end: endDate, page, size },
        });
        const data = res.data;
        if (cancelled) return;

        setRecords(Array.isArray(data?.content) ? data.content : data || []);
        setTotalPages(data?.totalPages ?? 0);
        setTotalElements(data?.totalElements ?? (data?.content?.length ?? 0));
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load fuel records."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRecords();
    return () => {
      cancelled = true;
    };
  }, [id, startDate, endDate, page, size, token]);

  const canAddFuel = vehicle?.status === "IN_USE" || vehicle?.status === "RESERVE";

  function goBack() {
    navigate("/instructor/vehicle");
  }

  function openAddModal() {
    if (!canAddFuel) {
      alert(
        "You can only add fuel records to a vehicle that's currently in use."
      );
      return;
    }
    setAddForm({
      refuelDate: todayISO(),
      liters: "",
      totalCost: "",
      mileageAtRefuel: vehicle?.currentMileage ?? "",
    });
    setSaveError(null);
    setShowAddModal(true);
  }

  function handleAddChange(e) {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    const payload = {
      vehicleId: Number(id),
      refuelDate: addForm.refuelDate,
      liters: parseFloat(addForm.liters),
      totalCost: parseFloat(addForm.totalCost),
      mileageAtRefuel: addForm.mileageAtRefuel
        ? parseInt(addForm.mileageAtRefuel, 10)
        : null,
    };

    try {
      await axios.post(`http://localhost:8080/fuel/save`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setShowAddModal(false);

      if (page === 0) {
        setStartDate((d) => d);
        setEndDate((d) => d);
      } else {
        setPage(0);
      }
    } catch (err) {
      console.error("Error saving fuel record:", err);
      setSaveError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save fuel record."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fuel-record-page">
      <button
        type="button"
        className="fuel-record-page__back-btn"
        onClick={goBack}
      >
        ← Back to vehicles
      </button>

      <header className="fuel-record-page__header">
        

        <div className="fuel-record-page__identity">
          <h1 className="fuel-record-page__reg">
            {vehicle?.registrationNumber || "Vehicle"}
          </h1>
          <p className="fuel-record-page__name">
            {vehicle?.brand || ""} {vehicle?.model || ""}
            {vehicle?.year ? ` · ${vehicle.year}` : ""}
          </p>

          <div className="fuel-record-page__quick-stats">
            <span className="fuel-record-page__stat">
              <span className="fuel-record-page__stat-label">Colour</span>
              <span className="fuel-record-page__stat-value">
                {vehicle?.colour ? (
                  <span className="fuel-record-page__colour">
                    <span
                      className="fuel-record-page__colour-swatch"
                      style={{
                        backgroundColor: (vehicle.colour || "").toLowerCase(),
                      }}
                    />
                    {vehicle.colour}
                  </span>
                ) : (
                  "—"
                )}
              </span>
            </span>

            <span className="fuel-record-page__stat">
              <span className="fuel-record-page__stat-label">Mileage</span>
              <span className="fuel-record-page__stat-value">
                {vehicle?.currentMileage != null
                  ? `${vehicle.currentMileage} km`
                  : "—"}
              </span>
            </span>

            <span className="fuel-record-page__stat">
              <span className="fuel-record-page__stat-label">Reg. expiry</span>
              <span className="fuel-record-page__stat-value">
                {formatDate(vehicle?.registrationExpiryDate)}
              </span>
            </span>

            <span className="fuel-record-page__stat">
              <span className="fuel-record-page__stat-label">Status</span>
              <span
                className={`fuel-record-page__badge fuel-record-page__badge--${(
                  vehicle?.status || ""
                ).toLowerCase()}`}
              >
                {vehicle?.status?.replace("_", " ") || "—"}
              </span>
            </span>
          </div>
        </div>
      </header>

      <hr className="fuel-record-page__divider" />

      <section className="fuel-record-page__section">
        <header className="fuel-record-page__section-header">
          <div>
            <h2>Fuel records</h2>
            <span className="fuel-record-page__section-count">
              {totalElements} {totalElements === 1 ? "record" : "records"}
            </span>
          </div>

          <div className="fuel-record-page__section-actions">
            <label className="fuel-record-page__filter">
              <span>From</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setPage(0);
                  setStartDate(e.target.value);
                }}
              />
            </label>

            <label className="fuel-record-page__filter">
              <span>To</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setPage(0);
                  setEndDate(e.target.value);
                }}
              />
            </label>

            {canAddFuel ? (
              <button
                type="button"
                className="fuel-record-page__add-btn"
                onClick={openAddModal}
              >
                + Add fuel record
              </button>
            ) : (
              <button
                type="button"
                className="fuel-record-page__add-btn fuel-record-page__add-btn--disabled"
                disabled
                title="You can only add fuel records to a vehicle that's currently in use"
              >
                + Add fuel record
              </button>
            )}
          </div>
        </header>

        {!canAddFuel && (
          <div className="fuel-record-page__add-hint">
            Only available for vehicles that are <strong>in use</strong>.
          </div>
        )}

        {loading && (
          <div className="fuel-record-page__state">Loading records…</div>
        )}

        {error && (
          <div className="fuel-record-page__state fuel-record-page__state--error">
            Couldn't load records: {error}
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="fuel-record-page__empty">
            <span className="fuel-record-page__empty-icon">⛽</span>
            <p>No fuel records in this date range.</p>
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <>
            <div className="fuel-record-page__table-wrapper">
              <table className="fuel-record-page__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Liters</th>
                    <th>Total cost</th>
                    <th>Mileage at refuel</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, index) => {
                    const rowNumber = page * size + index + 1;
                    return (
                      <tr key={rec.id} className="fuel-record-page__row">
                        <td>{rowNumber}</td>
                        <td>{formatDate(rec.refuelDate)}</td>
                        <td>
                          {rec.liters != null ? `${rec.liters} L` : "—"}
                        </td>
                        <td>
                          {rec.totalCost != null
                            ? Number(rec.totalCost).toFixed(2)
                            : "—"}
                        </td>
                        <td>
                          {rec.mileageAtRefuel != null
                            ? `${rec.mileageAtRefuel} km`
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="fuel-record-page__pagination">
                <button
                  type="button"
                  className="fuel-record-page__page-btn"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  ← Prev
                </button>
                <span className="fuel-record-page__page-info">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  type="button"
                  className="fuel-record-page__page-btn"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {showAddModal && (
        <div
          className="fuel-record-page__modal-overlay"
          onClick={() => !saving && setShowAddModal(false)}
        >
          <div
            className="fuel-record-page__modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="fuel-record-page__modal-header">
              <h3>Add fuel record</h3>
              <button
                type="button"
                className="fuel-record-page__modal-close"
                onClick={() => !saving && setShowAddModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="fuel-record-page__form">
              {saveError && (
                <div className="fuel-record-page__form-error">
                  ⚠️ {saveError}
                </div>
              )}

              <label className="fuel-record-page__field">
                <span>Refuel date *</span>
                <input
                  type="date"
                  name="refuelDate"
                  value={addForm.refuelDate}
                  onChange={handleAddChange}
                  required
                  disabled={saving}
                />
              </label>

              <div className="fuel-record-page__row">
                <label className="fuel-record-page__field">
                  <span>Liters *</span>
                  <input
                    type="number"
                    name="liters"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 42.5"
                    value={addForm.liters}
                    onChange={handleAddChange}
                    required
                    disabled={saving}
                  />
                </label>

                <label className="fuel-record-page__field">
                  <span>Total cost *</span>
                  <input
                    type="number"
                    name="totalCost"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 65.20"
                    value={addForm.totalCost}
                    onChange={handleAddChange}
                    required
                    disabled={saving}
                  />
                </label>
              </div>

              <label className="fuel-record-page__field">
                <span>Mileage at refuel (km) *</span>
                <input
                  type="number"
                  name="mileageAtRefuel"
                  min="0"
                  placeholder="e.g. 124500"
                  value={addForm.mileageAtRefuel}
                  onChange={handleAddChange}
                  required
                  disabled={saving}
                />
              </label>

              <div className="fuel-record-page__modal-actions">
                <button
                  type="button"
                  className="fuel-record-page__btn fuel-record-page__btn--ghost"
                  onClick={() => setShowAddModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="fuel-record-page__btn fuel-record-page__btn--primary"
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}