import { Person, Notebook, Note, Comment, ContextEntity, ToolEntity, SubjectEntity, NotificationItem, ReportItem, GiftRecord } from '../types';

export const INITIAL_USERS: Person[] = [
  {
    id: 'user_derrick',
    username: 'derrick',
    name: 'Derrick Mbabazi',
    bio: 'Building things and writing about what I learn along the way. Interested in small software, calm interfaces, and distributed systems.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    links: {
      website: 'https://derrickm.org',
      github: 'https://github.com/derrickmbabazi',
      twitter: 'https://twitter.com/derrickmbabazi',
    },
    roles: ['Developer', 'Writer'],
    followersCount: 342,
    followingUserIds: ['user_sarah', 'user_elena', 'user_marcus'],
    followingNotebookIds: ['nb_backend_log', 'nb_notes_novelist', 'nb_type_structure'],
    followingContextIds: ['ctx_building', 'ctx_writing', 'ctx_researching'],
    followingToolIds: ['tool_cloudflare', 'tool_r2', 'tool_obsidian'],
    joinedDate: '2025-01-10',
  },
  {
    id: 'user_sarah',
    username: 'sarahchen',
    name: 'Sarah Chen',
    bio: 'Systems engineer investigating distributed edge caches, database primitives, and resilient architectures.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    links: {
      website: 'https://schen.dev',
      github: 'https://github.com/sarahchen',
    },
    roles: ['Engineer', 'Researcher'],
    followersCount: 512,
    followingUserIds: ['user_derrick', 'user_marcus'],
    followingNotebookIds: ['nb_building_small', 'nb_type_structure'],
    followingContextIds: ['ctx_building', 'ctx_experimenting', 'ctx_documenting'],
    followingToolIds: ['tool_cloudflare', 'tool_postgresql'],
    joinedDate: '2025-02-04',
  },
  {
    id: 'user_elena',
    username: 'elena',
    name: 'Elena Rostova',
    bio: 'Novelist, essayist, and student of languages. Writing long-form prose with pen and paper before digitizing.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    links: {
      website: 'https://elenarostova.net',
    },
    roles: ['Novelist', 'Essayist'],
    followersCount: 420,
    followingUserIds: ['user_derrick', 'user_julian'],
    followingNotebookIds: ['nb_building_small', 'nb_learning_public'],
    followingContextIds: ['ctx_writing', 'ctx_learning', 'ctx_reading'],
    followingToolIds: ['tool_scrivener', 'tool_obsidian', 'tool_fountain_pen'],
    joinedDate: '2025-02-18',
  },
  {
    id: 'user_marcus',
    username: 'marcusv',
    name: 'Marcus Vance',
    bio: 'Designer and typographer exploring optical sizing, digital reading comfort, and high-legibility layouts.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    links: {
      website: 'https://marcusvance.design',
    },
    roles: ['Designer', 'Typographer'],
    followersCount: 290,
    followingUserIds: ['user_derrick', 'user_sarah'],
    followingNotebookIds: ['nb_building_small', 'nb_notes_novelist'],
    followingContextIds: ['ctx_researching', 'ctx_documenting'],
    followingToolIds: ['tool_figma'],
    joinedDate: '2025-03-01',
  },
  {
    id: 'user_julian',
    username: 'jrivera',
    name: 'Dr. Julian Rivera',
    bio: 'Cognitive scientist studying knowledge representation, spaced retrieval rhythms, and digital notebooks.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    links: {
      website: 'https://julianrivera.edu',
    },
    roles: ['Researcher', 'Teacher'],
    followersCount: 388,
    followingUserIds: ['user_elena', 'user_derrick'],
    followingNotebookIds: ['nb_building_small', 'nb_notes_novelist'],
    followingContextIds: ['ctx_researching', 'ctx_learning'],
    followingToolIds: ['tool_obsidian', 'tool_anki'],
    joinedDate: '2025-01-22',
  },
];

