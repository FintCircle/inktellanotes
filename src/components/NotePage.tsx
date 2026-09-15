import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useInktella } from '../context/InktellaContext';
import { CommentItem } from './CommentThread';
import {
  Bookmark,
  Share2,
  Gift,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Clock,
  Flag,
  PenSquare,
  Check,
  ExternalLink,
  ChevronsUpDown,
} from 'lucide-react';
import { Note } from '../types';
import { extractHtmlEmbeds, NoteEmbeds } from './NoteEmbedRenderer';

interface NotePageProps {
  username: string;
  notebookSlug: string;
  noteSlug: string;
  onOpenGiftModal: (notebookId: string) => void;
  onOpenReportModal: (type: 'note' | 'comment', id: string, title: string) => void;
}

export const NotePage: React.FC<NotePageProps> = ({
  username,
  notebookSlug,
  noteSlug,
  onOpenGiftModal,
  onOpenReportModal,
}) => {
  const {
    users,
    notebooks,
    notes,
    comments,
    currentUser,
    savedNoteIds,
    toggleSaveNote,
    incrementNoteViews,
    toggleFollowNotebook,
    addComment,
    navigateTo,
  } = useInktella();

  const [commentInput, setCommentInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [collapseAllTrigger, setCollapseAllTrigger] = useState(0);
  const [expandAllTrigger, setExpandAllTrigger] = useState(0);
  const [allThreadsCollapsed, setAllThreadsCollapsed] = useState(false);

  const author = users.find((u) => u.username === username);
  const notebook = notebooks.find((nb) => nb.slug === notebookSlug && (author ? nb.ownerId === author.id : true));
  const note = notes.find((n) => n.slug === noteSlug && (notebook ? n.notebookId === notebook.id : true));

  useEffect(() => {
    if (note) {
      incrementNoteViews(note.id);
    }
  }, [note?.id, incrementNoteViews]);

  if (!author || !notebook || !note) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-editorial text-2xl font-semibold mb-2">Note Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">
          The requested note might have been moved, renamed, or is currently unlisted.
        </p>
        <button
          onClick={() => navigateTo({ type: 'discover' })}
          className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs rounded font-medium"
        >
          Return to Discover
        </button>
      </div>
    );
  }

  const parsedBody = extractHtmlEmbeds(note.body);
  const renderedEmbeds = [...(note.embeds || []), ...parsedBody.embeds];

  const isSaved = savedNoteIds.includes(note.id);
  const isAuthor = currentUser.id === note.authorId;
  const isFollowingNotebook = currentUser.followingNotebookIds.includes(notebook.id);

  // All comments for this note
  const noteComments = comments.filter((c) => c.noteId === note.id);
  const rootComments = noteComments.filter((c) => !c.parentCommentId);

  // Previous and Next notes in the same notebook
  const notebookNotes = notes
    .filter((n) => n.notebookId === notebook.id && n.status !== 'draft')
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const currentIndex = notebookNotes.findIndex((n) => n.id === note.id);
  const prevNote = currentIndex > 0 ? notebookNotes[currentIndex - 1] : null;
  const nextNote = currentIndex >= 0 && currentIndex < notebookNotes.length - 1 ? notebookNotes[currentIndex + 1] : null;

  // Related notes (matching context or tool, excluding current)
  const relatedNotes = notes
    .filter(
      (n) =>
        n.id !== note.id &&
        n.status === 'published' &&
        (n.contexts.some((ctx) => note.contexts.includes(ctx)) ||
          n.tools.some((t) => note.tools.includes(t)))
    )
    .slice(0, 3);

  const handlePostRootComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(note.id, commentInput.trim(), null);
    setCommentInput('');
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div id="note-reading-page" className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-8">
        <button
          onClick={() => navigateTo({ type: 'notebook', username: author.username, notebookSlug: notebook.slug })}
          className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 uppercase tracking-widest text-[11px] font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {notebook.name}
        </button>

        <div className="flex items-center gap-2">
          {isAuthor && (
            <button
              onClick={() => navigateTo({ type: 'editor', editNoteId: note.id })}
              className="px-2 py-1 border border-stone-200 dark:border-stone-800 rounded hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-1 transition-colors"
              title="Edit Note"
            >
              <PenSquare className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}

          <button
            onClick={() => toggleSaveNote(note.id)}
            className={`p-1.5 rounded border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
              isSaved ? 'text-amber-700 dark:text-amber-500' : ''
            }`}
            title={isSaved ? 'Remove from saved' : 'Save note'}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Copy link"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onOpenReportModal('note', note.id, note.title)}
            className="p-1.5 rounded border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-400"
            title="Report note"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Note Header */}
      <header className="mb-8">
        <div className="font-hand text-lg sm:text-xl text-stone-500 dark:text-stone-400 -rotate-1 mb-1.5 tracking-wide">
          ~ entry from the notebook of {author.name}
        </div>
        <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] font-bold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          {note.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-baseline gap-2 text-sm text-stone-600 dark:text-stone-400 font-sans">
          <button
            onClick={() => navigateTo({ type: 'profile', username: author.username })}
            className="font-medium text-stone-900 dark:text-stone-200 hover:underline"
          >
            {author.name}
          </button>
          <span>in</span>
          <button
            onClick={() => navigateTo({ type: 'notebook', username: author.username, notebookSlug: notebook.slug })}
            className="font-medium text-stone-900 dark:text-stone-200 hover:underline"
          >
            {notebook.name}
          </button>
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-stone-400 font-mono">
          <span>{formattedDate}</span>
          <span>·</span>
          <span className="flex items-center gap-1 font-hand text-[15px] sm:text-base text-stone-500 dark:text-stone-400">
            <Clock className="w-3 h-3" />
            ~ {note.readingMinutes} min read
          </span>
          {note.roleAtWriting && (
            <>
              <span>·</span>
              <span className="italic">as {note.roleAtWriting}</span>
            </>
          )}
        </div>
      </header>

      {/* Clean Divider */}
      <hr className="border-stone-200 dark:border-stone-800 my-8" />

      {/* Note Body (Typography-First Reading Column) */}
      <div className="inktella-prose">
        <Markdown>{parsedBody.body}</Markdown>
      </div>

      {renderedEmbeds.length > 0 && <NoteEmbeds embeds={renderedEmbeds} />}

      {/* Bottom Contexts & Tools Tags */}
      <div className="mt-12 pt-6 border-t border-stone-200 dark:border-stone-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {note.contexts.map((ctx) => (
              <button
                key={ctx}
                onClick={() => navigateTo({ type: 'context', slug: ctx.toLowerCase().replace(/\s+/g, '-') })}
                className="text-xs font-medium px-2.5 py-1 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
              >
                {ctx}
              </button>
            ))}

            {note.tools.map((tool) => (
              <button
                key={tool}
                onClick={() => navigateTo({ type: 'tool', slug: tool.toLowerCase().replace(/\s+/g, '-') })}
                className="text-xs px-2.5 py-1 rounded border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
              >
                {tool}
              </button>
            ))}
          </div>

          <button
            onClick={() => onOpenGiftModal(notebook.id)}
            className="text-xs flex items-center gap-1.5 px-3 py-1 rounded border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors"
          >
            <Gift className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Gift 1 year · $10</span>
          </button>
        </div>
      </div>

      {/* From Notebook Section */}
      <div className="mt-8 p-5 rounded-md border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-stone-400 mb-1">
          From the Notebook
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              onClick={() => navigateTo({ type: 'notebook', username: author.username, notebookSlug: notebook.slug })}
              className="font-editorial text-xl font-bold text-stone-900 dark:text-stone-100 hover:underline"
            >
              {notebook.name}
            </button>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
              {notebook.description}
            </p>
          </div>
          <button
            onClick={() => toggleFollowNotebook(notebook.id)}
            className={`px-3 py-1 text-xs rounded font-medium shrink-0 transition-colors ${
              isFollowingNotebook
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900'
            }`}
          >
            {isFollowingNotebook ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      {/* Previous / Next Navigation */}
      {(prevNote || nextNote) && (
        <nav className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200 dark:border-stone-800 text-xs">
          {prevNote ? (
            <button
              onClick={() =>
                navigateTo({
                  type: 'note',
                  username: author.username,
                  notebookSlug: notebook.slug,
                  noteSlug: prevNote.slug,
                })
              }
              className="text-left p-3 rounded border border-stone-200/60 dark:border-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors"
            >
              <span className="text-stone-400 text-[10px] uppercase tracking-wider flex items-center gap-1 mb-1">
                <ArrowLeft className="w-3 h-3" /> Previous Note
              </span>
              <span className="font-editorial text-sm font-semibold text-stone-900 dark:text-stone-100 block truncate">
                {prevNote.title}
              </span>
            </button>
          ) : (
            <div />
          )}

          {nextNote && (
            <button
              onClick={() =>
                navigateTo({
                  type: 'note',
                  username: author.username,
                  notebookSlug: notebook.slug,
                  noteSlug: nextNote.slug,
                })
              }
              className="text-right p-3 rounded border border-stone-200/60 dark:border-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors ml-auto w-full"
            >
              <span className="text-stone-400 text-[10px] uppercase tracking-wider flex items-center justify-end gap-1 mb-1">
                Next Note <ArrowRight className="w-3 h-3" />
              </span>
              <span className="font-editorial text-sm font-semibold text-stone-900 dark:text-stone-100 block truncate">
                {nextNote.title}
              </span>
            </button>
          )}
        </nav>
      )}

      {/* Related Notes */}
      {relatedNotes.length > 0 && (
        <section className="mt-12 pt-8 border-t border-stone-200 dark:border-stone-800">
          <h3 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100 mb-4">
            Related Notes
          </h3>
          <div className="space-y-3">
            {relatedNotes.map((rn) => {
              const rAuthor = users.find((u) => u.id === rn.authorId);
              const rNotebook = notebooks.find((nb) => nb.id === rn.notebookId);
              if (!rAuthor || !rNotebook) return null;
              return (
                <button
                  key={rn.id}
                  onClick={() =>
                    navigateTo({
                      type: 'note',
                      username: rAuthor.username,
                      notebookSlug: rNotebook.slug,
                      noteSlug: rn.slug,
                    })
                  }
                  className="w-full text-left p-3 rounded border border-stone-200/60 dark:border-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-editorial text-base font-semibold text-stone-900 dark:text-stone-100">
                      {rn.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {rNotebook.name} · {rAuthor.name}
                    </p>
                  </div>
                  <span className="text-xs text-stone-400 font-mono shrink-0 ml-4">
                    {rn.readingMinutes}m
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Discussion Section */}
      <section id="note-discussion" className="mt-16 pt-8 border-t-2 border-stone-300 dark:border-stone-700">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-editorial text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-stone-500" />
              Discussion · {noteComments.length}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Threaded conversation</span>
              <span className="font-hand text-base text-stone-500 dark:text-stone-400 -rotate-1">
                ~ reader marginalia
              </span>
            </div>
          </div>

          {noteComments.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (allThreadsCollapsed) {
                  setExpandAllTrigger((prev) => prev + 1);
                  setAllThreadsCollapsed(false);
                } else {
                  setCollapseAllTrigger((prev) => prev + 1);
                  setAllThreadsCollapsed(true);
                }
              }}
              className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 px-2.5 py-1.5 rounded border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={allThreadsCollapsed ? 'Expand all discussion threads' : 'Collapse all discussion threads'}
            >
              <ChevronsUpDown className="w-3.5 h-3.5" />
              <span>{allThreadsCollapsed ? 'Expand all threads' : 'Collapse all threads'}</span>
            </button>
          )}
        </div>

        {/* Root Comment Form */}
        <form onSubmit={handlePostRootComment} className="mb-8">
          <div className="flex items-start gap-2.5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover mt-1 grayscale-[20%]"
            />
            <div className="flex-1">
              <textarea
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Share a thoughtful question, observation, or reaction..."
                rows={3}
                className="w-full text-sm p-3 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-600 font-sans leading-relaxed"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  Markdown supported. Mention with @username.
                </span>
                <button
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="px-4 py-1.5 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs rounded font-medium disabled:opacity-40 transition-opacity"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comment List */}
        {rootComments.length === 0 ? (
          <p className="text-center text-stone-400 text-sm py-8 font-editorial italic">
            No discussion yet. Be the first to add a thoughtful comment.
          </p>
        ) : (
          <div className="space-y-4 divide-y divide-stone-100 dark:divide-stone-800/60">
            {rootComments.map((rootCmt) => (
              <CommentItem
                key={rootCmt.id}
                comment={rootCmt}
                allComments={noteComments}
                noteAuthorId={note.authorId}
                notebookOwnerId={notebook.ownerId}
                depth={0}
                collapseAllTrigger={collapseAllTrigger}
                expandAllTrigger={expandAllTrigger}
                onReport={(cId, authorName, snippet) =>
                  onOpenReportModal('comment', cId, `Comment by ${authorName}: "${snippet}"`)
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
