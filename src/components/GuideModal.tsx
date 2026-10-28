import React from 'react';
import { X, BookOpen, CheckCircle, FileText, MapPin, Database, Award, HelpCircle, Download } from 'lucide-react';

interface GuideModalProps {
  onClose: () => void;
  onOpenSyncModal: () => void;
  onOpenFormModal: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  onClose,
  onOpenSyncModal,
  onOpenFormModal,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#081E3D] text-white px-6 py-4 flex items-center justify-between border-b border-blue-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-amber-300 flex items-center justify-center border border-blue-400/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">Panduan Sistem E-RTLH Kab. Konawe</h2>
              <p className="text-xs text-blue-200/80">Petunjuk Operasional Pendataan, Verifikasi, dan Monitoring BNBA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-sm leading-relaxed">
          
          {/* Section 1 */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">1</span>
              Alur Pendataan &amp; Verifikasi RTLH
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Tahapan penanganan RTLH dilaksanakan secara berjenjang berbasis By Name By Address (BNBA):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-amber-700 block mb-1">1. Usulan Baru</span>
                Pendaftaran warga via Google Form atau fasilitator desa dengan input NIK dan foto 4 sudut.
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-blue-700 block mb-1">2. Tahap Verifikasi</span>
                Pemeriksaan faktual ke lokasi rumah, validasi tanah, dan cetak lembar verifikasi A4.
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-purple-700 block mb-1">3. Masuk SK</span>
                Penetapan calon penerima melalui Keputusan Bupati Konawe dengan alokasi bantuan.
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200">
                <span className="font-semibold text-emerald-700 block mb-1">4. Selesai</span>
                Pelaksanaan fisik tuntas 100% dan serah terima rumah layak huni kepada keluarga penerima.
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">2</span>
              Standar Dokumentasi 4 Sudut Foto
            </h3>
            <p className="text-xs text-slate-600 mb-3">
              Untuk memenuhi kriteria verifikasi KemenPKP (BSPS) dan Disperkim Konawe, setiap rumah wajib memiliki 4 sisi dokumentasi visual:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="font-semibold block text-slate-800">1. Foto Tampak Depan</span>
                <span className="text-[11px] text-slate-500">Memperlihatkan pintu, nomor rumah, dan tampak depan utuh.</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="font-semibold block text-slate-800">2. Samping Kanan</span>
                <span className="text-[11px] text-slate-500">Kondisi dinding kanan, pondasi, dan saluran air.</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="font-semibold block text-slate-800">3. Samping Kiri</span>
                <span className="text-[11px] text-slate-500">Kondisi dinding kiri, ventilasi, dan kemiringan tiang.</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="font-semibold block text-slate-800">4. Tampak Belakang</span>
                <span className="text-[11px] text-slate-500">Area dapur, sanitasi jamban, dan sumber air bersih.</span>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-base mb-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center font-bold">3</span>
              Integrasi Google Spreadsheet &amp; Google Form
            </h3>
            <p className="text-xs text-slate-600 mb-2">
              Website ini terhubung secara langsung dengan Google Form survei dan Google Spreadsheet database:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5 ml-2">
              <li>Masyarakat atau fasilitator dapat mengisi formulir melalui menu <strong>Google Form</strong>.</li>
              <li>Hasil survei otomatis tersimpan di Google Spreadsheet.</li>
              <li>Admin dapat menekan tombol <strong>Sinkronkan</strong> di menu Admin untuk memperbarui data website secara real-time tanpa reload server.</li>
            </ul>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-500">
            Dinas Perumahan dan Kawasan Permukiman Kab. Konawe
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenFormModal();
              }}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
            >
              Buka Google Form
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenSyncModal();
              }}
              className="px-3.5 py-2 text-xs font-bold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition shadow-sm cursor-pointer"
            >
              Konfigurasi Admin
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
