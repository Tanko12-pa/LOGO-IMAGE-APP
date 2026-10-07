import React, { useState } from 'react';
import {
  Library,
  Star,
  History,
  Download,
  Trash2,
  Sparkles,
  Search,
  Copy,
  Check,
  CheckSquare,
  Square,
  Archive,
  Loader2,
  X,
  FileCode,
  Shield,
  Palette,
  Box,
} from 'lucide-react';
import { DesignItem, NavView } from '../../types';
import { exportDesignsAsZip, triggerFileDownload } from '../../utils/zipExport';
import { extractVisualCharacteristics } from '../../utils/aiMetadataExtractor';

interface GalleryViewsProps {
  mode: 'my-designs' | 'favorites' | 'history';
  designs: DesignItem[];
  onToggleFavorite: (id: string) => void;
  onDeleteDesign: (id: string) => void;
  onNavigate: (view: NavView) => void;
}

export const GalleryViews: React.FC<GalleryViewsProps> = ({
  mode,
  designs,
  onToggleFavorite,
  onDeleteDesign,
  onNavigate,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'logo' | 'image' | 'video'>('all');
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Multi-select Batch Download State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [exportProgress, setExportProgress] = useState<{ percent: number; message: string } | null>(null);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  const title =
    mode === 'my-designs'
      ? 'My Designs Library'
      : mode === 'favorites'
      ? 'Favorite Assets'
      : 'Generation History';

  const subtitle =
    mode === 'my-designs'
      ? 'All your generated logos, high-resolution visuals, and brand assets.'
      : mode === 'favorites'
      ? 'Your bookmarked logos and starred visuals for quick access.'
      : 'Chronological timeline of all AI prompts and model generations.';

  const filtered = designs.filter((item) => {
    if (mode === 'favorites' && !item.isFavorite) return false;
    const matchesType = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.prompt.toLowerCase().includes(search.toLowerCase()) ||
      (item.tags || []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((item) => selectedIds.has(item.id));

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      // Unselect only the filtered ones
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((item) => next.delete(item.id));
        return next;
      });
    } else {
      // Select all filtered ones
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((item) => next.add(item.id));
        return next;
      });
    }
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleCopyPrompt = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSingleDownload = (item: DesignItem) => {
    if (item.svgCode) {
      const blob = new Blob([item.svgCode], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${item.title.toLowerCase().replace(/\s+/g, '-')}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      const link = document.createElement('a');
      link.href = item.url;
      link.download = `${item.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      link.target = '_blank';
      link.click();
    }
  };

  // Batch ZIP Export Handler
  const handleBatchDownloadZip = async () => {
    const selectedDesigns = designs.filter((d) => selectedIds.has(d.id));
    if (selectedDesigns.length === 0) return;

    setIsExportingZip(true);
    setExportProgress({ percent: 10, message: 'Initializing batch package...' });
    setExportSuccessMessage(null);

    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      const zipName = `logmage-batch-${selectedDesigns.length}-designs-${dateStr}.zip`;

      const { blob, filename } = await exportDesignsAsZip({
        designs: selectedDesigns,
        zipFilename: zipName,
        onProgress: (percent, message) => {
          setExportProgress({ percent, message });
        },
      });

      triggerFileDownload(blob, filename);
      setExportSuccessMessage(`Successfully exported ${selectedDesigns.length} designs in ZIP archive!`);
      setTimeout(() => setExportSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Failed to export batch ZIP:', err);
      alert(`Export failed: ${err?.message || 'Unknown error occurred while packaging ZIP.'}`);
    } finally {
      setIsExportingZip(false);
      setExportProgress(null);
    }
  };

  // Batch toggle favorite
  const handleBatchFavorite = () => {
    selectedIds.forEach((id) => {
      onToggleFavorite(id);
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/20 border border-[#800020]/40 text-[#FFE566] text-xs font-mono font-semibold mb-2">
            {mode === 'my-designs' ? (
              <Library className="w-3.5 h-3.5 text-[#F27430]" />
            ) : mode === 'favorites' ? (
              <Star className="w-3.5 h-3.5 text-[#FFE566]" />
            ) : (
              <History className="w-3.5 h-3.5 text-zinc-400" />
            )}
            <span>{title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{title}</h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompt, title, or tags..."
              className="w-full sm:w-64 pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#F27430]"
            />
          </div>

          {/* Quick Select All Toggle in Header */}
          {filtered.length > 0 && (
            <button
              type="button"
              onClick={handleSelectAllFiltered}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                allFilteredSelected
                  ? 'bg-[#800020]/40 border-[#F27430] text-[#FFE566]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700'
              }`}
            >
              {allFilteredSelected ? (
                <>
                  <CheckSquare className="w-4 h-4 text-[#F27430]" />
                  <span>Deselect All</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4 text-zinc-400" />
                  <span>Select All ({filtered.length})</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Selection summary */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['all', 'logo', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeFilter === t
                  ? 'bg-[#800020] text-white border border-[#F27430]'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {selectedIds.size > 0 && (
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F27430] animate-pulse" />
            <span>
              {selectedIds.size} of {designs.length} selected
            </span>
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-zinc-500 hover:text-zinc-300 underline text-[11px]"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Success Notification Alert */}
      {exportSuccessMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{exportSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setExportSuccessMessage(null)}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Gallery Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isSelected = selectedIds.has(item.id);
            const visualMeta = extractVisualCharacteristics(item);

            return (
              <div
                key={item.id}
                className={`group rounded-3xl bg-zinc-950 border overflow-hidden shadow-xl transition-all flex flex-col relative ${
                  isSelected
                    ? 'border-[#F27430] ring-2 ring-[#F27430]/40 shadow-[#F27430]/10'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Preview Window */}
                <div className="relative aspect-video bg-zinc-900 flex items-center justify-center p-4 overflow-hidden">
                  {item.svgCode ? (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: item.svgCode }}
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Top-Left Selection Checkbox */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSelect(item.id);
                      }}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#F27430] text-white shadow-lg shadow-[#F27430]/40'
                          : 'bg-black/60 text-zinc-300 hover:bg-black/80 hover:text-white'
                      }`}
                      title={isSelected ? 'Deselect from batch' : 'Select for batch export'}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-white" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono text-white uppercase">
                      {item.type}
                    </span>
                    {item.svgCode && (
                      <span className="px-2 py-0.5 rounded-md bg-[#800020]/90 text-[10px] font-mono text-[#FFE566]">
                        SVG
                      </span>
                    )}
                  </div>

                  {/* Top-Right Favorite & Delete Controls */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-zinc-300 hover:text-[#FFE566] transition-colors"
                      title={item.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          item.isFavorite ? 'fill-[#FFE566] text-[#FFE566]' : ''
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDesign(item.id);
                      }}
                      className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-zinc-300 hover:text-red-400 transition-colors"
                      title="Delete design"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3 bg-zinc-950">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.prompt}
                    </p>

                    {/* Auto-Tagging Badges Extracted via AI Metadata */}
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-zinc-900/80">
                      {visualMeta.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          title={tag.tooltip}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-[#F27430]/40 transition-colors cursor-default"
                        >
                          {tag.category === 'geometry' && <Box className="w-2.5 h-2.5 text-[#FFE566]" />}
                          {tag.category === 'color' && <Palette className="w-2.5 h-2.5 text-[#F27430]" />}
                          {tag.category === 'fidelity' && <FileCode className="w-2.5 h-2.5 text-[#800020]" />}
                          {tag.category === 'compliance' && <Shield className="w-2.5 h-2.5 text-emerald-400" />}
                          <span>{tag.label}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-900 text-xs text-zinc-500">
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(item.prompt, item.id)}
                      className="hover:text-white font-mono flex items-center gap-1 text-[11px]"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === item.id ? 'Copied' : 'Prompt'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSingleDownload(item)}
                      className="text-[#FFE566] hover:underline font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950 p-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
            <Sparkles className="w-6 h-6 text-[#FFE566]" />
          </div>
          <h3 className="text-base font-bold font-heading text-white">No items found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            {mode === 'favorites'
              ? 'Star your favorite designs to see them collected here.'
              : 'Generate vector logos or visuals to build your creative archive.'}
          </p>
          <button
            type="button"
            onClick={() => onNavigate('logo-generator')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold"
          >
            Create New Asset
          </button>
        </div>
      )}

      {/* Floating Batch Actions Dock (Visible when 1+ designs are selected) */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl">
          <div className="rounded-2xl bg-zinc-950/95 border border-[#F27430]/60 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F27430] animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-white">
                  {selectedIds.size} {selectedIds.size === 1 ? 'Design' : 'Designs'} Selected
                </span>
              </div>

              <button
                type="button"
                onClick={handleClearSelection}
                className="text-xs text-zinc-400 hover:text-white underline font-mono"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleBatchFavorite}
                className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-[#FFE566] hover:border-zinc-700 transition-all flex items-center gap-1.5"
                title="Bookmark all selected"
              >
                <Star className="w-3.5 h-3.5 text-[#FFE566]" />
                <span className="hidden sm:inline">Star All</span>
              </button>

              <button
                type="button"
                onClick={handleBatchDownloadZip}
                disabled={isExportingZip}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] via-[#800020] to-[#F27430] text-white text-xs font-bold shadow-lg shadow-[#800020]/40 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExportingZip ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#FFE566]" />
                    <span>Packaging ZIP ({exportProgress?.percent || 0}%)...</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-4 h-4 text-[#FFE566]" />
                    <span>Download as ZIP</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Export Progress Bar */}
          {isExportingZip && exportProgress && (
            <div className="mt-2 p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800 text-[11px] font-mono text-zinc-300 space-y-1.5 backdrop-blur-md">
              <div className="flex justify-between">
                <span>{exportProgress.message}</span>
                <span className="text-[#FFE566] font-bold">{exportProgress.percent}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#800020] via-[#F27430] to-[#FFE566] transition-all duration-200"
                  style={{ width: `${exportProgress.percent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
