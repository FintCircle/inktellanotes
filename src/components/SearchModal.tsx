import React, { useState, useEffect, useRef } from 'react';
import { useInktella } from '../context/InktellaContext';
import {
  Search,
  X,
  FileText,
  BookOpen,
  User,
  Layers,
  Wrench,
  CornerDownLeft,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface SearchModalProps {
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const { notes, notebooks, users, contexts, tools, navigateTo } = useInktella();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'notes' | 'notebooks' | 'people' | 'tags'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  // Search Results
  const matchingNotes = !q
    ? []
    : notes
        .filter((n) => {
          if (n.status === 'draft') return false;
          const matchTitle = n.title.toLowerCase().includes(q);
          const matchBody = n.body.toLowerCase().includes(q);
          const matchContext = n.contexts.some((c) => c.toLowerCase().includes(q));
          const matchTool = n.tools.some((t) => t.toLowerCase().includes(q));
          const author = users.find((u) => u.id === n.authorId);
          const matchAuthor = author?.name.toLowerCase().includes(q) || author?.username.toLowerCase().includes(q);
          return matchTitle || matchBody || matchContext || matchTool || matchAuthor;
        })
        .slice(0, 8);

  const matchingNotebooks = !q
    ? []
    : notebooks
        .filter((nb) => {
          const matchName = nb.name.toLowerCase().includes(q);
          const matchDesc = nb.description.toLowerCase().includes(q);
          const author = users.find((u) => u.id === nb.ownerId);
          const matchAuthor = author?.name.toLowerCase().includes(q) || author?.username.toLowerCase().includes(q);
          return matchName || matchDesc || matchAuthor;
        })
        .slice(0, 6);

  const matchingUsers = !q
    ? []
    : users
        .filter((u) => {
          const matchName = u.name.toLowerCase().includes(q);
          const matchUsername = u.username.toLowerCase().includes(q);
          const matchBio = u.bio.toLowerCase().includes(q);
          const matchRole = u.roles.some((r) => r.toLowerCase().includes(q));
          return matchName || matchUsername || matchBio || matchRole;
        })
        .slice(0, 5);

  const matchingContexts = !q
    ? []
    : contexts
        .filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
        .slice(0, 4);

  const matchingTools = !q
    ? []
    : tools
        .filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
        .slice(0, 4);

  const totalMatches =
    matchingNotes.length +
    matchingNotebooks.length +
    matchingUsers.length +
    matchingContexts.length +
    matchingTools.length;

  const handleSelectNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;
    const author = users.find((u) => u.id === note.authorId);
    const nb = notebooks.find((n) => n.id === note.notebookId);
    if (author && nb) {
      navigateTo({
        type: 'note',
        username: author.username,
        notebookSlug: nb.slug,
        noteSlug: note.slug,
      });
      onClose();
    }
  };

  const handleSelectNotebook = (nbId: string) => {
    const nb = notebooks.find((n) => n.id === nbId);
    if (!nb) return;
    const author = users.find((u) => u.id === nb.ownerId);
    if (author) {
      navigateTo({
        type: 'notebook',
        username: author.username,
        notebookSlug: nb.slug,
      });
      onClose();
    }
  };

  const handleSelectUser = (username: string) => {
    navigateTo({ type: 'profile', username });
    onClose();
  };

  const handleSelectContext = (slug: string) => {
    navigateTo({ type: 'context', slug });
    onClose();
  };

  const handleSelectTool = (slug: string) => {
    navigateTo({ type: 'tool', slug });
    onClose();
  };

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4 bg-stone-900/60 dark:bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="search-modal-card"
        className="w-full max-w-2xl bg-[#FAF9F6] dark:bg-[#1C1B19] border border-stone-300 dark:border-stone-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[82vh] transition-colors"
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, publications, people, contexts, tools..."
            className="w-full bg-transparent border-none outline-none text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm sm:text-base font-sans"
            aria-label="Search Inktella"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1"
              title="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-stone-100 dark:bg-stone-800 text-stone-400 border border-stone-200 dark:border-stone-700 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/30 overflow-x-auto no-scrollbar text-xs">
          <span className="text-stone-400 font-mono text-[11px] shrink-0">Filter:</span>
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'notes', label: `Notes (${matchingNotes.length})` },
              { id: 'notebooks', label: `Notebooks (${matchingNotebooks.length})` },
              { id: 'people', label: `People (${matchingUsers.length})` },
              { id: 'tags', label: `Contexts & Tools (${matchingContexts.length + matchingTools.length})` },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors shrink-0 ${
                activeFilter === filter.id
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium'
                  : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {!q && (
            <div className="py-12 text-center text-stone-400 text-xs space-y-2">
              <p className="font-editorial text-base text-stone-600 dark:text-stone-300">
                Explore the Inktella Library & Network
              </p>
              <p className="text-stone-400 max-w-sm mx-auto">
                Type anything to search across essays, technical logs, independent notebooks, thinkers, and canonical tools.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-1.5 max-w-md mx-auto">
                <span className="text-[11px] text-stone-400 mr-1">Try:</span>
                {['Building', 'Researching', 'TypeScript', 'Tailwind', 'Typography', 'Architecture'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2 py-0.5 bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700 rounded text-[11px]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && totalMatches === 0 && (
            <div className="py-12 text-center text-stone-400 text-xs">
              <p className="font-editorial text-base text-stone-600 dark:text-stone-300">
                No results found for "{query}"
              </p>
              <p className="text-stone-400 mt-1">Try a different keyword or browse through the Discover feed.</p>
            </div>
          )}

          {/* Notes Section */}
          {(activeFilter === 'all' || activeFilter === 'notes') && matchingNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                <FileText className="w-3.5 h-3.5" />
                <span>Notes ({matchingNotes.length})</span>
              </div>
              <div className="space-y-1">
                {matchingNotes.map((note) => {
                  const author = users.find((u) => u.id === note.authorId);
                  return (
                    <button
                      key={note.id}
                      onClick={() => handleSelectNote(note.id)}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-850 dark:hover:bg-stone-800/60 transition-colors flex items-start justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors truncate">
                          {note.title}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                          {note.body.replace(/[#*`_]/g, '')}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400 font-mono">
                          <span>by {author?.name}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" /> {note.readingMinutes} min
                          </span>
                          {note.contexts.length > 0 && (
                            <>
                              <span>·</span>
                              <span className="text-stone-500 dark:text-stone-400">{note.contexts.join(', ')}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notebooks Section */}
          {(activeFilter === 'all' || activeFilter === 'notebooks') && matchingNotebooks.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Publications & Notebooks ({matchingNotebooks.length})</span>
              </div>
              <div className="space-y-1">
                {matchingNotebooks.map((nb) => {
                  const author = users.find((u) => u.id === nb.ownerId);
                  return (
                    <button
                      key={nb.id}
                      onClick={() => handleSelectNotebook(nb.id)}
                      className="w-full text-left p-2.5 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-colors flex items-start justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold uppercase tracking-wide text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {nb.name}
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                          {nb.description}
                        </p>
                        <p className="text-[11px] text-stone-400 mt-1 font-mono">Curated by {author?.name}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* People Section */}
          {(activeFilter === 'all' || activeFilter === 'people') && matchingUsers.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                <User className="w-3.5 h-3.5" />
                <span>People & Thinkers ({matchingUsers.length})</span>
              </div>
              <div className="space-y-1">
                {matchingUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectUser(u.username)}
                    className="w-full text-left p-2.5 rounded-lg hover:bg-stone-200/50 dark:hover:bg-stone-800/60 transition-colors flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover grayscale-[20%] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {u.name}
                          <span className="ml-1.5 text-xs font-normal text-stone-400 font-mono">@{u.username}</span>
                        </p>
                        <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-1">{u.bio}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contexts & Tools Section */}
          {(activeFilter === 'all' || activeFilter === 'tags') &&
            (matchingContexts.length > 0 || matchingTools.length > 0) && (
              <div>
                <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Canonical Contexts & Tools</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {matchingContexts.map((ctx) => (
                    <button
                      key={ctx.id}
                      onClick={() => handleSelectContext(ctx.slug)}
                      className="text-left p-2 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 bg-white/40 dark:bg-stone-900/40 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 dark:text-stone-100">
                        <Layers className="w-3 h-3 text-stone-500" />
                        <span>{ctx.name}</span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                        {ctx.description}
                      </p>
                    </button>
                  ))}
                  {matchingTools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTool(t.slug)}
                      className="text-left p-2 rounded-lg border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 bg-white/40 dark:bg-stone-900/40 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-900 dark:text-stone-100">
                        <Wrench className="w-3 h-3 text-stone-500" />
                        <span>{t.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono font-normal">({t.category})</span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                        {t.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/70 flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> Select to view
          </span>
          <span className="font-hand text-sm text-stone-500 dark:text-stone-400">
            ~ knowledge worth preserving
          </span>
        </div>
      </div>
    </div>
  );
};
