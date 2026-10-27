import React, { useState } from 'react';
import { X, ExternalLink, RefreshCw, FileText, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface GoogleFormEmbedModalProps {
  formUrl: string;
  onUpdateFormUrl: (url: string) => void;
  onTriggerSync: () => void;
  onClose: () => void;
}

export const GoogleFormEmbedModal: React.FC<GoogleFormEmbedModalProps> = ({
  formUrl,
  onUpdateFormUrl,
  onTriggerSync,
  onClose,
}) => {
  const [tempUrl, setTempUrl] = useState(formUrl);
  const [isEditing, setIsEditing] = useState(!formUrl);

  const handleSave = () => {
    onUpdateFormUrl(tempUrl);
    setIsEditing(false);
  };

  const getEmbeddableUrl = (raw: string) => {
    if (!raw) return '';
    let url = raw.trim();
    if (url.includes('viewform')) {
      if (!url.includes('embedded=true')) {
        url += (url.includes('?') ? '&' : '?') + 'embedded=true';
      }
    }
    return url;
  };

  const embedUrl = getEmbeddableUrl(formUrl);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col h-[88vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Instrumen Survei Google Form RTLH
              </h3>
              <p className="text-xs text-slate-400">
                Kuesioner digital pendataan RTLH langsung dari petugas verifikator lapangan
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {formUrl && (
              <a
                href={formUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
              >
                <span>Buka di Tab Baru</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync Tip Banner */}
        <div className="bg-emerald-50 px-6 py-2.5 border-b border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Alur Kerja:</strong> Setelah selesai mengisi dan klik "Kirim" pada Google Form, data akan otomatis masuk ke Google Sheet Anda. Klik tombol <strong>Sinkronkan Sekarang</strong> di kanan untuk memuatnya ke tabel BNBA.
            </span>
          </div>
          <button
            onClick={() => {
              onTriggerSync();
              onClose();
            }}
            className="ml-3 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold whitespace-nowrap shadow-sm text-xs flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sinkronkan Sekarang</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden relative bg-slate-100 flex flex-col">
          {(!formUrl || isEditing) ? (
            <div className="p-8 max-w-xl mx-auto my-auto bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Masukkan Link Google Form RTLH Anda
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Tempelkan URL Google Form yang biasa digunakan oleh surveyor lapangan Dinas PKP Konawe.
                </p>
              </div>

              <input
                type="text"
                placeholder="https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />

              <div className="flex items-center justify-center space-x-2 pt-2">
                {formUrl && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20"
                >
                  Simpan Link Google Form
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <iframe
                src={embedUrl}
                title="Google Form Survei RTLH"
                className="w-full h-full border-0"
              />
              {/* Floating edit button */}
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 shadow-md backdrop-blur-sm"
              >
                Ganti Link Form
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
