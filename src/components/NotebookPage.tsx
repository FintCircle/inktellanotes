import React from 'react';
import { useInktella } from '../context/InktellaContext';
import { NoteCard } from './NoteCard';
import { Gift, ExternalLink, Calendar, Plus } from 'lucide-react';

interface NotebookPageProps {
  username: string;
  notebookSlug: string;
  onOpenGiftModal: (notebookId: string) => void;
}

export const NotebookPage: React.FC<NotebookPageProps> = ({
  username,
  notebookSlug,
  onOpenGiftModal,
}) => {
  const { users, notebooks, notes, currentUser, toggleFollowNotebook, navigateTo } = useInktella();

  const author = users.find((u) => u.username === username);
  const notebook = notebooks.find((nb) => nb.slug === notebookSlug && (author ? nb.ownerId === author.id : true));

  if (!author || !notebook) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-editorial text-2xl font-semibold mb-2">Notebook Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">
          The requested notebook publication does not exist or has moved.
        </p>
        <button
          onClick={() => navigateTo({ type: 'discover' })}
          className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs rounded font-medium"
        >
          Explore Inktella
        </button>
      </div>
    );
  }

  const isOwner = currentUser.id === notebook.ownerId;
  const isFollowing = currentUser.followingNotebookIds.includes(notebook.id);

  // Notes in this notebook
  const notebookNotes = notes
    .filter((n) => n.notebookId === notebook.id && (isOwner || n.status !== 'draft'))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formattedPaidThrough = new Date(notebook.paidThroughDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div id="notebook-publication-page" className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Publication Header */}
      <header className="mb-10 text-center sm:text-left">
        <p className="text-[11px] uppercase tracking-widest font-semibold text-stone-400 mb-3">
          Independent Publication
        </p>

        <h1 className="font-editorial text-3xl sm:text-5xl font-bold uppercase tracking-wide text-stone-900 dark:text-stone-100 leading-tight">
          {notebook.name}
        </h1>

        <div className="mt-3 flex items-center justify-center sm:justify-start gap-2 text-sm text-stone-600 dark:text-stone-400">
          <img
            src={author.avatarUrl}
            alt={author.name}
            className="w-5 h-5 rounded-full object-cover grayscale-[20%]"
          />
          <button
            onClick={() => navigateTo({ type: 'profile', username: author.username })}
            className="font-medium text-stone-900 dark:text-stone-200 hover:underline"
          >
            {author.name}
          </button>
        </div>

        <p className="font-editorial text-lg sm:text-xl text-stone-600 dark:text-stone-400 mt-4 leading-relaxed max-w-xl">
          {notebook.description}
        </p>

        {/* External links if any */}
        {notebook.externalLinks && notebook.externalLinks.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
            {notebook.externalLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 underline decoration-stone-300"
              >
                <span>{link.label}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}

        {/* Publication Actions: Follow, Gift 1 Year, New Note */}
        <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => toggleFollowNotebook(notebook.id)}
              className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                isFollowing
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                  : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>

            <button
              onClick={() => onOpenGiftModal(notebook.id)}
              className="px-3.5 py-1.5 rounded border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors"
            >
              <Gift className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Gift 1 year · $10</span>
            </button>

            {isOwner && (
              <button
                onClick={() => navigateTo({ type: 'editor' })}
                className="px-3 py-1.5 rounded border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Note</span>
              </button>
            )}
          </div>

          {/* Paid through status badge */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-mono">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Paid through: {formattedPaidThrough}</span>
          </div>
        </div>
      </header>

      {/* Notes Stream */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between text-xs text-stone-400 uppercase tracking-widest font-semibold">
          <span>{notebookNotes.length} Notes in Publication</span>
        </div>

        {notebookNotes.length === 0 ? (
          <div className="py-16 text-center border-t border-stone-200 dark:border-stone-800">
            <p className="font-editorial text-lg text-stone-400 italic">
              No notes published in this notebook yet.
            </p>
            {isOwner && (
              <button
                onClick={() => navigateTo({ type: 'editor' })}
                className="mt-4 px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs rounded font-medium"
              >
                Write First Note
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
            {notebookNotes.map((note) => (
              <NoteCard key={note.id} note={note} showNotebookHeader={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
