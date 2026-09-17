import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MapContainer, TileLayer, GeoJSON, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../style/RouteNotesMap.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

export default function RouteNotesMap({ classId, token = localStorage.getItem("userToken") }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeNoteId, setActiveNoteId] = useState(null);

  const [locationNotes, setLocationNotes] = useState([]);
  const [noteLat, setNoteLat] = useState("");
  const [noteLng, setNoteLng] = useState("");
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [noteLoading, setNoteLoading] = useState(false);

  const [roadRouteResult, setRoadRouteResult] = useState(null);
  const [routeGeomLoading, setRouteGeomLoading] = useState(false);

  // Fetch route and embedded notes
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
        if (!ignore) {
          setData(res.data);
          if (res.data?.notes) {
            setLocationNotes(res.data.notes);
          }
        }
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

  // Fallback fetch for location notes if they are on a different endpoint
  useEffect(() => {
    if (!classId) return;
    let ignore = false;

    async function fetchLocationNotes() {
      try {
        const response = await axios.get(`http://localhost:8080/route/notes/${classId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!ignore && response.data) {
          setLocationNotes(response.data);
        }
      } catch  {
        if (!ignore) {
          console.log("Notes fetched via primary route payload or endpoint unavailable.");
        }
      }
    }

    fetchLocationNotes();
    return () => {
      ignore = true;
    };
  }, [classId, token]);

  const rawWaypoints = useMemo(() => {
    if (!data?.pathGeoJson) return null;
    try {
      const geoJson = typeof data.pathGeoJson === "string" 
        ? JSON.parse(data.pathGeoJson) 
        : data.pathGeoJson;
      return geoJson.coordinates || null;
    } catch (e) {
      console.error("Error parsing GeoJSON:", e);
      return null;
    }
  }, [data]);

  const hasEnoughWaypoints = !!rawWaypoints && rawWaypoints.length >= 2;

  // OSRM Road Snapping Hook
  useEffect(() => {
    if (!hasEnoughWaypoints) return;
    let ignore = false;

    async function fetchRoadRoute() {
      setRouteGeomLoading(true);
      try {
        const coordsParam = rawWaypoints.map(([lng, lat]) => `${lng},${lat}`).join(";");
        const url = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=geojson`;
        const response = await axios.get(url);

        if (ignore) return;

        if (response.data?.code !== "Ok" || !response.data?.routes?.length) {
          return;
        }

        setRoadRouteResult({ routeId: data?.id, geometry: response.data.routes[0].geometry });
      } catch (error) {
        if (!ignore) {
          console.error("Error fetching road route:", error);
        }
      } finally {
        if (!ignore) setRouteGeomLoading(false);
      }
    }

    fetchRoadRoute();
    return () => {
      ignore = true;
    };
  }, [hasEnoughWaypoints, rawWaypoints, data?.id]);

  const effectiveRoadRoute =
    hasEnoughWaypoints && roadRouteResult?.routeId === data?.id
      ? roadRouteResult?.geometry
      : null;

  const mapCenter = useMemo(() => {
    if (rawWaypoints && rawWaypoints.length > 0) {
      const [lng, lat] = rawWaypoints[0];
      return [lat, lng];
    }
    if (locationNotes.length > 0) {
      return [locationNotes[0].latitude, locationNotes[0].longitude];
    }
    return [45.2395, 19.8512];
  }, [rawWaypoints, locationNotes]);

  const mapZoom = rawWaypoints ? 14 : 13;
  const activeNote = locationNotes.find((n) => n.id === activeNoteId) || null;

  const handleMapClick = (lat, lng) => {
    setNoteLat(lat.toString());
    setNoteLng(lng.toString());
    setSelectedLocation({ lat, lng });
    setShowNoteInput(true);
  };

  const addLocationNote = async () => {
    if (!noteLat || !noteLng || !noteText.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setNoteLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/route/leaveNote",
        {
          classId: classId,
          latitude: parseFloat(noteLat),
          longitude: parseFloat(noteLng),
          note: noteText.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLocationNotes([...locationNotes, response.data]);
      setNoteLat("");
      setNoteLng("");
      setNoteText("");
      setSelectedLocation(null);
      setShowNoteInput(false);
    } catch (error) {
      console.error("Error adding note:", error);
      alert("Failed to add note");
    } finally {
      setNoteLoading(false);
    }
  };


  const renderRouteOnMap = () => {
    if (!data?.pathGeoJson) return null;

    if (effectiveRoadRoute) {
      return <GeoJSON key={`road-${data.id}`} data={effectiveRoadRoute} style={{ color: "#d6fb4f", weight: 4 }} />;
    }

    try {
      const geoJson = typeof data.pathGeoJson === "string" ? JSON.parse(data.pathGeoJson) : data.pathGeoJson;
      return <GeoJSON key={`straight-${data.id}`} data={geoJson} style={{ color: "#d6fb4f", weight: 4, dashArray: "6,6" }} />;
    } catch {
      return null;
    }
  };

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

  return (
    <section className="route-notes-map">
      <header className="route-notes-map__header">
        <div>
          <h2 className="route-notes-map__title">
            {data?.routeName || "Route & Location Notes"}
          </h2>
          <span className="route-notes-map__meta">
            {routeGeomLoading
              ? "Snapping to roads..."
              : effectiveRoadRoute
              ? "Road route active"
              : "Straight line route"} · {locationNotes.length} {locationNotes.length === 1 ? "note" : "notes"}
          </span>
        </div>
      </header>

      <div className="route-notes-map__wrapper">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="route-notes-map__canvas interactive-map"
          style={{ height: "380px", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {renderRouteOnMap()}

          {selectedLocation && (
            <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={noteIcon} />
          )}

          {locationNotes.map((note) => (
            <Marker
              key={note.id}
              position={[note.latitude, note.longitude]}
              icon={note.id === activeNoteId ? activeNoteIcon : noteIcon}
              eventHandlers={{
                click: () => setActiveNoteId(note.id),
              }}
            />
          ))}
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>
      </div>

      {showNoteInput && (
        <div className="route-notes-map__note-input-section">
          <h4>Add Location Note</h4>
          <div className="route-notes-map__note-input-row">
            <input
              type="text"
              placeholder="Latitude"
              value={noteLat}
              readOnly
              className="route-notes-map__note-coord-input"
            />
            <input
              type="text"
              placeholder="Longitude"
              value={noteLng}
              readOnly
              className="route-notes-map__note-coord-input"
            />
          </div>
          <textarea
            placeholder="Enter note for this location..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows="2"
            className="route-notes-map__note-textarea"
          />
          <div className="route-notes-map__note-actions">
            <button
              className="route-notes-map__save-btn"
              onClick={addLocationNote}
              disabled={noteLoading}
            >
              {noteLoading ? "Saving..." : "Save Note"}
            </button>
            <button
              className="route-notes-map__cancel-btn"
              onClick={() => {
                setShowNoteInput(false);
                setSelectedLocation(null);
                setNoteLat("");
                setNoteLng("");
                setNoteText("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
            📍 {activeNote.latitude.toFixed(6)}, {activeNote.longitude.toFixed(6)}
          </p>
       
        </div>
      )}
    </section>
  );
}