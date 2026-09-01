"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import type { Model, ModelMedia, ModelStats } from "@/types/model";
import { modelPageLabels } from "@/lib/i18n/model-page";
import type { SiteLocale } from "@/lib/i18n/locale";

interface DownloadPortfolioButtonProps {
  slug: string;
  name: string;
  stats: ModelStats;
  featuredImage?: string;
  locale?: SiteLocale;
}

interface LoadedImage {
  dataUrl: string;
  width: number;
  height: number;
}

const PDF_MARGIN_X_MM = 14;
const PDF_MARGIN_TOP_MM = 10;
const PDF_MARGIN_BOTTOM_MM = 12;
const PDF_HEADER_HEIGHT_MM = 22;
const PDF_FOOTER_HEIGHT_MM = 22;
const PDF_IMAGE_GAP_MM = 8;
const JPEG_QUALITY = 0.92;

async function loadImageAsDataUrl(src: string): Promise<LoadedImage | null> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        resolve({
          dataUrl,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      } catch (err) {
        console.error("[DownloadPortfolioButton] Failed to rasterize image:", err);
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function fitInBox(
  imgWidth: number,
  imgHeight: number,
  boxWidth: number,
  boxHeight: number,
): { width: number; height: number } {
  const ratio = Math.min(boxWidth / imgWidth, boxHeight / imgHeight);
  return { width: imgWidth * ratio, height: imgHeight * ratio };
}

function buildStatsLine(stats: ModelStats, locale: SiteLocale = "en"): string {
  const labels = modelPageLabels(locale);
  const parts: string[] = [];
  if (stats.height) parts.push(`${labels.statHeight} ${stats.height}`);
  if (stats.bust) parts.push(`${labels.statBust} ${stats.bust}`);
  if (stats.waist) parts.push(`${labels.statWaist} ${stats.waist}`);
  if (stats.hips) parts.push(`${labels.statHips} ${stats.hips}`);
  if (stats.shoeSize) parts.push(`${labels.statShoe} ${stats.shoeSize}`);
  if (stats.hairColor) parts.push(`${labels.statHair} ${stats.hairColor}`);
  if (stats.eyeColor) parts.push(`${labels.statEyes} ${stats.eyeColor}`);
  return parts.join("   \u2022   ");
}

function dedupeOrderedImages(
  featuredImage: string,
  modelName: string,
  gallery: ModelMedia[],
): ModelMedia[] {
  const seen = new Set<string>();
  const ordered: ModelMedia[] = [];
  if (featuredImage) {
    ordered.push({
      type: "image",
      src: featuredImage,
      alt: `${modelName} - Featured`,
    });
    seen.add(featuredImage);
  }
  for (const item of gallery) {
    if (item.type !== "image" || !item.src) continue;
    if (seen.has(item.src)) continue;
    ordered.push(item);
    seen.add(item.src);
  }
  return ordered;
}

function renderHeader(pdf: jsPDF, pageWidth: number): void {
  const centerX = pageWidth / 2;
  pdf.setFont("times", "normal");
  pdf.setFontSize(26);
  pdf.setTextColor(20);
  pdf.text("V \u00C8 L I S H E", centerX, PDF_MARGIN_TOP_MM + 10, {
    align: "center",
    charSpace: 1.4,
  });
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(80);
  pdf.text("M G M T", centerX, PDF_MARGIN_TOP_MM + 16, {
    align: "center",
    charSpace: 2.2,
  });
}

function renderFooter(
  pdf: jsPDF,
  pageWidth: number,
  pageHeight: number,
  modelName: string,
  statsLine: string,
): void {
  const centerX = pageWidth / 2;
  const dividerY = pageHeight - PDF_MARGIN_BOTTOM_MM - PDF_FOOTER_HEIGHT_MM + 4;
  pdf.setDrawColor(200);
  pdf.setLineWidth(0.2);
  pdf.line(PDF_MARGIN_X_MM, dividerY, pageWidth - PDF_MARGIN_X_MM, dividerY);

  pdf.setFont("times", "bold");
  pdf.setFontSize(16);
  pdf.setTextColor(20);
  pdf.text(modelName, centerX, pageHeight - PDF_MARGIN_BOTTOM_MM - 9, {
    align: "center",
  });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(70);
  pdf.text(statsLine, centerX, pageHeight - PDF_MARGIN_BOTTOM_MM - 2, {
    align: "center",
  });
}

function renderImageInBox(
  pdf: jsPDF,
  image: LoadedImage,
  boxX: number,
  boxY: number,
  boxWidth: number,
  boxHeight: number,
): void {
  const { width, height } = fitInBox(image.width, image.height, boxWidth, boxHeight);
  const x = boxX + (boxWidth - width) / 2;
  const y = boxY + (boxHeight - height) / 2;
  pdf.addImage(image.dataUrl, "JPEG", x, y, width, height, undefined, "FAST");
}

async function fetchAllGalleryImages(slug: string): Promise<{
  gallery: ModelMedia[];
  featuredImage: string;
} | null> {
  try {
    const response = await fetch(`/api/models/${slug}?type=image`, {
      cache: "no-store",
    });
    if (!response.ok) {
      console.error(
        `[DownloadPortfolioButton] Failed to fetch model: ${response.status}`,
      );
      return null;
    }
    const data: Model = await response.json();
    return {
      gallery: data.gallery ?? [],
      featuredImage: data.featuredImage ?? "",
    };
  } catch (err) {
    console.error("[DownloadPortfolioButton] Failed to fetch model:", err);
    return null;
  }
}

export default function DownloadPortfolioButton({
  slug,
  name,
  stats,
  featuredImage,
  locale = "en",
}: DownloadPortfolioButtonProps) {
  const [loading, setLoading] = useState(false);
  const labels = modelPageLabels(locale);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const fetched = await fetchAllGalleryImages(slug);
      const gallery = fetched?.gallery ?? [];
      const resolvedFeatured = featuredImage || fetched?.featuredImage || "";

      const ordered = dedupeOrderedImages(resolvedFeatured, name, gallery);

      if (ordered.length === 0) {
        window.alert(labels.noImagesForPdf);
        return;
      }

      const loaded = await Promise.all(
        ordered.map((item) => loadImageAsDataUrl(item.src)),
      );
      const validImages = loaded.filter((img): img is LoadedImage => img !== null);

      if (validImages.length === 0) {
        window.alert(labels.failedLoadImages);
        return;
      }

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const contentTop = PDF_MARGIN_TOP_MM + PDF_HEADER_HEIGHT_MM;
      const contentHeight =
        pageHeight -
        PDF_MARGIN_TOP_MM -
        PDF_MARGIN_BOTTOM_MM -
        PDF_HEADER_HEIGHT_MM -
        PDF_FOOTER_HEIGHT_MM;
      const imageBoxWidth =
        (pageWidth - PDF_MARGIN_X_MM * 2 - PDF_IMAGE_GAP_MM) / 2;
      const imageBoxHeight = contentHeight;
      const statsLine = buildStatsLine(stats, locale);

      for (let pageIndex = 0; pageIndex * 2 < validImages.length; pageIndex += 1) {
        if (pageIndex > 0) pdf.addPage();

        renderHeader(pdf, pageWidth);

        const leftImage = validImages[pageIndex * 2];
        if (leftImage) {
          renderImageInBox(
            pdf,
            leftImage,
            PDF_MARGIN_X_MM,
            contentTop,
            imageBoxWidth,
            imageBoxHeight,
          );
        }

        const rightImage = validImages[pageIndex * 2 + 1];
        if (rightImage) {
          renderImageInBox(
            pdf,
            rightImage,
            PDF_MARGIN_X_MM + imageBoxWidth + PDF_IMAGE_GAP_MM,
            contentTop,
            imageBoxWidth,
            imageBoxHeight,
          );
        }

        renderFooter(pdf, pageWidth, pageHeight, name, statsLine);
      }

      pdf.save(`${slug}-portfolio.pdf`);
    } catch (err) {
      console.error("[DownloadPortfolioButton] Failed to generate PDF:", err);
      window.alert(labels.failedGeneratePdf);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      aria-label={labels.downloadPdfAria}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>{labels.generatingPdf}</span>
        </>
      ) : (
        <>
          <Download size={16} />
          <span>{labels.downloadPdf}</span>
        </>
      )}
    </button>
  );
}
