import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DashboardNav, DashboardSection } from "@/components/DashboardNav";
import { MyOrders } from "@/components/MyOrders";
import { ArtworkLibrary } from "@/components/ArtworkLibrary";
import { ProofApprovalsSection } from "@/components/ProofApprovalsSection";
import { SavedProducts } from "@/components/SavedProducts";
import { AccountSettings } from "@/components/AccountSettings";
import {
  sampleUserAccount,
  sampleArtworkLibrary,
  sampleSavedProducts,
} from "@shared/account";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState<DashboardSection>("orders");
  const [user, setUser] = useState(sampleUserAccount);
  const [orders, setOrders] = useState<any[]>([]);
  const [artwork, setArtwork] = useState(sampleArtworkLibrary);
  const [savedProducts, setSavedProducts] = useState(sampleSavedProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [proofs, setProofs] = useState<any[]>([]);

  useEffect(() => {
    if (isAuthenticated && authUser) {
      fetchDashboardData();
    }
  }, [isAuthenticated, authUser]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const [ordersRes, proofsRes] = await Promise.all([
        supabase.from("orders").select("*").eq("customer_email", authUser?.email).order("created_at", { ascending: false }),
        supabase.from("proofs").select("*, order:orders(*)").eq("order.customer_email", authUser?.email)
      ]);

      if (ordersRes.error) throw ordersRes.error;

      // Map Supabase orders to the structure expected by MyOrders component
      const mappedOrders = (ordersRes.data || []).map(o => ({
        id: o.id,
        orderNumber: o.order_number || o.id.substring(0, 8),
        createdAt: new Date(o.created_at),
        status: o.status === 'awaiting-artwork' ? 'pending-proof' :
                o.status === 'proof-sent' ? 'pending-proof' :
                o.status === 'approved' ? 'proof-approved' :
                o.status === 'in-production' ? 'in-production' :
                o.status === 'ready-to-ship' ? 'shipped' : 'delivered',
        items: [{
          id: o.product_id,
          productId: o.product_id,
          productName: o.product_name || 'Custom Product',
          quantity: o.quantity || 1,
          size: o.selected_size || '',
          material: o.selected_material || '',
          finish: o.selected_finish || '',
          unitPrice: o.price_per_unit || 0,
          subtotal: o.subtotal || 0
        }],
        total: o.total || o.total_amount || 0,
        shippingAddress: {
          name: o.customer_name || 'Customer',
          street: o.shipping_address?.street || '',
          city: o.shipping_address?.city || '',
          state: o.shipping_address?.state || '',
          zipCode: o.shipping_address?.zipCode || ''
        }
      }));

      setOrders(mappedOrders);
      setProofs(proofsRes.data || []);

      if (authUser) {
        setUser({
          ...sampleUserAccount,
          id: authUser.id,
          email: authUser.email,
          firstName: authUser.name?.split(' ')[0] || '',
          lastName: authUser.name?.split(' ')[1] || ''
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get pending and past proofs
  const pendingProofs = proofs.filter(
    (p) =>
      p.status === "sent" ||
      p.status === "revised"
  );
  const pastProofs = proofs.filter(
    (p) =>
      p.status === "approved"
  );

  const handleArtworkDelete = (id: string) => {
    setArtwork((prev) => prev.filter((art) => art.id !== id));
  };

  const handleArtworkRename = (id: string, newName: string) => {
    setArtwork((prev) =>
      prev.map((art) =>
        art.id === id ? { ...art, name: newName } : art
      )
    );
  };

  const handleArtworkDuplicate = (id: string) => {
    const original = artwork.find((art) => art.id === id);
    if (original) {
      const newArtwork = {
        ...original,
        id: `art-${Date.now()}`,
        name: `${original.name} (Copy)`,
        uploadedAt: new Date(),
      };
      setArtwork((prev) => [...prev, newArtwork]);
    }
  };

  const handleArtworkUpload = (file: File) => {
    const newArtwork = {
      id: `art-${Date.now()}`,
      name: file.name,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      type: "design" as const,
      uploadedAt: new Date(),
      fileSize: file.size,
      dpi: 300,
      tags: [],
      timesUsed: 0,
    };
    setArtwork((prev) => [...prev, newArtwork]);
  };

  const handleSaveProduct = (settings: any) => {
    setUser((prev) => ({
      ...prev,
      ...settings,
      preferences: settings.preferences || prev.preferences,
    }));
  };

  const handleRemoveSavedProduct = (id: string) => {
    setSavedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setSavedProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "orders":
        return <MyOrders orders={orders} />;
      case "artwork":
        return (
          <ArtworkLibrary
            artworks={artwork}
            onUpload={handleArtworkUpload}
            onDelete={handleArtworkDelete}
            onRename={handleArtworkRename}
            onDuplicate={handleArtworkDuplicate}
          />
        );
      case "proofs":
        return (
          <ProofApprovalsSection
            pendingProofs={pendingProofs.map((p) => ({
              id: p.id,
              proofNumber: `v${p.version}`,
              productName: p.order?.product_name || 'Custom Product',
              currentStatus: p.status === 'sent' ? 'ready-for-approval' : 'pending-review',
              totalRevisions: p.version - 1,
              maxRevisionsAllowed: 3,
              approvalDeadline: new Date(new Date(p.sent_at).getTime() + 7 * 24 * 60 * 60 * 1000),
              firstSentAt: new Date(p.sent_at),
            }))}
            pastProofs={pastProofs.map((p) => ({
              id: p.id,
              proofNumber: `v${p.version}`,
              productName: p.order?.product_name || 'Custom Product',
              currentStatus: 'approved',
              totalRevisions: p.version - 1,
              maxRevisionsAllowed: 3,
              approvalDeadline: new Date(p.sent_at),
              firstSentAt: new Date(p.sent_at),
            }))}
          />
        );
      case "products":
        return (
          <SavedProducts
            savedProducts={savedProducts}
            onRemove={handleRemoveSavedProduct}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case "settings":
        return (
          <AccountSettings user={user} onSave={handleSaveProduct} />
        );
      default:
        return <MyOrders orders={orders} />;
    }
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

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 min-h-[calc(100vh-200px)]">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1 border-r border-gray-200">
              <DashboardNav
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            {/* Main Content */}
            <div className="md:col-span-3 lg:col-span-4 p-6 md:p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Sample proofs mapping (to match the expected type)
const sampleProofs = proofs;
