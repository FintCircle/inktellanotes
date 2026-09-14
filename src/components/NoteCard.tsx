import React from 'react';
import { Note } from '../types';
import { useInktella } from '../context/InktellaContext';
import { MessageSquare, Bookmark, Lock } from 'lucide-react';

interface NoteCardProps {
  note: Note;
  showNotebookHeader?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, showNotebookHeader = true }) => {
  const { users, notebooks, comments, savedNoteIds, toggleSaveNote, navigateTo } = useInktella();

  const author = users.find((u) => u.id === note.authorId);
  const notebook = notebooks.find((nb) => nb.id === note.notebookId);
  const noteComments = comments.filter((c) => c.noteId === note.id && !c.isHidden);
  const isSaved = savedNoteIds.includes(note.id);

  if (!author || !notebook) return null;

  const handleOpenNote = () => {
    navigateTo({
      type: 'note',
      username: author.username,
      notebookSlug: notebook.slug,
      noteSlug: note.slug,
    });
  };

  const handleOpenNotebook = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo({
      type: 'notebook',
      username: author.username,
      notebookSlug: notebook.slug,
    });
  };

  const handleOpenAuthor = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateTo({
      type: 'profile',
      username: author.username,
    });
  };

  const handleOpenContext = (e: React.MouseEvent, contextName: string) => {
    e.stopPropagation();
    const slug = contextName.toLowerCase().replace(/\s+/g, '-');
    navigateTo({ type: 'context', slug });
  };

  const handleOpenTool = (e: React.MouseEvent, toolName: string) => {
    e.stopPropagation();
    const slug = toolName.toLowerCase().replace(/\s+/g, '-');
    navigateTo({ type: 'tool', slug });
  };

  // Format date cleanly e.g. "Sep 14"
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <article
      id={`note-card-${note.id}`}
      onClick={handleOpenNote}
      className="group cursor-pointer py-6 border-b border-stone-200/70 dark:border-stone-800/70 hover:bg-stone-50/50 dark:hover:bg-stone-900/30 transition-colors px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-md"
    >
      {/* Title */}
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-editorial text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors leading-tight">
          {note.title}
        </h2>
        {note.status === 'unlisted' && (
          <span className="flex items-center gap-1 text-[11px] text-stone-400 font-mono tracking-tight" title="Unlisted note">
            <Lock className="w-3 h-3" /> Unlisted
          </span>
        )}
      </div>

      {/* Opening text / excerpt */}
      <p className="font-editorial text-stone-600 dark:text-stone-400 text-base sm:text-[17px] leading-relaxed mt-2.5 line-clamp-3">
        {note.excerpt}
      </p>

      {/* Metadata Line 1: Notebook · Author */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
        {showNotebookHeader && (
          <>
            <button
              onClick={handleOpenNotebook}
              className="font-medium text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-stone-100 uppercase tracking-wider text-[11px] transition-colors"
            >
              {notebook.name}
            </button>
            <span className="text-stone-300 dark:text-stone-700">·</span>
          </>
        )}
        <button
          onClick={handleOpenAuthor}
          className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
        >
          {author.name}
        </button>
        <span className="text-stone-300 dark:text-stone-700">·</span>
        <span>{formattedDate}</span>
        <span className="text-stone-300 dark:text-stone-700">·</span>
        <span className="font-hand text-[15px] sm:text-base text-stone-500 dark:text-stone-400">
          ~ {note.readingMinutes} min read
        </span>
      </div>

      {/* Metadata Line 2: Contexts · Tools · Comments · Save */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Contexts */}
          {note.contexts.map((ctx) => (
            <button
              key={ctx}
              onClick={(e) => handleOpenContext(e, ctx)}
              className="text-[11px] font-medium px-2 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300/60 dark:hover:bg-stone-700 transition-colors"
            >
              {ctx}
            </button>
          ))}

          {/* Tools */}
          {note.tools.map((tool) => (
            <button
              key={tool}
              onClick={(e) => handleOpenTool(e, tool)}
              className="text-[11px] px-2 py-0.5 rounded border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
            >
              {tool}
            </button>
          ))}
        </div>

        {/* Discussion count & bookmark action */}
        <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
          <button
            onClick={handleOpenNote}
            className="flex items-center gap-1 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
            title={`${noteComments.length} discussion comments`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{noteComments.length}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveNote(note.id);
            }}
            className={`p-1 rounded hover:text-stone-900 dark:hover:text-stone-100 transition-colors ${
              isSaved ? 'text-amber-700 dark:text-amber-500' : 'text-stone-400'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save note'}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
};
