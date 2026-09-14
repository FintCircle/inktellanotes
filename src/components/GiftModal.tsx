import React, { useState } from 'react';
import { useInktella } from '../context/InktellaContext';
import { Gift, Check, X, Calendar, Sparkles } from 'lucide-react';

interface GiftModalProps {
  notebookId: string;
  onClose: () => void;
}

export const GiftModal: React.FC<GiftModalProps> = ({ notebookId, onClose }) => {
  const { notebooks, users, currentUser, giftNotebook } = useInktella();

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const notebook = notebooks.find((nb) => nb.id === notebookId);
  const owner = notebook ? users.find((u) => u.id === notebook.ownerId) : null;

  if (!notebook || !owner) return null;

  const currentPaid = new Date(notebook.paidThroughDate);
  const extendedDate = new Date(currentPaid);
  extendedDate.setFullYear(extendedDate.getFullYear() + 1);

  const handleConfirmGift = () => {
    setIsProcessing(true);
    setTimeout(() => {
      giftNotebook(notebook.id, 1, currentUser.name, message.trim() || undefined);
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-editorial text-xl font-bold">
            <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Gift 1 Year to Publication</span>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center mx-auto mb-3">
              <Check className="w-5 h-5" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-stone-900 dark:text-stone-100">
              Gift Successfully Applied
            </h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
              "{notebook.name}" has been extended for another full year until{' '}
              {extendedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800">
              <p className="font-editorial text-base font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
                {notebook.name}
              </p>
              <p className="text-stone-500 dark:text-stone-400 mt-0.5">Author: {owner.name}</p>

              <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between text-stone-600 dark:text-stone-300 font-mono text-[11px]">
                <span>Current expiry:</span>
                <span>
                  {currentPaid.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-amber-700 dark:text-amber-400 font-mono font-medium text-[11px]">
                <span>New expiry (+1 year):</span>
                <span>
                  {extendedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
              Anyone can sponsor or extend a public Notebook for <strong>$10.00/year</strong>. This keeps the publication online, ad-free, and accessible to readers across the world.
            </p>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                Optional Note to Author
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Thank you for writing and sharing your notes in the open..."
                rows={2}
                className="w-full text-xs p-2 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="font-mono text-base font-bold text-stone-900 dark:text-stone-100">
                $10.00 USD
              </span>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmGift}
                  disabled={isProcessing}
                  className="px-4 py-1.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded font-medium flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isProcessing ? 'Processing...' : 'Complete Gift'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