export const INITIAL_NOTEBOOKS: Notebook[] = [
  {
    id: 'nb_building_small',
    slug: 'building-small-things',
    name: 'Building Small Things',
    description: 'Notes from building small products on the internet. Architectural decisions, storage shifts, and minimal interface craft.',
    ownerId: 'user_derrick',
    createdAt: '2025-01-15',
    paidThroughDate: '2027-09-14',
    followersCount: 218,
    commonContexts: ['Building', 'Learning', 'Experimenting'],
    toolsUsed: ['Cloudflare', 'R2', 'React', 'Tailwind'],
    externalLinks: [
      { label: 'GitHub Project', url: 'https://github.com/derrickmbabazi' },
    ],
  },
  {
    id: 'nb_writing_desk',
    slug: 'the-writing-desk',
    name: 'The Writing Desk',
    description: 'Reflections on prose structure, drafting discipline, and the craft of non-fiction without manufactured drama.',
    ownerId: 'user_derrick',
    createdAt: '2025-02-01',
    paidThroughDate: '2026-11-20',
    followersCount: 84,
    commonContexts: ['Writing', 'Reading'],
    toolsUsed: ['Scrivener', 'Fountain Pen', 'Kindle'],
  },
  {
    id: 'nb_backend_log',
    slug: 'the-backend-log',
    name: 'The Backend Log',
    description: 'Field notes from low-level systems, distributed database benchmarks, edge runtimes, and cache dynamics.',
    ownerId: 'user_sarah',
    createdAt: '2025-02-10',
    paidThroughDate: '2027-04-12',
    followersCount: 310,
    commonContexts: ['Documenting', 'Experimenting', 'Building'],
    toolsUsed: ['Cloudflare', 'PostgreSQL', 'D1', 'Next.js'],
  },
  {
    id: 'nb_notes_novelist',
    slug: 'notes-from-a-novelist',
    name: 'Notes From a Novelist',
    description: 'Character studies, longhand observations, dialogue experiments, and studying foreign grammar in between chapters.',
    ownerId: 'user_elena',
    createdAt: '2025-02-20',
    paidThroughDate: '2028-01-10',
    followersCount: 275,
    commonContexts: ['Writing', 'Learning', 'Exploring'],
    toolsUsed: ['Scrivener', 'Obsidian', 'Fountain Pen', 'Duolingo'],
  },
  {
    id: 'nb_type_structure',
    slug: 'type-and-structure',
    name: 'Type & Structure',
    description: 'Observations on micro-typography, line-height ratios, variable font axis metrics, and reading ergonomics.',
    ownerId: 'user_marcus',
    createdAt: '2025-03-05',
    paidThroughDate: '2027-03-05',
    followersCount: 195,
    commonContexts: ['Researching', 'Documenting'],
    toolsUsed: ['Figma'],
  },
  {
    id: 'nb_learning_public',
    slug: 'learning-in-public',
    name: 'Learning in Public',
    description: 'Cognitive load notes, spaced repetition logs, and examining how tools shape human contemplation.',
    ownerId: 'user_julian',
    createdAt: '2025-01-28',
    paidThroughDate: '2026-12-01',
    followersCount: 230,
    commonContexts: ['Researching', 'Learning'],
    toolsUsed: ['Obsidian', 'Anki'],
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note_r2_storage',
    slug: 'moving-media-to-r2',
    title: 'Moving our media to R2',
    excerpt: 'The storage wasn\'t really the difficult part. The URLs were. We finally shifted our media pipeline over to Cloudflare R2 after battling egress charges for months.',
    body: `## What changed

I finally moved the media files to **Cloudflare R2**.

The biggest problem wasn't storage itself. Storing gigabytes of files is practically a solved commodity problem.

It was the way I was generating and routing URLs.

When assets were originally stored on AWS S3, each public request either passed through our application proxy or generated presigned URLs that broke HTTP edge caching. The egress fees on high-traffic days were quietly outpacing our compute bills.

> The simpler architecture turned out to be better. By placing R2 directly behind Cloudflare Workers with a custom domain, every media item resolves at the edge with zero egress penalties.

### Key architecture shifts

1. **Direct Worker Ingestion**: Instead of uploads hitting our Node server first, clients request a signed upload token and dispatch directly to the R2 bucket.
2. **Immutable Hashing**: Every image file is named by its sha256 checksum (\`/media/7f4a9b...\`). This allows setting \`Cache-Control: public, max-age=31536000, immutable\`.
3. **Graceful Failover**: In the rare event that an edge node has not warmed up the asset, the Worker falls back to the origin bucket in under 35ms.

Here is an architectural note on how the routing coordinates:

\`\`\`typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const key = url.pathname.slice(1);
    
    // Check edge cache first
    const cache = caches.default;
    let response = await cache.match(request);
    if (response) return response;

    const object = await env.MEDIA_BUCKET.get(key);
    if (!object) return new Response("Not Found", { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    
    response = new Response(object.body, { headers });
    await cache.put(request, response.clone());
    return response;
  }
};
\`\`\`

More testing scheduled for tomorrow once the image compression pipeline hooks into the same worker. So far, the latency drop is undeniable.`,
    notebookId: 'nb_building_small',
    authorId: 'user_derrick',
    createdAt: '2026-09-14T01:15:00Z',
    updatedAt: '2026-09-14T01:15:00Z',
    readingMinutes: 4,
    status: 'published',
    contexts: ['Building'],
    subjects: ['Inktella', 'R2 Storage'],
    tools: ['Cloudflare', 'R2'],
    roleAtWriting: 'Developer',
    viewsCount: 1420,
    savesCount: 132,
    isFeatured: true,
  },
  {
    id: 'note_keeping_tiny',
    slug: 'why-im-keeping-this-product-tiny',
    title: 'Why I\'m keeping this product tiny',
    excerpt: 'I\'ve spent the last few weeks thinking about software scale. Not technical scale—human scale. Why do so many projects rush to become sprawling enterprise dashboards?',
    body: `I've spent the last few weeks thinking about software scale. Not technical scale—human scale.

When you start building a software product, the default gravity of the industry pulls you toward adding more knobs, more toggles, more settings pages, and more integrations until the original soul of the tool is buried under a layer of corporate crust.

### The three rules I'm enforcing

- **Single responsibility per screen**: If a page needs more than two primary actions, the model is wrong.
- **Typography over decoration**: If the interface looks bland without gradients or glassmorphism, the typographic hierarchy has failed. Fix the type, do not mask it with visual noise.
- **Zero vanity metrics**: No follower count badges plastered in bold 24pt font. No streak notifications calculated to induce artificial anxiety.

A notebook should feel like quiet linen paper on a solid wooden desk. It invites thought rather than demanding participation.`,
    notebookId: 'nb_building_small',
    authorId: 'user_derrick',
    createdAt: '2026-09-10T14:30:00Z',
    updatedAt: '2026-09-10T14:30:00Z',
    readingMinutes: 3,
    status: 'published',
    contexts: ['Building'],
    subjects: ['Product Philosophy', 'Inktella'],
    tools: ['React', 'Tailwind'],
    roleAtWriting: 'Developer',
    viewsCount: 980,
    savesCount: 89,
    isFeatured: true,
  },
  {
    id: 'note_workers_misunderstood',
    slug: 'what-i-misunderstood-about-workers',
    title: 'What I misunderstood about Workers',
    excerpt: 'Serverless compute isn\'t just smaller Node servers. The memory model and request lifecycles behave fundamentally differently at the edge.',
    body: `When I first started writing Cloudflare Workers, I treated them as tiny, short-lived Express.js apps.

That mental model caused multiple subtle memory leaks and unexpected cache misses.

### The execution context is persistent across requests

Unlike traditional containerized functions that spin down after handling a spike, a single Worker isolate may remain alive across hundreds of requests in the same edge data center.

If you declare global variables or mutable module state, you are sharing that state across disparate client requests.

\`\`\`typescript
// WRONG: This global variable leaks across different incoming visitors
let visitorCount = 0;

// RIGHT: Keep state inside the request scope or delegate to Durable Objects / KV
export default {
  async fetch(req: Request) {
    // Isolated per request
  }
}
\`\`\`

Understanding this shifted how we design stateless parsers. It makes edge compute extraordinarily fast, provided you respect the isolate boundary.`,
    notebookId: 'nb_building_small',
    authorId: 'user_derrick',
    createdAt: '2026-09-02T09:00:00Z',
    updatedAt: '2026-09-02T09:00:00Z',
    readingMinutes: 3,
    status: 'published',
    contexts: ['Learning'],
    subjects: ['Edge Computing', 'Workers'],
    tools: ['Cloudflare'],
    roleAtWriting: 'Developer',
    viewsCount: 840,
    savesCount: 71,
  },
  {
    id: 'note_cache_invalidation',
    slug: 'cache-invalidation-headers-on-edge-distributions',
    title: 'Cache invalidation headers on edge distributions',
    excerpt: 'Cache-Control headers remain one of the most misconfigured aspects of modern web architecture. Here is what we discovered benchmarking 10,000 edge invalidations.',
    body: `There are only two hard problems in computer science: cache invalidation and naming things.

Over the past month, our team ran a rigorous benchmark suite measuring edge cache hit rates across 28 global regions.

### The common pitfalls

1. **Using \`no-cache\` when you actually mean \`no-store\`**:
   \`no-cache\` instructs the browser or proxy to revalidate with the origin using \`ETag\` or \`If-Modified-Since\`. It does *not* prevent caching.
2. **Missing \`stale-while-revalidate\`**:
   For content that changes periodically (like a notebook note), setting \`stale-while-revalidate=86400\` allows the edge to return instant cached responses to readers while quietly fetching updates in the background.

\`\`\`http
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
\`\`\`

Readers experience sub-10ms page loads, and origin databases barely register traffic surges.`,
    notebookId: 'nb_backend_log',
    authorId: 'user_sarah',
    createdAt: '2026-09-12T16:20:00Z',
    updatedAt: '2026-09-12T16:20:00Z',
    readingMinutes: 5,
    status: 'published',
    contexts: ['Documenting', 'Experimenting'],
    subjects: ['HTTP Caching', 'Edge Architecture'],
    tools: ['Cloudflare', 'PostgreSQL'],
    roleAtWriting: 'Engineer',
    viewsCount: 1650,
    savesCount: 164,
    isFeatured: true,
  },
  {
    id: 'note_drafting_longhand',
    slug: 'drafting-chapter-six-in-longhand-before-obsidian',
    title: 'Drafting chapter six in longhand before Obsidian',
    excerpt: 'The backlit glass of a screen invites ruthless self-editing before a sentence has even found its rhythm. Hand-writing on smooth paper forces patience.',
    body: `Every time I attempt to draft raw narrative fiction directly on a keyboard, I find myself backspacing over dialogue before the character has even finished their thought.

A keyboard is an editing instrument. A fountain pen is a thinking instrument.

This morning I filled seven pages of a Rhodia notebook for Chapter Six of *The Glass Weaver*. There are crossed-out adverbs, arrows pointing to margin annotations, and half-formed sentences. But there is forward momentum.

> "You cannot edit a blank page, but you also cannot hear a voice if the delete key is three millimeters from your right index finger."

### The transcription ritual

In the evening, I open **Scrivener** and transcribe the handwritten pages word for word.

That transcription step acts as an organic first edit. Clunky clauses are smoothed out naturally as my fingers type them. Once the chapter structure holds, I export notes and character relationships into **Obsidian** for reference.`,
    notebookId: 'nb_notes_novelist',
    authorId: 'user_elena',
    createdAt: '2026-09-11T11:00:00Z',
    updatedAt: '2026-09-11T11:00:00Z',
    readingMinutes: 4,
    status: 'published',
    contexts: ['Writing'],
    subjects: ['My Novel', 'Drafting Rituals'],
    tools: ['Scrivener', 'Obsidian', 'Fountain Pen'],
    roleAtWriting: 'Novelist',
    viewsCount: 1120,
    savesCount: 145,
    isFeatured: true,
  },
  {
    id: 'note_japanese_verbs',
    slug: 'learning-japanese-verb-conjugations-at-forty',
    title: 'Learning Japanese verb conjugations at forty',
    excerpt: 'Adult language acquisition feels less like building a skyscraper and more like excavating an ancient city. Group 1 godan verbs demand a different mental muscularity.',
    body: `When you study a radically different language as an adult, the first thing you lose is your verbal arrogance.

In English, I make a living weighing the nuance of commas and the cadence of syllables. In Japanese, I am currently humbled by the difference between transitive (\`他動詞\`) and intransitive (\`自動詞\`) verbs.

### The daily rhythm

- 25 minutes of spaced repetition flashcards in **Anki** first thing in the morning with black coffee.
- 3 short drills on **Duolingo** during the afternoon commute.
- Copying two sentences from a children's storybook into my physical notebook before bed.

It is slow, methodical, and strangely liberating. There are no shortcuts, only repetition and attention.`,
    notebookId: 'nb_notes_novelist',
    authorId: 'user_elena',
    createdAt: '2026-09-08T08:15:00Z',
    updatedAt: '2026-09-08T08:15:00Z',
    readingMinutes: 3,
    status: 'published',
    contexts: ['Learning'],
    subjects: ['Learning Japanese', 'Language Notes'],
    tools: ['Duolingo', 'Anki'],
    roleAtWriting: 'Novelist',
    viewsCount: 780,
    savesCount: 62,
  },
  {
    id: 'note_optical_sizing',
    slug: 'optical-sizing-in-variable-serifs',
    title: 'Optical sizing in variable serifs for long-form reading',
    excerpt: 'A typeface designed for a 72-point billboard will choke when rendered at 16-point on an OLED smartphone. Optical sizing bridges that physical chasm.',
    body: `In the era of metal casting, punchcutters cut entirely separate steel punches for 6pt footnote text versus 36pt title text.

The 6pt type had thicker hairlines, wider proportions, looser letter-spacing, and sturdier serifs so ink wouldn't pool into muddy blobs. The 36pt type had razor-sharp contrasts and delicate curves.

When desktop publishing arrived, digital type founders flattened this history: a single 12pt outline was scaled linearly up and down.

### Why variable fonts fix this

Modern variable fonts with the \`opsz\` (optical size) axis restore punchcutting wisdom:

\`\`\`css
/* Headline: high contrast, delicate serifs */
h1 {
  font-family: 'Newsreader', serif;
  font-variation-settings: 'opsz' 36, 'wght' 600;
}

/* Body: robust hairlines, open counters, relaxed tracking */
p {
  font-family: 'Newsreader', serif;
  font-variation-settings: 'opsz' 14, 'wght' 400;
  line-height: 1.7;
}
\`\`\`

The result is immediate: your eyes do not fatigue after twenty minutes of sustained reading.`,
    notebookId: 'nb_type_structure',
    authorId: 'user_marcus',
    createdAt: '2026-09-13T18:45:00Z',
    updatedAt: '2026-09-13T18:45:00Z',
    readingMinutes: 4,
    status: 'published',
    contexts: ['Researching', 'Documenting'],
    subjects: ['Typography Research', 'Variable Fonts'],
    tools: ['Figma'],
    roleAtWriting: 'Typographer',
    viewsCount: 1390,
    savesCount: 188,
    isFeatured: true,
  },
  {
    id: 'note_spaced_repetition',
    slug: 'spaced-repetition-intervals-under-cognitive-fatigue',
    title: 'Spaced repetition intervals under cognitive fatigue',
    excerpt: 'The standard SuperMemo SM-2 algorithm assumes consistent daily retrieval efficiency. What happens when circadian disruption skews the forgetting curve?',
    body: `Most flashcard applications rely on algorithms originally devised by Piotr Woźniak in 1987.

The fundamental formula calculates ease factors (\`EF\`) based on subjective ratings (1 through 5). However, our laboratory observations indicate that cognitive fatigue caused by sleep fragmentation introduces severe noise into user self-assessment.

### Experimental findings

- Participants tested at 11:00 PM consistently rated recall difficulty 1.8 points harsher than identical items tested at 9:00 AM.
- Artificial ease deflation caused premature card rescheduling, swelling review queues and triggering abandonment.
- Introducing a circadian confidence dampener reduced review dropout rates by 34%.

We are publishing the raw dataset alongside the replication protocol next month.`,
    notebookId: 'nb_learning_public',
    authorId: 'user_julian',
    createdAt: '2026-09-09T10:00:00Z',
    updatedAt: '2026-09-09T10:00:00Z',
    readingMinutes: 4,
    status: 'published',
    contexts: ['Researching', 'Learning'],
    subjects: ['Cognitive Ergonomics', 'Spaced Retrieval'],
    tools: ['Obsidian', 'Anki'],
    roleAtWriting: 'Researcher',
    viewsCount: 890,
    savesCount: 94,
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'cmt_1',
    noteId: 'note_r2_storage',
    authorId: 'user_sarah',
    parentCommentId: null,
    body: 'This is exactly the problem I ran into when we migrated our telemetry logs. S3 egress was quietly 65% of our monthly invoice.',
    createdAt: '2026-09-14T02:00:00Z',
  },
  {
    id: 'cmt_2',
    noteId: 'note_r2_storage',
    authorId: 'user_derrick',
    parentCommentId: 'cmt_1',
    body: 'What ended up fixing it on your side? Did you put Cloudflare in front as a caching layer or swap the primary storage endpoint?',
    createdAt: '2026-09-14T02:05:00Z',
  },
  {
    id: 'cmt_3',
    noteId: 'note_r2_storage',
    authorId: 'user_sarah',
    parentCommentId: 'cmt_2',
    body: 'The cache headers were wrong at first. Cloudflare was revalidating on every request because Cache-Control was set to private, no-transform. Once we forced immutable headers, edge hit ratio shot up to 98.4%.',
    createdAt: '2026-09-14T02:11:00Z',
  },
  {
    id: 'cmt_4',
    noteId: 'note_r2_storage',
    authorId: 'user_marcus',
    parentCommentId: 'cmt_3',
    body: 'Did you notice any latency impact on initial cold cache hits from non-US edge nodes?',
    createdAt: '2026-09-14T02:18:00Z',
  },
  {
    id: 'cmt_5',
    noteId: 'note_r2_storage',
    authorId: 'user_sarah',
    parentCommentId: 'cmt_4',
    body: 'About 42ms from our London and Tokyo edge nodes on cold misses. But subsequent hits dropped to sub-5ms across the board.',
    createdAt: '2026-09-14T02:22:00Z',
  },
  {
    id: 'cmt_6',
    noteId: 'note_r2_storage',
    authorId: 'user_julian',
    parentCommentId: null,
    body: 'Fascinating architecture. The choice of content-addressed hashing (sha256 in the URL) also means you completely bypass cache-busting queries like ?v=2.',
    createdAt: '2026-09-14T02:25:00Z',
  },
  {
    id: 'cmt_7',
    noteId: 'note_optical_sizing',
    authorId: 'user_derrick',
    parentCommentId: null,
    body: 'The difference in eye strain between linear outline scaling and true optical size modulation is dramatic. Are you testing Newsreader or Literata for Inktella\'s reading column?',
    createdAt: '2026-09-13T19:30:00Z',
  },
  {
    id: 'cmt_8',
    noteId: 'note_optical_sizing',
    authorId: 'user_marcus',
    parentCommentId: 'cmt_7',
    body: 'Newsreader by Production Type is currently winning hands down. Its 14pt optical master preserves open counters without looking cartoonish on high-DPI displays.',
    createdAt: '2026-09-13T19:42:00Z',
  },
  {
    id: 'cmt_9',
    noteId: 'note_drafting_longhand',
    authorId: 'user_derrick',
    parentCommentId: null,
    body: '"You cannot hear a voice if the delete key is three millimeters from your right index finger." That sentence belongs framed on every writer\'s desk.',
    createdAt: '2026-09-11T12:15:00Z',
  },
  {
    id: 'cmt_10',
    noteId: 'note_drafting_longhand',
    authorId: 'user_elena',
    parentCommentId: 'cmt_9',
    body: 'It took me three published books to realize that friction is not the enemy—friction is the sculpting tool.',
    createdAt: '2026-09-11T12:30:00Z',
  },
];

