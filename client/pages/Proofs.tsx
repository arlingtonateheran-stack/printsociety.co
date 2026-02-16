import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, AlertCircle, CheckCircle, Clock, Lock, Loader2 } from 'lucide-react';
import { proofStatusColors, type ProofStatus } from '@shared/proofs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

type FilterStatus = ProofStatus | 'all';

export default function Proofs() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [proofs, setProofs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProofs();
    }
  }, [isAuthenticated, user]);

  const fetchProofs = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from("proofs")
        .select(`
          *,
          order:orders(*)
        `);

      if (user?.role !== 'admin') {
        query = query.eq("order.customer_email", user?.email);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProofs(data || []);
    } catch (error) {
      console.error("Error fetching proofs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProofs = useMemo(() => {
    if (!isAuthenticated || !user) return [];

    let filtered = proofs;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        (p.order?.order_number || "").toLowerCase().includes(q) ||
        (p.order?.customer_name || "").toLowerCase().includes(q) ||
        (p.order?.product_name || "").toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [proofs, searchQuery, filterStatus]);

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

  if (authLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <Footer />
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
                    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-primary transition bg-white">
                      <div className="grid md:grid-cols-6 gap-6">
                        {/* Proof Number & Product */}
                        <div className="md:col-span-2">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(proof.status)}
                            <div>
                              <p className="font-mono text-sm text-gray-600">v{proof.version}</p>
                              <h3 className="text-lg font-bold text-black mt-1">{proof.order?.product_name || 'Custom Print'}</h3>
                              <p className="text-sm text-gray-600">{proof.order?.order_number}</p>
                            </div>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Customer</p>
                          <p className="font-medium text-black mt-1">{proof.order?.customer_name || 'Guest'}</p>
                          <p className="text-xs text-gray-600 truncate">{proof.order?.customer_email}</p>
                        </div>

                        {/* Status */}
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Status</p>
                          <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                            proofStatusColors[proof.status as ProofStatus]?.bg || 'bg-blue-100'
                          } ${proofStatusColors[proof.status as ProofStatus]?.text || 'text-blue-800'}`}>
                            {proofStatusColors[proof.status as ProofStatus]?.label || proof.status}
                          </div>
                        </div>

                        {/* Versions */}
                        <div>
                          <p className="text-xs text-gray-600 uppercase font-semibold">Version</p>
                          <p className="font-medium text-black mt-1">v{proof.version}</p>
                        </div>

                        {/* Sent Date */}
                        <div className="md:col-span-1">
                          <p className="text-xs text-gray-600 uppercase font-semibold">Sent On</p>
                          <p className="text-sm text-gray-700 mt-1">
                            {new Date(proof.sent_at).toLocaleDateString()}
                          </p>
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
