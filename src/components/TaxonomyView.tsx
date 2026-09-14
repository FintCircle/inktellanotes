import React from 'react';
import { useInktella } from '../context/InktellaContext';
import { NoteCard } from './NoteCard';
import { ExternalLink, Check, Layers, Wrench } from 'lucide-react';

interface TaxonomyViewProps {
  type: 'context' | 'tool';
  slug: string;
}

export const TaxonomyView: React.FC<TaxonomyViewProps> = ({ type, slug }) => {
  const {
    contexts,
    tools,
    notes,
    currentUser,
    toggleFollowContext,
    toggleFollowTool,
    navigateTo,
  } = useInktella();

  const publishedNotes = notes.filter((n) => n.status === 'published');

  if (type === 'context') {
    const context = contexts.find((c) => c.slug === slug || c.name.toLowerCase() === slug.toLowerCase());

    if (!context) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h2 className="font-editorial text-2xl font-semibold mb-2">Context Not Found</h2>
          <p className="text-stone-500 text-sm mb-6">The requested context tag does not exist.</p>
          <button
            onClick={() => navigateTo({ type: 'discover' })}
            className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs rounded font-medium"
          >
            Return to Discover
          </button>
        </div>
      );
    }

    const isFollowing = currentUser.followingContextIds.includes(context.id);
    const contextNotes = publishedNotes.filter((n) =>
      n.contexts.some((c) => c.toLowerCase() === context.name.toLowerCase())
    );

    // Tools frequently used with this context
    const toolCounts: Record<string, number> = {};
    contextNotes.forEach((n) => {
      n.tools.forEach((t) => {
        toolCounts[t] = (toolCounts[t] || 0) + 1;
      });
    });
    const frequentTools = Object.entries(toolCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);

    return (
      <div id="context-taxonomy-page" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Context</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
              {context.name}
            </h1>

            <button
              onClick={() => toggleFollowContext(context.id)}
              className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                isFollowing
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                  : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90'
              }`}
            >
              {isFollowing ? 'Following Context' : 'Follow Context'}
            </button>
          </div>

          <p className="font-editorial text-lg text-stone-600 dark:text-stone-400 mt-3 leading-relaxed">
            {context.description}
          </p>

          {/* Related tools */}
          {frequentTools.length > 0 && (
            <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400 font-mono text-[11px]">Frequently used tools:</span>
              {frequentTools.map(([toolName, count]) => (
                <button
                  key={toolName}
                  onClick={() =>
                    navigateTo({ type: 'tool', slug: toolName.toLowerCase().replace(/\s+/g, '-') })
                  }
                  className="px-2 py-0.5 rounded border border-stone-200 dark:border-stone-800 hover:border-stone-400 text-stone-600 dark:text-stone-400 transition-colors"
                >
                  {toolName} <span className="text-[10px] text-stone-400">({count})</span>
                </button>
              ))}
            </div>
          )}
        </header>

        {/* Notes Stream */}
        <section className="mt-8 border-t border-stone-200 dark:border-stone-800 pt-6">
          <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-widest font-semibold mb-4">
            <span>{contextNotes.length} Notes Tagged with {context.name}</span>
          </div>

          {contextNotes.length === 0 ? (
            <p className="text-stone-400 italic text-sm py-8 text-center font-editorial">
              No notes published in this context yet.
            </p>
          ) : (
            <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
              {contextNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  // Tool page
  const tool = tools.find((t) => t.slug === slug || t.name.toLowerCase() === slug.toLowerCase());

  if (!tool) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-editorial text-2xl font-semibold mb-2">Tool Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">The requested tool does not exist.</p>
        <button
          onClick={() => navigateTo({ type: 'discover' })}
          className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs rounded font-medium"
        >
          Return to Discover
        </button>
      </div>
    );
  }

  const isFollowingTool = currentUser.followingToolIds.includes(tool.id);
  const toolNotes = publishedNotes.filter((n) =>
    n.tools.some((t) => t.toLowerCase() === tool.name.toLowerCase())
  );

  return (
    <div id="tool-taxonomy-page" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-widest font-semibold mb-2">
          <Wrench className="w-3.5 h-3.5" />
          <span>Tool · {tool.category}</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-stone-900 dark:text-stone-100">
              {tool.name}
            </h1>
            {tool.website && (
              <a
                href={tool.website}
                target="_blank"
                rel="noreferrer"
                className="mt-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 underline decoration-stone-300"
              >
                <span>{tool.website}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <button
            onClick={() => toggleFollowTool(tool.id)}
            className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
              isFollowingTool
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90'
            }`}
          >
            {isFollowingTool ? 'Following Tool' : 'Follow Tool'}
          </button>
        </div>

        <p className="font-editorial text-lg text-stone-600 dark:text-stone-400 mt-3 leading-relaxed">
          {tool.description}
        </p>
      </header>

      {/* Notes using this tool */}
      <section className="mt-8 border-t border-stone-200 dark:border-stone-800 pt-6">
        <div className="flex items-center justify-between text-xs text-stone-400 uppercase tracking-widest font-semibold mb-4">
          <span>{toolNotes.length} Notes Involving {tool.name}</span>
        </div>

        {toolNotes.length === 0 ? (
          <p className="text-stone-400 italic text-sm py-8 text-center font-editorial">
            No notes have referenced {tool.name} yet.
          </p>
        ) : (
          <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
            {toolNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
