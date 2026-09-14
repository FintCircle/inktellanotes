import React from 'react';
import { useInktella } from '../context/InktellaContext';
import { NoteCard } from './NoteCard';
import { Globe, Github, Twitter, BookOpen } from 'lucide-react';

interface PersonProfileProps {
  username: string;
}

export const PersonProfile: React.FC<PersonProfileProps> = ({ username }) => {
  const { users, notebooks, notes, currentUser, toggleFollowUser, navigateTo } = useInktella();

  const person = users.find((u) => u.username === username);

  if (!person) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h2 className="font-editorial text-2xl font-semibold mb-2">User Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">This profile does not exist.</p>
        <button
          onClick={() => navigateTo({ type: 'discover' })}
          className="px-4 py-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-xs rounded font-medium"
        >
          Return to Discover
        </button>
      </div>
    );
  }

  const isSelf = currentUser.id === person.id;
  const isFollowing = currentUser.followingUserIds.includes(person.id);

  // User's notebooks
  const userNotebooks = notebooks.filter((nb) => nb.ownerId === person.id);

  // User's notes
  const userNotes = notes
    .filter((n) => n.authorId === person.id && (isSelf || n.status === 'published'))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div id="person-profile-page" className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Profile Header */}
      <header className="mb-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={person.avatarUrl}
              alt={person.name}
              className="w-16 h-16 rounded-full object-cover grayscale-[20%] border border-stone-200 dark:border-stone-800"
            />
            <div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
                {person.name}
              </h1>
              <p className="text-xs text-stone-500 font-mono">@{person.username}</p>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                {person.roles.join(' · ')}
              </p>
            </div>
          </div>

          {!isSelf && (
            <button
              onClick={() => toggleFollowUser(person.id)}
              className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${
                isFollowing
                  ? 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                  : 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* Bio */}
        <p className="font-editorial text-base sm:text-lg text-stone-700 dark:text-stone-300 mt-5 leading-relaxed">
          {person.bio}
        </p>

        {/* External Links */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-500">
          {person.links.website && (
            <a
              href={person.links.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Website</span>
            </a>
          )}
          {person.links.github && (
            <a
              href={person.links.github}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          )}
          {person.links.twitter && (
            <a
              href={person.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
            >
              <Twitter className="w-3.5 h-3.5" />
              <span>Twitter</span>
            </a>
          )}
        </div>
      </header>

      {/* Notebooks Owned Section */}
      <section className="mb-12 pt-6 border-t border-stone-200 dark:border-stone-800">
        <h2 className="text-xs uppercase font-semibold tracking-widest text-stone-400 mb-4">
          Notebook Publications
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {userNotebooks.map((nb) => {
            const nbNotesCount = notes.filter((n) => n.notebookId === nb.id && n.status !== 'draft').length;
            return (
              <button
                key={nb.id}
                onClick={() =>
                  navigateTo({
                    type: 'notebook',
                    username: person.username,
                    notebookSlug: nb.slug,
                  })
                }
                className="w-full text-left p-4 rounded-md border border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600 transition-colors bg-white/40 dark:bg-stone-900/30"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-editorial text-lg font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                    {nb.name}
                  </h3>
                  <span className="text-xs font-mono text-stone-400">
                    {nbNotesCount} note{nbNotesCount === 1 ? '' : 's'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                  {nb.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent Notes Activity */}
      <section className="pt-6 border-t border-stone-200 dark:border-stone-800">
        <h2 className="text-xs uppercase font-semibold tracking-widest text-stone-400 mb-4">
          Notes & Writing ({userNotes.length})
        </h2>

        {userNotes.length === 0 ? (
          <p className="text-stone-400 italic text-sm py-6">No published notes yet.</p>
        ) : (
          <div className="divide-y divide-stone-200/80 dark:divide-stone-800/80">
            {userNotes.map((note) => (
              <NoteCard key={note.id} note={note} showNotebookHeader={true} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
