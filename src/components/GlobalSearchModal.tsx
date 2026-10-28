import React, { useState, useEffect, useRef } from 'react';
import { RTLHEntry } from '../types/rtlh';
import { maskIdentity } from '../utils/privacyMask';
import { Search, X, Home, MapPin, ArrowRight, User, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: RTLHEntry[];
  onSelectEntry: (entry: RTLHEntry) => void;
  isSuperAdmin?: boolean;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  data,
  onSelectEntry,
  isSuperAdmin = true,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? data.filter(d => 
        d.namaKK.toLowerCase().includes(query.toLowerCase()) ||
        d.nik.includes(query) ||
        d.noKK.includes(query) ||
        d.kecamatan.toLowerCase().includes(query.toLowerCase()) ||
        d.desaKelurahan.toLowerCase().includes(query.toLowerCase()) ||
        (d.keteranganFisik && d.keteranganFisik.toLowerCase().includes(query.toLowerCase()))
      )
    : data.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cari data penerima berdasarkan Nama KK, NIK, Desa, atau Kecamatan..."
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-xs">
              Tidak ada data calon penerima yang cocok dengan pencarian "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {query.trim() ? `Hasil Pencarian (${results.length})` : 'Data Terkini'}
              </div>
              {results.map(entry => (
                <div
                  key={entry.id}
                  onClick={() => {
                    onSelectEntry(entry);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition border border-transparent hover:border-slate-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                      {entry.fotoDepan ? (
                        <img src={entry.fotoDepan} alt="" className="w-full h-full object-cover" />
                      ) : (
                        entry.namaKK.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 group-hover:text-blue-700 transition">
                          {entry.namaKK}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          NIK: {maskIdentity(entry.nik, isSuperAdmin)}
                          {!isSuperAdmin && <Lock className="w-2.5 h-2.5 text-amber-500 inline" />}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {entry.desaKelurahan}, Kec. {entry.kecamatan}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-slate-600">{entry.sumberDana || 'BSPS KemenPKP'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                      entry.statusBantuan === 'Bantuan Selesai' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : entry.statusBantuan === 'Calon Penerima (Masuk SK)'
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : entry.statusBantuan === 'Terverifikasi Lapangan'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {entry.statusBantuan === 'Terverifikasi Lapangan' ? 'Tahap Verifikasi' : entry.statusBantuan === 'Calon Penerima (Masuk SK)' ? 'Masuk SK' : entry.statusBantuan === 'Bantuan Selesai' ? 'Selesai' : 'Usulan Baru'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Pilih baris untuk membuka detail dan dokumen foto RTLH</span>
          <button
            onClick={onClose}
            className="hover:underline text-slate-600 font-medium"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
