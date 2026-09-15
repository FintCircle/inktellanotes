import React from 'react';
import { ExternalLink, Play, Volume2 } from 'lucide-react';
import { NoteEmbed } from '../types';

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be']);
const VIMEO_HOSTS = new Set(['vimeo.com', 'www.vimeo.com', 'player.vimeo.com']);

function isSafeHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function hostName(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

export function getVideoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (YOUTUBE_HOSTS.has(host)) {
      const id = host === 'youtu.be' ? parsed.pathname.slice(1).split('/')[0] : parsed.searchParams.get('v');
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

function getMediaType(url: string): NoteEmbed['type'] {
  const normalized = url.split('?')[0].split('#')[0].toLowerCase();
  if (/\.(png|jpe?g|gif|webp|avif|svg)$/.test(normalized)) return 'image';
  if (/\.(mp3|wav|ogg|m4a|aac|flac)$/.test(normalized)) return 'audio';
  if (/\.(mp4|webm|mov|m4v|ogv)$/.test(normalized)) return 'video';
  if (getVideoEmbedUrl(url)) return 'video';
  return 'link-card';
}

function createEmbed(url: string, type: NoteEmbed['type'], index: number, title?: string, description?: string): NoteEmbed {
  return {
    id: `parsed_embed_${index}_${url}`,
    type,
    url,
    title: title || (type === 'video' ? 'Video embed' : type === 'image' ? 'Image' : type === 'audio' ? 'Audio' : undefined),
    description,
    siteName: hostName(url),
  };
}

export function extractHtmlEmbeds(body: string): { body: string; embeds: NoteEmbed[] } {
  const embeds: NoteEmbed[] = [];
  let cleanedBody = body;
  const add = (url: string, type: NoteEmbed['type'], title?: string) => {
    if (!isSafeHttpUrl(url)) return '';
    embeds.push(createEmbed(url, type, embeds.length, title));
    return '';
  };

  cleanedBody = cleanedBody.replace(/<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>[\s\S]*?<\/iframe>/gi, (_match, url: string) => {
    const type = getVideoEmbedUrl(url) ? 'video' : 'link-card';
    return type === 'video' ? add(url, type) : `[${hostName(url) || 'Embedded resource'}](${url})`;
  });
  cleanedBody = cleanedBody.replace(/<(img|video|audio)\b[^>]*\bsrc=["']([^"']+)["'][^>]*>(?:[\s\S]*?<\/\1>)?/gi, (_match, tag: string, url: string) => {
    const type = tag.toLowerCase() as 'image' | 'video' | 'audio';
    return add(url, type);
  });

  return { body: cleanedBody.replace(/\n{3,}/g, '\n\n').trim(), embeds };
}

export function inferEmbed(url: string, title?: string, description?: string): NoteEmbed {
  return createEmbed(url, getMediaType(url), Date.now(), title, description);
}

export const NoteEmbedCard: React.FC<{ embed: NoteEmbed }> = ({ embed }) => {
  const safeUrl = isSafeHttpUrl(embed.url);
  const videoUrl = embed.type === 'video' ? getVideoEmbedUrl(embed.url) : null;

  if (videoUrl) {
    return (
      <figure className="my-8 overflow-hidden rounded-lg border border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40">
        <div className="aspect-video w-full bg-stone-900">
          <iframe src={videoUrl} title={embed.title || 'Embedded video'} className="h-full w-full border-0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
        {(embed.title || embed.caption) && <figcaption className="flex items-center gap-2 px-4 py-3 text-xs text-stone-600 dark:text-stone-400"><Play className="h-3.5 w-3.5 shrink-0" />{embed.caption || embed.title}</figcaption>}
      </figure>
    );
  }

  if (embed.type === 'image' && safeUrl) {
    return <figure className="my-8"><img src={embed.url} alt={embed.title || embed.caption || 'Embedded image'} className="mx-auto max-h-[70vh] w-full rounded-lg object-contain" loading="lazy" />{embed.caption && <figcaption className="mt-2 text-center text-xs text-stone-500">{embed.caption}</figcaption>}</figure>;
  }

  if (embed.type === 'video' && safeUrl) {
    return <figure className="my-8 overflow-hidden rounded-lg border border-stone-200 bg-black dark:border-stone-800"><video controls playsInline preload="metadata" className="max-h-[70vh] w-full" src={embed.url} />{embed.caption && <figcaption className="bg-stone-50 px-4 py-3 text-xs text-stone-500 dark:bg-stone-900">{embed.caption}</figcaption>}</figure>;
  }

  if (embed.type === 'audio' && safeUrl) {
    return <figure className="my-8 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-900/40"><div className="mb-2 flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400"><Volume2 className="h-3.5 w-3.5" />{embed.title || 'Audio'}</div><audio controls className="w-full" src={embed.url} /></figure>;
  }

  return <a href={embed.url} target="_blank" rel="noreferrer" className="my-6 block rounded-lg border border-stone-200 bg-stone-50 p-4 transition-opacity hover:opacity-80 dark:border-stone-800 dark:bg-stone-900/40"><span className="flex items-center gap-2 text-sm font-semibold text-stone-900 dark:text-stone-100">{embed.title || embed.url}<ExternalLink className="h-3.5 w-3.5 text-stone-400" /></span>{embed.description && <span className="mt-1 block text-xs text-stone-600 dark:text-stone-400">{embed.description}</span>}<span className="mt-2 block truncate font-mono text-[10px] text-stone-400">{embed.siteName || embed.url}</span></a>;
};

export const NoteEmbeds: React.FC<{ embeds: NoteEmbed[] }> = ({ embeds }) => <div>{embeds.map((embed) => <NoteEmbedCard key={embed.id} embed={embed} />)}</div>;

export { getMediaType };
