export interface Person {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  links: {
    website?: string;
    github?: string;
    twitter?: string;
  };
  roles: string[];
  followersCount: number;
  followingUserIds: string[];
  followingNotebookIds: string[];
  followingContextIds: string[];
  followingToolIds: string[];
  joinedDate: string;
}

export interface Notebook {
  id: string;
  slug: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  paidThroughDate: string; // e.g. "2027-09-14"
  followersCount: number;
  commonContexts: string[];
  toolsUsed: string[];
  externalLinks?: { label: string; url: string }[];
}

export type NoteStatus = 'published' | 'draft' | 'unlisted';

export interface NoteEmbed {
  id: string;
  type: 'image' | 'video' | 'audio' | 'link-card' | 'code';
  url: string;
  title?: string;
  description?: string;
  siteName?: string;
  caption?: string;
}

export interface Note {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  notebookId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  readingMinutes: number;
  status: NoteStatus;
  contexts: string[]; // e.g. ['Building', 'Experimenting']
  subjects: string[]; // e.g. ['Inktella', 'R2 Storage']
  tools: string[];    // e.g. ['Cloudflare', 'R2']
  roleAtWriting: string; // e.g. 'Developer'
  viewsCount: number;
  savesCount: number;
  isFeatured?: boolean;
  embeds?: NoteEmbed[];
}

export interface Comment {
  id: string;
  noteId: string;
  authorId: string;
  parentCommentId: string | null;
  body: string;
  createdAt: string;
  updatedAt?: string;
  isEdited?: boolean;
  isReported?: boolean;
  isHidden?: boolean;
  mentions?: string[];
}

export interface ContextEntity {
  id: string;
  slug: string;
  name: string;
  description: string;
  notesCount: number;
  notebooksCount: number;
  isCanonical: boolean;
}

export interface ToolEntity {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: 'development' | 'writing' | 'design' | 'research' | 'productivity' | string;
  aliases: string[];
  website?: string;
  logoUrl?: string; // Admin-provided logo URL or persisted image data
  icon: string; // Icon identifier (e.g. "Cloud", "HardDrive", "Database", "Atom", etc.)
  notesCount: number;
  notebooksCount: number;
  isCanonical: boolean;
}

export interface SubjectEntity {
  id: string;
  slug: string;
  name: string;
  notesCount: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'comment' | 'reply' | 'mention' | 'follow_notebook' | 'gift';
  message: string;
  read: boolean;
  createdAt: string;
  targetUrl: string;
  actorId: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  targetType: 'note' | 'comment' | 'user';
  targetId: string;
  targetTitleOrSnippet: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface GiftRecord {
  id: string;
  notebookId: string;
  senderName: string;
  senderEmail?: string;
  yearsGifted: number;
  amountUsd: number;
  message?: string;
  date: string;
}

export type ViewRoute =
  | { type: 'discover' }
  | { type: 'following' }
  | { type: 'conversations' }
  | { type: 'notebooks' }
  | { type: 'saved' }
  | { type: 'note'; username: string; notebookSlug: string; noteSlug: string }
  | { type: 'notebook'; username: string; notebookSlug: string }
  | { type: 'profile'; username: string }
  | { type: 'context'; slug: string }
  | { type: 'tool'; slug: string }
  | { type: 'editor'; editNoteId?: string }
  | { type: 'admin' }
  | { type: 'search'; initialQuery?: string };
