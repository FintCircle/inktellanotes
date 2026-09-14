import React, { useState } from 'react';
import { useInktella } from '../context/InktellaContext';
import { Shield, Check, Trash2, Plus, Sparkles, AlertCircle, Wrench, Layers, ImagePlus, X } from 'lucide-react';
import { ToolIcon } from './ToolIcon';

export const AdminModerationView: React.FC = () => {
  const {
    reports,
    notes,
    comments,
    contexts,
    tools,
    users,
    adminResolveReport,
    deleteComment,
    updateNote,
    adminCreateContext,
    adminCreateTool,
    adminToggleFeatureNote,
  } = useInktella();

  const [activeTab, setActiveTab] = useState<'reports' | 'featured' | 'taxonomy'>('reports');

  // Taxonomy inputs
  const [newContextName, setNewContextName] = useState('');
  const [newContextDesc, setNewContextDesc] = useState('');
  const [newToolName, setNewToolName] = useState('');
  const [newToolCategory, setNewToolCategory] = useState('development');
  const [newToolDesc, setNewToolDesc] = useState('');
  const [newToolLogoUrl, setNewToolLogoUrl] = useState('');
  const [newToolLogoFile, setNewToolLogoFile] = useState('');
  const [logoError, setLogoError] = useState('');

  const handleCreateContext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContextName.trim()) return;
    adminCreateContext(newContextName.trim(), newContextDesc.trim());
    setNewContextName('');
    setNewContextDesc('');
  };

  const handleCreateTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim()) return;
    adminCreateTool(newToolName.trim(), newToolDesc.trim(), newToolCategory as any, [], 'Wrench', undefined, newToolLogoFile || newToolLogoUrl.trim() || undefined);
    setNewToolName('');
    setNewToolDesc('');
    setNewToolLogoUrl('');
    setNewToolLogoFile('');
    setLogoError('');
  };

  const handleLogoFile = (file?: File) => {
    setLogoError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setLogoError('Choose an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Logo files must be 2 MB or smaller.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setNewToolLogoFile(String(reader.result));
    reader.readAsDataURL(file);
  };

  const pendingReports = reports.filter((r) => r.status === 'pending');

  return (
    <div id="admin-moderation-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-stone-400 text-xs font-mono uppercase tracking-wider mb-1">
          <Shield className="w-3.5 h-3.5 text-stone-600 dark:text-stone-300" />
          <span>Network Management</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Curatorial & Moderation Console
        </h1>
        <p className="font-editorial text-base text-stone-600 dark:text-stone-400 mt-1">
          Review network safety, curate editorial features, and expand the canonical taxonomy.
        </p>
      </header>

      {/* Tabs (No pills) */}
      <nav
        aria-label="Moderation tabs"
        className="flex items-center gap-6 sm:gap-8 overflow-x-auto border-b border-stone-200 dark:border-stone-800 no-scrollbar mb-6 -mb-px text-sm"
      >
        <button
          id="admin-tab-reports"
          onClick={() => setActiveTab('reports')}
          className={`pb-3 font-medium transition-all relative shrink-0 flex items-center gap-2 cursor-pointer focus:outline-none ${
            activeTab === 'reports'
              ? 'text-stone-950 dark:text-stone-50 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-normal'
          }`}
        >
          <AlertCircle className={`w-3.5 h-3.5 ${activeTab === 'reports' ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400'}`} />
          <span>Flagged Content</span>
          <span className="text-xs text-stone-400 font-mono">({pendingReports.length})</span>
          {activeTab === 'reports' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100" />
          )}
        </button>

        <button
          id="admin-tab-featured"
          onClick={() => setActiveTab('featured')}
          className={`pb-3 font-medium transition-all relative shrink-0 flex items-center gap-2 cursor-pointer focus:outline-none ${
            activeTab === 'featured'
              ? 'text-stone-950 dark:text-stone-50 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-normal'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'featured' ? 'text-amber-600' : 'text-stone-400'}`} />
          <span>Curated Picks</span>
          {activeTab === 'featured' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100" />
          )}
        </button>

        <button
          id="admin-tab-taxonomy"
          onClick={() => setActiveTab('taxonomy')}
          className={`pb-3 font-medium transition-all relative shrink-0 flex items-center gap-2 cursor-pointer focus:outline-none ${
            activeTab === 'taxonomy'
              ? 'text-stone-950 dark:text-stone-50 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-normal'
          }`}
        >
          <Layers className={`w-3.5 h-3.5 ${activeTab === 'taxonomy' ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400'}`} />
          <span>Taxonomy (Contexts & Tools)</span>
          {activeTab === 'taxonomy' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100" />
          )}
        </button>
      </nav>

      {/* Flagged Content */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {pendingReports.length === 0 ? (
            <div className="py-12 text-center border rounded-lg border-stone-200 dark:border-stone-800 text-stone-400">
              <Check className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="font-editorial text-base">All clear. No pending content reports.</p>
            </div>
          ) : (
            pendingReports.map((rep) => {
              const reporter = users.find((u) => u.id === rep.reporterId);
              let targetSnippet = '';
              if (rep.targetType === 'note') {
                const n = notes.find((item) => item.id === rep.targetId);
                targetSnippet = n ? `Note: "${n.title}"` : 'Note removed';
              } else {
                const c = comments.find((item) => item.id === rep.targetId);
                targetSnippet = c ? `Comment: "${c.body}"` : 'Comment removed';
              }

              return (
                <div
                  key={rep.id}
                  className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 flex items-start justify-between gap-4 text-xs"
                >
                  <div>
                    <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-mono text-[10px] uppercase tracking-wider">
                      {rep.targetType} reported
                    </span>
                    <p className="font-semibold text-stone-900 dark:text-stone-100 mt-2">
                      {targetSnippet}
                    </p>
                    <p className="text-stone-600 dark:text-stone-400 mt-1">Reason: {rep.reason}</p>
                    <p className="text-stone-400 text-[10px] mt-2 font-mono">
                      Reported by {reporter?.name || 'User'} on{' '}
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => adminResolveReport(rep.id, 'dismissed')}
                      className="px-3 py-1.5 rounded border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => {
                        if (rep.targetType === 'comment') {
                          deleteComment(rep.targetId);
                        } else {
                          updateNote(rep.targetId, { status: 'unlisted' });
                        }
                        adminResolveReport(rep.id, 'resolved', true);
                      }}
                      className="px-3 py-1.5 rounded bg-red-600 text-white font-medium hover:bg-red-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Take Action</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Featured / Curated Picks */}
      {activeTab === 'featured' && (
        <div className="space-y-4">
          <p className="text-xs text-stone-600 dark:text-stone-400 mb-2">
            Toggle the "Worth Reading" editorial designation for notes across the network:
          </p>
          <div className="divide-y divide-stone-200 dark:divide-stone-800 border rounded-lg border-stone-200 dark:border-stone-800 overflow-hidden bg-white/40 dark:bg-stone-900/30">
            {notes.map((n) => {
              const author = users.find((u) => u.id === n.authorId);
              return (
                <div key={n.id} className="p-3.5 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <p className="font-editorial text-sm font-semibold text-stone-900 dark:text-stone-100">
                      {n.title}
                    </p>
                    <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                      by {author?.name} · {n.contexts.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => adminToggleFeatureNote(n.id)}
                    className={`px-3 py-1 rounded font-medium flex items-center gap-1.5 transition-colors ${
                      n.isFeatured
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                        : 'border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{n.isFeatured ? 'Curated Pick' : 'Feature'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Taxonomy Management */}
      {activeTab === 'taxonomy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Context Form */}
          <div className="p-5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/30">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Canonical Contexts
            </h3>
            <form onSubmit={handleCreateContext} className="space-y-3 mb-6 text-xs">
              <input
                type="text"
                value={newContextName}
                onChange={(e) => setNewContextName(e.target.value)}
                placeholder="New Context Name (e.g. Synthesizing, Interviewing)"
                className="w-full p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
                required
              />
              <input
                type="text"
                value={newContextDesc}
                onChange={(e) => setNewContextDesc(e.target.value)}
                placeholder="Brief description of this human activity"
                className="w-full p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded font-medium"
              >
                Add Context Tag
              </button>
            </form>

            <div className="space-y-2 text-xs">
              {contexts.map((c) => (
                <div
                  key={c.id}
                  className="p-2 rounded bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 flex items-center justify-between"
                >
                  <span className="font-medium text-stone-800 dark:text-stone-200">{c.name}</span>
                  <span className="text-[10px] text-stone-400 font-mono">{c.notesCount} notes</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Tool Form */}
          <div className="p-5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/30">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" /> Canonical Tools
            </h3>
            <form onSubmit={handleCreateTool} className="space-y-3 mb-6 text-xs">
              <input
                type="text"
                value={newToolName}
                onChange={(e) => setNewToolName(e.target.value)}
                placeholder="Tool Name (e.g. Next.js, Obsidian, Anki)"
                className="w-full p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
                required
              />
              <select
                value={newToolCategory}
                onChange={(e) => setNewToolCategory(e.target.value)}
                className="w-full p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
              >
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Physical">Physical / Stationery</option>
                <option value="Framework">Framework / Library</option>
              </select>
              <input
                type="text"
                value={newToolDesc}
                onChange={(e) => setNewToolDesc(e.target.value)}
                placeholder="Short description of the tool"
                className="w-full p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
              />
              <div className="rounded border border-dashed border-stone-300 dark:border-stone-700 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300 font-medium">
                  <ImagePlus className="w-3.5 h-3.5" /> Tool logo <span className="text-stone-400 font-normal">(optional)</span>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) => handleLogoFile(e.target.files?.[0])}
                  className="w-full text-[11px] text-stone-500 file:mr-2 file:rounded file:border-0 file:bg-stone-200 file:px-2 file:py-1 file:text-[11px] file:text-stone-700 dark:file:bg-stone-800 dark:file:text-stone-200"
                />
                <input
                  type="url"
                  value={newToolLogoUrl}
                  onChange={(e) => { setNewToolLogoUrl(e.target.value); setNewToolLogoFile(''); setLogoError(''); }}
                  placeholder="Or paste a logo image URL"
                  className="w-full p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
                />
                {(newToolLogoFile || newToolLogoUrl) && (
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <img src={newToolLogoFile || newToolLogoUrl} alt="Logo preview" className="w-9 h-9 rounded object-contain border border-stone-200 dark:border-stone-700 bg-white" />
                    <span>Logo preview</span>
                    <button type="button" onClick={() => { setNewToolLogoFile(''); setNewToolLogoUrl(''); }} className="ml-auto p-1 hover:text-stone-900 dark:hover:text-stone-100" aria-label="Clear logo"><X className="w-3.5 h-3.5" /></button>
                  </div>
                )}
                {logoError && <p className="text-red-600 dark:text-red-400">{logoError}</p>}
              </div>
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded font-medium"
              >
                Add Canonical Tool
              </button>
            </form>

            <div className="space-y-2 text-xs max-h-72 overflow-y-auto">
              {tools.map((t) => (
                <div
                  key={t.id}
                  className="p-2 rounded bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 flex items-center justify-center shrink-0 overflow-hidden">
                      {t.logoUrl ? <img src={t.logoUrl} alt="" className="w-full h-full object-contain" /> : <ToolIcon icon={t.icon} name={t.name} category={t.category} className="w-4 h-4 text-stone-500" />}
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-stone-800 dark:text-stone-200">{t.name}</span>
                      <span className="text-[10px] text-stone-400 ml-1.5">({t.category})</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono">{t.notesCount} notes</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
