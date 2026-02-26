import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// ─── Page constants (A4 in points) ──────────────────────────────────────────
const PW = 595;
const PH = 842;
const ML = 54; // margin left
const MR = 54; // margin right
const MT = 56; // margin top
const CW = PW - ML - MR; // usable content width = 487

const LABEL_W = 142; // width reserved for row labels
const FIELD_X = ML + LABEL_W + 10; // where editable field starts (x)
const FIELD_W = PW - MR - FIELD_X; // width of editable field
const FIELD_H = 14; // height of a single-row form field

const FS = 11; // body font size
const TS = 12; // title font size
const RH = 16; // row height / line height

const BLACK = rgb(0, 0, 0);

// ─── Types ───────────────────────────────────────────────────────────────────
export interface FillableData {
  dateStamp: string;
  city: string;
  grantorName: string;
  grantorNik: string;
  grantorBirthPlaceDate: string;
  grantorOccupation: string;
  grantorAddress: string;
  granteeName: string;
  granteeNIK: string;
  granteeBirthPlaceDate: string;
  granteeOccupation: string;
  granteeAddress: string;
  road: string;
  village: string;
  district: string;
  province: string;
  titleNumber: string;
  area: string;
  nib: string;
  imgDate: string;
  imgNumber: string;
  titleType: string;
  certificateSerialNumber: string;
  subject: string;
  address: string;
  noSuratKuasa: string;
  suratKuasaDate: string;
}

// ─── Drawing context ─────────────────────────────────────────────────────────
interface Ctx {
  page: ReturnType<PDFDocument["addPage"]>;
  form: ReturnType<PDFDocument["getForm"]>;
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>;
  fontBold: Awaited<ReturnType<PDFDocument["embedFont"]>>;
  cursor: number; // distance from TOP of page (increases downward)
}

/** Convert cursor (from top) to pdf-lib y (from bottom) for text baseline */
function ty(cursor: number) {
  return PH - cursor;
}

/** Draw a centered title with underline */
function drawTitle(ctx: Ctx, title: string) {
  const w = ctx.fontBold.widthOfTextAtSize(title, TS);
  const x = (PW - w) / 2;
  ctx.page.drawText(title, {
    x,
    y: ty(ctx.cursor),
    font: ctx.fontBold,
    size: TS,
    color: BLACK,
  });
  ctx.page.drawLine({
    start: { x, y: ty(ctx.cursor) - 1 },
    end: { x: x + w, y: ty(ctx.cursor) - 1 },
    thickness: 0.5,
    color: BLACK,
  });
  ctx.cursor += TS + 8;
}

/** Draw a centered bold section title with underline (e.g. "KHUSUS") */
function drawSectionTitle(ctx: Ctx, title: string) {
  ctx.cursor += 4;
  const w = ctx.fontBold.widthOfTextAtSize(title, FS);
  const x = (PW - w) / 2;
  ctx.page.drawText(title, {
    x,
    y: ty(ctx.cursor),
    font: ctx.fontBold,
    size: FS,
    color: BLACK,
  });
  ctx.page.drawLine({
    start: { x, y: ty(ctx.cursor) - 1 },
    end: { x: x + w, y: ty(ctx.cursor) - 1 },
    thickness: 0.5,
    color: BLACK,
  });
  ctx.cursor += RH;
}

