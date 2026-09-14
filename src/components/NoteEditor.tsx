import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { useInktella } from '../context/InktellaContext';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ListOrdered,
  Minus,
  Link,
  Eye,
  Edit3,
  Plus,
  X,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Globe,
  Film,
  FileText,
} from 'lucide-react';
import { NoteStatus, NoteEmbed } from '../types';

interface NoteEditorProps {
  editNoteId?: string;
  onDone?: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ editNoteId, onDone }) => {
  const {
    currentUser,
    notebooks,
    notes,
    contexts,
    tools,
    createNote,
    updateNote,
    createNotebook,
    navigateTo,
  } = useInktella();

  // User's owned notebooks
  const myNotebooks = notebooks.filter((nb) => nb.ownerId === currentUser.id);

  // Existing note if editing
  const existingNote = editNoteId ? notes.find((n) => n.id === editNoteId) : null;

  const [title, setTitle] = useState(existingNote?.title || '');
  const [body, setBody] = useState(existingNote?.body || '');
  const [selectedNotebookId, setSelectedNotebookId] = useState(
    existingNote?.notebookId || (myNotebooks[0]?.id || '')
  );
  const [status, setStatus] = useState<NoteStatus>(existingNote?.status || 'published');
  const [selectedContexts, setSelectedContexts] = useState<string[]>(
    existingNote?.contexts || ['Building']
  );
  const [selectedTools, setSelectedTools] = useState<string[]>(existingNote?.tools || []);
  const [subjectInput, setSubjectInput] = useState(existingNote?.subjects?.join(', ') || '');
  const [roleAtWriting, setRoleAtWriting] = useState(
    existingNote?.roleAtWriting || currentUser.roles[0] || 'Writer'
  );
  const [embeds, setEmbeds] = useState<NoteEmbed[]>(existingNote?.embeds || []);

  const [toolInput, setToolInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');

  // Media embed dialog
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');
  const [embedType, setEmbedType] = useState<'link-card' | 'video' | 'image'>('link-card');
  const [embedTitle, setEmbedTitle] = useState('');
  const [embedDescription, setEmbedDescription] = useState('');

  // New notebook inline creation modal
  const [isCreatingNotebook, setIsCreatingNotebook] = useState(false);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [newNotebookDesc, setNewNotebookDesc] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // If no notebook exists, set up default
  useEffect(() => {
    if (myNotebooks.length === 0 && !isCreatingNotebook) {
      const defaultNb = createNotebook({
        name: `${currentUser.name.split(' ')[0]}'s Notebook`,
        description: 'Thoughts, learnings, and experiments.',
      });
      setSelectedNotebookId(defaultNb.id);
    } else if (!selectedNotebookId && myNotebooks.length > 0) {
      setSelectedNotebookId(myNotebooks[0].id);
    }
  }, [myNotebooks, selectedNotebookId, currentUser, createNotebook, isCreatingNotebook]);

  // Autosave simulation
  useEffect(() => {
    if (!title && !body) return;
    setSaveStatus('dirty');
    const timer = setTimeout(() => {
      setSaveStatus('saving');
      setTimeout(() => setSaveStatus('saved'), 400);
    }, 1500);
    return () => clearTimeout(timer);
  }, [title, body, selectedNotebookId, selectedContexts, selectedTools]);

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newText = text.substring(0, start) + replacement + text.substring(end);
    setBody(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 0);
  };

  const handleAddTool = (toolName: string) => {
    const trimmed = toolName.trim();
    if (!trimmed || selectedTools.includes(trimmed)) return;
    setSelectedTools([...selectedTools, trimmed]);
    setToolInput('');
  };

  const handleRemoveTool = (toolName: string) => {
    setSelectedTools(selectedTools.filter((t) => t !== toolName));
  };

  const toggleContext = (ctxName: string) => {
    if (selectedContexts.includes(ctxName)) {
      setSelectedContexts(selectedContexts.filter((c) => c !== ctxName));
    } else {
      setSelectedContexts([...selectedContexts, ctxName]);
    }
  };

  const handleCreateNewNotebook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotebookName.trim()) return;
    const created = createNotebook({
      name: newNotebookName.trim(),
      description: newNotebookDesc.trim() || 'A public notebook on Inktella.',
    });
    setSelectedNotebookId(created.id);
    setIsCreatingNotebook(false);
    setNewNotebookName('');
    setNewNotebookDesc('');
  };

  const handleInsertEmbed = () => {
    if (!embedUrl.trim()) return;

    // Detect YouTube
    const isYoutube = embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be');
    const finalType = isYoutube ? 'video' : embedType;

    const newEmbed: NoteEmbed = {
      id: `embed_${Date.now()}`,
      type: finalType,
      url: embedUrl.trim(),
      title: embedTitle.trim() || (isYoutube ? 'Video Embed' : 'Link Resource'),
      description: embedDescription.trim(),
      siteName: new URL(embedUrl.trim()).hostname.replace('www.', ''),
    };

    setEmbeds([...embeds, newEmbed]);

    // Also insert markdown hint
    if (finalType === 'image') {
      insertFormatting(`\n![Image](${embedUrl.trim()})\n`);
    } else {
      insertFormatting(`\n> [Resource: ${newEmbed.title}](${embedUrl.trim()})\n`);
    }

    setShowEmbedDialog(false);
    setEmbedUrl('');
    setEmbedTitle('');
    setEmbedDescription('');
  };

  const handlePublishOrSave = () => {
    if (!title.trim()) {
      alert('Please enter a note title.');
      return;
    }
    if (!selectedNotebookId) {
      alert('Please select or create a notebook.');
      return;
    }

    const subjects = subjectInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (existingNote) {
      updateNote(existingNote.id, {
        title: title.trim(),
        body: body.trim(),
        notebookId: selectedNotebookId,
        status,
        contexts: selectedContexts.length > 0 ? selectedContexts : ['Building'],
        tools: selectedTools,
        subjects,
        roleAtWriting,
        embeds,
      });

      const nb = notebooks.find((n) => n.id === selectedNotebookId);
      navigateTo({
        type: 'note',
        username: currentUser.username,
        notebookSlug: nb ? nb.slug : 'notebook',
        noteSlug: existingNote.slug,
      });
    } else {
      const created = createNote({
        title: title.trim(),
        body: body.trim(),
        notebookId: selectedNotebookId,
        status,
        contexts: selectedContexts.length > 0 ? selectedContexts : ['Building'],
        tools: selectedTools,
        subjects,
        roleAtWriting,
        embeds,
      });

      const nb = notebooks.find((n) => n.id === selectedNotebookId);
      navigateTo({
        type: 'note',
        username: currentUser.username,
        notebookSlug: nb ? nb.slug : 'notebook',
        noteSlug: created.slug,
      });
    }

    if (onDone) onDone();
  };

  // Word & reading time calculations
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div id="inktella-note-editor" className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo({ type: 'discover' })}
            className="text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <span className="text-stone-300 dark:text-stone-700">|</span>
          <span className="text-stone-500 font-mono text-[11px]">
            {saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'dirty'
              ? 'Unsaved changes'
              : 'Autosaved'}
          </span>
        </div>

        {/* Notebook Selector & Status & Publish Button */}
        <div className="flex items-center gap-2.5">
          {/* Notebook dropdown */}
          <select
            value={selectedNotebookId}
            onChange={(e) => {
              if (e.target.value === '__new__') {
                setIsCreatingNotebook(true);
              } else {
                setSelectedNotebookId(e.target.value);
              }
            }}
            className="text-xs py-1 px-2 border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
          >
            {myNotebooks.map((nb) => (
              <option key={nb.id} value={nb.id}>
                {nb.name}
              </option>
            ))}
            <option value="__new__">+ New Notebook...</option>
          </select>

          {/* Publishing visibility */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as NoteStatus)}
            className="text-xs py-1 px-2 border border-stone-200 dark:border-stone-800 rounded bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
          >
            <option value="published">Public</option>
            <option value="unlisted">Unlisted</option>
            <option value="draft">Draft</option>
          </select>

          {/* Preview toggle */}
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`px-2.5 py-1 rounded border border-stone-200 dark:border-stone-800 flex items-center gap-1 transition-colors ${
              isPreview
                ? 'bg-stone-200 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            {isPreview ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            <span>{isPreview ? 'Edit' : 'Preview'}</span>
          </button>

          {/* Publish / Save CTA */}
          <button
            onClick={handlePublishOrSave}
            className="px-3.5 py-1 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded font-medium hover:opacity-90 transition-opacity"
          >
            {existingNote ? 'Update Note' : status === 'draft' ? 'Save Draft' : 'Publish Note'}
          </button>
        </div>
      </div>

      {/* Inline Notebook Creation Modal */}
      {isCreatingNotebook && (
        <form
          onSubmit={handleCreateNewNotebook}
          className="my-4 p-4 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-editorial text-sm font-semibold">Create a New Notebook</h4>
            <button
              type="button"
              onClick={() => setIsCreatingNotebook(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={newNotebookName}
            onChange={(e) => setNewNotebookName(e.target.value)}
            placeholder="Notebook Name (e.g. The Backend Log, Learning in Public)"
            className="w-full text-xs p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
            autoFocus
          />
          <input
            type="text"
            value={newNotebookDesc}
            onChange={(e) => setNewNotebookDesc(e.target.value)}
            placeholder="Short description of this notebook publication"
            className="w-full text-xs p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCreatingNotebook(false)}
              className="px-2.5 py-1 text-xs text-stone-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded font-medium"
            >
              Create Notebook
            </button>
          </div>
        </form>
      )}

      {/* Formatting Toolbar (Minimal & Subtle) */}
      {!isPreview && (
        <div className="flex flex-wrap items-center gap-1 py-2 my-2 border-b border-stone-100 dark:border-stone-800 text-stone-500">
          <button
            type="button"
            onClick={() => insertFormatting('**', '**')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded"
            title="Bold (**text**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('*', '*')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded"
            title="Italic (*text*)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n## ', '\n')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded"
            title="Heading 2 (## Title)"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n### ', '\n')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded"
            title="Heading 3 (### Title)"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n> ', '\n')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded"
            title="Blockquote (> quote)"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('`', '`')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded"
            title="Inline code (`code`)"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n```typescript\n', '\n```\n')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded text-xs font-mono"
            title="Code block"
          >
            {'{}'}
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n- ', '\n')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded"
            title="Unordered list"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n1. ', '\n')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded"
            title="Ordered list"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('\n---\n')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded"
            title="Divider (---)"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertFormatting('[', '](https://)')}
            className="p-1.5 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded"
            title="Link ([title](url))"
          >
            <Link className="w-3.5 h-3.5" />
          </button>

          <span className="text-stone-300 dark:text-stone-700">|</span>

          {/* Embeds and Media modal trigger */}
          <button
            type="button"
            onClick={() => setShowEmbedDialog(true)}
            className="px-2 py-1 text-xs text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded flex items-center gap-1"
            title="Insert Embed, Video, or Link Card"
          >
            <Film className="w-3 h-3" />
            <span>Embed Media</span>
          </button>
        </div>
      )}

      {/* Embed Dialog */}
      {showEmbedDialog && (
        <div className="my-4 p-4 rounded-md border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Insert Media or Embed
            </h4>
            <button
              onClick={() => setShowEmbedDialog(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="embedType"
                checked={embedType === 'link-card'}
                onChange={() => setEmbedType('link-card')}
              />
              <span>Link Card</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="embedType"
                checked={embedType === 'video'}
                onChange={() => setEmbedType('video')}
              />
              <span>Video (YouTube/Vimeo)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="embedType"
                checked={embedType === 'image'}
                onChange={() => setEmbedType('image')}
              />
              <span>Inline Image</span>
            </label>
          </div>

          <input
            type="url"
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
            placeholder="Paste URL (e.g. https://... or https://youtube.com/watch?v=...)"
            className="w-full text-xs p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 font-mono"
          />

          {embedType === 'link-card' && (
            <>
              <input
                type="text"
                value={embedTitle}
                onChange={(e) => setEmbedTitle(e.target.value)}
                placeholder="Card title (optional)"
                className="w-full text-xs p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
              />
              <input
                type="text"
                value={embedDescription}
                onChange={(e) => setEmbedDescription(e.target.value)}
                placeholder="Card excerpt or description (optional)"
                className="w-full text-xs p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
              />
            </>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowEmbedDialog(false)}
              className="px-2.5 py-1 text-xs text-stone-500"
            >
              Cancel
            </button>
            <button
              onClick={handleInsertEmbed}
              className="px-3 py-1 text-xs bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded font-medium"
            >
              Insert Embed
            </button>
          </div>
        </div>
      )}

      {/* Writing Area or Preview */}
      {isPreview ? (
        <div className="py-6 border-b border-stone-200 dark:border-stone-800">
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-6">
            {title || 'Untitled Note'}
          </h1>
          <div className="inktella-prose">
            <Markdown>{body || '*No content written yet.*'}</Markdown>
          </div>
        </div>
      ) : (
        <div className="space-y-4 py-4">
          {/* Note Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full font-editorial text-3xl sm:text-4xl font-bold bg-transparent border-none outline-none text-stone-900 dark:text-stone-100 placeholder-stone-300 dark:placeholder-stone-700"
            autoFocus
          />

          {/* Note Body Textarea */}
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Start writing... (Markdown supported directly)"
            rows={14}
            className="w-full font-editorial-body text-base sm:text-lg bg-transparent border-none outline-none resize-y text-stone-800 dark:text-stone-200 placeholder-stone-300 dark:placeholder-stone-700 font-serif leading-relaxed"
          />

          {/* Word Count / Reading metrics */}
          <div className="text-right text-[11px] text-stone-400 font-mono">
            {wordCount} words · {readTime} min read
          </div>
        </div>
      )}

      {/* Fast Context Assignment Section (Section 7 from spec) */}
      <div className="mt-8 pt-6 border-t border-stone-200 dark:border-stone-800">
        <h3 className="text-xs uppercase font-semibold tracking-wider text-stone-500 dark:text-stone-400 mb-4">
          Context & Connections
        </h3>

        {/* 1. Context: What are you doing? */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
            Context <span className="text-stone-400 font-normal">(What are you doing?)</span>
          </label>
          <div className="flex flex-wrap gap-1.5">
            {contexts.map((ctx) => {
              const isSelected = selectedContexts.includes(ctx.name);
              return (
                <button
                  key={ctx.id}
                  type="button"
                  onClick={() => toggleContext(ctx.name)}
                  className={`text-xs px-2.5 py-1 rounded transition-colors ${
                    isSelected
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-medium'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {ctx.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Tools: What are you using? */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
            Tools Used <span className="text-stone-400 font-normal">(Software, instruments, physical media)</span>
          </label>
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            {selectedTools.map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 flex items-center gap-1"
              >
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTool(t)}
                  className="hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTool(toolInput);
                }
              }}
              placeholder="e.g. Cloudflare, R2, Scrivener, Figma..."
              className="text-xs p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex-1"
            />
            <button
              type="button"
              onClick={() => handleAddTool(toolInput)}
              className="px-2.5 py-2 text-xs bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded font-medium"
            >
              Add
            </button>
          </div>
          {/* Quick tool suggestions from canonical library */}
          <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-stone-400">
            <span className="py-0.5">Popular:</span>
            {tools.slice(0, 8).map((tool) => (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleAddTool(tool.name)}
                className="hover:text-stone-700 dark:hover:text-stone-200 underline decoration-dotted"
              >
                {tool.name}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Subject / Project & Author Role */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Subject / Project <span className="text-stone-400 font-normal">(Comma separated)</span>
            </label>
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="e.g. Inktella, My Novel, Learning Japanese"
              className="w-full text-xs p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              Your Role for this Note
            </label>
            <input
              type="text"
              value={roleAtWriting}
              onChange={(e) => setRoleAtWriting(e.target.value)}
              placeholder="e.g. Developer, Novelist, Researcher"
              className="w-full text-xs p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
