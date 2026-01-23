import { useState } from "react";
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
  sampleOrders,
  sampleArtworkLibrary,
  sampleSavedProducts,
  sampleProofs,
} from "@shared/account";
import { sampleProofs as proofs } from "@shared/proofs";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>("orders");
  const [user, setUser] = useState(sampleUserAccount);
  const [orders, setOrders] = useState(sampleOrders);
  const [artwork, setArtwork] = useState(sampleArtworkLibrary);
  const [savedProducts, setSavedProducts] = useState(sampleSavedProducts);

  // Get pending and past proofs
  const pendingProofs = proofs.filter(
    (p) =>
      p.currentStatus === "ready-for-approval" ||
      p.currentStatus === "pending-review"
  );
  const pastProofs = proofs.filter(
    (p) =>
      p.currentStatus === "approved" ||
      p.currentStatus === "in-production" ||
      p.currentStatus === "completed"
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
              proofNumber: p.proofNumber,
              productName: p.productName,
              currentStatus: p.currentStatus,
              totalRevisions: p.totalRevisions,
              maxRevisionsAllowed: p.maxRevisionsAllowed,
              approvalDeadline: p.approvalDeadline,
              firstSentAt: p.firstSentAt || new Date(),
            }))}
            pastProofs={pastProofs.map((p) => ({
              id: p.id,
              proofNumber: p.proofNumber,
              productName: p.productName,
              currentStatus: p.currentStatus,
              totalRevisions: p.totalRevisions,
              maxRevisionsAllowed: p.maxRevisionsAllowed,
              approvalDeadline: p.approvalDeadline,
              firstSentAt: p.firstSentAt || new Date(),
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
