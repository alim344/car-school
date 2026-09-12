import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../style/RouteNotesMap.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const noteIcon = L.divIcon({
  className: "route-note-marker",
  html: `<div class="route-note-marker__inner">📍</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
});

const activeNoteIcon = L.divIcon({
  className: "route-note-marker route-note-marker--active",
  html: `<div class="route-note-marker__inner">📍</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function RouteNotesMap({ classId }) {
  const token = localStorage.getItem("userToken");

  const [data, setData] = useState(null);       
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);

 
  useEffect(() => {
    if (!classId) return;
    let ignore = false;

    async function fetchRoute() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `http://localhost:8080/practical-class/route/${classId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!ignore) setData(res.data);
      } catch (err) {
        if (!ignore) {
          console.error("Error fetching route:", err);
          setError(err.message || "Failed to load route.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchRoute();
    return () => {
      ignore = true;
    };
  }, [classId, token]);


  const notes = useMemo(() => data?.notes || [], [data]);

  const parsedGeoJson = useMemo(() => {
    if (!data?.pathGeoJson) return null;
    try {
      return typeof data.pathGeoJson === "string"
        ? JSON.parse(data.pathGeoJson)
        : data.pathGeoJson;
    } catch (e) {
      console.error("Invalid GeoJSON:", e);
      return null;
    }
  }, [data]);

  const mapCenter = useMemo(() => {
    if (parsedGeoJson?.coordinates?.length) {
      const [lng, lat] = parsedGeoJson.coordinates[0];
      return [lat, lng];
    }
    if (notes.length > 0) {
      return [notes[0].latitude, notes[0].longitude];
    }
    return [45.2395, 19.8512];
  }, [parsedGeoJson, notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || null;


  if (loading) {
    return (
      <section className="route-notes-map">
        <div className="route-notes-map__state">Loading route…</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="route-notes-map">
        <div className="route-notes-map__state route-notes-map__state--error">
          Couldn't load route: {error}
        </div>
      </section>
    );
  }

  const hasRoute = !!parsedGeoJson;
  const hasNotes = notes.length > 0;

  if (!hasRoute && !hasNotes) {
    return (
      <section className="route-notes-map">
        <div className="route-notes-map__state">
          No route or notes were recorded for this class.
        </div>
      </section>
    );
  }

 
  return (
    <section className="route-notes-map">
      <header className="route-notes-map__header">
        <div>
          <h2 className="route-notes-map__title">
            {data?.routeName || "Route"}
          </h2>
          <span className="route-notes-map__meta">
            {hasRoute ? "Route drawn" : "No route"} ·{" "}
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </span>
        </div>
      </header>

      <div className="route-notes-map__wrapper">
        <MapContainer
          center={mapCenter}
          zoom={14}
          className="route-notes-map__canvas"
          style={{ height: "380px", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

       
          {hasRoute && (
            <GeoJSON
              key={`route-${classId}`}
              data={parsedGeoJson}
              style={{ color: "#d6fb4f", weight: 4 }}
            />
          )}

       
          {notes.map((note) => (
            <Marker
              key={note.id}
              position={[note.latitude, note.longitude]}
              icon={note.id === activeNoteId ? activeNoteIcon : noteIcon}
              eventHandlers={{
                click: () => setActiveNoteId(note.id),
              }}
            />
          ))}
        </MapContainer>

        {!hasRoute && (
          <div className="route-notes-map__route-missing">
            No route was recorded — showing notes only.
          </div>
        )}
      </div>

  
      {activeNote && (
        <div className="route-notes-map__note">
          <div className="route-notes-map__note-header">
            <span className="route-notes-map__note-badge">Note</span>
            <button
              type="button"
              className="route-notes-map__note-close"
              onClick={() => setActiveNoteId(null)}
              aria-label="Close note"
            >
              ×
            </button>
          </div>
          <p className="route-notes-map__note-body">{activeNote.note}</p>
          <p className="route-notes-map__note-coords">
            📍 {activeNote.latitude.toFixed(6)},{" "}
            {activeNote.longitude.toFixed(6)}
          </p>
        </div>
      )}

   
      {hasNotes && !activeNote && (
        <div className="route-notes-map__hint">
          Click a pin to see the note.
        </div>
      )}
    </section>
  );
}