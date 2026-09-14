import React, { useState } from 'react';
import { useInktella } from '../context/InktellaContext';
import { NoteCard } from './NoteCard';
import { Users, BookOpen, Layers, Wrench, Check } from 'lucide-react';

export const FollowingView: React.FC = () => {
  const {
    currentUser,
    notes,
    notebooks,
    contexts,
    tools,
    users,
    toggleFollowNotebook,
    toggleFollowContext,
    toggleFollowTool,
    toggleFollowUser,
    navigateTo,
  } = useInktella();

  const [activeFilter, setActiveFilter] = useState<'all' | 'notebooks' | 'contexts' | 'tools' | 'people' | 'manage'>('all');

  const publishedNotes = notes.filter((n) => n.status === 'published');

  // Followed IDs
  const followedUserIds = currentUser.followingUserIds || [];
  const followedNotebookIds = currentUser.followingNotebookIds || [];
  const followedContextIds = currentUser.followingContextIds || [];
  const followedToolIds = currentUser.followingToolIds || [];

  // Followed names for contexts and tools
  const followedContextNames = contexts
    .filter((c) => followedContextIds.includes(c.id))
    .map((c) => c.name);

  const followedToolNames = tools
    .filter((t) => followedToolIds.includes(t.id))
    .map((t) => t.name);

  // Compute feed
  const feedNotes = publishedNotes.filter((note) => {
    const matchUser = followedUserIds.includes(note.authorId);
    const matchNotebook = followedNotebookIds.includes(note.notebookId);
    const matchContext = note.contexts.some((ctx) => followedContextNames.includes(ctx));
    const matchTool = note.tools.some((t) => followedToolNames.includes(t));

    if (activeFilter === 'all') return matchUser || matchNotebook || matchContext || matchTool;
    if (activeFilter === 'notebooks') return matchNotebook;
    if (activeFilter === 'contexts') return matchContext;
    if (activeFilter === 'tools') return matchTool;
    if (activeFilter === 'people') return matchUser;
    return true;
  });

  return (
    <div id="following-feed-view" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-6">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Following
        </h1>
        <p className="font-editorial text-base text-stone-600 dark:text-stone-400 mt-1">
          A customized publication feed drawn from the notebooks, people, contexts, and tools you follow.
          <span className="font-hand text-xl text-stone-500 dark:text-stone-400 block sm:inline sm:ml-2 -rotate-1 font-normal">
            ~ your personalized reading circle
          </span>
        </p>
      </header>

      {/* Feed Filter Navigation (No pills) */}
      <nav
        aria-label="Feed filter"
        className="flex items-center gap-5 sm:gap-7 overflow-x-auto border-b border-stone-200 dark:border-stone-800 no-scrollbar mb-8 -mb-px text-sm"
      >
        <button
          id="following-tab-all"
          onClick={() => setActiveFilter('all')}
          className={`pb-3 font-medium transition-all relative shrink-0 cursor-pointer focus:outline-none flex items-center gap-1.5 ${
            activeFilter === 'all'
              ? 'text-stone-950 dark:text-stone-50 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-normal'
          }`}
        >
          <span>All Activity</span>
          <span
            className={`font-hand text-[15px] sm:text-base leading-none transition-all ${
              activeFilter === 'all'
                ? 'text-amber-800 dark:text-amber-400 font-semibold -rotate-2'
                : 'text-stone-400/80 dark:text-stone-500 -rotate-1'
            }`}
          >
            your circle
          </span>
          {activeFilter === 'all' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100" />
          )}
        </button>

        <button
          id="following-tab-notebooks"
          onClick={() => setActiveFilter('notebooks')}
          className={`pb-3 font-medium transition-all relative shrink-0 cursor-pointer focus:outline-none flex items-center gap-1.5 ${
            activeFilter === 'notebooks'
              ? 'text-stone-950 dark:text-stone-50 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-normal'
          }`}
        >
          <span>Notebooks</span>
          <span className="font-hand text-base text-stone-500 dark:text-stone-400">
            ({followedNotebookIds.length})
          </span>
          {activeFilter === 'notebooks' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100" />
          )}
        </button>

        <button
          id="following-tab-contexts"
          onClick={() => setActiveFilter('contexts')}
          className={`pb-3 font-medium transition-all relative shrink-0 cursor-pointer focus:outline-none flex items-center gap-1.5 ${
            activeFilter === 'contexts'
              ? 'text-stone-950 dark:text-stone-50 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-normal'
          }`}
        >
          <span>Contexts</span>
          <span className="font-hand text-base text-stone-500 dark:text-stone-400">
            ({followedContextIds.length})
          </span>
          {activeFilter === 'contexts' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100" />
          )}
        </button>

        <button
          id="following-tab-tools"
          onClick={() => setActiveFilter('tools')}
          className={`pb-3 font-medium transition-all relative shrink-0 cursor-pointer focus:outline-none flex items-center gap-1.5 ${
            activeFilter === 'tools'
              ? 'text-stone-950 dark:text-stone-50 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-normal'
          }`}
        >
          <span>Tools</span>
          <span className="font-hand text-base text-stone-500 dark:text-stone-400">
            ({followedToolIds.length})
          </span>
          {activeFilter === 'tools' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100" />
          )}
        </button>

        <button
          id="following-tab-people"
          onClick={() => setActiveFilter('people')}
          className={`pb-3 font-medium transition-all relative shrink-0 cursor-pointer focus:outline-none flex items-center gap-1.5 ${
            activeFilter === 'people'
              ? 'text-stone-950 dark:text-stone-50 font-semibold'
              : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-normal'
          }`}
        >
          <span>People</span>
          <span className="font-hand text-base text-stone-500 dark:text-stone-400">
            ({followedUserIds.length})
          </span>
          {activeFilter === 'people' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100" />
          )}
        </button>

        <button
          id="following-tab-manage"
          onClick={() => setActiveFilter('manage')}
          className={`ml-auto pb-3 font-medium transition-all relative shrink-0 cursor-pointer focus:outline-none flex items-center gap-1.5 ${
            activeFilter === 'manage'
              ? 'text-stone-950 dark:text-stone-50 font-semibold'
              : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 font-normal'
          }`}
        >
          <span>Manage Subscriptions</span>
          <span className="font-hand text-[15px] sm:text-base text-stone-400 dark:text-stone-500 -rotate-1 hidden sm:inline">
            curate
          </span>
          {activeFilter === 'manage' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100" />
          )}
        </button>
      </nav>

      {/* Main Content */}
      {activeFilter === 'manage' ? (
        <div className="space-y-8">
          {/* Followed Notebooks */}
          <section className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Followed Notebooks
            </h3>
            <div className="space-y-2">
              {notebooks.map((nb) => {
                const isF = followedNotebookIds.includes(nb.id);
                return (
                  <div key={nb.id} className="flex items-center justify-between py-2 border-b border-stone-100 dark:border-stone-800 text-xs">
                    <div>
                      <p className="font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
                        {nb.name}
                      </p>
                      <p className="text-stone-500 dark:text-stone-400 text-[11px]">{nb.description}</p>
                    </div>
                    <button
                      onClick={() => toggleFollowNotebook(nb.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        isF
                          ? 'bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                          : 'border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {isF ? 'Subscribed' : 'Follow'}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Followed Contexts */}
          <section className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Followed Contexts
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {contexts.map((ctx) => {
                const isF = followedContextIds.includes(ctx.id);
                return (
                  <button
                    key={ctx.id}
                    onClick={() => toggleFollowContext(ctx.id)}
                    className={`p-2.5 rounded text-xs text-left border flex items-center justify-between transition-colors ${
                      isF
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
                        : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-600'
                    }`}
                  >
                    <span>{ctx.name}</span>
                    {isF && <Check className="w-3 h-3 text-stone-900 dark:text-stone-100" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Followed Tools */}
          <section className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" /> Followed Tools
            </h3>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool) => {
                const isF = followedToolIds.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    onClick={() => toggleFollowTool(tool.id)}
                    className={`px-3 py-1 rounded text-xs border flex items-center gap-1.5 transition-colors ${
                      isF
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-100 dark:bg-stone-800 font-medium text-stone-900 dark:text-stone-100'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600'
                    }`}
                  >
                    <span>{tool.name}</span>
                    {isF && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      ) : feedNotes.length === 0 ? (
        <div className="py-16 text-center border-t border-stone-200 dark:border-stone-800">
          <p className="font-editorial text-lg text-stone-500 dark:text-stone-400 italic">
            No notes found matching your followed subscriptions.
          </p>
          <span className="font-hand text-xl text-stone-500 dark:text-stone-400 block mt-2 -rotate-1">
            ~ browse discover to find notebooks and thinkers to follow
          </span>
          <button
            onClick={() => setActiveFilter('manage')}
            className="mt-4 px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs rounded font-medium"
          >
            Manage Your Following
          </button>
        </div>
      ) : (
        <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
          {feedNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};
