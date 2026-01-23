import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Download, Share2, Printer } from 'lucide-react';
import { sampleProofs, proofStatusColors } from '@shared/proofs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProofApprovalPanel from '@/components/ProofApprovalPanel';
import ProofVersionHistory from '@/components/ProofVersionHistory';
import ProofComments from '@/components/ProofComments';

export default function ProofDetail() {
  const { proofId } = useParams<{ proofId: string }>();
  const proof = sampleProofs.find(p => p.id === proofId);
  const [selectedVersionId, setSelectedVersionId] = useState(proof?.currentVersion.id || '');

  if (!proof) {
    return <Navigate to="/proofs" />;
  }

  const selectedVersion = proof.versions.find(v => v.id === selectedVersionId) || proof.currentVersion;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-600">
        <a href="/proofs" className="hover:text-primary transition">Proof Center</a>
        {' / '}
        <span className="text-black font-semibold">{proof.proofNumber}</span>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-black">{proof.productName}</h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                proofStatusColors[proof.currentStatus].bg
              } ${proofStatusColors[proof.currentStatus].text}`}>
                {proofStatusColors[proof.currentStatus].label}
              </span>
            </div>
            <p className="text-gray-600">{proof.orderName}</p>
            <p className="font-mono text-sm text-gray-600 mt-1">{proof.proofNumber}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-col sm:flex-row">
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-black">
              <Download size={18} />
              Download PDF
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-black">
              <Share2 size={18} />
              Share
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-black">
              <Printer size={18} />
              Print
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Proof Preview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Proof Image */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-black">Proof Preview</h2>
              <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={selectedVersion.previewUrl}
                  alt="Proof preview"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-sm text-gray-600">
                Version {selectedVersion.versionNumber} • Generated{' '}
                {new Date(selectedVersion.generatedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-black mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Quantity</p>
                  <p className="text-lg font-bold text-black mt-1">{proof.specifications.quantity.toLocaleString()} units</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Size</p>
                  <p className="text-lg font-bold text-black mt-1">{proof.specifications.size}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Material</p>
                  <p className="text-lg font-bold text-black mt-1 capitalize">{proof.specifications.material}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase font-semibold">Finish</p>
                  <p className="text-lg font-bold text-black mt-1 capitalize">{proof.specifications.finish}</p>
                </div>
              </div>
            </div>

            {/* Version History */}
            {proof.versions.length > 1 && (
              <ProofVersionHistory
                versions={proof.versions}
                currentVersionId={selectedVersionId}
                onVersionSelect={setSelectedVersionId}
              />
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Order Info Card */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-black mb-4">Order Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 font-semibold">Customer</p>
                  <p className="text-black mt-1">{proof.customerName}</p>
                  <p className="text-xs text-gray-600">{proof.customerEmail}</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-gray-600 font-semibold">Order Details</p>
                  <p className="text-black mt-1">ID: {proof.orderId}</p>
                  <p className="text-black">Qty: {proof.specifications.quantity}</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-gray-600 font-semibold">Timeline</p>
                  <p className="text-black mt-1">
                    Created: {new Date(proof.createdAt).toLocaleDateString()}
                  </p>
                  {proof.approvedAt && (
                    <p className="text-green-700 font-medium">
                      ✓ Approved: {new Date(proof.approvedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Approval Panel */}
            <ProofApprovalPanel
              currentStatus={proof.currentStatus}
              approvalStatus={proof.approvalStatus}
              approvalDeadline={proof.approvalDeadline}
              totalRevisions={proof.totalRevisions}
              maxRevisionsAllowed={proof.maxRevisionsAllowed}
              approvedBy={proof.approvedBy}
              onApprove={() => console.log('Approve clicked')}
              onRequestRevision={() => console.log('Request revision clicked')}
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="mb-12">
          <ProofComments
            comments={proof.comments}
            currentUserRole="customer"
            onAddComment={(content, type) => {
              console.log('Add comment:', { content, type });
            }}
          />
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">📋 Proof Review Guide</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-blue-900">
            <div>
              <p className="font-semibold mb-1">✓ Check Colors</p>
              <p className="text-xs">Do the colors match your expectations?</p>
            </div>
            <div>
              <p className="font-semibold mb-1">✓ Check Text</p>
              <p className="text-xs">Is all text correct and readable?</p>
            </div>
            <div>
              <p className="font-semibold mb-1">✓ Check Layout</p>
              <p className="text-xs">Are sizes and proportions correct?</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
