/**
 * Guest Spreadsheet Utilities (Excel .xlsx & CSV)
 * Provides robust import, export, normalization, and template generation for Hayvows Guest Manager.
 */

export interface ParsedGuestRow {
  name: string;
  phone: string;
  category: string;
  address: string;
  tableNumber: string;
  guestCount: number;
}

/**
 * Normalizes phone numbers specifically handling Microsoft Excel idiosyncrasies:
 * - Truncated leading zero (e.g. 8123456789 -> 08123456789)
 * - Scientific notation (e.g. 8.123456789e+11)
 * - Country code prefixes (+62 or 62)
 * - Stray punctuation and whitespace
 */
export function normalizePhoneNumber(raw: any): string {
  if (raw === null || raw === undefined) return "";
  let val = String(raw).trim();
  if (!val) return "";

  // Handle scientific notation from Excel (e.g. 8.12345e+11)
  if (/^[0-9]+(\.[0-9]+)?e\+[0-9]+$/i.test(val)) {
    try {
      val = BigInt(Math.floor(Number(val))).toString();
    } catch {
      // fallback
    }
  }

  // Remove whitespace, hyphens, parentheses, dots
  val = val.replace(/[\s\-\(\)\.]/g, "");

  // If starts with +62
  if (val.startsWith("+62")) {
    val = "0" + val.slice(3);
  } else if (val.startsWith("62")) {
    val = "0" + val.slice(2);
  } else if (val.startsWith("8") && val.length >= 9 && val.length <= 13) {
    // Typical Excel dropping leading 0
    val = "0" + val;
  }

  return val;
}

/**
 * Downloads a sample template in Microsoft Excel (.xlsx) format
 * Uses dynamic import to keep initial bundle size lean.
 */
