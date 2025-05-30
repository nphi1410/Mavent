import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapGuide = () => {
  const locationName = "21.013221321252136, 105.52370094691307";
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const coords = locationName
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    if (coords.length === 2 && !coords.some(isNaN)) {
      setPosition({ lat: coords[0], lon: coords[1] });
    } else {
      console.error("Invalid coordinates");
    }
  }, []);

  return (
    <section className="w-full max-w-2xl px-4 md:px-6 text-gray-900">
      <div className="mb-6 border-b border-gray-300 pb-3">
        <h2 className="text-4xl font-bold tracking-tight">📍 Event Location</h2>
      </div>

      <div className="relative w-full h-96 overflow-hidden rounded-2xl ring-1 ring-gray-200 shadow-md">
        {position ? (
          <MapContainer
            center={[position.lat, position.lon]}
            zoom={20}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[position.lat, position.lon]}>
              <Popup>Gamma Building</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 font-medium text-lg">
            Loading map...
          </div>
        )}
      </div>

      <div className="mt-6 px-5 py-4 bg-white border border-gray-200 rounded-xl shadow-sm text-center text-gray-800 font-semibold text-lg">
        Tầng 5, hội trường tòa nhà Gamma - FPT University, Hòa Lạc, Hà Nội
      </div>
    </section>
  );
};

export default MapGuide;
