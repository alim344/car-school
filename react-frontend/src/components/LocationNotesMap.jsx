import { useState, useEffect,useMemo } from "react";
import axios from "axios";
import { MapContainer, TileLayer, GeoJSON, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import '../style/LocationNotesMap.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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

function LocationNoteItem({ note, onDelete }) {
  return (
    <div className="location-note-item">
      <div className="note-content">
        <div className="note-coords">
          📍 {note.latitude.toFixed(6)}, {note.longitude.toFixed(6)}
        </div>
        <div className="note-text">{note.note}</div>
        <div className="note-time">{new Date(note.createdAt).toLocaleString()}</div>
      </div>
      <button className="delete-note-btn" onClick={() => onDelete(note.id)}>
        ✕
      </button>
    </div>
  );
}

export default function LocationNotes({ 
  classId, 
  route, 
  token = localStorage.getItem("userToken")
}) {
  const [locationNotes, setLocationNotes] = useState([]);
  const [noteLat, setNoteLat] = useState("");
  const [noteLng, setNoteLng] = useState("");
  const [noteText, setNoteText] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteLoading, setNoteLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [roadRouteResult, setRoadRouteResult] = useState(null); 
  const [routeGeomLoading, setRouteGeomLoading] = useState(false);
  const [routeGeomError, setRouteGeomError] = useState(null);


  const rawWaypoints = useMemo(() => {
    if (!route?.pathGeoJson) return null;
    try {
      const geoJson = JSON.parse(route.pathGeoJson);
      return geoJson.coordinates || null;
    } catch (e) {
      console.error("Error parsing GeoJSON:", e);
      return null;
    }
  }, [route]);




  const hasEnoughWaypoints = !!rawWaypoints && rawWaypoints.length >= 2;

  
useEffect(() => {
  if (!hasEnoughWaypoints) return; 

  let ignore = false;

  async function fetchRoadRoute() {
    setRouteGeomLoading(true);
    setRouteGeomError(null);
    try {
      const coordsParam = rawWaypoints.map(([lng, lat]) => `${lng},${lat}`).join(";");
      const url = `https://router.project-osrm.org/route/v1/driving/${coordsParam}?overview=full&geometries=geojson`;
      const response = await axios.get(url);

      
      if (ignore) return;

      if (response.data?.code !== "Ok" || !response.data?.routes?.length) {
        setRouteGeomError(response.data?.message || "No route geometry returned");
        return;
      }

      setRoadRouteResult({ routeId: route?.id, geometry: response.data.routes[0].geometry });
    } catch (error) {
      if (!ignore) {
        console.error("Error fetching road route:", error);
        setRouteGeomError(error.message || "Failed to fetch route");
      }
    } finally {
      if (!ignore) setRouteGeomLoading(false);
    }
  }

  fetchRoadRoute();
  return () => { ignore = true; };
}, [hasEnoughWaypoints, rawWaypoints, route?.id]);

const effectiveRoadRoute =
  hasEnoughWaypoints && roadRouteResult?.routeId === route?.id
    ? roadRouteResult.geometry
    : null;


 useEffect(() => {
    if (!classId) return;

    let ignore = false;

    async function fetchLocationNotes() {
        setLoadingNotes(true);
        try {
            const response = await axios.get(`http://localhost:8080/route/notes/${classId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!ignore) {
                setLocationNotes(response.data);
            }
        } catch (error) {
            if (!ignore) {
                console.error("Error fetching location notes:", error);
            }
        } finally {
            if (!ignore) {
                setLoadingNotes(false);
            }
        }
    }

    fetchLocationNotes();

    return () => {
        ignore = true;
    };
}, [classId, token]);

 
const mapCenter = useMemo(() => {
    if (route?.pathGeoJson) {
      try {
        const geoJson = JSON.parse(route.pathGeoJson);
        if (geoJson.coordinates && geoJson.coordinates.length > 0) {
          const coords = geoJson.coordinates[0];
          return [coords[1], coords[0]];
        }
      } catch (e) {
        console.error("Error parsing GeoJSON:", e);
      }
    }
    return [45.2395, 19.8512]; 
}, [route]);

const mapZoom = route?.pathGeoJson ? 14 : 13;
 

 
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

  const deleteLocationNote = async (noteId) => {
    try {
      await axios.delete(`http://localhost:8080/route/note/delete/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocationNotes(locationNotes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
      alert("Failed to delete note");
    }
  };

  const renderRouteOnMap = () => {
    if (!route?.pathGeoJson) return null;

    if (effectiveRoadRoute) {
      return <GeoJSON key={`road-${route.id}`}   data={effectiveRoadRoute} style={{ color: "#d6fb4f", weight: 4 }} />;
    }

    try {
      const geoJson = JSON.parse(route.pathGeoJson);
      return <GeoJSON key={`straight-${route.id}`} data={geoJson} style={{ color: "#d6fb4f", weight: 4, dashArray: "6,6" }} />;
    } catch {
      return null;
    }
  };

  return (
    <div className="location-notes-container">
      <div className="map-section">
        <div className="map-header">
          <h3> LOCATION NOTES</h3>
          <span className="map-instruction">
  {routeGeomLoading
    ? "Loading route..."
    : routeGeomError
    ? `Route error: ${routeGeomError}`
    : "Click on map to add a note"}
</span>
        </div>
        
        <div className="map-wrapper">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            className="interactive-map"
            style={{ height: "350px", width: "100%", borderRadius: "12px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {renderRouteOnMap()}
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
            )}
            {locationNotes.map((note) => (
              <Marker 
                key={note.id} 
                position={[note.latitude, note.longitude]}
                icon={L.divIcon({
                  className: 'note-marker',
                  html: '📍',
                  iconSize: [25, 25],
                })}
              />
            ))}
            <MapClickHandler onMapClick={handleMapClick} />
          </MapContainer>
        </div>

      
        {showNoteInput && (
          <div className="note-input-section">
            <h4>Add Location Note</h4>
            <div className="note-input-row">
              <input
                type="text"
                placeholder="Latitude"
                value={noteLat}
                readOnly
                className="note-coord-input"
              />
              <input
                type="text"
                placeholder="Longitude"
                value={noteLng}
                readOnly
                className="note-coord-input"
              />
            </div>
            <textarea
              placeholder="Enter note for this location..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows="2"
              className="note-textarea"
            />
            <div className="note-actions">
              <button
                className="save-note-btn"
                onClick={addLocationNote}
                disabled={noteLoading}
              >
                {noteLoading ? "Saving..." : " Save Note"}
              </button>
              <button
                className="cancel-note-btn"
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

        <div className="location-notes-list">
          {loadingNotes ? (
            <div className="loading-notes">Loading notes...</div>
          ) : locationNotes.length > 0 ? (
            <>
              <h4>Saved Notes ({locationNotes.length})</h4>
              {locationNotes.map((note) => (
                <LocationNoteItem
                  key={note.id}
                  note={note}
                  onDelete={deleteLocationNote}
                />
              ))}
            </>
          ) : (
            <div className="no-notes-message">
               No location notes yet. Click on the map to add one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}