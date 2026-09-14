import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Person,
  Notebook,
  Note,
  Comment,
  ContextEntity,
  ToolEntity,
  NotificationItem,
  ReportItem,
  GiftRecord,
  ViewRoute,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_NOTEBOOKS,
  INITIAL_NOTES,
  INITIAL_COMMENTS,
  INITIAL_CONTEXTS,
  INITIAL_TOOLS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REPORTS,
  INITIAL_GIFTS,
} from '../data/initialData';

interface InktellaContextType {
  currentUser: Person;
  users: Person[];
  notebooks: Notebook[];
  notes: Note[];
  comments: Comment[];
  contexts: ContextEntity[];
  tools: ToolEntity[];
  notifications: NotificationItem[];
  reports: ReportItem[];
  gifts: GiftRecord[];
  savedNoteIds: string[];
  currentRoute: ViewRoute;
  theme: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  navigateTo: (route: ViewRoute) => void;
  switchCurrentUser: (userId: string) => void;
  
  // Note actions
  createNote: (data: Partial<Note> & { title: string; body: string; notebookId: string }) => Note;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleSaveNote: (id: string) => void;
  incrementNoteViews: (id: string) => void;

  // Notebook actions
  createNotebook: (data: { name: string; slug?: string; description: string }) => Notebook;
  updateNotebook: (id: string, data: Partial<Notebook>) => void;
  giftNotebook: (notebookId: string, years: number, senderName: string, message?: string) => void;

  // Comment actions
  addComment: (noteId: string, body: string, parentCommentId?: string | null) => Comment;
  updateComment: (id: string, body: string) => void;
  deleteComment: (id: string) => void;

  // Follow actions
  toggleFollowUser: (userId: string) => void;
  toggleFollowNotebook: (notebookId: string) => void;
  toggleFollowContext: (contextId: string) => void;
  toggleFollowTool: (toolId: string) => void;

  // Moderation & Reports
  submitReport: (targetType: 'note' | 'comment' | 'user', targetId: string, targetTitleOrSnippet: string, reason: string) => void;
  adminResolveReport: (reportId: string, action: 'resolved' | 'dismissed', removeTarget?: boolean) => void;

  // Admin network tools
  adminCreateTool: (name: string, description: string, category: ToolEntity['category'], aliases: string[], icon: string, website?: string) => void;
  adminUpdateTool: (toolId: string, updates: Partial<Pick<ToolEntity, 'name' | 'description' | 'category' | 'aliases' | 'icon' | 'website'>>) => void;
  adminMergeTools: (canonicalToolId: string, aliasNames: string[], toolIdsToRemove: string[]) => void;
  adminCreateContext: (name: string, description: string) => void;
  adminRenameContext: (contextId: string, newName: string, newDescription?: string) => void;
  adminMergeContexts: (canonicalContextId: string, mergeContextIds: string[]) => void;
  adminToggleFeatureNote: (noteId: string) => void;
  getToolByName: (name: string) => ToolEntity | undefined;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const InktellaContext = createContext<InktellaContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'inktella_users_v2',
  NOTEBOOKS: 'inktella_notebooks_v2',
  NOTES: 'inktella_notes_v2',
  COMMENTS: 'inktella_comments_v2',
  CONTEXTS: 'inktella_contexts_v2',
  TOOLS: 'inktella_tools_v2',
  NOTIFICATIONS: 'inktella_notifications_v2',
  REPORTS: 'inktella_reports_v2',
  GIFTS: 'inktella_gifts_v2',
  SAVED_NOTES: 'inktella_saved_notes_v2',
  CURRENT_USER_ID: 'inktella_current_user_v2',
  THEME: 'inktella_theme_v2',
};

