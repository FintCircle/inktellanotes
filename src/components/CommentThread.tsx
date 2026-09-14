import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { useInktella } from '../context/InktellaContext';
import {
  CornerDownRight,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Flag,
  Trash2,
  Edit2,
  X,
  MessageSquare,
} from 'lucide-react';

interface CommentItemProps {
  comment: Comment;
  allComments: Comment[];
  noteAuthorId: string;
  notebookOwnerId: string;
  depth?: number;
  onReport: (commentId: string, authorName: string, snippet: string) => void;
  collapseAllTrigger?: number;
  expandAllTrigger?: number;
}

// Calculate recursive total replies count for a comment
function getDescendantsCount(commentId: string, comments: Comment[]): number {
  const children = comments.filter((c) => c.parentCommentId === commentId);
  return children.reduce((acc, child) => acc + 1 + getDescendantsCount(child.id, comments), 0);
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  allComments,
  noteAuthorId,
  notebookOwnerId,
  depth = 0,
  onReport,
  collapseAllTrigger = 0,
  expandAllTrigger = 0,
}) => {
  const { currentUser, users, addComment, updateComment, deleteComment, navigateTo } = useInktella();

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.body);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [areRepliesCollapsed, setAreRepliesCollapsed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sync with global collapse/expand all triggers
  useEffect(() => {
    if (collapseAllTrigger > 0) {
      setIsCollapsed(true);
      setAreRepliesCollapsed(true);
    }
  }, [collapseAllTrigger]);

  useEffect(() => {
    if (expandAllTrigger > 0) {
      setIsCollapsed(false);
      setAreRepliesCollapsed(false);
    }
  }, [expandAllTrigger]);

  const author = users.find((u) => u.id === comment.authorId);
  const isCommentAuthor = currentUser.id === comment.authorId;
  const canModerate = isCommentAuthor || currentUser.id === noteAuthorId || currentUser.id === notebookOwnerId;

  // Direct child replies and total descendants
  const childReplies = allComments.filter((c) => c.parentCommentId === comment.id);
  const totalDescendants = getDescendantsCount(comment.id, allComments);

  // Parent comment and parent author for conversational context on mobile
  const parentComment = comment.parentCommentId
    ? allComments.find((c) => c.id === comment.parentCommentId)
    : null;
  const parentAuthor = parentComment
    ? users.find((u) => u.id === parentComment.authorId)
    : null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    addComment(comment.noteId, replyText.trim(), comment.id);
    setReplyText('');
    setIsReplying(false);
    setAreRepliesCollapsed(false);
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    updateComment(comment.id, editText.trim());
    setIsEditing(false);
  };

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!author) return null;

  // Responsive indentation configuration:
  // On mobile screens, deep indentation is capped to prevent crushing readable text column.
  const depthIndentation =
    depth === 0
      ? 'mt-5'
      : depth === 1
      ? 'mt-3 ml-2 sm:ml-5 pl-2.5 sm:pl-3.5 border-l-2 border-stone-200 dark:border-stone-800/80'
      : depth === 2
      ? 'mt-2.5 ml-1.5 sm:ml-4 pl-2 sm:pl-3 border-l-2 border-stone-200/90 dark:border-stone-800/70'
      : depth === 3
      ? 'mt-2 ml-1 sm:ml-3 pl-2 sm:pl-2.5 border-l-2 border-stone-300/80 dark:border-stone-700/70'
      : 'mt-2 ml-1 sm:ml-2.5 pl-1.5 sm:pl-2 border-l-2 border-stone-300 dark:border-stone-700';

  // Compact collapsed state representation
  if (isCollapsed) {
    return (
      <div
        id={`comment-collapsed-${comment.id}`}
        className={`${depthIndentation} transition-all`}
      >
        <div
          onClick={() => setIsCollapsed(false)}
          className="group cursor-pointer py-2 px-3 rounded-md bg-stone-100/80 dark:bg-stone-900/80 hover:bg-stone-200/70 dark:hover:bg-stone-800 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-2 text-xs transition-colors"
          role="button"
          tabIndex={0}
          aria-label={`Expand comment by ${author.name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsCollapsed(false);
            }
          }}
        >
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <span className="p-0.5 text-stone-500 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors shrink-0">
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
            <img
              src={author.avatarUrl}
              alt={author.name}
              className="w-4 h-4 rounded-full object-cover grayscale-[20%] shrink-0"
            />
            <span className="font-medium text-stone-900 dark:text-stone-100 shrink-0">
              {author.name}
            </span>
            {author.id === noteAuthorId && (
              <span className="text-[9px] uppercase font-semibold px-1 py-0.2 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 shrink-0">
                Author
              </span>
            )}
            <span className="text-[11px] text-stone-400 font-mono shrink-0 hidden xs:inline">
              {formattedDate}
            </span>
            <span className="text-stone-500 dark:text-stone-400 text-xs truncate italic">
              "{comment.body.replace(/\n/g, ' ')}"
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 text-[11px] font-mono text-stone-500 dark:text-stone-400 bg-stone-200/60 dark:bg-stone-800 px-2 py-0.5 rounded">
            <span>+{totalDescendants + 1}</span>
            <span className="hidden sm:inline">
              {totalDescendants === 0 ? 'comment' : 'in thread'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={`comment-${comment.id}`}
      className={`relative ${depthIndentation} transition-all`}
    >
      {/* Interactive gutter guideline: clicking the line folds the thread */}
      {depth > 0 && (
        <button
          type="button"
          onClick={() => setIsCollapsed(true)}
          className="absolute -left-2.5 sm:-left-3.5 top-0 bottom-0 w-4 sm:w-5 group/gutter cursor-pointer focus:outline-none flex justify-center z-10"
          title="Click line to collapse thread"
          aria-label="Collapse comment thread"
        >
          <span className="w-0.5 h-full bg-transparent group-hover/gutter:bg-stone-500 dark:group-hover/gutter:bg-stone-400 transition-colors" />
        </button>
      )}

      <div className="group relative">
        {/* Comment Header */}
        <div className="flex items-start sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <button
              onClick={() => navigateTo({ type: 'profile', username: author.username })}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <img
                src={author.avatarUrl}
                alt={author.name}
                className="w-5 h-5 rounded-full object-cover grayscale-[20%]"
              />
              <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                {author.name}
              </span>
            </button>

            {author.id === noteAuthorId && (
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                Author
              </span>
            )}

            {/* Depth label on deep threads */}
            {depth >= 3 && (
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                L{depth}
              </span>
            )}

            <span className="text-[11px] text-stone-400 font-mono">
              {formattedDate}
            </span>

            {comment.isEdited && (
              <span className="text-[10px] text-stone-400 italic">(edited)</span>
            )}
          </div>

          {/* Action buttons on comment header */}
          <div className="flex items-center gap-0.5 shrink-0">
            {/* Collapse entire thread button */}
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded transition-colors"
              title="Collapse thread"
              aria-label="Collapse thread"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>

            {/* Menu options */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded transition-colors"
                aria-label="Comment options"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md shadow-lg py-1 z-30 text-xs">
                  {isCommentAuthor && (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  )}

                  {canModerate && (
                    <button
                      onClick={() => {
                        deleteComment(comment.id);
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onReport(comment.id, author.name, comment.body.slice(0, 80));
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2 text-stone-600 dark:text-stone-400"
                  >
                    <Flag className="w-3 h-3" /> Report
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Replying-to context indicator for deep threads on mobile */}
        {depth >= 1 && parentAuthor && (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-stone-500 dark:text-stone-400 font-sans">
            <CornerDownRight className="w-2.5 h-2.5 text-stone-400 shrink-0" />
            <span>
              replying to{' '}
              <span className="font-medium text-stone-800 dark:text-stone-200">
                @{parentAuthor.username}
              </span>
            </span>
          </div>
        )}

        {/* Comment Body or Edit Form */}
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500 font-sans"
              rows={3}
            />
            <div className="mt-2 flex items-center gap-2 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-2.5 py-1 text-xs bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded font-medium"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-1.5 text-stone-800 dark:text-stone-200 text-sm font-sans leading-relaxed break-words">
            {comment.isHidden ? (
              <p className="text-stone-400 italic text-xs">{comment.body}</p>
            ) : (
              <p className="whitespace-pre-line">{comment.body}</p>
            )}
          </div>
        )}

        {/* Footer Actions: Reply & Sub-thread Toggle */}
        {!comment.isHidden && (
          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs">
            {!isReplying && (
              <button
                onClick={() => setIsReplying(true)}
                className="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 font-medium transition-colors py-1"
              >
                <CornerDownRight className="w-3 h-3" />
                <span>Reply</span>
              </button>
            )}

            {/* Collapse / Expand sub-thread replies toggle */}
            {childReplies.length > 0 && (
              <button
                onClick={() => setAreRepliesCollapsed(!areRepliesCollapsed)}
                className="flex items-center gap-1 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 font-medium transition-colors py-1 px-1.5 rounded bg-stone-100/60 dark:bg-stone-800/60"
              >
                {areRepliesCollapsed ? (
                  <>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>
                      Show {totalDescendants} {totalDescendants === 1 ? 'reply' : 'replies'}
                    </span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span>
                      Hide {totalDescendants} {totalDescendants === 1 ? 'reply' : 'replies'}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Reply Input Form */}
        {isReplying && (
          <form
            onSubmit={handleSendReply}
            className="mt-3 pl-2.5 border-l-2 border-stone-300 dark:border-stone-700"
          >
            <div className="text-[11px] text-stone-500 mb-1 flex items-center justify-between">
              <span>Replying to {author.name}</span>
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your thought..."
              rows={2}
              className="w-full text-xs p-2 rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-stone-500 font-sans"
              autoFocus
            />
            <div className="mt-1.5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReplying(false)}
                className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded text-xs font-medium"
              >
                Send Reply
              </button>
            </div>
          </form>
        )}

        {/* Recursive Child Replies */}
        {!areRepliesCollapsed && childReplies.length > 0 && (
          <div className="space-y-1">
            {childReplies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                allComments={allComments}
                noteAuthorId={noteAuthorId}
                notebookOwnerId={notebookOwnerId}
                depth={depth + 1}
                onReport={onReport}
                collapseAllTrigger={collapseAllTrigger}
                expandAllTrigger={expandAllTrigger}
              />
            ))}

            {/* Quick fold-up button at the bottom of deep or long threads */}
            {depth >= 1 && totalDescendants >= 2 && (
              <div className="pt-2 flex justify-start">
                <button
                  onClick={() => setAreRepliesCollapsed(true)}
                  className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 font-mono py-1 px-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors"
                >
                  <ChevronUp className="w-3 h-3" />
                  <span>Fold thread ({totalDescendants} replies)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
