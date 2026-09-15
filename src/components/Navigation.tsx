import React, { useState, useRef, useEffect } from 'react';
import { useInktella } from '../context/InktellaContext';
import {
  Search,
  PenLine,
  Bell,
  Sun,
  Moon,
  Monitor,
  ShieldCheck,
  User,
  BookOpen,
  Check,
  ChevronDown,
} from 'lucide-react';

export const Navigation: React.FC = () => {
  const {
    currentUser,
    users,
    notifications,
    currentRoute,
    theme,
    navigateTo,
    setTheme,
    switchCurrentUser,
    markNotificationRead,
    markAllNotificationsRead,
  } = useInktella();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const userNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setIsNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Discover', route: { type: 'discover' as const }, active: currentRoute.type === 'discover' },
    { label: 'Following', route: { type: 'following' as const }, active: currentRoute.type === 'following' },
    { label: 'Conversations', route: { type: 'conversations' as const }, active: currentRoute.type === 'conversations' },
    { label: 'Notebooks', route: { type: 'notebooks' as const }, active: currentRoute.type === 'notebooks' },
  ];

  return (
    <header
      id="inktella-nav-header"
      className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-[#FAF9F6]/90 dark:bg-[#141312]/90 backdrop-blur-md transition-colors"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Left: Brand Identity & Primary Links */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-8">
          <button
            id="brand-logo-btn"
            onClick={() => navigateTo({ type: 'discover' })}
            className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          >
            <span className="font-editorial text-xl sm:text-2xl font-bold tracking-[0.16em] sm:tracking-widest text-stone-900 dark:text-stone-100 group-hover:opacity-80 transition-opacity">
              INKTELLA
            </span>
            <span className="font-hand text-base sm:text-lg text-amber-800 dark:text-amber-400 -rotate-3 select-none ml-0.5 hidden sm:inline font-medium">
              ~ human notes
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <button
                key={link.label}
                id={`nav-link-${link.label.toLowerCase()}`}
                onClick={() => navigateTo(link.route)}
                className={`px-3.5 py-1.5 rounded text-sm font-medium transition-colors ${
                  link.active
                    ? 'text-stone-900 dark:text-stone-100 bg-stone-200/60 dark:bg-stone-800/60'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/30 dark:hover:bg-stone-800/30'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Search, Write Note, Notifications, User Persona & Theme */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-3">
          {/* Quick Search */}
          <button
            id="global-search-trigger"
            onClick={() => {
              setIsNotifMenuOpen(false);
              setIsProfileMenuOpen(false);
              navigateTo({ type: 'search' });
            }}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 text-xs text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200/70 dark:hover:bg-stone-800/70 border border-stone-200 dark:border-stone-800 rounded transition-colors"
            title="Search notes, notebooks, tools, and people (⌘K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline px-1 py-0.5 text-[10px] font-mono bg-stone-200 dark:bg-stone-800 rounded text-stone-500">
              ⌘K
            </kbd>
          </button>

          {/* Write Note CTA (Desktop/tablet) */}
          <button
            id="create-note-nav-btn"
            onClick={() => navigateTo({ type: 'editor' })}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-stone-50 dark:text-stone-900 text-xs font-medium rounded transition-colors"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Write</span>
          </button>

          {/* Notifications Trigger */}
          <div className="relative" ref={notifMenuRef}>
            <button
              id="notifications-btn"
              onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
              className="relative p-1.5 sm:p-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-600 rounded-full ring-2 ring-[#FAF9F6] dark:ring-[#141312]" />
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotifMenuOpen && (
              <div
                id="notifications-popover"
                className="fixed top-16 left-2 right-2 w-auto sm:absolute sm:top-auto sm:left-auto sm:right-0 sm:mt-2 sm:w-88 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-wide uppercase text-stone-500 dark:text-stone-400">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800/50">
                  {userNotifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-stone-400">
                      No notifications yet.
                    </div>
                  ) : (
                    userNotifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationRead(n.id);
                          setIsNotifMenuOpen(false);
                          const target = n.targetUrl.replace(/^#/, '');
                          if (target.startsWith('/@')) {
                            const parts = target.split('/');
                            const username = parts[1].replace('@', '');
                            if (parts.length >= 4) {
                              navigateTo({ type: 'note', username, notebookSlug: parts[2], noteSlug: parts[3] });
                            } else if (parts.length === 3) {
                              navigateTo({ type: 'notebook', username, notebookSlug: parts[2] });
                            } else {
                              navigateTo({ type: 'profile', username });
                            }
                          } else if (target.startsWith('/tool/')) {
                            navigateTo({ type: 'tool', slug: target.split('/')[2] });
                          } else if (target.startsWith('/context/')) {
                            navigateTo({ type: 'context', slug: target.split('/')[2] });
                          } else if (target.startsWith('/search')) {
                            navigateTo({ type: 'search', initialQuery: new URLSearchParams(target.split('?')[1] || '').get('q') || undefined });
                          } else {
                            navigateTo({ type: 'discover' });
                          }
                        }}
                        className={`px-4 py-3 text-xs cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors ${
                          !n.read ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''
                        }`}
                      >
                        <p className="text-stone-800 dark:text-stone-200 leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-stone-400 mt-1 block">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Persona & Settings Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              id="user-persona-btn"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-full border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover grayscale-[20%]"
              />
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300 max-w-[80px] truncate hidden sm:inline">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {isProfileMenuOpen && (
              <div
                id="user-persona-dropdown"
                className="absolute right-0 mt-2 w-64 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-lg py-2 z-50"
              >
                {/* Current User Info */}
                <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">{currentUser.name}</p>
                  <p className="text-[11px] text-stone-500 font-mono">@{currentUser.username}</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">{currentUser.roles.join(' · ')}</p>
                </div>

                {/* Direct Links */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigateTo({ type: 'profile', username: currentUser.username });
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" /> Your Profile
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigateTo({ type: 'notebooks' });
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Your Notebooks
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigateTo({ type: 'admin' });
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-stone-500" /> Admin & Network Tools
                  </button>
                </div>

                {/* Switch Persona for Demo */}
                <div className="border-t border-stone-100 dark:border-stone-800 py-1.5 px-4">
                  <p className="text-[10px] uppercase font-semibold text-stone-400 mb-1.5">
                    Switch Perspective (Demo)
                  </p>
                  <div className="space-y-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchCurrentUser(u.id);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between ${
                          u.id === currentUser.id
                            ? 'bg-stone-100 dark:bg-stone-800 font-medium text-stone-900 dark:text-stone-100'
                            : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        <span className="text-[10px] text-stone-400">@{u.username}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Mode */}
                <div className="border-t border-stone-100 dark:border-stone-800 px-4 py-2.5 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
                  <span className="font-medium">Theme</span>
                  <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-0.5 rounded-md border border-stone-200/60 dark:border-stone-700/60">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] transition-colors ${
                        theme === 'light'
                          ? 'bg-white text-stone-900 shadow-xs font-semibold'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                      title="Light mode"
                    >
                      <Sun className="w-3 h-3 text-amber-500" />
                      <span>Light</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] transition-colors ${
                        theme === 'dark'
                          ? 'bg-stone-700 text-stone-100 shadow-xs font-semibold'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                      title="Dark mode"
                    >
                      <Moon className="w-3 h-3 text-amber-400" />
                      <span>Dark</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('system')}
                      className={`px-2 py-1 rounded flex items-center gap-1 text-[11px] transition-colors ${
                        theme === 'system'
                          ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                          : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                      title="Follow system preference"
                    >
                      <Monitor className="w-3 h-3 text-stone-500 dark:text-stone-300" />
                      <span>Auto</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
