import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";

/**
 * Capture an HTML element and download it as PDF.
 * @param element HTML element to capture
 * @param fileName PDF file name
 */
export async function downloadSnapshotPDF(
  element: HTMLElement,
  fileName: string,
) {
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4"); // portrait, mm, A4

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgProps = pdf.getImageProperties(imgData);
  const imgWidth = pdfWidth;
  const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    pdf.addPage();
    position = heightLeft - imgHeight;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(fileName);
}

/**
 * Download an HTML element as PDF.
 * @param element HTML element
 * @param fileName PDF file name
 */
export function downloadDomAsPDF(
  domElement: HTMLElement,
  fileName = "Surat_Kuasa.pdf",
) {
  html2pdf()
    .set({
      margin: [20, 20, 20, 20],
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, letterRendering: true },
      jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    })
    .from(domElement)
    .save();
}
