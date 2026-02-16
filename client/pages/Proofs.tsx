import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, AlertCircle, CheckCircle, Clock, Lock } from 'lucide-react';
import { sampleProofs, proofStatusColors, type ProofStatus } from '@shared/proofs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

type FilterStatus = ProofStatus | 'all';

export default function Proofs() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const filteredProofs = useMemo(() => {
    if (!isAuthenticated || !user) return [];

    let filtered = sampleProofs;

    // Filter by customer email if not an admin
    if (user.role !== 'admin') {
      filtered = filtered.filter(p => p.customerEmail.toLowerCase() === user.email.toLowerCase());
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.currentStatus === filterStatus);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.proofNumber.toLowerCase().includes(query) ||
        p.customerName.toLowerCase().includes(query) ||
        p.productName.toLowerCase().includes(query) ||
        p.orderName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, filterStatus]);

  const getStatusIcon = (status: ProofStatus) => {
    switch (status) {
      case 'approved':
      case 'approved-final':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'ready-for-approval':
        return <AlertCircle className="text-yellow-600" size={20} />;
      case 'revision-requested':
        return <AlertCircle className="text-orange-600" size={20} />;
      case 'in-production':
        return <Clock className="text-purple-600" size={20} />;
      default:
        return <Clock className="text-blue-600" size={20} />;
    }
  };

  const getDaysUntilDeadline = (deadline: Date): number => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
            <p className="text-gray-600 mb-8">
              Please sign in to your account to view and manage your product proofs.
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="block w-full py-3 px-4 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Proof Center</h1>
          <p className="text-gray-300 text-lg">Review, approve, and request revisions on your designs</p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by proof number, customer name, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Filter by Status:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                All Proofs
              </button>
              {(['ready-for-approval', 'revision-requested', 'approved', 'in-production'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filterStatus === status
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {proofStatusColors[status].label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600">
            Found <span className="font-semibold">{filteredProofs.length}</span> proof{filteredProofs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {/* Proofs List */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredProofs.length > 0 ? (
            <div className="space-y-4">
              {filteredProofs.map((proof) => {
                const daysLeft = getDaysUntilDeadline(proof.approvalDeadline);
                const isUrgent = daysLeft <= 2 && proof.approvalStatus === 'pending';

                return (
                  <Link
                    key={proof.id}
                    to={`/proofs/${proof.id}`}
                    className="block"
                  >
                    <div className={`border rounded-lg p-6 hover:shadow-lg transition ${
                      isUrgent ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-primary'
                    }`}>
                      <div className="grid md:grid-cols-6 gap-6">
                        {/* Proof Number & Product */}
                        <div className="md:col-span-2">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(proof.currentStatus)}
                            <div>
                              <p className="font-mono text-sm text-gray-600">{proof.proofNumber}</p>
                              <h3 className="text-lg font-bold text-black mt-1">{proof.productName}</h3>
                              <p className="text-sm text-gray-600">{proof.orderName}</p>
                            </div>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Customer</p>
                          <p className="font-medium text-black mt-1">{proof.customerName}</p>
                          <p className="text-xs text-gray-600 truncate">{proof.customerEmail}</p>
                        </div>

                        {/* Status */}
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Status</p>
                          <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                            proofStatusColors[proof.currentStatus].bg
                          } ${proofStatusColors[proof.currentStatus].text}`}>
                            {proofStatusColors[proof.currentStatus].label}
                          </div>
                        </div>

                        {/* Versions & Deadline */}
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Versions</p>
                          <p className="font-medium text-black mt-1">v{proof.currentVersion.versionNumber}</p>
                          <p className="text-xs text-gray-600">
                            {proof.totalRevisions}/{proof.maxRevisionsAllowed} revisions
                          </p>
                        </div>

                        {/* Deadline */}
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Deadline</p>
                          {proof.approvalStatus === 'pending' ? (
                            <div className={`mt-1 ${isUrgent ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                              <p className="text-sm">{daysLeft} days left</p>
                              <p className="text-xs">
                                {proof.approvalDeadline.toLocaleDateString()}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-green-600 font-medium mt-1">✓ Approved</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No proofs found</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('all');
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
