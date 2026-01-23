import { useState } from 'react';
import { Send } from 'lucide-react';
import type { ProofComment, CommentType } from '@shared/proofs';

interface ProofCommentsProps {
  comments: ProofComment[];
  onAddComment?: (content: string, type: CommentType) => void;
  isReadOnly?: boolean;
  currentUserRole?: 'customer' | 'designer' | 'admin';
}

const roleColors: Record<string, { bg: string; text: string }> = {
  customer: { bg: 'bg-blue-100', text: 'text-blue-700' },
  designer: { bg: 'bg-purple-100', text: 'text-purple-700' },
  admin: { bg: 'bg-amber-100', text: 'text-amber-700' },
};

export default function ProofComments({
  comments,
  onAddComment,
  isReadOnly = false,
  currentUserRole = 'customer',
}: ProofCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<CommentType>('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment, commentType);
      setNewComment('');
      setCommentType('general');
    }
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-black">Discussion & Feedback</h3>

      {/* Comments Thread */}
      {sortedComments.length > 0 ? (
        <div className="space-y-4">
          {sortedComments.map((comment) => (
            <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-black">{comment.authorName}</p>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        roleColors[comment.authorRole].bg
                      } ${roleColors[comment.authorRole].text}`}
                    >
                      {comment.authorRole === 'customer' ? 'Customer' :
                       comment.authorRole === 'designer' ? 'Designer' : 'Admin'}
                    </span>
                    {comment.type === 'revision-request' && (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-orange-100 text-orange-700">
                        Revision Request
                      </span>
                    )}
                    {comment.type === 'approval' && (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700">
                        Approval
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(comment.createdAt).toLocaleDateString()} at{' '}
                    {new Date(comment.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-3">{comment.content}</p>

              {comment.attachments && comment.attachments.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {comment.attachments.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Attachment {idx + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 py-8 text-center">No comments yet. Start a discussion!</p>
      )}

      {/* Add Comment Form */}
      {!isReadOnly && (
        <form onSubmit={handleSubmit} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">Comment Type</label>
              <div className="flex gap-2 flex-wrap">
                {(['general', 'revision-request', 'approval'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setCommentType(type)}
                    className={`px-3 py-2 rounded text-sm font-medium transition ${
                      commentType === type
                        ? 'bg-primary text-white'
                        : 'bg-white border border-gray-300 text-black hover:border-primary'
                    }`}
                  >
                    {type === 'general' ? 'General' :
                     type === 'revision-request' ? 'Request Revision' : 'Approve'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setNewComment('');
                  setCommentType('general');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={16} />
                Post Comment
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
        <p className="font-semibold mb-2">💡 Communication Tips:</p>
        <ul className="space-y-1 text-xs">
          <li>• Be specific when requesting revisions (mention exact areas)</li>
          <li>• Designer notifications are sent automatically with each comment</li>
          <li>• Check back within 24 hours for your revision updates</li>
        </ul>
      </div>
    </div>
  );
}
