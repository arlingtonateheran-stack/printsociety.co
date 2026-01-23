import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { ProofVersion } from '@shared/proofs';

interface ProofVersionHistoryProps {
  versions: ProofVersion[];
  currentVersionId: string;
  onVersionSelect: (versionId: string) => void;
}

export default function ProofVersionHistory({
  versions,
  currentVersionId,
  onVersionSelect,
}: ProofVersionHistoryProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const sortedVersions = [...versions].sort((a, b) => b.versionNumber - a.versionNumber);

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-black">Version History</h3>
          <span className="text-sm bg-gray-200 px-2 py-1 rounded text-gray-700">
            {versions.length} version{versions.length !== 1 ? 's' : ''}
          </span>
        </div>
        <ChevronDown
          size={20}
          className={`text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="space-y-3 pl-4 border-l-2 border-gray-300">
          {sortedVersions.map((version) => (
            <button
              key={version.id}
              onClick={() => onVersionSelect(version.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition ${
                currentVersionId === version.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-black">Version {version.versionNumber}</h4>
                    {currentVersionId === version.id && (
                      <span className="text-xs bg-primary text-white px-2 py-1 rounded">Current</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{version.generatedBy}</p>
                  {version.changes && (
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Changes:</strong> {version.changes}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(version.generatedAt).toLocaleDateString()} at{' '}
                    {new Date(version.generatedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded ${
                  version.status === 'approved' ? 'bg-green-100 text-green-700' :
                  version.status === 'revision-requested' ? 'bg-orange-100 text-orange-700' :
                  version.status === 'ready-for-approval' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {version.status === 'approved' ? '✓ Approved' :
                   version.status === 'revision-requested' ? 'Revision' :
                   version.status === 'ready-for-approval' ? 'Pending' :
                   'Review'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
