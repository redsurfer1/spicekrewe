import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons when using bundlers (Vite/webpack)
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MAP_CENTER: [number, number] = [35.1495, -90.0490]; // Memphis, TN
const ZOOM = 13;

const SPICE_KREWE_LOCATIONS = [
  {
    id: 'hq',
    name: 'Spice Krewe HQ',
    position: [35.1462, -90.0528] as [number, number],
    address: '123 S Main St, Memphis, TN 38107',
    details: 'Flagship store & kitchen. Browse our full spice lineup and join in-store tastings.',
    hours: 'Mon–Sat 10am–6pm',
  },
  {
    id: 'market',
    name: 'Memphis Market Stall',
    position: [35.1425, -90.0562] as [number, number],
    address: '500 S Front St, Memphis, TN 38107',
    details: 'Fresh spices at the market. Pick up Cajun, Creole, and seasonal blends.',
    hours: 'Wed–Sun 8am–4pm',
  },
  {
    id: 'warehouse',
    name: 'Warehouse District',
    position: [35.1180, -90.0400] as [number, number],
    address: '800 E Carolina Ave, Memphis, TN 38126',
    details: 'Wholesale & events. Large orders and private tastings by appointment.',
    hours: 'By appointment',
  },
];

export default function KreweMap() {
  return (
    <div className="w-full rounded-sk-md overflow-hidden border border-sk-card-border shadow-md">
      <div className="h-[400px] w-full">
        <MapContainer
          center={MAP_CENTER}
          zoom={ZOOM}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {SPICE_KREWE_LOCATIONS.map((loc) => (
            <Marker key={loc.id} position={loc.position}>
              <Popup>
                <div className="min-w-[200px] text-left">
                  <h3 className="font-semibold text-stone-900">{loc.name}</h3>
                  <p className="text-sm text-stone-600 mt-1">{loc.address}</p>
                  <p className="text-sm text-stone-700 mt-2">{loc.details}</p>
                  <p className="text-xs text-stone-500 mt-2">{loc.hours}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
