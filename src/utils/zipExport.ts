import JSZip from 'jszip';
import { DesignItem } from '../types';
import { extractVisualCharacteristics } from './aiMetadataExtractor';

export interface BatchZipExportOptions {
  designs: DesignItem[];
  zipFilename?: string;
  onProgress?: (progressPercent: number, statusText: string) => void;
}

/**
 * Converts a data URL to a clean Base64 string without data prefix
 */
function cleanBase64(dataUrl: string): { data: string; mime: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { mime: match[1], data: match[2] };
  }
  return { mime: 'image/png', data: dataUrl };
}

/**
 * Sanitizes a title string for use as a filesystem filename
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'asset';
}

/**
 * Exports multiple DesignItems as a compressed ZIP file using JSZip.
 * Includes SVG vectors, raster images, JSON metadata manifest, and README.
 */
export async function exportDesignsAsZip({
  designs,
  zipFilename,
  onProgress,
}: BatchZipExportOptions): Promise<{ blob: Blob; filename: string }> {
  if (!designs || designs.length === 0) {
    throw new Error('No designs provided for batch export.');
  }

  const zip = new JSZip();
  const folderName = `logmage-designs-${new Date().toISOString().slice(0, 10)}`;
  const root = zip.folder(folderName) || zip;

  const manifestItems: any[] = [];
  const total = designs.length;

  for (let i = 0; i < designs.length; i++) {
    const item = designs[i];
    const indexPrefix = String(i + 1).padStart(2, '0');
    const safeTitle = sanitizeFilename(item.title);
    const visualMeta = extractVisualCharacteristics(item);

    onProgress?.(
      Math.round(((i + 0.2) / total) * 80),
      `Processing ${indexPrefix}/${total}: ${item.title}`
    );

    let savedFilename = '';

    // 1. Export SVG Vector if available
    if (item.svgCode) {
      savedFilename = `${indexPrefix}-${safeTitle}.svg`;
      root.file(savedFilename, item.svgCode);
    } else if (item.url && item.url.startsWith('data:')) {
      // 2. Export Base64 Data URL
      const { data, mime } = cleanBase64(item.url);
      const ext = mime.includes('png') ? 'png' : mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : 'png';
      savedFilename = `${indexPrefix}-${safeTitle}.${ext}`;
      root.file(savedFilename, data, { base64: true });
    } else if (item.url) {
      // 3. Remote URL (e.g. Unsplash or Cloud Storage)
      const ext = item.url.includes('.png') ? 'png' : 'jpg';
      savedFilename = `${indexPrefix}-${safeTitle}.${ext}`;

      try {
        const response = await fetch(item.url, { mode: 'cors' });
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          root.file(savedFilename, buffer);
        } else {
          // If remote fetch fails, provide SVG card representation
          const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#0B0B0E"/>
  <text x="50%" y="45%" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="28" font-weight="bold">${item.title}</text>
  <text x="50%" y="55%" text-anchor="middle" fill="#F27430" font-family="sans-serif" font-size="16">${item.prompt}</text>
  <text x="50%" y="65%" text-anchor="middle" fill="#FFE566" font-family="monospace" font-size="12">Source: ${item.url}</text>
</svg>`;
          savedFilename = `${indexPrefix}-${safeTitle}-preview.svg`;
          root.file(savedFilename, fallbackSvg);
        }
      } catch (err) {
        // Fallback card if CORS blocks the request
        const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#0B0B0E"/>
  <text x="50%" y="45%" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="28" font-weight="bold">${item.title}</text>
  <text x="50%" y="55%" text-anchor="middle" fill="#F27430" font-family="sans-serif" font-size="16">${item.prompt}</text>
  <text x="50%" y="65%" text-anchor="middle" fill="#FFE566" font-family="monospace" font-size="12">Source: ${item.url}</text>
</svg>`;
        savedFilename = `${indexPrefix}-${safeTitle}-preview.svg`;
        root.file(savedFilename, fallbackSvg);
      }
    }

    // Accumulate manifest data
    manifestItems.push({
      index: i + 1,
      filename: savedFilename,
      id: item.id,
      title: item.title,
      type: item.type,
      prompt: item.prompt,
      aspectRatio: item.aspectRatio,
      dimensions: item.dimensions || '1024x1024',
      palette: item.palette,
      tags: item.tags,
      isFavorite: item.isFavorite,
      createdAt: item.createdAt,
      aiVisualCharacteristics: {
        primaryStyle: visualMeta.primaryStyle,
        dominantMood: visualMeta.dominantMood,
        contrastRatio: visualMeta.contrastRatio,
        scalabilityRating: visualMeta.scalabilityRating,
        extractedTags: visualMeta.tags.map((t) => ({ label: t.label, category: t.category, confidence: t.confidence })),
      },
    });
  }

  onProgress?.(85, 'Compiling AI Visual Manifest & metadata...');

  // Add JSON Manifest
  const manifestContent = JSON.stringify(
    {
      appName: 'AI Studio Logo & Image Creator',
      exportDate: new Date().toISOString(),
      totalAssetsCount: designs.length,
      brandKitColors: ['#800020', '#FFFFFF', '#FFE566', '#F27430'],
      assets: manifestItems,
    },
    null,
    2
  );
  root.file('manifest.json', manifestContent);

  // Add README.txt documentation
  const readmeContent = `=====================================================
AI STUDIO LOGO & IMAGE CREATOR - BATCH EXPORT ARCHIVE
=====================================================
Export Timestamp: ${new Date().toUTCString()}
Total Assets: ${designs.length}

PACKAGE CONTENTS:
-----------------
1. Vector SVG Files / High-Res Visuals:
   Each asset is exported with its production geometry and color gradients.

2. manifest.json:
   Complete machine-readable JSON metadata containing original prompts,
   color palettes, dimensions, and AI visual characteristics.

BRAND PALETTE SIGNATURE:
------------------------
- Imperial Burgundy: #800020
- Vibrant Tangerine: #F27430
- Sunburst Amber:    #FFE566
- Pure Canvas White: #FFFFFF
- Obsidian Noir:     #0B0B0E

AI VISUAL CHARACTERISTICS EXTRACTED:
------------------------------------
${manifestItems
  .map(
    (m) =>
      `• [${m.type.toUpperCase()}] ${m.title}
  Prompt: "${m.prompt}"
  AI Tags: ${m.aiVisualCharacteristics.extractedTags.map((t: any) => t.label).join(', ')}`
  )
  .join('\n\n')}

Generated with Google AI Studio Logmage Engine.
=====================================================
`;
  root.file('README.txt', readmeContent);

  onProgress?.(92, 'Compressing archive with DEFLATE...');

  // Generate ZIP blob
  const zipBlob = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      onProgress?.(92 + Math.round(metadata.percent * 0.08), `Archiving ${Math.round(metadata.percent)}%`);
    }
  );

  const finalFilename = zipFilename || `logmage-designs-batch-${new Date().toISOString().slice(0, 10)}.zip`;

  onProgress?.(100, 'Batch ZIP Archive ready!');
  return { blob: zipBlob, filename: finalFilename };
}

/**
 * Triggers a direct browser file download for a Blob
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
