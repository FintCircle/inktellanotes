import React from 'react';
import { ExternalLink, Play, Volume2 } from 'lucide-react';
import { NoteEmbed } from '../types';

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be']);
const VIMEO_HOSTS = new Set(['vimeo.com', 'www.vimeo.com', 'player.vimeo.com']);

export function getVideoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (YOUTUBE_HOSTS.has(host)) {
      const id = host === 'youtu.be' ? parsed.pathname.slice(1) : parsed.searchParams.get('v');
      return id ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}` : null;
    }
    if (VIMEO_HOSTS.has(host)) {
      const match = parsed.pathname.match(/(?:video\/)?(\d+)/);
      return match ? `https://player.vimeo.com/video/${match[1]}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function extractHtmlEmbeds(body: string): { body: string; embeds: NoteEmbed[] } {
  const embeds: NoteEmbed[] = [];
  const cleanedBody = body.replace(/<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>[\s\S]*?<\/iframe>/gi, (_, url: string) => {
    if (!isSafeHttpUrl(url)) return '';
    const videoUrl = getVideoEmbedUrl(url);
    if (!videoUrl) return `[Embedded resource](${url})`;
    embeds.push({
      id: `parsed_embed_${embeds.length}_${url}`,
      type: 'video',
      url,
      title: 'Video embed',
      siteName: new URL(url).hostname.replace(/^www\./, ''),
    });
    return '';
  });

  return { body: cleanedBody.replace(/\n{3,}/g, '\n\n').trim(), embeds };
}

export const NoteEmbedCard: React.FC<{ embed: NoteEmbed }> = ({ embed }) => {
  const videoUrl = embed.type === 'video' ? getVideoEmbedUrl(embed.url) : null;

  if (videoUrl) {
    return (
      <figure className="my-8 overflow-hidden rounded-lg border border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40">
        <div className="aspect-video w-full bg-stone-900">
          <iframe
            src={videoUrl}
            title={embed.title || 'Embedded video'}
            className="h-full w-full border-0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        {(embed.title || embed.caption) && (
          <figcaption className="flex items-center gap-2 px-4 py-3 text-xs text-stone-600 dark:text-stone-400">
            <Play className="h-3.5 w-3.5 shrink-0" />
            {embed.caption || embed.title}
          </figcaption>
        )}
      </figure>
    );
  }

  if (embed.type === 'image' && isSafeHttpUrl(embed.url)) {
    return (
      <figure className="my-8">
        <img src={embed.url} alt={embed.title || embed.caption || 'Embedded image'} className="mx-auto max-h-[70vh] w-full rounded-lg object-contain" loading="lazy" />
        {embed.caption && <figcaption className="mt-2 text-center text-xs text-stone-500">{embed.caption}</figcaption>}
      </figure>
    );
  }

  if (embed.type === 'audio' && isSafeHttpUrl(embed.url)) {
    return (
      <figure className="my-8 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900/40">
        <div className="mb-2 flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400"><Volume2 className="h-3.5 w-3.5" />{embed.title || 'Audio'}</div>
        <audio controls className="w-full" src={embed.url} />
      </figure>
    );
  }

  return (
    <a href={embed.url} target="_blank" rel="noreferrer" className="my-6 block rounded-lg border border-stone-200 bg-stone-50 p-4 transition-opacity hover:opacity-80 dark:border-stone-800 dark:bg-stone-900/40">
      <span className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-stone-100">{embed.title || embed.url}<ExternalLink className="h-3.5 w-3.5 text-stone-400" /></span>
      {embed.description && <span className="mt-1 block text-xs text-stone-600 dark:text-stone-400">{embed.description}</span>}
      <span className="mt-2 block truncate font-mono text-[10px] text-stone-400">{embed.siteName || embed.url}</span>
    </a>
  );
};

export const NoteEmbeds: React.FC<{ embeds: NoteEmbed[] }> = ({ embeds }) => (
  <div>{embeds.map((embed) => <NoteEmbedCard key={embed.id} embed={embed} />)}</div>
);
