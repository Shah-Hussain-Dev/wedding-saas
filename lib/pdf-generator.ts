import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export interface PdfExportOptions {
  fileName?: string;
  quality?: number; // 0.1 to 1.0 (default: 0.95)
  scale?: number; // Canvas DPI multiplier (default: 2.5 for crisp 300 DPI)
  onProgress?: (progress: number) => void;
}

/**
 * Sanitizes a string into a clean, safe filename
 */
export function sanitizePdfFileName(name: string): string {
  const clean = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return clean ? `${clean}.pdf` : "wedding-invitation.pdf";
}

/**
 * Renders an A5 invitation DOM element into a print-ready PDF and triggers browser download
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  options: PdfExportOptions = {}
): Promise<boolean> {
  try {
    const scale = options.scale ?? 2.5;
    const quality = options.quality ?? 0.96;
    const fileName = options.fileName
      ? sanitizePdfFileName(options.fileName)
      : "wedding-invitation.pdf";

    // Ensure all web fonts are loaded before capturing
    if (typeof document !== "undefined" && document.fonts) {
      await document.fonts.ready;
    }

    // Capture DOM element using html2canvas-pro with retina scale
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/jpeg", quality);

    // Standard A5 Dimensions: 148 mm × 210 mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a5",
      compress: true,
    });

    const pdfWidth = 148;
    const pdfHeight = 210;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
    pdf.save(fileName);

    return true;
  } catch (err) {
    console.error("PDF generation error:", err);
    throw err;
  }
}

/**
 * Renders an A5 invitation DOM element and returns a Blob URL for instant iframe/tab preview
 */
export async function generatePdfBlobUrl(
  element: HTMLElement,
  scale: number = 2.0
): Promise<string> {
  if (typeof document !== "undefined" && document.fonts) {
    await document.fonts.ready;
  }

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.92);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a5",
    compress: true,
  });

  pdf.addImage(imgData, "JPEG", 0, 0, 148, 210, undefined, "FAST");
  const blob = pdf.output("blob");
  return URL.createObjectURL(blob);
}