export const INITIAL_CONTEXTS: ContextEntity[] = [
  {
    id: 'ctx_building',
    slug: 'building',
    name: 'Building',
    description: 'Notes from people actively constructing software, hardware, and physical prototypes.',
    notesCount: 428,
    notebooksCount: 182,
    isCanonical: true,
  },
  {
    id: 'ctx_learning',
    slug: 'learning',
    name: 'Learning',
    description: 'Notes from people acquiring new skills, languages, sciences, and mental models.',
    notesCount: 395,
    notebooksCount: 146,
    isCanonical: true,
  },
  {
    id: 'ctx_writing',
    slug: 'writing',
    name: 'Writing',
    description: 'Notes from novelists, essayists, technical authors, and reflective journalers.',
    notesCount: 312,
    notebooksCount: 129,
    isCanonical: true,
  },
  {
    id: 'ctx_researching',
    slug: 'researching',
    name: 'Researching',
    description: 'Systematic investigations, academic inquiries, literature reviews, and lab notes.',
    notesCount: 260,
    notebooksCount: 94,
    isCanonical: true,
  },
  {
    id: 'ctx_experimenting',
    slug: 'experimenting',
    name: 'Experimenting',
    description: 'Controlled trials, bench tests, hypotheses, and documented failures.',
    notesCount: 184,
    notebooksCount: 88,
    isCanonical: true,
  },
  {
    id: 'ctx_reading',
    slug: 'reading',
    name: 'Reading',
    description: 'Marginalia, book reflections, synthesis across texts, and close readings.',
    notesCount: 215,
    notebooksCount: 104,
    isCanonical: true,
  },
  {
    id: 'ctx_exploring',
    slug: 'exploring',
    name: 'Exploring',
    description: 'Open-ended wandering through ideas, territories, and curiosities.',
    notesCount: 142,
    notebooksCount: 65,
    isCanonical: true,
  },
  {
    id: 'ctx_documenting',
    slug: 'documenting',
    name: 'Documenting',
    description: 'Precise records of systems, architectures, decisions, and operations.',
    notesCount: 198,
    notebooksCount: 89,
    isCanonical: true,
  },
];

