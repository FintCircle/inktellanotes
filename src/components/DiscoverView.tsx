import React, { useState } from 'react';
import { useInktella } from '../context/InktellaContext';
import { NoteCard } from './NoteCard';
import { Sparkles, Hammer, GraduationCap, PenTool, Flame, Compass, Wrench } from 'lucide-react';

export const DiscoverView: React.FC = () => {
  const { notes, contexts, tools, notebooks, users, navigateTo } = useInktella();

  const [activeTab, setActiveTab] = useState<
    'all' | 'worth-reading' | 'building' | 'learning' | 'writing' | 'active-conversations' | 'recent'
  >('all');

  const publishedNotes = notes.filter((n) => n.status === 'published');

  // Specific curated sections
  const worthReadingNotes = publishedNotes.filter((n) => n.isFeatured || n.savesCount > 100);
  const buildingNotes = publishedNotes.filter((n) => n.contexts.includes('Building'));
  const learningNotes = publishedNotes.filter((n) => n.contexts.includes('Learning'));
  const writingNotes = publishedNotes.filter((n) => n.contexts.includes('Writing'));
  const recentNotes = [...publishedNotes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const tabs = [
    { id: 'all', label: 'All Curated', icon: Compass, sprinkle: 'the stream' },
    { id: 'worth-reading', label: 'Worth Reading', icon: Sparkles, sprinkle: 'handpicked ✦' },
    { id: 'building', label: 'Building', icon: Hammer, sprinkle: 'in public' },
    { id: 'learning', label: 'Learning', icon: GraduationCap, sprinkle: 'field notes' },
    { id: 'writing', label: 'Writing', icon: PenTool, sprinkle: 'craft & prose' },
    { id: 'recent', label: 'Recently Published', icon: Flame, sprinkle: 'fresh ink ~' },
  ];

  return (
    <div id="discover-view" className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Network Header with calming quote */}
      <header className="mb-8 text-center sm:text-left">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          A network of notes worth keeping.
        </h1>
        <p className="font-editorial text-base sm:text-lg text-stone-600 dark:text-stone-400 mt-2 max-w-2xl leading-relaxed">
          Public notebooks on what people are building, learning, researching, and figuring out in the open.
          <span className="font-hand text-xl text-stone-500 dark:text-stone-400 block sm:inline sm:ml-2 -rotate-1 font-normal">
            ~ pens & thoughts in the open
          </span>
        </p>
      </header>

      {/* Discovery Section Editorial Tabs (No pills) */}
      <nav
        aria-label="Discovery sections"
        className="flex items-center gap-5 sm:gap-7 overflow-x-auto border-b border-stone-200 dark:border-stone-800 no-scrollbar mb-8 -mb-px"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`discover-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm transition-all relative shrink-0 flex items-center gap-2 cursor-pointer focus:outline-none group ${
                isActive
                  ? 'text-stone-950 dark:text-stone-50 font-semibold'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-normal'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`font-hand text-[15px] sm:text-base leading-none transition-all ${
                  isActive
                    ? 'text-amber-800 dark:text-amber-400 font-semibold -rotate-2'
                    : 'text-stone-400/80 dark:text-stone-500 group-hover:text-stone-700 dark:group-hover:text-stone-300 -rotate-1'
                }`}
              >
                {tab.sprinkle}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 dark:bg-stone-100" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Notes Stream (8 cols) */}
        <div className="lg:col-span-8">
          {activeTab === 'all' && (
            <div className="space-y-10">
              {/* Section 1: Worth Reading */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-1.5">
                    <h2 className="text-xs uppercase font-semibold tracking-widest text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      Worth Reading
                    </h2>
                    <span className="font-hand text-base text-amber-800/90 dark:text-amber-400/90 -rotate-1">
                      ~ curator's picks
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('worth-reading')}
                    className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 font-sans"
                  >
                    View all
                  </button>
                </div>
                <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
                  {worthReadingNotes.slice(0, 3).map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              </section>

              {/* Section 2: Building */}
              <section className="pt-6 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-1.5">
                    <h2 className="text-xs uppercase font-semibold tracking-widest text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <Hammer className="w-3.5 h-3.5 text-stone-500" />
                      Building
                    </h2>
                    <span className="font-hand text-base text-stone-500 dark:text-stone-400 -rotate-1">
                      ~ prototypes & code
                    </span>
                  </div>
                  <button
                    onClick={() => navigateTo({ type: 'context', slug: 'building' })}
                    className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 font-sans"
                  >
                    Context page →
                  </button>
                </div>
                <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
                  {buildingNotes.slice(0, 2).map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              </section>

              {/* Section 3: Learning */}
              <section className="pt-6 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-1.5">
                    <h2 className="text-xs uppercase font-semibold tracking-widest text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-stone-500" />
                      Learning
                    </h2>
                    <span className="font-hand text-base text-stone-500 dark:text-stone-400 -rotate-1">
                      ~ discoveries & curiosities
                    </span>
                  </div>
                  <button
                    onClick={() => navigateTo({ type: 'context', slug: 'learning' })}
                    className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 font-sans"
                  >
                    Context page →
                  </button>
                </div>
                <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
                  {learningNotes.slice(0, 2).map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              </section>

              {/* Section 4: Writing */}
              <section className="pt-6 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-baseline gap-1.5">
                    <h2 className="text-xs uppercase font-semibold tracking-widest text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-stone-500" />
                      Writing
                    </h2>
                    <span className="font-hand text-base text-stone-500 dark:text-stone-400 -rotate-1">
                      ~ crafted sentences
                    </span>
                  </div>
                  <button
                    onClick={() => navigateTo({ type: 'context', slug: 'writing' })}
                    className="text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 font-sans"
                  >
                    Context page →
                  </button>
                </div>
                <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
                  {writingNotes.slice(0, 2).map((note) => (
                    <NoteCard key={note.id} note={note} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'worth-reading' && (
            <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
              {worthReadingNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}

          {activeTab === 'building' && (
            <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
              {buildingNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}

          {activeTab === 'learning' && (
            <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
              {learningNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}

          {activeTab === 'writing' && (
            <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
              {writingNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
              {recentNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Network Directory Sidebar (4 cols) */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Active Contexts */}
          <div className="p-4 rounded-lg border border-stone-200/70 dark:border-stone-800/70 bg-stone-50/50 dark:bg-stone-900/30">
            <h3 className="text-xs uppercase font-semibold tracking-widest text-stone-500 dark:text-stone-400 mb-3">
              Contexts in the Network
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 leading-relaxed">
              What are people doing right now across their notebooks?
            </p>
            <div className="flex flex-wrap gap-1.5">
              {contexts.map((ctx) => (
                <button
                  key={ctx.id}
                  onClick={() => navigateTo({ type: 'context', slug: ctx.slug })}
                  className="text-xs px-2.5 py-1 rounded bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-500 transition-colors flex items-center gap-1.5"
                >
                  <span>{ctx.name}</span>
                  <span className="text-[10px] text-stone-400 font-mono">{ctx.notesCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tools Used */}
          <div className="p-4 rounded-lg border border-stone-200/70 dark:border-stone-800/70 bg-stone-50/50 dark:bg-stone-900/30">
            <h3 className="text-xs uppercase font-semibold tracking-widest text-stone-500 dark:text-stone-400 mb-3 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              Tools Being Used
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-3 leading-relaxed">
              Software, instruments, and physical media used during the work.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tools.slice(0, 12).map((t) => (
                <button
                  key={t.id}
                  onClick={() => navigateTo({ type: 'tool', slug: t.slug })}
                  className="text-xs px-2 py-0.5 rounded border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Notebooks */}
          <div className="p-4 rounded-lg border border-stone-200/70 dark:border-stone-800/70 bg-stone-50/50 dark:bg-stone-900/30">
            <h3 className="text-xs uppercase font-semibold tracking-widest text-stone-500 dark:text-stone-400 mb-3">
              Independent Notebooks
            </h3>
            <div className="space-y-3">
              {notebooks.slice(0, 4).map((nb) => {
                const owner = users.find((u) => u.id === nb.ownerId);
                if (!owner) return null;
                return (
                  <button
                    key={nb.id}
                    onClick={() =>
                      navigateTo({
                        type: 'notebook',
                        username: owner.username,
                        notebookSlug: nb.slug,
                      })
                    }
                    className="w-full text-left p-2.5 rounded hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
                  >
                    <p className="font-editorial text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                      {nb.name}
                    </p>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">by {owner.name}</p>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {nb.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