/** Draw body text with automatic word-wrap. Returns updated cursor. */
function drawParagraph(ctx: Ctx, text: string, indentX = 0, gap = 3) {
  const x = ML + indentX;
  const maxW = CW - indentX;
  const words = text.split(" ");
  let line = "";
  const lines: string[] = [];

  for (const word of words) {
    const test = line ? line + " " + word : word;
    const w = ctx.font.widthOfTextAtSize(test, FS);
    if (w > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);

  for (const l of lines) {
    ctx.page.drawText(l, {
      x,
      y: ty(ctx.cursor),
      font: ctx.font,
      size: FS,
      color: BLACK,
    });
    ctx.cursor += RH;
  }
  ctx.cursor += gap;
}

/** Draw plain static text on one line */
function drawLine(ctx: Ctx, text: string, x = ML, bold = false) {
  ctx.page.drawText(text, {
    x,
    y: ty(ctx.cursor),
    font: bold ? ctx.fontBold : ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.cursor += RH;
}

/** Draw right-aligned text */
function drawRight(ctx: Ctx, text: string) {
  const w = ctx.font.widthOfTextAtSize(text, FS);
  ctx.page.drawText(text, {
    x: PW - MR - w,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.cursor += RH;
}

/** Add vertical gap */
function gap(ctx: Ctx, size = 4) {
  ctx.cursor += size;
}

/**
 * Draw a form row: "Label  :  [editable field]"
 * fieldName must be unique within the document.
 */
function addRow(
  ctx: Ctx,
  label: string,
  fieldName: string,
  value: string,
  indentX = 0,
) {
  const x = ML + indentX;
  const labelW = LABEL_W - indentX;
  const fieldX = x + labelW + 10;
  const fieldWidth = PW - MR - fieldX;

  // Draw label
  ctx.page.drawText(label, {
    x,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  // Draw colon
  ctx.page.drawText(":", {
    x: x + labelW,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });

  // Add editable field
  const tf = ctx.form.createTextField(fieldName);
  if (value && value !== "____________________") tf.setText(value);
  tf.addToPage(ctx.page, {
    x: fieldX,
    y: ty(ctx.cursor) - FIELD_H + 10,
    width: fieldWidth,
    height: FIELD_H,
    borderWidth: 0,
  });
  tf.setFontSize(FS);

  ctx.cursor += RH;
}

// ─── SURAT KUASA ─────────────────────────────────────────────────────────────
export async function createSuratKuasaFillable(
  data: FillableData,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const page = doc.addPage([PW, PH]);
  const form = doc.getForm();
  const ctx: Ctx = { page, form, font, fontBold, cursor: MT };

  drawTitle(ctx, "SURAT KUASA");

  drawParagraph(ctx, "Yang bertanda-tangan di bawah ini :", 0, 2);

  addRow(ctx, "Nama", "pemberi_nama", data.grantorName);
  addRow(
    ctx,
    "Tempat/Tanggal Lahir",
    "pemberi_ttl",
    data.grantorBirthPlaceDate,
  );
  addRow(ctx, "NIK", "pemberi_nik", data.grantorNik);
  // Custom multiline row for Alamat (Pemberi Kuasa)
  ctx.page.drawText("Alamat", {
    x: ML,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.page.drawText(":", {
    x: ML + LABEL_W,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });

  const tfAlamatPemberi = ctx.form.createTextField("pemberi_alamat");
  tfAlamatPemberi.setText(data.grantorAddress || "");
  tfAlamatPemberi.enableMultiline();
  tfAlamatPemberi.addToPage(ctx.page, {
    x: ML + LABEL_W + 10,
    y: ty(ctx.cursor) - FIELD_H * 2 + 10,
    width: PW - MR - (ML + LABEL_W + 10),
    height: FIELD_H * 2,
    borderWidth: 0,
  });
  tfAlamatPemberi.setFontSize(FS);
  ctx.cursor += RH * 2;

  gap(ctx, 4);
  drawParagraph(ctx, "Dengan ini memberi kuasa kepada :", 0, 2);

  addRow(ctx, "Nama", "penerima_nama", data.granteeName || "");
  addRow(
    ctx,
    "Pekerjaan/Jabatan",
    "penerima_kerja",
    data.granteeOccupation || "",
  );

  // Custom multiline row for Alamat
  ctx.page.drawText("Alamat", {
    x: ML,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.page.drawText(":", {
    x: ML + LABEL_W,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });

  const tfAlamat = ctx.form.createTextField("penerima_alamat");
  tfAlamat.setText(data.granteeAddress || "");
  tfAlamat.enableMultiline();
  tfAlamat.addToPage(ctx.page, {
    x: ML + LABEL_W + 10,
    y: ty(ctx.cursor) - FIELD_H * 2 + 10,
    width: PW - MR - (ML + LABEL_W + 10),
    height: FIELD_H * 2,
    borderWidth: 0,
  });
  tfAlamat.setFontSize(FS);
  ctx.cursor += RH * 2;

  drawSectionTitle(ctx, "KHUSUS");

  drawParagraph(
    ctx,
    `Untuk dan atas nama pemberi kuasa menghadap di Kantor Pertanahan ${data.city} untuk mengurus permohonan ${data.subject} dan melakukan segala sesuatu berkaitan dengan pengurusan tersebut serta menerima sertipikatnya dari Kantor Pertanahan ${data.city} atas bidang tanah yang terletak di :`,
    0,
    2,
  );

  // Custom multiline row for Letak tanah (Jalan)
  ctx.page.drawText("Jalan", {
    x: ML,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.page.drawText(":", {
    x: ML + LABEL_W,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });

  const tfJalanKuasa = ctx.form.createTextField("tanah_letak_kuasa");
  tfJalanKuasa.setText(data.road || "");
  tfJalanKuasa.enableMultiline();
  tfJalanKuasa.addToPage(ctx.page, {
    x: ML + LABEL_W + 10,
    y: ty(ctx.cursor) - FIELD_H * 2 + 10,
    width: PW - MR - (ML + LABEL_W + 10),
    height: FIELD_H * 2,
    borderWidth: 0,
  });
  tfJalanKuasa.setFontSize(FS);
  ctx.cursor += RH * 2;
  addRow(ctx, "Kelurahan", "tanah_kel", data.village);
  addRow(ctx, "Kecamatan", "tanah_kec", data.district);
  addRow(ctx, "Kota", "tanah_kota", data.city);
  addRow(ctx, "Nomor Hak", "tanah_nomhak", data.titleNumber);
  addRow(ctx, "Luas", "tanah_luas", data.area);

  gap(ctx, 4);
  drawParagraph(
    ctx,
    "Demikian Surat Kuasa ini dibuat dengan sebenar-benarnya dan dapat dipergunakan sebagaimana mestinya.",
    0,
    6,
  );

  drawRight(ctx, `${data.city}, ${data.dateStamp}`);
  gap(ctx, 6);

  // Signature block
  drawLine(ctx, "Penerima Kuasa :");
  ctx.cursor -= RH;
  const rw = font.widthOfTextAtSize("Pemberi Kuasa :", FS);
  page.drawText("Pemberi Kuasa :", {
    x: PW - MR - rw,
    y: ty(ctx.cursor),
    font,
    size: FS,
    color: BLACK,
  });
  ctx.cursor += RH;

  ctx.cursor += RH * 5; // Extra space for materai/stempel

  // Grantee signature name (fillable)
  const granteeTf = ctx.form.createTextField("ttd_penerima");
  granteeTf.setText(data.granteeName || "");
  granteeTf.addToPage(ctx.page, {
    x: ML,
    y: ty(ctx.cursor) - FIELD_H + 7,
    width: 200,
    height: FIELD_H,
    borderWidth: 0,
  });
  granteeTf.setFontSize(FS);

  // Grantor signature name (static for now as it aligns right, or we can make it fillable too)
  // Making it fillable & right-aligned:
  const grantorTf = ctx.form.createTextField("ttd_pemberi");
  grantorTf.setText(data.grantorName || "");
  grantorTf.setAlignment(1); // Center align within its box
  grantorTf.addToPage(ctx.page, {
    x: PW - MR - 200,
    y: ty(ctx.cursor) - FIELD_H + 7,
    width: 200,
    height: FIELD_H,
    borderWidth: 0,
  });
  grantorTf.setFontSize(FS);
  ctx.cursor += RH;

  return doc.save();
}

// ─── SURAT PERMOHONAN ────────────────────────────────────────────────────────
export async function createSuratPermohonanFillable(
  data: FillableData,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const page = doc.addPage([PW, PH]);
  const form = doc.getForm();
  const ctx: Ctx = { page, form, font, fontBold, cursor: MT };

  // Header address block (Aligned Right)
  const rightX = 320;
  ctx.page.drawText("Kepada Yth,", {
    x: rightX + 25,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.cursor += RH;
  ctx.page.drawText("Sdr.", {
    x: rightX,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.page.drawText("Kepala Kantor Pertanahan", {
    x: rightX + 25,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.cursor += RH;
  ctx.page.drawText(`Kota Administrasi ${data.city}`, {
    x: rightX + 25,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.cursor += RH;
  ctx.page.drawText(`Di Jakarta`, {
    x: rightX + 25,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  }); // Hardcoded "Di Jakarta" per image, or use Di ${data.city} depending on needs
  ctx.cursor += RH;

  gap(ctx, 4);

  drawParagraph(ctx, "Dengan Hormat,", 0, 1.2);
  drawParagraph(ctx, "Yang bertandatangan dibawah ini :", 0, 2);

  addRow(ctx, "Nama", "pem_nama", data.granteeName, 12);
  addRow(ctx, "Pekerjaan", "pem_kerja", data.granteeOccupation, 12);

  // Custom multiline row for Alamat (Pemohon)
  const indentX1 = 12;
  const labelW1 = LABEL_W - indentX1;
  ctx.page.drawText("Alamat", {
    x: ML + indentX1,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.page.drawText(":", {
    x: ML + indentX1 + labelW1,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });

  const tfAlamatPem = ctx.form.createTextField("pem_alamat");
  tfAlamatPem.setText(data.granteeAddress || "");
  tfAlamatPem.enableMultiline();
  tfAlamatPem.addToPage(ctx.page, {
    x: ML + indentX1 + labelW1 + 10,
    y: ty(ctx.cursor) - FIELD_H * 2 + 10,
    width: PW - MR - (ML + indentX1 + labelW1 + 10),
    height: FIELD_H * 2,
    borderWidth: 0,
  });
  tfAlamatPem.setFontSize(FS);
  ctx.cursor += RH * 2;

  gap(ctx, 4);
  drawParagraph(
    ctx,
    "Dalam hal ini bertindak untuk dan atas nama diri sendiri / selaku kuasa dari :",
    0,
    2,
  );

  addRow(ctx, "Nama", "ku_nama", data.grantorName, 12);
  addRow(ctx, "Pekerjaan", "ku_kerja", data.grantorOccupation, 12);
  addRow(ctx, "No. KTP/SIM", "ku_nik", data.grantorNik, 12);

  // Custom multiline row for Alamat (Kuasa)
  const indentX2 = 12;
  const labelW2 = LABEL_W - indentX2;
  ctx.page.drawText("Alamat", {
    x: ML + indentX2,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.page.drawText(":", {
    x: ML + indentX2 + labelW2,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });

  const tfAlamatKu = ctx.form.createTextField("ku_alamat");
  tfAlamatKu.setText(data.grantorAddress || "");
  tfAlamatKu.enableMultiline();
  tfAlamatKu.addToPage(ctx.page, {
    x: ML + indentX2 + labelW2 + 10,
    y: ty(ctx.cursor) - FIELD_H * 2 + 10,
    width: PW - MR - (ML + indentX2 + labelW2 + 10),
    height: FIELD_H * 2,
    borderWidth: 0,
  });
  tfAlamatKu.setFontSize(FS);
  ctx.cursor += RH * 2;

  gap(ctx, 4);
  const text1 = "Berdasarkan Surat Kuasa Nomor ";
  const w1 = ctx.font.widthOfTextAtSize(text1, FS);
  const fieldW1 = 140;
  const text2 = " Tanggal ";
  const w2 = ctx.font.widthOfTextAtSize(text2, FS);
  const fieldW2 = 100;
  const text3 = " dengan";

  ctx.page.drawText(text1, {
    x: ML,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });

  const nomSkTf = ctx.form.createTextField("sk_nomor");
  nomSkTf.setText(data.noSuratKuasa || "");
  nomSkTf.addToPage(ctx.page, {
    x: ML + w1,
    y: ty(ctx.cursor) - FIELD_H + 7,
    width: fieldW1,
    height: FIELD_H,
    borderWidth: 0,
  });
  nomSkTf.setFontSize(FS);

  ctx.page.drawText(text2, {
    x: ML + w1 + fieldW1,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });

  const tglSkTf = ctx.form.createTextField("sk_tgl");
  tglSkTf.setText(data.suratKuasaDate || "");
  tglSkTf.addToPage(ctx.page, {
    x: ML + w1 + fieldW1 + w2,
    y: ty(ctx.cursor) - FIELD_H + 7,
    width: fieldW2,
    height: FIELD_H,
    borderWidth: 0,
  });
  tglSkTf.setFontSize(FS);

  ctx.page.drawText(text3, {
    x: ML + w1 + fieldW1 + w2 + fieldW2,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.cursor += RH;

  drawParagraph(ctx, "ini mengajukan permohonan :", 0, 4);

  const subjectW = ctx.fontBold.widthOfTextAtSize(data.subject, FS);
  drawLine(ctx, data.subject, (PW - subjectW) / 2, true);
  gap(ctx, 2);

  drawParagraph(
    ctx,
    `dan melakukan segala sesuatu berkaitan dengan pengurusan tersebut serta menerima Sertipikatnya dari Kantor Pertanahan ${data.city} atas bidang tanah yang terletak di :`,
    0,
    2,
  );

  // Custom multiline row for Letak tanah (Jalan)
  const indentX = 12;
  const labelW = LABEL_W - indentX;
  ctx.page.drawText("Letak tanah", {
    x: ML + indentX,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.page.drawText(":", {
    x: ML + indentX + labelW,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });

  const tfJalanPermohonan = ctx.form.createTextField("tanah_letak_permohonan");
  tfJalanPermohonan.setText(data.road || "");
  tfJalanPermohonan.enableMultiline();
  tfJalanPermohonan.addToPage(ctx.page, {
    x: ML + indentX + labelW + 10,
    y: ty(ctx.cursor) - FIELD_H * 2 + 10,
    width: PW - MR - (ML + indentX + labelW + 10),
    height: FIELD_H * 2,
    borderWidth: 0,
  });
  tfJalanPermohonan.setFontSize(FS);
  ctx.cursor += RH * 2;
  addRow(ctx, "Kelurahan", "tanah_kel", data.village, 12);
  addRow(ctx, "Kecamatan", "tanah_kec", data.district, 12);
  addRow(ctx, "Wilayah", "tanah_wil", data.province, 12);
  addRow(ctx, "Nomor Hak", "tanah_nomhak", data.titleNumber, 12);

  gap(ctx, 4);
  drawParagraph(
    ctx,
    "Untuk melengkapi permohonan dimaksud, bersama ini kami lampirkan :",
    0,
    2,
  );
  drawLine(ctx, `   1. Asli Sertipikat HM ${data.titleNumber}`);
  drawLine(ctx, "   2.");
  drawLine(ctx, "   3.");

  gap(ctx, 6);
  drawRight(ctx, `${data.city}, ${data.dateStamp}`);
  gap(ctx, 2);
  drawRight(ctx, "Hormat Kami");
  ctx.cursor += RH * 5; // Extra space for materai/stempel

  const pemohonTf = ctx.form.createTextField("ttd_pemohon");
  pemohonTf.setText(data.granteeName || "");
  pemohonTf.setAlignment(1); // Center align
  pemohonTf.addToPage(ctx.page, {
    x: PW - MR - 200,
    y: ty(ctx.cursor) - FIELD_H + 7,
    width: 200,
    height: FIELD_H,
    borderWidth: 0,
  });
  pemohonTf.setFontSize(FS);
  ctx.cursor += RH;

  return doc.save();
}

// ─── SURAT PERNYATAAN ─────────────────────────────────────────────────────────
export async function createSuratPernyataanFillable(
  data: FillableData,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const page = doc.addPage([PW, PH]);
  const form = doc.getForm();
  const ctx: Ctx = { page, form, font, fontBold, cursor: MT };

  drawTitle(ctx, "SURAT PERNYATAAN");
  drawParagraph(ctx, "Yang bertandatangan di bawah ini :", 0, 2);

  addRow(ctx, "Nama", "pr_nama", data.grantorName);
  addRow(ctx, "Pekerjaan", "pr_kerja", data.grantorOccupation);

  // Custom multiline row for Alamat (Pernyataan)
  ctx.page.drawText("Alamat", {
    x: ML,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.page.drawText(":", {
    x: ML + LABEL_W,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });

  const tfAlamatPr = ctx.form.createTextField("pr_alamat");
  tfAlamatPr.setText(data.address || "");
  tfAlamatPr.enableMultiline();
  tfAlamatPr.addToPage(ctx.page, {
    x: FIELD_X,
    y: ty(ctx.cursor) - FIELD_H * 2 + 10,
    width: FIELD_W,
    height: FIELD_H * 2,
    borderWidth: 0,
  });
  tfAlamatPr.setFontSize(FS);
  ctx.cursor += RH * 2;

  addRow(ctx, "KTP/NIK", "pr_nik", data.grantorNik);

  gap(ctx, 4);
  drawParagraph(ctx, "Dengan ini menyatakan bahwa :", 0, 2);

  drawParagraph(
    ctx,
    "1.  Saya adalah pemegang hak atas tanah dengan data sebagai berikut :",
    0,
    2,
  );

  addRow(ctx, "a.  Jenis Hak", "t_jenis", data.titleType, 12);
  addRow(ctx, "b.  Nomor", "t_nomor", data.titleNumber, 12);
  addRow(
    ctx,
    "c.  Nomor Seri Blanko",
    "t_seri",
    data.certificateSerialNumber,
    12,
  );
  addRow(ctx, "d.  Atas Nama", "t_atasNama", data.grantorName, 12);

  gap(ctx);
  drawLine(ctx, "     e.  Letak Tanah :");

  addRow(ctx, "Provinsi", "lt_prov", data.province, 28);
  addRow(ctx, "Kota", "lt_kota", data.city, 28);
  addRow(ctx, "Kecamatan", "lt_kec", data.district, 28);
  addRow(ctx, "Kelurahan", "lt_kel", data.village, 28);
  // Custom multiline row for Jalan
  const indentX = 28;
  const labelWPernyataan = LABEL_W - indentX;
  ctx.page.drawText("Jalan", {
    x: ML + indentX,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });
  ctx.page.drawText(":", {
    x: ML + indentX + labelWPernyataan,
    y: ty(ctx.cursor),
    font: ctx.font,
    size: FS,
    color: BLACK,
  });

  const tfJalanPernyataan = ctx.form.createTextField("tanah_jalan_pernyataan");
  tfJalanPernyataan.setText(data.road || "");
  tfJalanPernyataan.enableMultiline();
  tfJalanPernyataan.addToPage(ctx.page, {
    x: ML + indentX + labelWPernyataan + 10,
    y: ty(ctx.cursor) - FIELD_H * 2 + 10,
    width: PW - MR - (ML + indentX + labelWPernyataan + 10),
    height: FIELD_H * 2,
    borderWidth: 0,
  });
  tfJalanPernyataan.setFontSize(FS);
  ctx.cursor += RH * 2;

  gap(ctx);
  drawLine(ctx, "     f.  Gambar Situasi :");

  addRow(ctx, "Tanggal", "gs_tgl", data.imgDate, 28);
  addRow(ctx, "Nomor", "gs_nom", data.imgNumber, 28);
  addRow(ctx, "NIB", "gs_nib", data.nib, 28);
  addRow(ctx, "Luas", "gs_luas", data.area, 28);

  gap(ctx, 4);
  drawParagraph(
    ctx,
    "2.  Saya menjamin keaslian sertipikat tersebut dan nama yang tercantum dalam sertipikat merupakan nama pemegang hak yang sebenarnya dan beritikad baik serta bertanggung jawab sepenuhnya atas penggunaan data yang diakses.",
    0,
    2,
  );
  drawParagraph(
    ctx,
    "3.  Saya menjamin bahwa hak atas tanah tersebut benar milik saya dan tidak ada orang/pihak lain yang turut memiliki atau ikut mempunyai sesuatu hak pun di atasnya, serta tidak tersangkut dalam suatu sengketa, bebas dari sitaan.",
    0,
    2,
  );
  drawParagraph(
    ctx,
    "4.  Saya menjamin bahwa surat bukti hak atas tanah tersebut adalah satu-satunya yang sah/tidak pernah dipalsukan dan tidak pernah dibuat duplikatnya oleh instansi yang berwenang atas permintaan saya.",
    0,
    2,
  );
  drawParagraph(
    ctx,
    "5.  Apabila pernyataan ini tidak benar, maka saya bertanggung jawab secara perdata maupun pidana tanpa melibatkan pihak Kantor Pertanahan.",
    0,
    4,
  );
  drawParagraph(
    ctx,
    "Demikian Surat Pernyataan ini dibuat untuk dipergunakan sebagaimana mestinya.",
    0,
    6,
  );

  drawRight(ctx, `${data.city}, ${data.dateStamp}`);
  gap(ctx, 2);
  drawRight(ctx, "Hormat Saya");
  ctx.cursor += RH * 5; // Extra space for materai/stempel

  const pernyataanTf = ctx.form.createTextField("ttd_pernyataan");
  pernyataanTf.setText(data.grantorName || "");
  pernyataanTf.setAlignment(1); // Center align
  pernyataanTf.addToPage(ctx.page, {
    x: PW - MR - 200,
    y: ty(ctx.cursor) - FIELD_H + 7,
    width: 200,
    height: FIELD_H,
    borderWidth: 0,
  });
  pernyataanTf.setFontSize(FS);
  ctx.cursor += RH;

  return doc.save();
}
