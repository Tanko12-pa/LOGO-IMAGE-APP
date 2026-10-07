import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Folder,
  Star,
  Trash2,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { NavView, Project } from '../../types';

interface ProjectsViewProps {
  projects: Project[];
  onSaveProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  onNavigate: (view: NavView) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onSaveProject,
  onDeleteProject,
  onNavigate,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const proj: Project = {
      id: `proj-${Date.now()}`,
      name: newProjectName.trim(),
      description: newProjectDesc.trim() || 'Custom branding initiative',
      itemsCount: 0,
      itemIds: [],
      isArchived: false,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveProject(proj);
    setNewProjectName('');
    setNewProjectDesc('');
    setShowCreateModal(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#800020]/20 border border-[#800020]/40 text-[#FFE566] text-xs font-mono font-semibold mb-2">
            <FolderKanban className="w-3.5 h-3.5 text-[#F27430]" />
            <span>Workspace Asset Organization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Projects
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Organize logos, graphics, and video campaigns into dedicated project folders.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold shadow-md flex items-center gap-2 hover:opacity-95"
        >
          <Plus className="w-4 h-4 text-[#FFE566]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4 hover:border-[#F27430]/60 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-[#FFE566] group-hover:scale-105 transition-transform">
                  <Folder className="w-6 h-6 text-[#F27430]" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onDeleteProject(proj.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-900 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-white">{proj.name}</h3>
              <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                {proj.description}
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>{proj.itemsCount} Assets</span>
              <button
                type="button"
                onClick={() => onNavigate('my-designs')}
                className="text-[#FFE566] hover:underline font-sans font-semibold flex items-center gap-1"
              >
                <span>Open Folder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-zinc-950 rounded-3xl border border-zinc-800 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold font-heading text-white">Create New Project</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Project Name</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. 2026 Brand Refresh"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-300 font-semibold">Description</label>
                <input
                  type="text"
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  placeholder="Brief purpose of project"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-[#F27430]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#800020] to-[#F27430] text-white text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
