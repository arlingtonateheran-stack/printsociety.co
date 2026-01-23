import { useState } from "react";
import { 
  ShoppingBag, 
  FileText, 
  Heart, 
  Settings, 
  Image,
  ChevronRight,
  Menu,
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type DashboardSection = "orders" | "artwork" | "proofs" | "products" | "settings";

interface DashboardNavProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

export function DashboardNav({ activeSection, onSectionChange }: DashboardNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const sections = [
    {
      id: "orders" as DashboardSection,
      label: "My Orders",
      icon: ShoppingBag,
      description: "Track orders and shipments",
    },
    {
      id: "artwork" as DashboardSection,
      label: "Artwork Library",
      icon: Image,
      description: "Manage your designs",
    },
    {
      id: "proofs" as DashboardSection,
      label: "Proof Approvals",
      icon: FileText,
      description: "Pending approvals",
    },
    {
      id: "products" as DashboardSection,
      label: "Saved Products",
      icon: Heart,
      description: "Your favorites",
    },
    {
      id: "settings" as DashboardSection,
      label: "Account Settings",
      icon: Settings,
      description: "Profile & preferences",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <h2 className="font-bold text-lg">My Account</h2>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Navigation */}
      <nav
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block md:sticky md:top-20 md:max-h-screen md:overflow-y-auto border-r md:border-b-0 border-gray-200 bg-white`}
      >
        <div className="p-4 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-green-50 border-l-4 border-green-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-green-600" : "text-gray-500"}
                />
                <div className="flex-1 text-left">
                  <div
                    className={`font-semibold text-sm ${
                      isActive ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {section.label}
                  </div>
                  <div className="text-xs text-gray-500 hidden md:block">
                    {section.description}
                  </div>
                </div>
                {isActive && (
                  <ChevronRight size={18} className="text-green-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
            Logout
          </Button>
        </div>
      </nav>
    </>
  );
}
