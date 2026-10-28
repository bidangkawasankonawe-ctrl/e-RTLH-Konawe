import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RTLHEntry, KerusakanLevel } from '../types/rtlh';
import { KONAWE_KECAMATAN } from '../data/sampleKonaweData';
import { Filter, Layers, MapPin, ZoomIn, Info } from 'lucide-react';

interface MapViewProps {
  data: RTLHEntry[];
  onSelectEntry: (entry: RTLHEntry) => void;
  onOpenVerification: (entry: RTLHEntry) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  data,
  onSelectEntry,
  onOpenVerification,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filterKecamatan, setFilterKecamatan] = useState('Semua Kecamatan');
  const [filterKerusakan, setFilterKerusakan] = useState('Semua Kategori');

  // Konawe District Approximate Coordinates for Quick Fly-To
  const KECAMATAN_COORDS: Record<string, [number, number]> = {
    'Semua Kecamatan': [-3.94, 122.08],
    'Unaaha': [-3.9772, 122.0543],
    'Wawotobi': [-3.9054, 122.1287],
    'Pondidaha': [-3.9312, 122.1856],
    'Sampara': [-3.9458, 122.3121],
    'Tongauna': [-3.8824, 121.9876],
    'Abuki': [-3.9621, 121.9124],
    'Lambuya': [-3.9982, 122.1154],
    'Besulutu': [-3.9892, 122.2541],
    'Soropia': [-3.9015, 122.6105],
    'Morosi': [-3.8741, 122.4215],
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-3.94, 122.08],
        zoom: 10,
        scrollWheelZoom: true,
      });

      // CartoDB Voyager / OpenStreetMap standard tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Pemkab Konawe',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      // Map stays preserved
    };
  }, []);

  // Update Markers when data or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const filtered = data.filter((item) => {
      const matchKec = filterKecamatan === 'Semua Kecamatan' || item.kecamatan === filterKecamatan;
      const matchKer = filterKerusakan === 'Semua Kategori' || item.tingkatKerusakan === filterKerusakan;
      return matchKec && matchKer;
    });

    const bounds: [number, number][] = [];

    filtered.forEach((item) => {
      if (!item.latitude || !item.longitude) return;

      bounds.push([item.latitude, item.longitude]);

      // Pin Color based on damage
      let pinColor = '#ef4444'; // Red for Rusak Berat
      if (item.tingkatKerusakan === 'Rusak Sedang') pinColor = '#f59e0b'; // Amber
      if (item.tingkatKerusakan === 'Rusak Ringan') pinColor = '#3b82f6'; // Blue
      if (item.tingkatKerusakan === 'Layak Huni') pinColor = '#10b981'; // Green

      const customIcon = L.divIcon({
        className: 'custom-rtlh-pin',
        html: `
          <div style="
            background-color: ${pinColor};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            cursor: pointer;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-size: 10px;
              font-weight: 800;
              font-family: monospace;
            ">${item.skorKerusakan}</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const marker = L.marker([item.latitude, item.longitude], { icon: customIcon });

      // Popup Content
      const popupHtml = `
        <div style="font-family: inherit; width: 230px;">
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">
            ${item.namaKK}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            📍 ${item.desaKelurahan}, Kec. ${item.kecamatan}
          </div>
          ${
            item.fotoDepan
              ? `<img src="${item.fotoDepan}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />`
              : ''
          }
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="
              background: ${item.tingkatKerusakan === 'Rusak Berat' ? '#fee2e2' : item.tingkatKerusakan === 'Rusak Sedang' ? '#fef3c7' : '#e0e7ff'};
              color: ${item.tingkatKerusakan === 'Rusak Berat' ? '#991b1b' : item.tingkatKerusakan === 'Rusak Sedang' ? '#92400e' : '#3730a3'};
              font-size: 10px;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 4px;
            ">${item.tingkatKerusakan}</span>
            <span style="font-size: 11px; font-weight: 800; color: #334155;">Skor: ${item.skorKerusakan}/100</span>
          </div>
          <div style="font-size: 10px; color: #475569; margin-bottom: 8px; background: #f8fafc; padding: 6px; border-radius: 6px;">
            <strong>Atap:</strong> ${item.kondisiFisik.atap}<br/>
            <strong>Dinding:</strong> ${item.kondisiFisik.dinding}
          </div>
          <div style="font-size: 10px; color: #0284c7; font-weight: 600; margin-bottom: 8px;">
            Status: ${item.statusBantuan} (${item.sumberDana})
          </div>
          <button id="btn-popup-${item.id}" style="
            width: 100%;
            background: #059669;
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
          ">
            📄 Lihat Detail / Cetak Verifikasi
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${item.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectEntry(item);
          };
        }
      });

      markersGroup.addLayer(marker);
    });

    // Auto fit bounds if coordinates exist and not zoomed to a specific district
    if (filterKecamatan === 'Semua Kecamatan' && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [data, filterKecamatan, filterKerusakan, onSelectEntry]);

  // Handle District Fly-To
  const handleKecamatanChange = (kec: string) => {
    setFilterKecamatan(kec);
    const coords = KECAMATAN_COORDS[kec];
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, kec === 'Semua Kecamatan' ? 10 : 13, {
        duration: 1.2,
      });
    }
  };

  return (
    <div className="space-y-3">
      
      {/* Map Control Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-800 border border-blue-200/60 shadow-2xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">
              Geospasial GIS Sebaran RTLH Kab. Konawe
            </h3>
            <p className="text-[11px] text-slate-500">
              Titik koordinat survei lapangan By Name By Address (BNBA)
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Kecamatan Zoom Selector */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Fokus Wilayah:</span>
            <select
              value={filterKecamatan}
              onChange={(e) => handleKecamatanChange(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {KONAWE_KECAMATAN.map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>

          {/* Kerusakan Filter */}
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="text-slate-500 font-medium">Tingkat Kerusakan:</span>
            <select
              value={filterKerusakan}
              onChange={(e) => setFilterKerusakan(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Semua Kategori">Semua Kategori</option>
              <option value="Rusak Berat">Rusak Berat (Merah)</option>
              <option value="Rusak Sedang">Rusak Sedang (Kuning)</option>
              <option value="Rusak Ringan">Rusak Ringan (Biru)</option>
              <option value="Layak Huni">Layak Huni (Hijau)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-[580px] sm:h-[640px]">
        
        {/* Leaflet Mount */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Map Legend */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1.5">
          <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
            Indikator Tingkat Kerusakan:
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-white shadow-sm" />
            <span className="text-slate-700 font-medium">Rusak Berat (Skor ≥ 70)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-white shadow-sm" />
            <span className="text-slate-700 font-medium">Rusak Sedang (Skor 45 - 69)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3.5 h-3.5 rounded-full bg-blue-500 border border-white shadow-sm" />
            <span className="text-slate-700 font-medium">Rusak Ringan (Skor 25 - 44)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white shadow-sm" />
            <span className="text-slate-700 font-medium">Layak Huni (&lt; 25)</span>
          </div>
        </div>

        {/* Hint Badge */}
        <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur-md text-white text-[11px] px-3 py-1.5 rounded-lg border border-slate-700 shadow-md flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-400" />
          <span>Klik pin untuk melihat foto rumah & informasi calon penerima</span>
        </div>

      </div>

    </div>
  );
};
