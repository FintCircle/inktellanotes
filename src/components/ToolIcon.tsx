import React from 'react';
import {
  Cloud,
  HardDrive,
  Layers,
  Atom,
  Database,
  Server,
  GitBranch,
  FileText,
  Network,
  PenTool,
  Palette,
  Languages,
  Brain,
  Wind,
  Terminal,
  Cpu,
  Laptop,
  Code,
  Code2,
  Sparkles,
  Box,
  Boxes,
  Compass,
  Wrench,
  Bookmark,
  FileCode,
  Braces,
  Smartphone,
  Globe,
  Workflow,
  Zap,
  Coffee,
  Feather,
  FolderGit2,
  Monitor,
  Sliders,
  Shield,
  Activity,
  Grid,
  BookOpen,
  Pencil,
  Flame,
  Radio,
  Binary,
  GitPullRequest,
  Microscope,
  type LucideIcon,
} from 'lucide-react';

export interface ToolIconDefinition {
  id: string;
  label: string;
  category: 'code' | 'infra' | 'writing' | 'design' | 'learning' | 'hardware';
  icon: LucideIcon;
}

export const TOOL_ICON_MAP: Record<string, LucideIcon> = {
  // Cloud & Infra
  cloud: Cloud,
  harddrive: HardDrive,
  'hard-drive': HardDrive,
  database: Database,
  server: Server,
  globe: Globe,
  radio: Radio,

  // Code & Dev
  code: Code,
  code2: Code2,
  terminal: Terminal,
  layers: Layers,
  atom: Atom,
  gitbranch: GitBranch,
  'git-branch': GitBranch,
  foldergit: FolderGit2,
  gitpullrequest: GitPullRequest,
  braces: Braces,
  filecode: FileCode,
  binary: Binary,
  cpu: Cpu,
  laptop: Laptop,
  monitor: Monitor,
  smartphone: Smartphone,
  workflow: Workflow,

  // Design & Style
  palette: Palette,
  wind: Wind,
  sliders: Sliders,
  grid: Grid,
  sparkles: Sparkles,

  // Writing & Reading
  pentool: PenTool,
  'pen-tool': PenTool,
  pencil: Pencil,
  feather: Feather,
  filetext: FileText,
  'file-text': FileText,
  bookopen: BookOpen,
  'book-open': BookOpen,
  bookmark: Bookmark,

  // Knowledge, Learning & Cognition
  brain: Brain,
  languages: Languages,
  network: Network,
  microscope: Microscope,
  compass: Compass,

  // Utility & Hardware
  wrench: Wrench,
  box: Box,
  boxes: Boxes,
  zap: Zap,
  flame: Flame,
  shield: Shield,
  activity: Activity,
  coffee: Coffee,
};

// Preset catalog for Admin to pick from
export const AVAILABLE_TOOL_ICONS: ToolIconDefinition[] = [
  // Development & Code
  { id: 'Terminal', label: 'Terminal / CLI', category: 'code', icon: Terminal },
  { id: 'Code2', label: 'Code / Script', category: 'code', icon: Code2 },
  { id: 'Braces', label: 'Syntax / JSON / Lang', category: 'code', icon: Braces },
  { id: 'Atom', label: 'Atom / React Component', category: 'code', icon: Atom },
  { id: 'Layers', label: 'Layers / Framework / Stack', category: 'code', icon: Layers },
  { id: 'FileCode', label: 'Source File', category: 'code', icon: FileCode },
  { id: 'GitBranch', label: 'Git / Version Control', category: 'code', icon: GitBranch },
  { id: 'Binary', label: 'Binary / Low Level', category: 'code', icon: Binary },
  { id: 'Workflow', label: 'Workflow / Pipeline', category: 'code', icon: Workflow },

  // Cloud & Infrastructure
  { id: 'Cloud', label: 'Cloud Network / Edge', category: 'infra', icon: Cloud },
  { id: 'HardDrive', label: 'Storage / S3 / R2 Bucket', category: 'infra', icon: HardDrive },
  { id: 'Database', label: 'Database / SQL / Tables', category: 'infra', icon: Database },
  { id: 'Server', label: 'Server / Backend Node', category: 'infra', icon: Server },
  { id: 'Globe', label: 'Web / CDN / Domain', category: 'infra', icon: Globe },
  { id: 'Shield', label: 'Security / Auth / Firewall', category: 'infra', icon: Shield },

  // Writing & Documents
  { id: 'PenTool', label: 'Fountain Pen / Nib', category: 'writing', icon: PenTool },
  { id: 'Pencil', label: 'Pencil / Draft', category: 'writing', icon: Pencil },
  { id: 'Feather', label: 'Quill / Prose / Manuscript', category: 'writing', icon: Feather },
  { id: 'FileText', label: 'Document / Markdown File', category: 'writing', icon: FileText },
  { id: 'BookOpen', label: 'Open Book / Reader', category: 'writing', icon: BookOpen },

  // Design & Visuals
  { id: 'Palette', label: 'Palette / UI Design / Figma', category: 'design', icon: Palette },
  { id: 'Wind', label: 'Wind / CSS / Tailwind', category: 'design', icon: Wind },
  { id: 'Grid', label: 'Layout / Grid / Wireframe', category: 'design', icon: Grid },
  { id: 'Sparkles', label: 'Craft / Polished Aesthetic', category: 'design', icon: Sparkles },
  { id: 'Sliders', label: 'Sliders / Parameters', category: 'design', icon: Sliders },

  // Cognition & Productivity
  { id: 'Network', label: 'Network / Graph / Obsidian', category: 'learning', icon: Network },
  { id: 'Brain', label: 'Brain / Memory / Spaced Rep', category: 'learning', icon: Brain },
  { id: 'Languages', label: 'Languages / Translation', category: 'learning', icon: Languages },
  { id: 'Microscope', label: 'Research / Analysis', category: 'learning', icon: Microscope },
  { id: 'Compass', label: 'Exploration / Direction', category: 'learning', icon: Compass },

  // Hardware & Tools
  { id: 'Cpu', label: 'CPU / Chip / Firmware', category: 'hardware', icon: Cpu },
  { id: 'Laptop', label: 'Workstation / Laptop', category: 'hardware', icon: Laptop },
  { id: 'Smartphone', label: 'Mobile Device', category: 'hardware', icon: Smartphone },
  { id: 'Wrench', label: 'General Instrument / Tool', category: 'hardware', icon: Wrench },
  { id: 'Box', label: 'Container / Package', category: 'hardware', icon: Box },
  { id: 'Zap', label: 'Fast / Performance / Energy', category: 'hardware', icon: Zap },
  { id: 'Coffee', label: 'Ritual / Focus / Craft', category: 'hardware', icon: Coffee },
];

