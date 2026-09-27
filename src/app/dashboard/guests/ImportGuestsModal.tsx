"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  Users,
  Loader2,
  FileText,
  HelpCircle,
} from "lucide-react";

interface ParsedGuestRow {
  name: string;
  phone: string;
  category: string;
  address: string;
  tableNumber: string;
  guestCount: number;
}

interface ImportGuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingId: string;
  userPlan?: string;
  userRole?: string;
  currentGuestCount: number;
  onImportSuccess: (createdGuests: any[]) => void;
}

export function ImportGuestsModal({
  isOpen,
  onClose,
  weddingId,
  userPlan = "basic",
  userRole = "client",
  currentGuestCount,
  onImportSuccess,
}: ImportGuestsModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [parsedRows, setParsedRows] = useState<ParsedGuestRow[]>([]);
  const [rawText, setRawText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState<{ count: number; truncated: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxQuota =
    userRole === "admin" || userPlan === "luxury"
      ? 999999
      : userPlan === "premium"
      ? 500
      : 50;

  const availableSlots = Math.max(0, maxQuota - currentGuestCount);

  useEffect(() => {
    if (isOpen) {
      setParsedRows([]);
      setRawText("");
      setFileName(null);
      setErrorMessage("");
      setSuccessInfo(null);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow || "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Download template CSV with UTF-8 BOM
  const handleDownloadTemplate = () => {
    const csvContent =
      "\uFEFFNama Tamu,Nomor WhatsApp,Kategori,Alamat,Nomor Meja,Jumlah Pax\n" +
      "Budi Santoso,081234567890,VIP,Jakarta Selatan,Meja 01,2\n" +
      "Siti Rahmawati,081987654321,Keluarga,Bandung,Meja 02,2\n" +
      "Ahmad Fauzi,085678912345,Teman Kantor,Surabaya,Meja 05,1\n" +
      "dr. Hendra Kusuma,082134567899,VIP,Semarang,Meja 01,2\n" +
      "Rina Melati,087812345678,Reguler,Yogyakarta,Meja 08,1\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "template-tamu-hayvows.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Robust CSV parser supporting comma, semicolon, tab, and quotes
  const parseCSVContent = (content: string) => {
    setErrorMessage("");
    const lines = content
      .split(/\r\n|\n|\r/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      setParsedRows([]);
      return;
    }

    // Detect delimiter from first row
    const firstLine = lines[0];
    const delimiter =
      firstLine.includes(";") && !firstLine.includes(",")
        ? ";"
        : firstLine.includes("\t")
        ? "\t"
        : ",";

    const parseLine = (line: string): string[] => {
      const values: string[] = [];
      let cur = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (c === '"') {
          if (inQuotes && line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (c === delimiter && !inQuotes) {
          values.push(cur.trim());
          cur = "";
        } else {
          cur += c;
        }
      }
      values.push(cur.trim());
      return values;
    };

    const headerCols = parseLine(lines[0]).map((h) =>
      h.toLowerCase().replace(/[^a-z0-9]/g, "")
    );

    // Identify indices by header keyword
    let nameIdx = headerCols.findIndex((h) => h.includes("nama") || h.includes("name"));
    let phoneIdx = headerCols.findIndex(
      (h) => h.includes("wa") || h.includes("phone") || h.includes("telp") || h.includes("hp")
    );
    let catIdx = headerCols.findIndex(
      (h) => h.includes("kategori") || h.includes("category") || h.includes("tipe")
    );
    let addressIdx = headerCols.findIndex(
      (h) => h.includes("alamat") || h.includes("address") || h.includes("kota") || h.includes("domisili")
    );
    let tableIdx = headerCols.findIndex(
      (h) => h.includes("meja") || h.includes("table")
    );
    let countIdx = headerCols.findIndex(
      (h) => h.includes("pax") || h.includes("jumlah") || h.includes("kuota") || h.includes("count")
    );

    // If no header matches "nama", treat row 0 as data and use positional columns
    let startIndex = 1;
    if (nameIdx === -1) {
      startIndex = 0;
      nameIdx = 0;
      phoneIdx = 1;
      catIdx = 2;
      addressIdx = 3;
      tableIdx = 4;
      countIdx = 5;
    }

    const rows: ParsedGuestRow[] = [];
    for (let i = startIndex; i < lines.length; i++) {
      const cols = parseLine(lines[i]);
      const name = (nameIdx >= 0 ? cols[nameIdx] : cols[0]) || "";
      if (!name.trim()) continue;

      const phone = (phoneIdx >= 0 ? cols[phoneIdx] : cols[1]) || "";
      const category = (catIdx >= 0 ? cols[catIdx] : cols[2]) || "Reguler";
      const address = (addressIdx >= 0 ? cols[addressIdx] : cols[3]) || "";
      const tableNumber = (tableIdx >= 0 ? cols[tableIdx] : cols[4]) || "";
      const guestCount = Math.max(
        1,
        Number(countIdx >= 0 ? cols[countIdx] : cols[5]) || 1
      );

      rows.push({
        name: name.trim(),
        phone: phone.trim(),
        category: category.trim() || "Reguler",
        address: address.trim(),
        tableNumber: tableNumber.trim(),
        guestCount,
      });
    }

    if (rows.length === 0) {
      setErrorMessage("Tidak ada data nama tamu valid yang ditemukan dalam file/teks.");
    }

    setParsedRows(rows);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSVContent(text);
    };
    reader.readAsText(file);
  };

  const handlePasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);
    parseCSVContent(val);
  };

  const handleProcessImport = async () => {
    if (parsedRows.length === 0) return;
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/wedding/${weddingId}/guests/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guests: parsedRows }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.error || "Gagal melakukan import tamu.");
        setLoading(false);
        return;
      }

      setSuccessInfo({
        count: data.createdCount,
        truncated: data.truncated,
      });

      if (data.guests && Array.isArray(data.guests)) {
        onImportSuccess(data.guests);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMessage("Terjadi kesalahan jaringan saat mengirim data tamu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-emerald-900 to-[#1e332a] text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Import Daftar Tamu Massal (Excel / CSV)</h2>
              <p className="text-[11px] text-emerald-200/80">
                Unggah file spreadsheet untuk menambahkan banyak tamu sekaligus secara instan.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Top Info Banner & Template Download */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-[#2d4a3e] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Gunakan format kolom standar:</p>
                <p className="text-[11px] text-slate-500">
                  <code>Nama Tamu</code>, <code>Nomor WhatsApp</code>, <code>Kategori</code>, <code>Alamat</code>, <code>Nomor Meja</code>, <code>Jumlah Pax</code>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2d4a3e] bg-white border border-emerald-200 hover:bg-emerald-50 shadow-2xs transition-colors shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Unduh Template CSV</span>
            </button>
          </div>

          {/* Quota Indicator */}
          <div className="flex items-center justify-between text-xs px-3 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 font-medium">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>
                Paket Anda: <strong className="uppercase">{userPlan}</strong> • Terpakai:{" "}
                <strong>{currentGuestCount}</strong> / {maxQuota >= 999999 ? "Unlimited" : maxQuota} Tamu
              </span>
            </div>
            <span className="text-[11px] text-emerald-800">
              Sisa Kuota: <strong>{maxQuota >= 999999 ? "Tanpa Batas" : `${availableSlots} Tamu`}</strong>
            </span>
          </div>

          {/* Tabs: Upload vs Paste */}
          <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`pb-2 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === "upload"
                  ? "border-[#2d4a3e] text-[#2d4a3e]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Unggah File (.CSV / .TXT)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("paste")}
              className={`pb-2 transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 ${
                activeTab === "paste"
                  ? "border-[#2d4a3e] text-[#2d4a3e]"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Salin &amp; Tempel Teks CSV</span>
            </button>
          </div>

          {/* Tab 1: Upload */}
          {activeTab === "upload" && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-[#2d4a3e] bg-slate-50/70 hover:bg-emerald-50/30 rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#2d4a3e] group-hover:scale-105 transition-all">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-700">
                    {fileName ? fileName : "Klik untuk memilih file CSV dari perangkat Anda"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Mendukung pemisah koma (,), titik koma (;), atau tab dari Excel
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Paste */}
          {activeTab === "paste" && (
            <div>
              <textarea
                value={rawText}
                onChange={handlePasteChange}
                rows={5}
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d4a3e] leading-relaxed resize-none"
                placeholder="Tempel data CSV di sini... Contoh:
Budi Santoso, 081234567890, VIP, Jakarta, Meja 01, 2
Siti Rahmawati, 081987654321, Keluarga, Bandung, Meja 02, 2"
              />
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-3 rounded-xl animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successInfo && (
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-xl animate-in fade-in font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Berhasil mengimport {successInfo.count} tamu ke daftar undangan!
                {successInfo.truncated && " (Sebagian dipotong karena kuota paket penuh)"}
              </span>
            </div>
          )}

          {/* Table Preview */}
          {parsedRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    Pratinjau Data: {parsedRows.length} Tamu Siap Diimport
                  </span>
                </span>
                {parsedRows.length > availableSlots && availableSlots > 0 && (
                  <span className="text-[11px] text-amber-600 font-semibold">
                    * Hanya {availableSlots} tamu pertama yang akan diimport sesuai sisa kuota
                  </span>
                )}
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                <table className="w-full text-left text-[11px] font-sans">
                  <thead className="bg-slate-100 text-slate-600 font-bold sticky top-0 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">No</th>
                      <th className="px-3 py-2">Nama Tamu</th>
                      <th className="px-3 py-2">No. WhatsApp</th>
                      <th className="px-3 py-2">Kategori</th>
                      <th className="px-3 py-2">Alamat / Meja</th>
                      <th className="px-3 py-2 text-center">Pax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {parsedRows.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="px-3 py-1.5 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="px-3 py-1.5 font-bold text-slate-800">{row.name}</td>
                        <td className="px-3 py-1.5 text-slate-600 font-mono">
                          {row.phone || <span className="text-slate-300">-</span>}
                        </td>
                        <td className="px-3 py-1.5">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {row.category}
                          </span>
                        </td>
                        <td className="px-3 py-1.5 text-slate-600">
                          {row.address || row.tableNumber ? (
                            <span>
                              {row.address} {row.tableNumber ? `(${row.tableNumber})` : ""}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="px-3 py-1.5 text-center font-bold text-slate-700">
                          {row.guestCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {parsedRows.length > 10 && (
                <p className="text-[10px] text-slate-400 text-center">
                  ... dan {parsedRows.length - 10} tamu lainnya.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={handleProcessImport}
            disabled={parsedRows.length === 0 || loading || !!successInfo}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#2d4a3e] hover:bg-[#233a30] active:scale-98 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses {parsedRows.length} Tamu...</span>
              </>
            ) : successInfo ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Selesai!</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Import Sekarang ({parsedRows.length} Tamu)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
