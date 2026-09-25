import React, { useEffect, useRef, useState } from 'react';
import { FlowerEntry } from '../types/flower';
import { Layers, Flame, MapPin, Eye, Plus, Sparkles, Navigation } from 'lucide-react';
import { CAMPUS_CAMPUS_LOCATIONS } from '../data/flowerConstants';

// We access Leaflet via the global L loaded via CDN in index.html to avoid bundler asset path quirks
declare const L: any;

interface InteractiveCampusMapProps {
  flowers: FlowerEntry[];
  selectedCategory: string;
  selectedLocation: string;
  onMapClickCoordinates: (lat: number, lng: number, suggestedLocation: string) => void;
  onSelectFlower: (flower: FlowerEntry) => void;
}

export const InteractiveCampusMap: React.FC<InteractiveCampusMapProps> = ({
  flowers,
  selectedCategory,
  selectedLocation,
  onMapClickCoordinates,
  onSelectFlower,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const heatLayerRef = useRef<any>(null);

  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showMarkers, setShowMarkers] = useState<boolean>(true);
  const [clickPin, setClickPin] = useState<{ lat: number; lng: number; location: string } | null>(null);

  // Default campus center coordinates (lush green university campus coordinates)
  const defaultCenter = [10.6018, 76.1534];

  // Helper to find nearest campus landmark name based on lat/lng distance
  const getNearestCampusLocation = (lat: number, lng: number): string => {
    let closestName = 'Campus Garden Lawn';
    let minDistance = Infinity;

    CAMPUS_CAMPUS_LOCATIONS.forEach((loc) => {
      const dist = Math.hypot(loc.lat - lat, loc.lng - lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestName = loc.name;
      }
    });

    return closestName;
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;
    if (typeof L === 'undefined') return;

    // Create Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 17,
      minZoom: 15,
      maxZoom: 19,
      zoomControl: false,
    });

    // Add aesthetic light tile layer (CartoDB Positron / OSM clean)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors & CartoDB',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Marker cluster or feature group layer
    const markersGroup = L.featureGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // Click handler to capture exact coordinates
    map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      const nearest = getNearestCampusLocation(lat, lng);
      setClickPin({ lat, lng, location: nearest });
      onMapClickCoordinates(lat, lng, nearest);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers & Heatmap when flowers or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || typeof L === 'undefined') return;
    const map = mapInstanceRef.current;

    // 1. Filter flowers based on user selection
    const filteredFlowers = flowers.filter((f) => {
      const matchCat = selectedCategory === 'all' || f.category === selectedCategory;
      const matchLoc = selectedLocation === 'all' || f.locationName === selectedLocation;
      return matchCat && matchLoc;
    });

    // 2. Render Flower Custom Icon Markers
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();

      if (showMarkers) {
        filteredFlowers.forEach((flower) => {
          const emoji = flower.category === 'Hibiscus' ? '🌺'
            : flower.category === 'Bougainvillea' ? '🌸'
            : flower.category === 'Marigold' ? '🌼'
            : flower.category === 'Frangipani' ? '🤍'
            : flower.category === 'Rose' ? '🌹'
            : flower.category === 'Sunflower' ? '🌻'
            : '🌿';

          // Custom aesthetic Gen Z pill marker
          const customHtml = `
            <div class="flower-marker group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 border-2 border-emerald-400 shadow-md hover:scale-110 transition-transform cursor-pointer backdrop-blur-xs">
              <span class="text-sm select-none">${emoji}</span>
              <span class="text-[11px] font-bold text-stone-800 tracking-tight font-mono">${flower.count}</span>
            </div>
          `;

          const customIcon = L.divIcon({
            html: customHtml,
            className: 'custom-flower-div-icon',
            iconSize: [60, 28],
            iconAnchor: [30, 14],
          });

          const marker = L.marker([flower.lat, flower.lng], { icon: customIcon });

          // Popup content
          const popupContent = `
            <div class="p-2 space-y-1.5 font-sans min-w-[160px]">
              <div class="flex items-center justify-between gap-2">
                <span class="text-xs font-bold text-emerald-800">${flower.name}</span>
                <span class="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full font-semibold">${flower.count} spotted</span>
              </div>
              <p class="text-[11px] text-stone-600 font-medium">📍 ${flower.locationName}</p>
              ${flower.notes ? `<p class="text-[10px] text-stone-500 italic">"${flower.notes}"</p>` : ''}
              <div class="pt-1 text-[10px] text-stone-400 border-t border-stone-100 flex items-center justify-between">
                <span>By ${flower.userName}</span>
                <span class="text-emerald-600 font-semibold cursor-pointer">Click for details →</span>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent, { offset: [0, -10] });

          marker.on('click', () => {
            onSelectFlower(flower);
          });

          markersLayerRef.current.addLayer(marker);
        });
      }
    }

    // 3. Render Leaflet Heatmap Layer
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (showHeatmap && L.heatLayer) {
      // Points format: [lat, lng, intensity]
      const heatPoints = filteredFlowers.map((f) => [
        f.lat,
        f.lng,
        Math.min(f.count / 15, 1.0), // intensity normalized
      ]);

      if (heatPoints.length > 0) {
        heatLayerRef.current = L.heatLayer(heatPoints, {
          radius: 35,
          blur: 24,
          maxZoom: 18,
          max: 1.0,
          gradient: {
            0.2: '#86efac', // soft mint green
            0.5: '#fde047', // sunny yellow
            0.7: '#f472b6', // pastel pink
            1.0: '#f43f5e', // coral floral red
          },
        }).addTo(map);
      }
    }
  }, [flowers, selectedCategory, selectedLocation, showHeatmap, showMarkers]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(defaultCenter, 17, { animate: true });
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-emerald-100 bg-emerald-50/20 shadow-sm">
      {/* Floating Map Controls Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Badge: Campus Info */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-200/60 shadow-xs flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-stone-800">Campus Live Floral Cartography</span>
          <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">| Click map to place sighting</span>
        </div>

        {/* Right Action Chips: Heatmap Toggle & Markers Toggle */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/90 backdrop-blur-md p-1 rounded-full border border-emerald-200/60 shadow-xs">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              showHeatmap
                ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-rose-500' : 'text-stone-400'}`} />
            <span>Heatmap {showHeatmap ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              showMarkers
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapPin className={`w-3.5 h-3.5 ${showMarkers ? 'text-emerald-600' : 'text-stone-400'}`} />
            <span>Pins ({flowers.length})</span>
          </button>

          <button
            onClick={handleResetView}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Recenter campus"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Map DOM Canvas */}
      <div
        ref={mapContainerRef}
        className="w-full h-[460px] sm:h-[520px] bg-emerald-50/40 z-0"
        style={{ cursor: 'crosshair' }}
      />

      {/* Interactive Helper Banner Bottom */}
      <div className="p-3 bg-white/95 border-t border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="text-base">🌸</span>
          <span>
            {clickPin ? (
              <span>
                Selected location: <strong className="text-emerald-800">{clickPin.location}</strong> ({clickPin.lat.toFixed(4)}, {clickPin.lng.toFixed(4)})
              </span>
            ) : (
              <span>Click anywhere on campus to immediately geotag a new flower bloom!</span>
            )}
          </span>
        </div>

        {/* Heatmap intensity legend */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-stone-500">
          <span>Density:</span>
          <div className="w-24 h-2 rounded-full bg-gradient-to-r from-emerald-300 via-amber-300 to-rose-500" />
          <span>High Floral Glow</span>
        </div>
      </div>
    </div>
  );
};
