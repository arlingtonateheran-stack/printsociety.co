import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Settings,
  Truck,
  Tag,
  Users,
  Ticket,
  Search,
  DollarSign,
  Image,
  FileText,
  LogOut,
} from "lucide-react";

const adminNavItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: BarChart3,
    category: "Overview",
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    category: "Operations",
  },
  {
    label: "Shipping",
    href: "/admin/shipping",
    icon: Truck,
    category: "Operations",
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    category: "Catalog",
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: Image,
    category: "Catalog",
  },
  {
    label: "Pricing Rules",
    href: "/admin/pricing",
    icon: DollarSign,
    category: "Catalog",
  },
  {
    label: "Discounts",
    href: "/admin/discounts",
    icon: Tag,
    category: "Promotions",
  },
  {
    label: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
    category: "Promotions",
  },
  {
    label: "Media Kit",
    href: "/admin/press",
    icon: Image,
    category: "Promotions",
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
    category: "CRM",
  },
  {
    label: "Support Tickets",
    href: "/admin/tickets",
    icon: Ticket,
    category: "Support",
  },
  {
    label: "SEO & Content",
    href: "/admin/seo",
    icon: Search,
    category: "Content",
  },
  {
    label: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    category: "Insights",
  },
  {
    label: "Users & Roles",
    href: "/admin/users",
    icon: Users,
    category: "Settings",
  },
];

export default function AdminSidebar() {
  const location = useLocation();

  // Group items by category
  const categories = ["Overview", "Operations", "Catalog", "Promotions", "CRM", "Support", "Content", "Insights", "Settings"];
  const itemsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = adminNavItems.filter((item) => item.category === cat);
    return acc;
  }, {} as Record<string, typeof adminNavItems>);

  return (
    <aside className="w-64 bg-gray-900 text-white overflow-y-auto border-r border-gray-800">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Print Society .co</h2>
        <p className="text-gray-400 text-sm mt-1">Admin Panel</p>
      </div>

      <nav className="px-4 py-6">
        {categories.map((category) => {
          const items = itemsByCategory[category];
          if (items.length === 0) return null;

          return (
            <div key={category} className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
                {category}
              </h3>
              <ul className="space-y-1">
                {items.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                          isActive
                            ? "bg-green-600 text-white font-medium"
                            : "text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        <Icon size={18} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-4 mt-auto">
        <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-800 transition">
          <LogOut size={18} />
          Logout
        </button>
        <p className="text-xs text-gray-500 mt-4 px-3">
          Logged in as <span className="text-gray-400 font-medium">Admin User</span>
        </p>
      </div>
    </aside>
  );
}
