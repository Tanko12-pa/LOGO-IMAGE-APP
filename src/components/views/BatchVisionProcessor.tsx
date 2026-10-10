import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  Sliders,
  Sparkles,
  ArrowRight,
  X,
  Target,
  Palette,
  Layers,
} from 'lucide-react';
import { VisionAnalysisResult, DetectedObject } from '../../types';
import { apiService } from '../../services/apiService';
import { storageService } from '../../services/storageService';

export interface BatchImageItem {
  id: string;
  name: string;
  sizeBytes: number;
  dataUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  errorMessage?: string;
  result?: VisionAnalysisResult;
  processedAt?: string;
}

interface BatchVisionProcessorProps {
  onSelectImageForView?: (dataUrl: string, result?: VisionAnalysisResult) => void;
  onNavigate?: (view: any) => void;
  onClose?: () => void;
}

export const BatchVisionProcessor: React.FC<BatchVisionProcessorProps> = ({
  onSelectImageForView,
  onNavigate,
  onClose,
}) => {
  const [items, setItems] = useState<BatchImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);
  const [viewDetailItem, setViewDetailItem] = useState<BatchImageItem | null>(null);
  const [includePromptsInExport, setIncludePromptsInExport] = useState(true);
  const [includeColorsInExport, setIncludeColorsInExport] = useState(true);
  const [delimiter, setDelimiter] = useState<',' | '\t'>(',');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default demo items if user wants to test right away
  const loadDemoBatch = () => {
    const demoItems: BatchImageItem[] = [
      {
        id: 'batch-demo-1',
        name: 'brand_crest_vector.jpg',
        sizeBytes: 184000,
        dataUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        status: 'pending',
      },
      {
        id: 'batch-demo-2',
        name: 'tech_gateway_hardware.jpg',
        sizeBytes: 242000,
        dataUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        status: 'pending',
      },
      {
        id: 'batch-demo-3',
        name: 'luxury_studio_composition.jpg',
        sizeBytes: 310000,
        dataUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        status: 'pending',
      },
      {
        id: 'batch-demo-4',
        name: 'kinetic_emblem_automotive.jpg',
        sizeBytes: 198000,
        dataUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
        status: 'pending',
      },
    ];
    setItems((prev) => [...prev, ...demoItems]);
  };

  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newItem: BatchImageItem = {
          id: `batch-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          sizeBytes: file.size,
          dataUrl,
          status: 'pending',
        };
        setItems((prev) => [...prev, newItem]);
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  const handleProcessAll = async () => {
    if (items.length === 0 || isProcessing) return;
    setIsProcessing(true);

    for (let i = 0; i < items.length; i++) {
      const current = items[i];
      if (current.status === 'completed') continue;

      setActiveItemIndex(i);
      setItems((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: 'processing' } : item))
      );

      try {
        const result = await apiService.analyzeImage(current.dataUrl);
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? {
                  ...item,
                  status: 'completed',
                  result,
                  processedAt: new Date().toLocaleTimeString(),
                }
              : item
          )
        );
      } catch (err: any) {
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? {
                  ...item,
                  status: 'error',
                  errorMessage: err?.message || 'Vision analysis failed',
                }
              : item
          )
        );
      }
    }

    setIsProcessing(false);
    setActiveItemIndex(null);
    storageService.addNotification({
      title: 'Batch Vision Processing Complete',
      message: `Processed ${items.length} images. Ready to download spreadsheet summary.`,
      type: 'success',
    });
  };

  const handleClearItems = () => {
    setItems([]);
    setViewDetailItem(null);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (viewDetailItem?.id === id) setViewDetailItem(null);
  };

  // Helper to escape CSV fields
  const escapeCsv = (str: any) => {
    if (str === null || str === undefined) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  // Export 1: Detailed Object Level (one row per detected object)
  const exportDetailedCsv = () => {
    const completed = items.filter((i) => i.status === 'completed' && i.result);
    if (completed.length === 0) return;

    const headers = [
      'Image ID',
      'Filename',
      'Object ID',
      'Label',
      'Confidence (%)',
      'Category',
      'Box Bounding Ymin',
      'Box Bounding Xmin',
      'Box Bounding Ymax',
      'Box Bounding Xmax',
      'Dominant Color',
      'Object Metadata',
      'Brand Suggestion',
      'Design Style',
      'Overall Scene Summary',
      ...(includeColorsInExport ? ['Extracted Color Palette'] : []),
      ...(includePromptsInExport ? ['Generated Logo Prompt', 'Generated Image Prompt'] : []),
    ];

    const rows: string[] = [headers.join(delimiter)];

    completed.forEach((item) => {
      const res = item.result!;
      const objects = res.detectedObjects || [];

      if (objects.length === 0) {
        const row = [
          escapeCsv(item.id),
          escapeCsv(item.name),
          escapeCsv('none'),
          escapeCsv('No discrete objects detected'),
          escapeCsv('0'),
          escapeCsv('General'),
          escapeCsv(0),
          escapeCsv(0),
          escapeCsv(1000),
          escapeCsv(1000),
          escapeCsv(res.dominantPalette?.[0] || '#FFFFFF'),
          escapeCsv('Full scene backdrop'),
          escapeCsv(res.arOverlayInfo?.brandSuggestion || 'N/A'),
          escapeCsv(res.arOverlayInfo?.recommendedStyle || 'N/A'),
          escapeCsv(res.summary),
          ...(includeColorsInExport ? [escapeCsv(res.dominantPalette?.join(' | '))] : []),
          ...(includePromptsInExport
            ? [escapeCsv(res.extractedPrompts?.logoPrompt), escapeCsv(res.extractedPrompts?.imagePrompt)]
            : []),
        ];
        rows.push(row.join(delimiter));
      } else {
        objects.forEach((obj: DetectedObject) => {
          const row = [
            escapeCsv(item.id),
            escapeCsv(item.name),
            escapeCsv(obj.id),
            escapeCsv(obj.label),
            escapeCsv((obj.confidence * 100).toFixed(1)),
            escapeCsv(obj.category),
            escapeCsv(obj.box2d[0]),
            escapeCsv(obj.box2d[1]),
            escapeCsv(obj.box2d[2]),
            escapeCsv(obj.box2d[3]),
            escapeCsv(obj.dominantColor),
            escapeCsv(obj.metadata),
            escapeCsv(res.arOverlayInfo?.brandSuggestion || 'N/A'),
            escapeCsv(res.arOverlayInfo?.recommendedStyle || 'N/A'),
            escapeCsv(res.summary),
            ...(includeColorsInExport ? [escapeCsv(res.dominantPalette?.join(' | '))] : []),
            ...(includePromptsInExport
              ? [escapeCsv(res.extractedPrompts?.logoPrompt), escapeCsv(res.extractedPrompts?.imagePrompt)]
              : []),
          ];
          rows.push(row.join(delimiter));
        });
      }
    });

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `computer_vision_objects_summary_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export 2: Image Rollup Summary (one row per image with count and aggregated object labels)
  const exportImageRollupCsv = () => {
    const completed = items.filter((i) => i.status === 'completed' && i.result);
    if (completed.length === 0) return;

    const headers = [
      'Image ID',
      'Filename',
      'File Size (KB)',
      'Total Objects Detected',
      'Object Labels Summary',
      'Dominant Colors',
      'Top Object Category',
      'Average Confidence (%)',
      'Brand Suggestion',
      'Recommended Design Style',
      'Scene Description',
      ...(includePromptsInExport ? ['Synthesized Logo Prompt', 'Synthesized Image Prompt'] : []),
    ];

    const rows: string[] = [headers.join(delimiter)];

    completed.forEach((item) => {
      const res = item.result!;
      const objects = res.detectedObjects || [];
      const labels = objects.map((o) => `${o.label} (${(o.confidence * 100).toFixed(0)}%)`).join('; ');
      const avgConf =
        objects.length > 0
          ? (
              objects.reduce((acc, curr) => acc + curr.confidence, 0) /
              objects.length *
              100
            ).toFixed(1)
          : '0.0';
      const topCat = objects[0]?.category || 'General';

      const row = [
        escapeCsv(item.id),
        escapeCsv(item.name),
        escapeCsv((item.sizeBytes / 1024).toFixed(1)),
        escapeCsv(objects.length),
        escapeCsv(labels),
        escapeCsv(res.dominantPalette?.join(', ')),
        escapeCsv(topCat),
        escapeCsv(avgConf),
        escapeCsv(res.arOverlayInfo?.brandSuggestion || 'N/A'),
        escapeCsv(res.arOverlayInfo?.recommendedStyle || 'N/A'),
        escapeCsv(res.summary),
        ...(includePromptsInExport
          ? [escapeCsv(res.extractedPrompts?.logoPrompt), escapeCsv(res.extractedPrompts?.imagePrompt)]
          : []),
      ];
      rows.push(row.join(delimiter));
    });

    const csvContent = rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `computer_vision_images_rollup_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const completedCount = items.filter((i) => i.status === 'completed').length;
  const pendingCount = items.filter((i) => i.status === 'pending').length;

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#800020]/30 border border-[#800020] text-[#FFE566] flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4 text-[#F27430]" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <span>Batch Image Processor & Spreadsheet Generator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  CSV / Excel Ready
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                Upload multiple images simultaneously, analyze object detections in parallel, and export structured spreadsheets.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Upload & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] hover:opacity-95 text-white font-bold text-xs shadow-md shadow-[#800020]/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>Select Multiple Images</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFilesSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={loadDemoBatch}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE566]" />
            <span>Load 4 Test Samples</span>
          </button>

          {items.length > 0 && (
            <button
              type="button"
              onClick={handleClearItems}
              disabled={isProcessing}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-rose-950/40 border border-zinc-800 hover:border-rose-700/50 text-zinc-400 hover:text-rose-300 text-xs transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Queue</span>
            </button>
          )}
        </div>

        {/* Processing CTA and Status */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-400">
            {completedCount}/{items.length} Completed
          </span>
          <button
            type="button"
            onClick={handleProcessAll}
            disabled={isProcessing || pendingCount === 0}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing Queue...</span>
              </>
            ) : (
              <>
                <Target className="w-3.5 h-3.5 text-white" />
                <span>Process All ({pendingCount} pending)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spreadsheet Export Options */}
      {completedCount > 0 && (
        <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="font-mono text-zinc-400 uppercase tracking-wider font-semibold">
              Export Options:
            </span>
            <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includePromptsInExport}
                onChange={(e) => setIncludePromptsInExport(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-[#F27430] focus:ring-0"
              />
              <span>Include AI Prompts</span>
            </label>
            <label className="flex items-center gap-1.5 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeColorsInExport}
                onChange={(e) => setIncludeColorsInExport(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-900 text-[#F27430] focus:ring-0"
              />
              <span>Include Color Palettes</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportDetailedCsv}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
              title="Exports every detected object as an individual row with coordinates and confidence"
            >
              <Download className="w-3.5 h-3.5 text-[#FFE566]" />
              <span>Export Object-Level CSV</span>
            </button>

            <button
              type="button"
              onClick={exportImageRollupCsv}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              title="Exports one row per image with object totals and descriptions"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#FFE566]" />
              <span>Export Image Rollup CSV</span>
            </button>
          </div>
        </div>
      )}

      {/* Items Table / Queue Grid */}
      {items.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-zinc-800/80 space-y-3 bg-zinc-900/20">
          <FileSpreadsheet className="w-10 h-10 text-zinc-600 mx-auto" />
          <div className="text-sm font-bold text-white">No images in batch queue</div>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Upload multiple image files from your computer or load our 4 sample images to generate a comprehensive detection spreadsheet.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={loadDemoBatch}
              className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-[#FFE566] hover:bg-zinc-800 transition-colors"
            >
              Load Test Samples to Try
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-zinc-800 rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-mono text-zinc-400 uppercase">
                <th className="p-3 w-12">Preview</th>
                <th className="p-3">File Name</th>
                <th className="p-3 w-28">Status</th>
                <th className="p-3 w-36">Objects Isolated</th>
                <th className="p-3">Dominant Palette</th>
                <th className="p-3">Brand Suggestion</th>
                <th className="p-3 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/80 font-sans">
              {items.map((item, idx) => {
                const res = item.result;
                const objectsCount = res?.detectedObjects?.length ?? 0;
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-zinc-900/40 transition-colors ${
                      idx === activeItemIndex ? 'bg-[#800020]/15' : ''
                    }`}
                  >
                    <td className="p-3">
                      <img
                        src={item.dataUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-zinc-800"
                      />
                    </td>
                    <td className="p-3 min-w-[140px]">
                      <div className="font-semibold text-white truncate max-w-[200px]">
                        {item.name}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {(item.sizeBytes / 1024).toFixed(1)} KB
                      </div>
                    </td>
                    <td className="p-3">
                      {item.status === 'pending' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                          Pending
                        </span>
                      )}
                      {item.status === 'processing' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 flex items-center gap-1 w-fit animate-pulse">
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                          <span>Analyzing</span>
                        </span>
                      )}
                      {item.status === 'completed' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          <span>Done</span>
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 flex items-center gap-1 w-fit">
                          <AlertCircle className="w-2.5 h-2.5 text-rose-400" />
                          <span>Error</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {res ? (
                        <div className="space-y-1">
                          <span className="font-bold text-[#FFE566] text-xs">
                            {objectsCount} Objects
                          </span>
                          <div className="text-[10px] text-zinc-400 truncate max-w-[150px]">
                            {res.detectedObjects?.map((o) => o.label).join(', ')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-600 font-mono text-[11px]">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      {res?.dominantPalette && res.dominantPalette.length > 0 ? (
                        <div className="flex items-center gap-1">
                          {res.dominantPalette.slice(0, 4).map((c, ci) => (
                            <span
                              key={ci}
                              className="w-4 h-4 rounded-md border border-black/50"
                              style={{ backgroundColor: c }}
                              title={c}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-600 font-mono text-[11px]">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      {res?.arOverlayInfo ? (
                        <div>
                          <div className="font-medium text-white truncate max-w-[130px]">
                            {res.arOverlayInfo.brandSuggestion}
                          </div>
                          <div className="text-[10px] text-zinc-500 truncate max-w-[130px]">
                            {res.arOverlayInfo.recommendedStyle}
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-600 font-mono text-[11px]">—</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {res && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onSelectImageForView) {
                                onSelectImageForView(item.dataUrl, res);
                              }
                              setViewDetailItem(item);
                            }}
                            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                            title="Inspect in HUD view"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#FFE566]" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-300 transition-colors"
                          title="Remove from batch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Item Detail Inspector Modal */}
      {viewDetailItem?.result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <Target className="w-5 h-5 text-[#F27430]" />
                <div>
                  <h3 className="text-base font-bold font-heading text-white truncate max-w-[360px]">
                    {viewDetailItem.name}
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {viewDetailItem.result.detectedObjects.length} Objects Detected •{' '}
                    {viewDetailItem.result.arOverlayInfo.brandSuggestion}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewDetailItem(null)}
                className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-zinc-800">
              <img
                src={viewDetailItem.dataUrl}
                alt={viewDetailItem.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 text-xs">
              <span className="font-mono text-[#FFE566] text-[11px] uppercase font-semibold">
                Scene Analysis:
              </span>
              <p className="text-zinc-300 leading-relaxed">{viewDetailItem.result.summary}</p>
            </div>

            {/* Objects table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Isolated Object Coordinates:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {viewDetailItem.result.detectedObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span>{obj.label}</span>
                      <span className="text-[#FFE566] font-mono">
                        {(obj.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400">{obj.metadata}</div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      BBox: [{obj.box2d.join(', ')}]
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setViewDetailItem(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
