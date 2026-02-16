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
import { toast } from "sonner";

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

      const [ordersRes, proofsRes, profileRes, addressesRes] = await Promise.all([
        supabase.from("orders").select("*").eq("customer_email", authUser?.email).order("created_at", { ascending: false }),
        supabase.from("proofs").select("*, order:orders(*)").eq("order.customer_email", authUser?.email),
        supabase.from("customer_profiles").select("*, user:users(*)").eq("user_id", authUser?.id).single(),
        supabase.from("addresses").select("*").eq("user_id", authUser?.id)
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
        const profile = profileRes.data;
        const addresses = addressesRes.data || [];

        // Map preferences from JSONB or use defaults
        const defaultPrefs = {
          emailNotifications: true,
          proofApprovalReminders: true,
          orderUpdates: true,
          marketingEmails: false,
        };

        const commPrefs = profile?.communication_preferences || {};
        const preferences = {
          emailNotifications: commPrefs.emailNotifications ?? defaultPrefs.emailNotifications,
          proofApprovalReminders: commPrefs.proofApprovalReminders ?? defaultPrefs.proofApprovalReminders,
          orderUpdates: commPrefs.orderUpdates ?? defaultPrefs.orderUpdates,
          marketingEmails: commPrefs.marketingEmails ?? defaultPrefs.marketingEmails,
        };

        setUser({
          ...sampleUserAccount,
          id: authUser.id,
          email: authUser.email,
          firstName: authUser.name?.split(' ')[0] || '',
          lastName: authUser.name?.split(' ').slice(1).join(' ') || '',
          phone: profile?.phone || '',
          company: profile?.business_name || '',
          createdAt: new Date(authUser.created_at || Date.now()),
          lastLogin: new Date(authUser.last_login || Date.now()),
          preferences,
          shippingAddresses: addresses.map((addr: any) => ({
            id: addr.id,
            label: addr.address_type === 'shipping' ? 'Shipping' : 'Billing',
            firstName: addr.first_name,
            lastName: addr.last_name,
            company: addr.company,
            street: addr.street,
            street2: addr.street_2,
            city: addr.city,
            state: addr.state_province,
            zipCode: addr.zip_postal_code,
            country: addr.country,
            phone: addr.phone,
            isDefault: addr.is_default,
            addressType: addr.address_type
          }))
        });
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      let errorMessage = error.message || error.details || error.hint || (typeof error === 'object' ? JSON.stringify(error) : String(error));
      if (errorMessage === "{}" || errorMessage === "[object Object]") {
        errorMessage = "Database error. Check if 'orders' and 'proofs' tables are correctly set up.";
      }
      toast.error(`Failed to load dashboard: ${errorMessage}`);
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

  const handleUpdateAccountSettings = async (settings: any) => {
    try {
      const { firstName, lastName, phone, company, preferences } = settings;

      const updatePromises = [];

      // Update user name in users table
      updatePromises.push(
        supabase.from("users").update({
          name: `${firstName} ${lastName}`.trim(),
        }).eq("id", authUser?.id)
      );

      // Update customer profile
      updatePromises.push(
        supabase.from("customer_profiles").update({
          business_name: company,
          phone: phone,
          communication_preferences: preferences
        }).eq("user_id", authUser?.id)
      );

      const results = await Promise.all(updatePromises);
      const errors = results.filter(r => r.error).map(r => r.error);

      if (errors.length > 0) {
        throw errors[0];
      }

      setUser((prev) => ({
        ...prev,
        ...settings,
      }));

      toast.success("Account settings updated successfully");
    } catch (error: any) {
      console.error("Error updating account settings:", error);
      toast.error(`Failed to update settings: ${error.message}`);
    }
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

  const handleAddressSave = async (address: any) => {
    try {
      const payload = {
        user_id: authUser?.id,
        address_type: address.addressType,
        first_name: address.firstName,
        last_name: address.lastName,
        company: address.company,
        street: address.street,
        street_2: address.street2,
        city: address.city,
        state_province: address.state,
        zip_postal_code: address.zipCode,
        country: address.country,
        phone: address.phone,
        is_default: address.isDefault
      };

      if (address.id) {
        // If setting as default, unset others first
        if (address.isDefault) {
          const { error: resetError } = await supabase.from("addresses").update({ is_default: false }).eq("user_id", authUser?.id);
          if (resetError) throw resetError;
        }
        const { error } = await supabase.from("addresses").update(payload).eq("id", address.id);
        if (error) throw error;
        toast.success("Address updated successfully");
      } else {
        // If setting as default, unset others first
        if (address.isDefault) {
          const { error: resetError } = await supabase.from("addresses").update({ is_default: false }).eq("user_id", authUser?.id);
          if (resetError) throw resetError;
        }
        const { error } = await supabase.from("addresses").insert([payload]);
        if (error) throw error;
        toast.success("Address added successfully");
      }

      // Refresh dashboard data to update addresses
      fetchDashboardData();
    } catch (error: any) {
      console.error("Error saving address:", error);
      const errorMessage = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
      toast.error(`Failed to save address: ${errorMessage}`);
      throw error; // Re-throw for the modal to handle
    }
  };

  const handleAddressDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) throw error;
      toast.success("Address deleted successfully");

      // Refresh dashboard data
      fetchDashboardData();
    } catch (error: any) {
      console.error("Error deleting address:", error);
      toast.error(`Failed to delete address: ${error.message}`);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      toast.success("Verification email sent!");
    } catch (error: any) {
      toast.error(`Failed to send verification email: ${error.message}`);
    }
  };

  const handleChangePassword = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`
      });
      if (error) throw error;
      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error(`Failed to send reset email: ${error.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Mark as inactive in users table
      const { error } = await supabase.from("users").update({ is_active: false }).eq("id", authUser?.id);
      if (error) throw error;

      toast.success("Account deactivated. You will be signed out.");

      // Sign out
      await supabase.auth.signOut();
      window.location.href = "/";
    } catch (error: any) {
      toast.error(`Failed to delete account: ${error.message}`);
    }
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
          <AccountSettings
            user={user}
            onSave={handleUpdateAccountSettings}
            onAddressSave={handleAddressSave}
            onAddressDelete={handleAddressDelete}
            onVerifyEmail={handleVerifyEmail}
            onChangePassword={handleChangePassword}
            onDeleteAccount={handleDeleteAccount}
          />
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