export const INITIAL_TOOLS: ToolEntity[] = [
  {
    id: 'tool_cloudflare',
    slug: 'cloudflare',
    name: 'Cloudflare',
    description: 'Global cloud edge network, Workers runtime, CDN, and DNS infrastructure.',
    category: 'development',
    aliases: ['cloudflare.com', 'CF', 'CloudFlare'],
    website: 'https://cloudflare.com',
    icon: 'Cloud',
    notesCount: 1284,
    notebooksCount: 312,
    isCanonical: true,
  },
  {
    id: 'tool_r2',
    slug: 'r2',
    name: 'R2',
    description: 'Zero-egress object storage compatible with the S3 API.',
    category: 'development',
    aliases: ['cloudflare r2', 'cf-r2', 'r2-storage'],
    website: 'https://cloudflare.com/developer-platform/r2',
    icon: 'HardDrive',
    notesCount: 340,
    notebooksCount: 115,
    isCanonical: true,
  },
  {
    id: 'tool_nextjs',
    slug: 'nextjs',
    name: 'Next.js',
    description: 'React application framework with server-side rendering and streaming.',
    category: 'development',
    aliases: ['next.js', 'next', 'NextJS'],
    website: 'https://nextjs.org',
    icon: 'Layers',
    notesCount: 940,
    notebooksCount: 280,
    isCanonical: true,
  },
  {
    id: 'tool_react',
    slug: 'react',
    name: 'React',
    description: 'Declarative component-driven user interface library.',
    category: 'development',
    aliases: ['reactjs', 'react.js'],
    website: 'https://react.dev',
    icon: 'Atom',
    notesCount: 1450,
    notebooksCount: 420,
    isCanonical: true,
  },
  {
    id: 'tool_postgresql',
    slug: 'postgresql',
    name: 'PostgreSQL',
    description: 'Open-source relational database management system with strong consistency.',
    category: 'development',
    aliases: ['postgres', 'pgsql', 'psql'],
    website: 'https://postgresql.org',
    icon: 'Database',
    notesCount: 670,
    notebooksCount: 190,
    isCanonical: true,
  },
  {
    id: 'tool_d1',
    slug: 'd1',
    name: 'D1',
    description: 'Serverless SQL database running on Cloudflare SQLite edge primitives.',
    category: 'development',
    aliases: ['cloudflare d1', 'cf d1'],
    website: 'https://cloudflare.com/developer-platform/d1',
    icon: 'Server',
    notesCount: 180,
    notebooksCount: 62,
    isCanonical: true,
  },
  {
    id: 'tool_github',
    slug: 'github',
    name: 'GitHub',
    description: 'Version control collaboration and Git repository hosting platform.',
    category: 'development',
    aliases: ['gh', 'github.com'],
    website: 'https://github.com',
    icon: 'GitBranch',
    notesCount: 890,
    notebooksCount: 310,
    isCanonical: true,
  },
  {
    id: 'tool_scrivener',
    slug: 'scrivener',
    name: 'Scrivener',
    description: 'Long-form writing and manuscript structuring software for authors.',
    category: 'writing',
    aliases: ['literature-and-latte', 'scrivener-app'],
    website: 'https://literatureandlatte.com/scrivener/overview',
    icon: 'FileText',
    notesCount: 410,
    notebooksCount: 145,
    isCanonical: true,
  },
  {
    id: 'tool_obsidian',
    slug: 'obsidian',
    name: 'Obsidian',
    description: 'Local markdown knowledge base with bidirectional graph linking.',
    category: 'productivity',
    aliases: ['obsidian.md', 'obsidian-notes'],
    website: 'https://obsidian.md',
    icon: 'Network',
    notesCount: 780,
    notebooksCount: 260,
    isCanonical: true,
  },
  {
    id: 'tool_fountain_pen',
    slug: 'fountain-pen',
    name: 'Fountain Pen',
    description: 'Nib and ink physical writing instruments used for tactile longhand drafting.',
    category: 'writing',
    aliases: ['fountainpen', 'ink-pen', 'nib'],
    icon: 'PenTool',
    notesCount: 145,
    notebooksCount: 58,
    isCanonical: true,
  },
  {
    id: 'tool_figma',
    slug: 'figma',
    name: 'Figma',
    description: 'Collaborative vector design and interface prototyping tool.',
    category: 'design',
    aliases: ['figma.com'],
    website: 'https://figma.com',
    icon: 'Palette',
    notesCount: 520,
    notebooksCount: 195,
    isCanonical: true,
  },
  {
    id: 'tool_duolingo',
    slug: 'duolingo',
    name: 'Duolingo',
    description: 'Gamified bite-sized foreign language learning platform.',
    category: 'productivity',
    aliases: ['duo'],
    website: 'https://duolingo.com',
    icon: 'Languages',
    notesCount: 165,
    notebooksCount: 72,
    isCanonical: true,
  },
  {
    id: 'tool_anki',
    slug: 'anki',
    name: 'Anki',
    description: 'Open-source spaced repetition flashcard software for long-term memory.',
    category: 'productivity',
    aliases: ['anki-spaced-repetition'],
    website: 'https://apps.ankiweb.net',
    icon: 'Brain',
    notesCount: 310,
    notebooksCount: 118,
    isCanonical: true,
  },
  {
    id: 'tool_tailwind',
    slug: 'tailwind',
    name: 'Tailwind',
    description: 'Utility-first CSS framework for rapid interface construction.',
    category: 'development',
    aliases: ['tailwindcss', 'tailwind-css'],
    website: 'https://tailwindcss.com',
    icon: 'Wind',
    notesCount: 620,
    notebooksCount: 210,
    isCanonical: true,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_derrick',
    type: 'reply',
    message: 'Sarah Chen replied to your thread in "Moving media to R2"',
    read: false,
    createdAt: '2026-09-14T02:11:00Z',
    targetUrl: '/@derrick/building-small-things/moving-media-to-r2',
    actorId: 'user_sarah',
  },
  {
    id: 'notif_2',
    userId: 'user_derrick',
    type: 'comment',
    message: 'Dr. Julian Rivera commented on "Moving media to R2"',
    read: false,
    createdAt: '2026-09-14T02:25:00Z',
    targetUrl: '/@derrick/building-small-things/moving-media-to-r2',
    actorId: 'user_julian',
  },
  {
    id: 'notif_3',
    userId: 'user_derrick',
    type: 'follow_notebook',
    message: 'Marcus Vance followed your notebook "Building Small Things"',
    read: true,
    createdAt: '2026-09-13T20:10:00Z',
    targetUrl: '/@derrick/building-small-things',
    actorId: 'user_marcus',
  },
];

export const INITIAL_REPORTS: ReportItem[] = [];

export const INITIAL_GIFTS: GiftRecord[] = [
  {
    id: 'gift_1',
    notebookId: 'nb_building_small',
    senderName: 'Elena Rostova',
    senderEmail: 'elena@example.com',
    yearsGifted: 1,
    amountUsd: 10,
    message: 'Thank you for documenting the quiet side of building software.',
    date: '2026-08-15',
  },
];
