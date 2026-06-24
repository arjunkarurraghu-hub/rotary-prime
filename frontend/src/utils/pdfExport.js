import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Render a DOM element to a downloadable PDF.
// Scales the captured canvas to fit an A4 page (portrait by default).
export async function downloadElementAsPdf(element, fileName = "document.pdf", opts = {}) {
  if (!element) return;
  const orientation = opts.orientation || "portrait";

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight
  });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4"
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Fit width
  const ratio = canvas.height / canvas.width;
  let drawW = pageWidth;
  let drawH = pageWidth * ratio;
  // If too tall, fit by height instead
  if (drawH > pageHeight) {
    drawH = pageHeight;
    drawW = pageHeight / ratio;
  }
  const offsetX = (pageWidth - drawW) / 2;
  const offsetY = (pageHeight - drawH) / 2;
  pdf.addImage(imgData, "PNG", offsetX, offsetY, drawW, drawH);
  pdf.save(fileName);
}
