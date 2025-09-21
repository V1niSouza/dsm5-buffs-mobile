import React, { useRef } from 'react';
import { View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useCurrentLocation } from '../../hooks/useCurrentLocation';

interface MapLeafletProps {
  piqueteCoords: { latitude: number; longitude: number }[];
}

export const MapLeaflet: React.FC<MapLeafletProps> = ({ piqueteCoords }) => {
  const webviewRef = useRef<WebView>(null);
  const currentLocation = useCurrentLocation(); // <-- usa o hook

  const coordsJS = piqueteCoords.map(c => `[${c.latitude}, ${c.longitude}]`).join(',');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <style>
          #map { height: 100%; width: 100%; }
          html, body { margin: 0; height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${currentLocation ? currentLocation.latitude : -24.497}, ${currentLocation ? currentLocation.longitude : -47.842}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);

          const coords = [${coordsJS}];
          const polygon = L.polygon(coords, { color: 'orange', fillOpacity: 0.3 }).addTo(map);
          coords.forEach(c => L.marker(c).addTo(map));

          ${currentLocation ? `L.marker([${currentLocation.latitude}, ${currentLocation.longitude}]).addTo(map).bindPopup("Você está aqui").openPopup();` : ''}
        </script>
      </body>
    </html>
  `;

  return <WebView ref={webviewRef} originWhitelist={['*']} source={{ html }} style={{ height: 400, width: '100%' }} />;
};
