import React, { useState } from 'react';
import { useInktella } from '../context/InktellaContext';
import { BookOpen, Search, Plus, Calendar } from 'lucide-react';

export const NotebooksDirectory: React.FC = () => {
  const { notebooks, users, notes, currentUser, toggleFollowNotebook, createNotebook, navigateTo } = useInktella();

  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const filteredNotebooks = notebooks.filter((nb) => {
    const owner = users.find((u) => u.id === nb.ownerId);
    const query = searchQuery.toLowerCase();
    return (
      nb.name.toLowerCase().includes(query) ||
      nb.description.toLowerCase().includes(query) ||
      (owner && owner.name.toLowerCase().includes(query))
    );
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const nb = createNotebook({
      name: name.trim(),
      description: description.trim() || 'A public notebook on Inktella.',
    });
    setShowCreateModal(false);
    setName('');
    setDescription('');
    navigateTo({
      type: 'notebook',
      username: currentUser.username,
      notebookSlug: nb.slug,
    });
  };

  return (
    <div id="notebooks-directory-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
            Public Notebooks
          </h1>
          <p className="font-editorial text-base sm:text-lg text-stone-600 dark:text-stone-400 mt-1">
            Independent publications curated by builders, writers, and researchers.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-medium rounded flex items-center gap-1.5 self-start sm:self-auto hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Notebook · $10/yr</span>
        </button>
      </header>

      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notebooks by name, focus, or creator..."
          className="w-full text-xs pl-10 pr-4 py-2.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400"
        />
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="font-editorial text-2xl font-bold text-stone-900 dark:text-stone-100 mb-1">
              Start a Public Notebook
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              A notebook is your independent publication on Inktella. $10 per year covers hosting and network distribution.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Notebook Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Field Notes, The Architecture Journal"
                  className="w-full text-xs p-2.5 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Description / Editorial Focus
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will this notebook explore?"
                  rows={3}
                  className="w-full text-xs p-2.5 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
                />
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 flex items-center justify-between">
                <span>Annual Subscription</span>
                <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">$10.00 / year</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs font-medium rounded"
                >
                  Create & Activate Notebook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notebooks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNotebooks.map((nb) => {
          const owner = users.find((u) => u.id === nb.ownerId);
          if (!owner) return null;
          const isFollowing = currentUser.followingNotebookIds.includes(nb.id);
          const nbNotesCount = notes.filter((n) => n.notebookId === nb.id && n.status !== 'draft').length;

          return (
            <div
              key={nb.id}
              className="p-5 rounded-lg border border-stone-200/80 dark:border-stone-800/80 bg-white/40 dark:bg-stone-900/30 flex flex-col justify-between hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <button
                    onClick={() =>
                      navigateTo({
                        type: 'notebook',
                        username: owner.username,
                        notebookSlug: nb.slug,
                      })
                    }
                    className="text-left font-editorial text-xl font-bold uppercase tracking-wide text-stone-900 dark:text-stone-100 hover:underline"
                  >
                    {nb.name}
                  </button>

                  <button
                    onClick={() => toggleFollowNotebook(nb.id)}
                    className={`px-3 py-1 text-xs rounded font-medium shrink-0 transition-colors ${
                      isFollowing
                        ? 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                        : 'border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-900 dark:hover:border-stone-400'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>

                {/* Owner info */}
                <button
                  onClick={() => navigateTo({ type: 'profile', username: owner.username })}
                  className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 mb-3"
                >
                  <img
                    src={owner.avatarUrl}
                    alt={owner.name}
                    className="w-4 h-4 rounded-full object-cover grayscale-[20%]"
                  />
                  <span>{owner.name}</span>
                  <span className="font-mono text-stone-400">@{owner.username}</span>
                </button>

                {/* Description */}
                <p className="font-editorial text-stone-600 dark:text-stone-400 text-sm leading-relaxed line-clamp-3">
                  {nb.description}
                </p>
              </div>

              {/* Bottom metadata */}
              <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>{nbNotesCount} published notes</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Active
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