export async function downloadExcelTemplate(): Promise<void> {
  const XLSX = await import("xlsx");

  const headers = [
    "Nama Tamu",
    "Nomor WhatsApp",
    "Kategori",
    "Alamat",
    "Nomor Meja",
    "Jumlah Pax",
  ];

  const sampleData = [
    ["Budi Santoso", "081234567890", "VIP", "Jakarta Selatan", "Meja 01", 2],
    ["Siti Rahmawati", "081987654321", "Keluarga", "Bandung", "Meja 02", 2],
    ["Ahmad Fauzi", "085678912345", "Teman Kantor", "Surabaya", "Meja 05", 1],
    ["dr. Hendra Kusuma", "082134567899", "VIP", "Semarang", "Meja 01", 2],
    ["Rina Melati", "087812345678", "Reguler", "Yogyakarta", "Meja 08", 1],
  ];

  const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);

  // Set column widths for comfortable editing in Excel
  ws["!cols"] = [
    { wch: 24 }, // Nama Tamu
    { wch: 20 }, // Nomor WhatsApp
    { wch: 16 }, // Kategori
    { wch: 24 }, // Alamat
    { wch: 14 }, // Nomor Meja
    { wch: 12 }, // Jumlah Pax
  ];

  // Explicitly set phone column cells as String type ('s') with Text formatting ('@')
  for (let r = 1; r <= sampleData.length; r++) {
    const cellRef = XLSX.utils.encode_cell({ r, c: 1 });
    if (ws[cellRef]) {
      ws[cellRef].t = "s";
      ws[cellRef].z = "@";
    }
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Daftar Tamu");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "template-tamu-hayvows.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a sample template in CSV format with UTF-8 BOM
 */
export function downloadCSVTemplate(): void {
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
  URL.revokeObjectURL(url);
}

/**
 * Exports full guest list and RSVP status to Excel (.xlsx)
 */
export async function exportGuestsToExcel(
  guests: any[],
  weddingSlug: string
): Promise<void> {
  const XLSX = await import("xlsx");
  const origin = typeof window !== "undefined" ? window.location.origin : "https://hayvows.com";

  const headers = [
    "No",
    "Nama Tamu",
    "Nomor WhatsApp",
    "Kategori",
    "Alamat / Domisili",
    "Nomor Meja",
    "Sesi Acara",
    "Status RSVP",
    "Pax Hadir",
    "Status Check-in",
    "Tautan Undangan Personal",
    "Kode Tiket QR",
  ];

  const rows = guests.map((g, idx) => {
    const personalUrl = `${origin}/invitation/${weddingSlug}/${g.slug}`;
    const rsvpStatus =
      g.rsvp?.attendanceStatus === "attending"
        ? "Hadir"
        : g.rsvp?.attendanceStatus === "not_attending"
        ? "Tidak Hadir"
        : "Belum Respon";
    const paxCount =
      g.rsvp?.attendanceStatus === "attending" ? g.rsvp?.guestCount || g.guestCount : 0;
    const checkInStatus = g.checkedIn ? "Sudah Check-in" : "Belum Check-in";

    return [
      idx + 1,
      g.name || "",
      normalizePhoneNumber(g.phone) || "",
      g.category || "Reguler",
      g.address || "",
      g.tableNumber || "",
      g.sessionName || "",
      rsvpStatus,
      paxCount,
      checkInStatus,
      personalUrl,
      g.qrCode || "",
    ];
  });

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Format phone column cells as String
  for (let r = 1; r <= rows.length; r++) {
    const cellRef = XLSX.utils.encode_cell({ r, c: 2 });
    if (ws[cellRef]) {
      ws[cellRef].t = "s";
      ws[cellRef].z = "@";
    }
  }

  // Set column widths
  ws["!cols"] = [
    { wch: 6 },  // No
    { wch: 24 }, // Nama Tamu
    { wch: 20 }, // Nomor WhatsApp
    { wch: 15 }, // Kategori
    { wch: 24 }, // Alamat
    { wch: 14 }, // Nomor Meja
    { wch: 14 }, // Sesi Acara
    { wch: 16 }, // Status RSVP
    { wch: 12 }, // Pax Hadir
    { wch: 18 }, // Status Check-in
    { wch: 45 }, // Tautan Undangan
    { wch: 18 }, // Kode Tiket QR
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rekap Tamu");

  const dateStr = new Date().toISOString().slice(0, 10);
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `daftar-tamu-${weddingSlug}-${dateStr}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports full guest list and RSVP status to CSV with UTF-8 BOM
 */
export function exportGuestsToCSV(
  guests: any[],
  weddingSlug: string
): void {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://hayvows.com";

  const headers = [
    "No",
    "Nama Tamu",
    "Nomor WhatsApp",
    "Kategori",
    "Alamat / Domisili",
    "Nomor Meja",
    "Sesi Acara",
    "Status RSVP",
    "Pax Hadir",
    "Status Check-in",
    "Tautan Undangan Personal",
    "Kode Tiket QR",
  ];

  const dataRows = guests.map((g, idx) => {
    const personalUrl = `${origin}/invitation/${weddingSlug}/${g.slug}`;
    const rsvpStatus =
      g.rsvp?.attendanceStatus === "attending"
        ? "Hadir"
        : g.rsvp?.attendanceStatus === "not_attending"
        ? "Tidak Hadir"
        : "Belum Respon";
    const paxCount =
      g.rsvp?.attendanceStatus === "attending" ? g.rsvp?.guestCount || g.guestCount : 0;
    const checkInStatus = g.checkedIn ? "Sudah Check-in" : "Belum Check-in";

    return [
      idx + 1,
      `"${(g.name || "").replace(/"/g, '""')}"`,
      `"${(normalizePhoneNumber(g.phone) || "").replace(/"/g, '""')}"`,
      `"${(g.category || "").replace(/"/g, '""')}"`,
      `"${(g.address || "").replace(/"/g, '""')}"`,
      `"${(g.tableNumber || "").replace(/"/g, '""')}"`,
      `"${(g.sessionName || "").replace(/"/g, '""')}"`,
      `"${rsvpStatus}"`,
      paxCount,
      `"${checkInStatus}"`,
      `"${personalUrl}"`,
      `"${(g.qrCode || "").replace(/"/g, '""')}"`,
    ].join(",");
  });

  const csvContent = "\uFEFF" + [headers.join(","), ...dataRows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `daftar-tamu-${weddingSlug}-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Universal 2D table parser that intelligently detects headers
 */
export function parseTableMatrix(
  matrix: any[][]
): { rows: ParsedGuestRow[]; error?: string } {
  // Filter out empty rows
  const cleanRows = matrix.filter((row) =>
    row && row.some((cell) => cell !== null && cell !== undefined && String(cell).trim() !== "")
  );

  if (cleanRows.length === 0) {
    return { rows: [], error: "Tidak ada data tamu yang ditemukan dalam berkas." };
  }

  // Header detection on the first row
  const firstRowCols = cleanRows[0].map((c) =>
    String(c || "").toLowerCase().replace(/[^a-z0-9]/g, "")
  );

  let nameIdx = firstRowCols.findIndex((h) => h.includes("nama") || h.includes("name"));
  let phoneIdx = firstRowCols.findIndex(
    (h) => h.includes("wa") || h.includes("phone") || h.includes("telp") || h.includes("hp")
  );
  let catIdx = firstRowCols.findIndex(
    (h) => h.includes("kategori") || h.includes("category") || h.includes("tipe")
  );
  let addressIdx = firstRowCols.findIndex(
    (h) => h.includes("alamat") || h.includes("address") || h.includes("kota") || h.includes("domisili")
  );
  let tableIdx = firstRowCols.findIndex(
    (h) => h.includes("meja") || h.includes("table")
  );
  let countIdx = firstRowCols.findIndex(
    (h) => h.includes("pax") || h.includes("jumlah") || h.includes("kuota") || h.includes("count")
  );

  let startIndex = 1;
  // If first row does not contain a header matching "nama", treat row 0 as data
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
  for (let i = startIndex; i < cleanRows.length; i++) {
    const cols = cleanRows[i];
    const name = String(nameIdx >= 0 ? cols[nameIdx] || "" : cols[0] || "").trim();
    if (!name) continue;

    const rawPhone = phoneIdx >= 0 ? cols[phoneIdx] : cols[1];
    const phone = normalizePhoneNumber(rawPhone);

    const category = String(catIdx >= 0 ? cols[catIdx] || "" : cols[2] || "").trim() || "Reguler";
    const address = String(addressIdx >= 0 ? cols[addressIdx] || "" : cols[3] || "").trim();
    const tableNumber = String(tableIdx >= 0 ? cols[tableIdx] || "" : cols[4] || "").trim();
    const rawCount = countIdx >= 0 ? cols[countIdx] : cols[5];
    const guestCount = Math.max(1, Number(rawCount) || 1);

    rows.push({
      name,
      phone,
      category,
      address,
      tableNumber,
      guestCount,
    });
  }

  if (rows.length === 0) {
    return { rows: [], error: "Tidak ada baris data tamu yang valid ditemukan." };
  }

  return { rows };
}

/**
 * Parses raw CSV string with delimiter auto-detection and quote escaping
 */
export function parseCSVString(
  content: string
): { rows: ParsedGuestRow[]; error?: string } {
  const lines = content
    .split(/\r\n|\n|\r/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { rows: [], error: "File CSV kosong." };
  }

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

  const matrix = lines.map((l) => parseLine(l));
  return parseTableMatrix(matrix);
}

/**
 * High-level parser that automatically determines whether the file is Excel (.xlsx / .xls)
 * or CSV/Text, and returns parsed guest rows.
 */
export async function parseSpreadsheetFile(
  file: File
): Promise<{ rows: ParsedGuestRow[]; error?: string; fileType: "excel" | "csv" }> {
  const isExcel =
    file.name.endsWith(".xlsx") ||
    file.name.endsWith(".xls") ||
    file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "application/vnd.ms-excel";

  if (isExcel) {
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      if (!wb.SheetNames || wb.SheetNames.length === 0) {
        return { rows: [], error: "File Excel tidak memiliki lembar kerja (sheet).", fileType: "excel" };
      }
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
      const res = parseTableMatrix(rawData);
      return { ...res, fileType: "excel" };
    } catch (err: any) {
      return {
        rows: [],
        error: `Gagal membaca file Excel: ${err?.message || "Format file tidak didukung"}`,
        fileType: "excel",
      };
    }
  } else {
    // CSV or Plain Text
    try {
      const text = await file.text();
      const res = parseCSVString(text);
      return { ...res, fileType: "csv" };
    } catch (err: any) {
      return {
        rows: [],
        error: `Gagal membaca file CSV: ${err?.message || "Format teks tidak valid"}`,
        fileType: "csv",
      };
    }
  }
}
