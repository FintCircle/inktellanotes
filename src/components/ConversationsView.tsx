import React from 'react';
import { useInktella } from '../context/InktellaContext';
import { MessageSquare, Users, GitFork, CornerDownRight, ArrowRight } from 'lucide-react';

export const ConversationsView: React.FC = () => {
  const { notes, comments, users, notebooks, navigateTo } = useInktella();

  // Compute conversation metrics per note
  const notesWithConversations = notes
    .map((note) => {
      const noteComments = comments.filter((c) => c.noteId === note.id && !c.isHidden);
      const uniqueParticipants = Array.from(new Set(noteComments.map((c) => c.authorId)));
      const hasAuthorParticipation = noteComments.some((c) => c.authorId === note.authorId);
      const childRepliesCount = noteComments.filter((c) => c.parentCommentId !== null).length;

      // Quality discussion score:
      // Rewards: unique participants (x3), replies depth (x2), author joining back-and-forth (+5), recent activity
      const qualityScore =
        uniqueParticipants.length * 3 +
        childRepliesCount * 2 +
        (hasAuthorParticipation ? 5 : 0) +
        noteComments.length;

      // Latest comment snippet
      const latestComment = noteComments.length > 0 ? noteComments[noteComments.length - 1] : null;
      const latestCommentAuthor = latestComment ? users.find((u) => u.id === latestComment.authorId) : null;

      return {
        note,
        totalComments: noteComments.length,
        uniqueParticipantsCount: uniqueParticipants.length,
        childRepliesCount,
        hasAuthorParticipation,
        qualityScore,
        latestComment,
        latestCommentAuthor,
      };
    })
    .filter((item) => item.totalComments > 0)
    .sort((a, b) => b.qualityScore - a.qualityScore);

  return (
    <div id="conversations-surface" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <header className="mb-8">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">
          Conversations
        </h1>
        <p className="font-editorial text-base sm:text-lg text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
          Surfacing notes where thoughtful back-and-forth discussions are unfolding across notebooks.
        </p>
      </header>

      {/* Conversations Stream */}
      <div className="space-y-6">
        {notesWithConversations.length === 0 ? (
          <div className="py-16 text-center border-t border-stone-200 dark:border-stone-800">
            <p className="font-editorial text-lg text-stone-400 italic">
              No conversations active yet.
            </p>
          </div>
        ) : (
          notesWithConversations.map((item) => {
            const author = users.find((u) => u.id === item.note.authorId);
            const notebook = notebooks.find((nb) => nb.id === item.note.notebookId);
            if (!author || !notebook) return null;

            return (
              <div
                key={item.note.id}
                onClick={() =>
                  navigateTo({
                    type: 'note',
                    username: author.username,
                    notebookSlug: notebook.slug,
                    noteSlug: item.note.slug,
                  })
                }
                className="group cursor-pointer p-5 rounded-lg border border-stone-200/80 dark:border-stone-800/80 bg-white/40 dark:bg-stone-900/30 hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
              >
                {/* Note Title & Context */}
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-editorial text-xl sm:text-2xl font-semibold text-stone-900 dark:text-stone-100 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors">
                    {item.note.title}
                  </h2>
                  <span className="text-xs text-stone-400 font-mono shrink-0">
                    {notebook.name}
                  </span>
                </div>

                {/* Excerpt */}
                <p className="font-editorial text-stone-600 dark:text-stone-400 text-sm mt-1.5 line-clamp-2">
                  {item.note.excerpt}
                </p>

                {/* Discussion Signals */}
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-400 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                  <span className="flex items-center gap-1.5 font-medium text-stone-900 dark:text-stone-200">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {item.totalComments} replies
                  </span>

                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-stone-400" />
                    {item.uniqueParticipantsCount} participants
                  </span>

                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5 text-stone-400" />
                    {item.childRepliesCount} nested replies
                  </span>

                  {item.hasAuthorParticipation && (
                    <span className="px-2 py-0.5 rounded bg-stone-200/60 dark:bg-stone-800 text-[10px] font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                      Author Participating
                    </span>
                  )}
                </div>

                {/* Latest Reply Snippet */}
                {item.latestComment && item.latestCommentAuthor && (
                  <div className="mt-3 p-3 rounded bg-stone-50/70 dark:bg-stone-900/50 border-l-2 border-stone-400 dark:border-stone-600 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={item.latestCommentAuthor.avatarUrl}
                        alt={item.latestCommentAuthor.name}
                        className="w-4 h-4 rounded-full object-cover grayscale-[20%]"
                      />
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {item.latestCommentAuthor.name}:
                      </span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-400 line-clamp-2 italic font-serif">
                      "{item.latestComment.body}"
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
