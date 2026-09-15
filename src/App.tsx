/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { InktellaProvider, useInktella } from './context/InktellaContext';
import { Navigation } from './components/Navigation';
import { DiscoverView } from './components/DiscoverView';
import { FollowingView } from './components/FollowingView';
import { ConversationsView } from './components/ConversationsView';
import { NotebooksDirectory } from './components/NotebooksDirectory';
import { SavedNotesView } from './components/SavedNotesView';
import { NotePage } from './components/NotePage';
import { NotebookPage } from './components/NotebookPage';
import { PersonProfile } from './components/PersonProfile';
import { TaxonomyView } from './components/TaxonomyView';
import { NoteEditor } from './components/NoteEditor';
import { AdminModerationView } from './components/AdminModerationView';
import { GiftModal } from './components/GiftModal';
import { ReportModal } from './components/ReportModal';
import { SearchModal } from './components/SearchModal';
import { BottomNavigation } from './components/BottomNavigation';
import { Shield } from 'lucide-react';

const InktellaMain: React.FC = () => {
  const { currentRoute, navigateTo } = useInktella();

  // Modals state
  const [giftNotebookId, setGiftNotebookId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<{
    targetType: 'note' | 'comment';
    targetId: string;
    targetTitle: string;
  } | null>(null);

  const handleOpenGiftModal = (notebookId: string) => {
    setGiftNotebookId(notebookId);
  };

  const handleOpenReportModal = (
    targetType: 'note' | 'comment',
    targetId: string,
    targetTitle: string
  ) => {
    setReportData({ targetType, targetId, targetTitle });
  };

  const renderContent = () => {
    switch (currentRoute.type) {
      case 'discover':
        return <DiscoverView />;
      case 'following':
        return <FollowingView />;
      case 'conversations':
        return <ConversationsView />;
      case 'notebooks':
        return <NotebooksDirectory />;
      case 'saved':
        return <SavedNotesView />;
      case 'admin':
        return <AdminModerationView />;
      case 'search':
        return <SearchModal initialQuery={currentRoute.initialQuery} pageMode onClose={() => navigateTo({ type: 'discover' })} />;
      case 'editor':
        return <NoteEditor editNoteId={currentRoute.editNoteId} />;
      case 'note':
        return (
          <NotePage
            username={currentRoute.username}
            notebookSlug={currentRoute.notebookSlug}
            noteSlug={currentRoute.noteSlug}
            onOpenGiftModal={handleOpenGiftModal}
            onOpenReportModal={handleOpenReportModal}
          />
        );
      case 'notebook':
        return (
          <NotebookPage
            username={currentRoute.username}
            notebookSlug={currentRoute.notebookSlug}
            onOpenGiftModal={handleOpenGiftModal}
          />
        );
      case 'profile':
        return <PersonProfile username={currentRoute.username} />;
      case 'context':
        return <TaxonomyView type="context" slug={currentRoute.slug} />;
      case 'tool':
        return <TaxonomyView type="tool" slug={currentRoute.slug} />;
      default:
        return <DiscoverView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] dark:bg-[#121110] text-[#1c1917] dark:text-[#f5f5f4] transition-colors duration-200">
      <Navigation />

      <main className="flex-1 pb-20 md:pb-0">{renderContent()}</main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Gift Modal */}
      {giftNotebookId && (
        <GiftModal
          notebookId={giftNotebookId}
          onClose={() => setGiftNotebookId(null)}
        />
      )}

      {/* Report Modal */}
      {reportData && (
        <ReportModal
          targetType={reportData.targetType}
          targetId={reportData.targetId}
          targetTitle={reportData.targetTitle}
          onClose={() => setReportData(null)}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-stone-200 dark:border-stone-800/80 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-baseline justify-between gap-6">
          <div>
            <span className="font-editorial text-xl font-bold tracking-widest uppercase">
              INKTELLA
            </span>
            <p className="font-editorial text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-sm leading-relaxed">
              A typography-first network of public notebooks and notes. Minimal interface. Powerful network.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-stone-500 dark:text-stone-400">
            <button
              onClick={() => navigateTo({ type: 'discover' })}
              className="hover:text-stone-900 dark:hover:text-stone-100"
            >
              Discover
            </button>
            <button
              onClick={() => navigateTo({ type: 'notebooks' })}
              className="hover:text-stone-900 dark:hover:text-stone-100"
            >
              Notebooks ($10/yr)
            </button>
            <button
              onClick={() => navigateTo({ type: 'saved' })}
              className="hover:text-stone-900 dark:hover:text-stone-100"
            >
              Library
            </button>
            <button
              onClick={() => navigateTo({ type: 'admin' })}
              className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              <span>Curation</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <InktellaProvider>
      <InktellaMain />
    </InktellaProvider>
  );
}