export function getToolIconComponent(iconId?: string, toolName?: string, category?: string): LucideIcon {
  // 1. Direct identifier match
  if (iconId) {
    const normalized = iconId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (TOOL_ICON_MAP[normalized]) {
      return TOOL_ICON_MAP[normalized];
    }
  }

  // 2. Intelligent name-based heuristics
  if (toolName) {
    const lowerName = toolName.toLowerCase();
    if (lowerName.includes('cloudflare') || lowerName.includes('worker')) return Cloud;
    if (lowerName.includes('r2') || lowerName.includes('s3') || lowerName.includes('storage') || lowerName.includes('bucket')) return HardDrive;
    if (lowerName.includes('postgres') || lowerName.includes('sql') || lowerName.includes('d1') || lowerName.includes('database')) return Database;
    if (lowerName.includes('next') || lowerName.includes('framework')) return Layers;
    if (lowerName.includes('react') || lowerName.includes('component')) return Atom;
    if (lowerName.includes('git') || lowerName.includes('repo')) return GitBranch;
    if (lowerName.includes('figma') || lowerName.includes('design') || lowerName.includes('sketch')) return Palette;
    if (lowerName.includes('tailwind') || lowerName.includes('css')) return Wind;
    if (lowerName.includes('scrivener') || lowerName.includes('draft')) return FileText;
    if (lowerName.includes('pen') || lowerName.includes('ink') || lowerName.includes('nib')) return PenTool;
    if (lowerName.includes('obsidian') || lowerName.includes('roam') || lowerName.includes('logseq')) return Network;
    if (lowerName.includes('anki') || lowerName.includes('memory') || lowerName.includes('flashcard')) return Brain;
    if (lowerName.includes('duolingo') || lowerName.includes('language') || lowerName.includes('vocab')) return Languages;
    if (lowerName.includes('terminal') || lowerName.includes('bash') || lowerName.includes('zsh')) return Terminal;
  }

  // 3. Category heuristics
  if (category) {
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('design')) return Palette;
    if (lowerCat.includes('writ')) return PenTool;
    if (lowerCat.includes('productiv')) return Layers;
    if (lowerCat.includes('research')) return Brain;
    if (lowerCat.includes('hardw')) return Cpu;
    if (lowerCat.includes('dev') || lowerCat.includes('software')) return Code2;
  }

  // 4. Default fallback
  return Wrench;
}

interface ToolIconProps {
  icon?: string;
  name?: string;
  category?: string;
  className?: string;
  size?: number;
}

export const ToolIcon: React.FC<ToolIconProps> = ({
  icon,
  name,
  category,
  className = 'w-4 h-4',
  size,
}) => {
  const IconComponent = getToolIconComponent(icon, name, category);
  return <IconComponent className={className} size={size} aria-hidden="true" />;
};
