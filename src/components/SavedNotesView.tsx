import React from 'react';
import { useInktella } from '../context/InktellaContext';
import { NoteCard } from './NoteCard';
import { Bookmark } from 'lucide-react';

export const SavedNotesView: React.FC = () => {
  const { notes, savedNoteIds, navigateTo } = useInktella();

  const savedNotes = notes.filter((n) => savedNoteIds.includes(n.id));

  return (
    <div id="saved-notes-view" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-3">
          <Bookmark className="w-6 h-6 text-amber-600 dark:text-amber-500" />
          Saved Notes
        </h1>
        <p className="font-editorial text-base text-stone-600 dark:text-stone-400 mt-1">
          Your personal library of referenced notes and writing across the network.
        </p>
      </header>

      {savedNotes.length === 0 ? (
        <div className="py-16 text-center border-t border-stone-200 dark:border-stone-800">
          <p className="font-editorial text-lg text-stone-400 italic">
            You haven't saved any notes yet.
          </p>
          <button
            onClick={() => navigateTo({ type: 'discover' })}
            className="mt-4 px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs rounded font-medium"
          >
            Explore Notes
          </button>
        </div>
      ) : (
        <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
          {savedNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
};