function parseRouteFromHash(hash: string): ViewRoute {
  const path = hash.replace(/^#\/?/, '').trim();
  if (!path || path === 'discover') {
    return { type: 'discover' };
  }
  if (path === 'following') {
    return { type: 'following' };
  }
  if (path === 'conversations') {
    return { type: 'conversations' };
  }
  if (path === 'notebooks') {
    return { type: 'notebooks' };
  }
  if (path === 'saved') {
    return { type: 'saved' };
  }
  if (path === 'admin') {
    return { type: 'admin' };
  }
  if (path === 'new-note') {
    return { type: 'editor' };
  }
  if (path.startsWith('edit-note/')) {
    const editNoteId = path.split('/')[1];
    return { type: 'editor', editNoteId };
  }
  if (path.startsWith('search')) {
    const queryMatch = path.match(/search(?:\?q=(.*))?/);
    const initialQuery = queryMatch && queryMatch[1] ? decodeURIComponent(queryMatch[1]) : '';
    return { type: 'search', initialQuery };
  }
  if (path.startsWith('context/')) {
    const slug = path.split('/')[1];
    return { type: 'context', slug };
  }
  if (path.startsWith('tool/')) {
    const slug = path.split('/')[1];
    return { type: 'tool', slug };
  }
  if (path.startsWith('@')) {
    const parts = path.split('/');
    const username = parts[0].replace(/^@/, '');
    if (parts.length === 1) {
      return { type: 'profile', username };
    }
    if (parts.length === 2) {
      return { type: 'notebook', username, notebookSlug: parts[1] };
    }
    if (parts.length >= 3) {
      return { type: 'note', username, notebookSlug: parts[1], noteSlug: parts[2] };
    }
  }
  return { type: 'discover' };
}

function routeToHash(route: ViewRoute): string {
  switch (route.type) {
    case 'discover':
      return '#/discover';
    case 'following':
      return '#/following';
    case 'conversations':
      return '#/conversations';
    case 'notebooks':
      return '#/notebooks';
    case 'saved':
      return '#/saved';
    case 'admin':
      return '#/admin';
    case 'editor':
      return route.editNoteId ? `#/edit-note/${route.editNoteId}` : '#/new-note';
    case 'search':
      return route.initialQuery ? `#/search?q=${encodeURIComponent(route.initialQuery)}` : '#/search';
    case 'context':
      return `#/context/${route.slug}`;
    case 'tool':
      return `#/tool/${route.slug}`;
    case 'profile':
      return `#/@${route.username}`;
    case 'notebook':
      return `#/@${route.username}/${route.notebookSlug}`;
    case 'note':
      return `#/@${route.username}/${route.notebookSlug}/${route.noteSlug}`;
  }
}

export const InktellaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Persistence loaders
  const [users, setUsers] = useState<Person[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_derrick';
  });

  const [notebooks, setNotebooks] = useState<Notebook[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTEBOOKS);
    return saved ? JSON.parse(saved) : INITIAL_NOTEBOOKS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  const [contexts, setContexts] = useState<ContextEntity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CONTEXTS);
    return saved ? JSON.parse(saved) : INITIAL_CONTEXTS;
  });

  const [tools, setTools] = useState<ToolEntity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TOOLS);
    return saved ? JSON.parse(saved) : INITIAL_TOOLS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [gifts, setGifts] = useState<GiftRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GIFTS);
    return saved ? JSON.parse(saved) : INITIAL_GIFTS;
  });

  const [savedNoteIds, setSavedNoteIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_NOTES);
    return saved ? JSON.parse(saved) : ['note_r2_storage'];
  });

  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>(() => {
    return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | 'system') || 'light';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [currentRoute, setCurrentRoute] = useState<ViewRoute>(() => {
    return parseRouteFromHash(window.location.hash);
  });

  // Sync route on hash change
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(parseRouteFromHash(window.location.hash));
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = useCallback((route: ViewRoute) => {
    setCurrentRoute(route);
    const hash = routeToHash(route);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Theme synchronization
  const applyThemeClass = (targetTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    if (targetTheme === 'dark') {
      root.classList.add('dark');
    } else if (targetTheme === 'light') {
      root.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const setTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    applyThemeClass(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    const next = isCurrentlyDark ? 'light' : 'dark';
    setTheme(next);
  }, [setTheme]);

  useEffect(() => {
    applyThemeClass(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = (e: MediaQueryListEvent) => {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }
  }, [theme]);

  // Storage persistence effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTEBOOKS, JSON.stringify(notebooks));
  }, [notebooks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTEXTS, JSON.stringify(contexts));
  }, [contexts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(tools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GIFTS, JSON.stringify(gifts));
  }, [gifts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_NOTES, JSON.stringify(savedNoteIds));
  }, [savedNoteIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchCurrentUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  // Note CRUD
  const createNote = useCallback(
    (data: Partial<Note> & { title: string; body: string; notebookId: string }): Note => {
      const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `note-${Date.now()}`;
      const excerpt = data.excerpt || data.body.replace(/[#*`_>]/g, '').slice(0, 180).trim() + '...';
      const wordCount = data.body.trim().split(/\s+/).length;
      const readingMinutes = Math.max(1, Math.ceil(wordCount / 200));

      const newNote: Note = {
        id: `note_${Date.now()}`,
        slug,
        title: data.title,
        excerpt,
        body: data.body,
        notebookId: data.notebookId,
        authorId: currentUser.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        readingMinutes,
        status: data.status || 'published',
        contexts: data.contexts || ['Building'],
        subjects: data.subjects || [],
        tools: data.tools || [],
        roleAtWriting: data.roleAtWriting || currentUser.roles[0] || 'Author',
        viewsCount: 1,
        savesCount: 0,
        isFeatured: false,
        embeds: data.embeds || [],
      };

      setNotes((prev) => [newNote, ...prev]);

      // Update context note counts
      if (newNote.contexts.length > 0) {
        setContexts((prev) =>
          prev.map((ctx) =>
            newNote.contexts.includes(ctx.name) ? { ...ctx, notesCount: ctx.notesCount + 1 } : ctx
          )
        );
      }

      // Update tools note counts
      if (newNote.tools.length > 0) {
        setTools((prev) =>
          prev.map((t) =>
            newNote.tools.includes(t.name) ? { ...t, notesCount: t.notesCount + 1 } : t
          )
        );
      }

      return newNote;
    },
    [currentUser]
  );

  const updateNote = useCallback((id: string, data: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const updated = { ...n, ...data, updatedAt: new Date().toISOString() };
          if (data.body) {
            const wordCount = data.body.trim().split(/\s+/).length;
            updated.readingMinutes = Math.max(1, Math.ceil(wordCount / 200));
            if (!data.excerpt) {
              updated.excerpt = data.body.replace(/[#*`_>]/g, '').slice(0, 180).trim() + '...';
            }
          }
          return updated;
        }
        return n;
      })
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setComments((prev) => prev.filter((c) => c.noteId !== id));
  }, []);

  const toggleSaveNote = useCallback((id: string) => {
    setSavedNoteIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        setNotes((nPrev) =>
          nPrev.map((n) => (n.id === id ? { ...n, savesCount: Math.max(0, n.savesCount - 1) } : n))
        );
        return prev.filter((item) => item !== id);
      } else {
        setNotes((nPrev) =>
          nPrev.map((n) => (n.id === id ? { ...n, savesCount: n.savesCount + 1 } : n))
        );
        return [...prev, id];
      }
    });
  }, []);

  const incrementNoteViews = useCallback((id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, viewsCount: n.viewsCount + 1 } : n))
    );
  }, []);

  // Notebook actions
  const createNotebook = useCallback(
    (data: { name: string; slug?: string; description: string }): Notebook => {
      const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newNotebook: Notebook = {
        id: `nb_${Date.now()}`,
        slug,
        name: data.name,
        description: data.description,
        ownerId: currentUser.id,
        createdAt: new Date().toISOString().split('T')[0],
        paidThroughDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        followersCount: 1,
        commonContexts: ['Building'],
        toolsUsed: [],
      };

      setNotebooks((prev) => [...prev, newNotebook]);
      return newNotebook;
    },
    [currentUser]
  );

  const updateNotebook = useCallback((id: string, data: Partial<Notebook>) => {
    setNotebooks((prev) => prev.map((nb) => (nb.id === id ? { ...nb, ...data } : nb)));
  }, []);

  const giftNotebook = useCallback((notebookId: string, years: number, senderName: string, message?: string) => {
    setNotebooks((prev) =>
      prev.map((nb) => {
        if (nb.id === notebookId) {
          const currentPaid = new Date(nb.paidThroughDate || Date.now());
          const newDate = new Date(currentPaid.getTime() + years * 365 * 24 * 60 * 60 * 1000);
          return {
            ...nb,
            paidThroughDate: newDate.toISOString().split('T')[0],
          };
        }
        return nb;
      })
    );

    const gift: GiftRecord = {
      id: `gift_${Date.now()}`,
      notebookId,
      senderName,
      yearsGifted: years,
      amountUsd: years * 10,
      message,
      date: new Date().toISOString().split('T')[0],
    };

    setGifts((prev) => [gift, ...prev]);

    // Send notification to owner
    const targetNb = notebooks.find((n) => n.id === notebookId);
    if (targetNb) {
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          userId: targetNb.ownerId,
          type: 'gift',
          message: `${senderName} gifted ${years} year${years > 1 ? 's' : ''} to "${targetNb.name}" ($${years * 10})!`,
          read: false,
          createdAt: new Date().toISOString(),
          targetUrl: `/@${currentUser.username}/${targetNb.slug}`,
          actorId: currentUser.id,
        },
        ...prev,
      ]);
    }
  }, [currentUser, notebooks]);

  // Comment actions
  const addComment = useCallback(
    (noteId: string, body: string, parentCommentId: string | null = null): Comment => {
      // Check for mentions like @username
      const mentionMatches = body.match(/@([a-zA-Z0-9_-]+)/g);
      const mentions = mentionMatches ? mentionMatches.map((m) => m.replace('@', '')) : [];

      const newComment: Comment = {
        id: `cmt_${Date.now()}`,
        noteId,
        authorId: currentUser.id,
        parentCommentId,
        body,
        createdAt: new Date().toISOString(),
        mentions,
      };

      setComments((prev) => [...prev, newComment]);

      // Notify note author or parent comment author
      const note = notes.find((n) => n.id === noteId);
      if (note && note.authorId !== currentUser.id && !parentCommentId) {
        setNotifications((prev) => [
          {
            id: `notif_${Date.now()}`,
            userId: note.authorId,
            type: 'comment',
            message: `${currentUser.name} commented on "${note.title}"`,
            read: false,
            createdAt: new Date().toISOString(),
            targetUrl: `note_${note.id}`,
            actorId: currentUser.id,
          },
          ...prev,
        ]);
      } else if (parentCommentId) {
        const parentCmt = comments.find((c) => c.id === parentCommentId);
        if (parentCmt && parentCmt.authorId !== currentUser.id) {
          setNotifications((prev) => [
            {
              id: `notif_${Date.now()}`,
              userId: parentCmt.authorId,
              type: 'reply',
              message: `${currentUser.name} replied to your comment on "${note?.title || 'a note'}"`,
              read: false,
              createdAt: new Date().toISOString(),
              targetUrl: `note_${noteId}`,
              actorId: currentUser.id,
            },
            ...prev,
          ]);
        }
      }

      return newComment;
    },
    [currentUser, notes, comments]
  );

  const updateComment = useCallback((id: string, body: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, body, isEdited: true, updatedAt: new Date().toISOString() } : c))
    );
  }, []);

  const deleteComment = useCallback((id: string) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, isHidden: true, body: '[Comment removed]' } : c)));
  }, []);

  // Follow toggles
  const toggleFollowUser = useCallback((targetUserId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUserId) {
          const isFollowing = u.followingUserIds.includes(targetUserId);
          const newFollowing = isFollowing
            ? u.followingUserIds.filter((id) => id !== targetUserId)
            : [...u.followingUserIds, targetUserId];
          return { ...u, followingUserIds: newFollowing };
        }
        if (u.id === targetUserId) {
          const isFollowed = currentUser.followingUserIds.includes(targetUserId);
          return {
            ...u,
            followersCount: isFollowed ? Math.max(0, u.followersCount - 1) : u.followersCount + 1,
          };
        }
        return u;
      })
    );
  }, [currentUserId, currentUser]);

  const toggleFollowNotebook = useCallback((notebookId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUserId) {
          const isFollowing = u.followingNotebookIds.includes(notebookId);
          const newFollowing = isFollowing
            ? u.followingNotebookIds.filter((id) => id !== notebookId)
            : [...u.followingNotebookIds, notebookId];
          return { ...u, followingNotebookIds: newFollowing };
        }
        return u;
      })
    );

    setNotebooks((prev) =>
      prev.map((nb) => {
        if (nb.id === notebookId) {
          const isFollowing = currentUser.followingNotebookIds.includes(notebookId);
          return {
            ...nb,
            followersCount: isFollowing ? Math.max(0, nb.followersCount - 1) : nb.followersCount + 1,
          };
        }
        return nb;
      })
    );
  }, [currentUserId, currentUser]);

  const toggleFollowContext = useCallback((contextId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUserId) {
          const isFollowing = u.followingContextIds.includes(contextId);
          const newFollowing = isFollowing
            ? u.followingContextIds.filter((id) => id !== contextId)
            : [...u.followingContextIds, contextId];
          return { ...u, followingContextIds: newFollowing };
        }
        return u;
      })
    );
  }, [currentUserId]);

  const toggleFollowTool = useCallback((toolId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUserId) {
          const isFollowing = u.followingToolIds.includes(toolId);
          const newFollowing = isFollowing
            ? u.followingToolIds.filter((id) => id !== toolId)
            : [...u.followingToolIds, toolId];
          return { ...u, followingToolIds: newFollowing };
        }
        return u;
      })
    );
  }, [currentUserId]);

  // Reports
  const submitReport = useCallback((targetType: 'note' | 'comment' | 'user', targetId: string, targetTitleOrSnippet: string, reason: string) => {
    const report: ReportItem = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      targetType,
      targetId,
      targetTitleOrSnippet,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setReports((prev) => [report, ...prev]);
  }, [currentUser]);

  const adminResolveReport = useCallback((reportId: string, action: 'resolved' | 'dismissed', removeTarget: boolean = false) => {
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          return { ...r, status: action };
        }
        return r;
      })
    );

    if (removeTarget) {
      const rep = reports.find((r) => r.id === reportId);
      if (rep) {
        if (rep.targetType === 'note') {
          deleteNote(rep.targetId);
        } else if (rep.targetType === 'comment') {
          deleteComment(rep.targetId);
        }
      }
    }
  }, [reports, deleteNote, deleteComment]);

  // Admin Tools
  const adminCreateTool = useCallback((name: string, description: string, category: ToolEntity['category'], aliases: string[]) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newTool: ToolEntity = {
      id: `tool_${Date.now()}`,
      slug,
      name,
      description,
      category,
      aliases: aliases.map((a) => a.trim()).filter(Boolean),
      notesCount: 0,
      notebooksCount: 0,
      isCanonical: true,
    };
    setTools((prev) => [...prev, newTool]);
  }, []);

  const adminMergeTools = useCallback((canonicalToolId: string, aliasNames: string[], toolIdsToRemove: string[]) => {
    setTools((prev) => {
      const canonical = prev.find((t) => t.id === canonicalToolId);
      if (!canonical) return prev;

      const mergedAliases = Array.from(new Set([...canonical.aliases, ...aliasNames]));
      return prev
        .filter((t) => !toolIdsToRemove.includes(t.id))
        .map((t) => (t.id === canonicalToolId ? { ...t, aliases: mergedAliases } : t));
    });

    // Update references in notes
    const canonicalTool = tools.find((t) => t.id === canonicalToolId);
    if (canonicalTool) {
      setNotes((prevNotes) =>
        prevNotes.map((note) => {
          const updatedTools = note.tools.map((tName) => {
            if (aliasNames.includes(tName)) {
              return canonicalTool.name;
            }
            return tName;
          });
          return { ...note, tools: Array.from(new Set(updatedTools)) };
        })
      );
    }
  }, [tools]);

  const adminCreateContext = useCallback((name: string, description: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCtx: ContextEntity = {
      id: `ctx_${Date.now()}`,
      slug,
      name,
      description,
      notesCount: 0,
      notebooksCount: 0,
      isCanonical: true,
    };
    setContexts((prev) => [...prev, newCtx]);
  }, []);

  const adminRenameContext = useCallback((contextId: string, newName: string, newDescription?: string) => {
    setContexts((prev) =>
      prev.map((c) =>
        c.id === contextId
          ? { ...c, name: newName, description: newDescription !== undefined ? newDescription : c.description }
          : c
      )
    );
  }, []);

  const adminMergeContexts = useCallback((canonicalContextId: string, mergeContextIds: string[]) => {
    const canonical = contexts.find((c) => c.id === canonicalContextId);
    if (!canonical) return;

    const sourceContexts = contexts.filter((c) => mergeContextIds.includes(c.id));
    const sourceNames = sourceContexts.map((c) => c.name);

    setContexts((prev) => prev.filter((c) => !mergeContextIds.includes(c.id)));

    // Rewrite context references on notes
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        const hasSource = note.contexts.some((ctx) => sourceNames.includes(ctx));
        if (hasSource) {
          const filtered = note.contexts.filter((ctx) => !sourceNames.includes(ctx));
          return { ...note, contexts: Array.from(new Set([...filtered, canonical.name])) };
        }
        return note;
      })
    );
  }, [contexts]);

  const adminToggleFeatureNote = useCallback((noteId: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isFeatured: !n.isFeatured } : n))
    );
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  return (
    <InktellaContext.Provider
      value={{
        currentUser,
        users,
        notebooks,
        notes,
        comments,
        contexts,
        tools,
        notifications,
        reports,
        gifts,
        savedNoteIds,
        currentRoute,
        theme,
        toggleTheme,
        isSearchOpen,
        setIsSearchOpen,
        setTheme,
        navigateTo,
        switchCurrentUser,
        createNote,
        updateNote,
        deleteNote,
        toggleSaveNote,
        incrementNoteViews,
        createNotebook,
        updateNotebook,
        giftNotebook,
        addComment,
        updateComment,
        deleteComment,
        toggleFollowUser,
        toggleFollowNotebook,
        toggleFollowContext,
        toggleFollowTool,
        submitReport,
        adminResolveReport,
        adminCreateTool,
        adminMergeTools,
        adminCreateContext,
        adminRenameContext,
        adminMergeContexts,
        adminToggleFeatureNote,
        markNotificationRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </InktellaContext.Provider>
  );
};

export function useInktella() {
  const context = useContext(InktellaContext);
  if (!context) {
    throw new Error('useInktella must be used within an InktellaProvider');
  }
  return context;
}
