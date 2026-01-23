import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { ProofStatus } from '@shared/proofs';

interface ProofApprovalPanelProps {
  currentStatus: ProofStatus;
  approvalStatus: 'pending' | 'approved' | 'revision-pending' | 'expired';
  approvalDeadline: Date;
  totalRevisions: number;
  maxRevisionsAllowed: number;
  approvedBy?: string;
  onApprove?: () => void;
  onRequestRevision?: () => void;
  isLoading?: boolean;
}

export default function ProofApprovalPanel({
  currentStatus,
  approvalStatus,
  approvalDeadline,
  totalRevisions,
  maxRevisionsAllowed,
  approvedBy,
  onApprove,
  onRequestRevision,
  isLoading = false,
}: ProofApprovalPanelProps) {
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const daysLeft = Math.ceil((approvalDeadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft < 0;
  const isUrgent = daysLeft <= 2 && approvalStatus === 'pending';
  const revisionsRemaining = maxRevisionsAllowed - totalRevisions;

  if (approvalStatus === 'approved') {
    return (
      <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={28} />
          <div>
            <h3 className="text-xl font-bold text-green-900 mb-2">✓ Proof Approved</h3>
            <p className="text-green-800 mb-4">
              This proof was approved by <strong>{approvedBy}</strong>
            </p>
            <div className="text-sm text-green-700 space-y-1">
              <p>• Production will begin shortly</p>
              <p>• You'll receive updates via email</p>
              <p>• Expected completion in 3-5 business days</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (approvalStatus === 'expired') {
    return (
      <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-1" size={28} />
          <div>
            <h3 className="text-xl font-bold text-red-900 mb-2">⚠️ Approval Deadline Passed</h3>
            <p className="text-red-800 mb-4">
              The approval deadline for this proof has passed. Please contact our support team.
            </p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border-2 rounded-lg p-6 ${
      isUrgent ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'
    }`}>
      <div className="space-y-6">
        {/* Deadline Alert */}
        <div className="flex items-start gap-3">
          <AlertCircle className={isUrgent ? 'text-red-600' : 'text-yellow-600'} size={24} />
          <div>
            <p className={`font-bold ${isUrgent ? 'text-red-900' : 'text-yellow-900'}`}>
              {isUrgent ? '🔴 Urgent: ' : '⏱️ '}
              Decision needed in <span className="font-bold">{daysLeft}</span> day{daysLeft !== 1 ? 's' : ''}
            </p>
            <p className={isUrgent ? 'text-red-800' : 'text-yellow-800'}>
              Deadline: {approvalDeadline.toLocaleDateString()} at{' '}
              {approvalDeadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Revision Counter */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-black">Revisions Used</p>
            <span className="text-2xl font-bold text-primary">
              {totalRevisions}/{maxRevisionsAllowed}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition ${
                revisionsRemaining > 1 ? 'bg-green-600' :
                revisionsRemaining > 0 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${(totalRevisions / maxRevisionsAllowed) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {revisionsRemaining} revision{revisionsRemaining !== 1 ? 's' : ''} remaining
          </p>
        </div>

        {/* Action Buttons */}
        {!showRevisionForm ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onApprove}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={20} />
              Approve
            </button>
            <button
              onClick={() => {
                if (revisionsRemaining > 0) {
                  setShowRevisionForm(true);
                }
              }}
              disabled={isLoading || revisionsRemaining === 0}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle size={20} />
              Request Changes
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 border border-orange-300 space-y-3">
            <p className="font-semibold text-black">Describe what needs to be changed:</p>
            <textarea
              placeholder="Be specific: mention colors, sizing, text changes, etc. Designer will see your feedback in the discussion section."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 resize-none"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowRevisionForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRevisionForm(false);
                  onRequestRevision?.();
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Revision
              </button>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 text-sm text-gray-700 space-y-2">
          <p><strong>📋 Review Checklist:</strong></p>
          <ul className="space-y-1 text-xs">
            <li>✓ Colors match your design intent</li>
            <li>✓ Text is legible and correct</li>
            <li>✓ Sizing and proportions look right</li>
            <li>✓ No visible artifacts or print defects</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
