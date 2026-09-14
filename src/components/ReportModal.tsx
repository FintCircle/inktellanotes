import React, { useState } from 'react';
import { useInktella } from '../context/InktellaContext';
import { Flag, Check, X } from 'lucide-react';

interface ReportModalProps {
  targetType: 'note' | 'comment';
  targetId: string;
  targetTitle: string;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  targetType,
  targetId,
  targetTitle,
  onClose,
}) => {
  const { submitReport } = useInktella();

  const [reason, setReason] = useState('spam');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(
      targetType,
      targetId,
      targetTitle,
      details ? `${reason}: ${details}` : reason
    );
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-editorial text-lg font-bold">
            <Flag className="w-4 h-4 text-red-500" />
            <span>Report Inappropriate Content</span>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-2">
            <Check className="w-8 h-8 text-green-600 mx-auto" />
            <h4 className="font-editorial text-base font-semibold text-stone-900 dark:text-stone-100">Report Received</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Thank you for keeping Inktella thoughtful and respectful. Our moderators have queued this for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <p className="text-stone-500 dark:text-stone-400 mb-1 font-mono text-[11px] uppercase tracking-wider">
                Reporting {targetType}:
              </p>
              <p className="p-2 bg-stone-50 dark:bg-stone-800/50 rounded border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 font-medium truncate">
                {targetTitle}
              </p>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                Reason for report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-2 rounded border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200"
              >
                <option value="spam">Spam or commercial self-promotion</option>
                <option value="harassment">Harassment or personal attack</option>
                <option value="plagiarism">Plagiarism or copyright infringement</option>
                <option value="inappropriate">Offensive or abusive material</option>
                <option value="other">Other policy violation</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 dark:text-stone-300 font-medium mb-1">
                Additional context
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain why this content violates network standards..."
                rows={3}
                className="w-full text-xs p-2 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
