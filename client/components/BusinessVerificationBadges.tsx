import { Card } from "@/components/ui/card";
import {
  Shield,
  CheckCircle,
  Award,
  Zap,
  Lock,
  Heart,
  TrendingUp,
  Users,
  Leaf,
} from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  verified: boolean;
  verifiedDate?: Date;
  link?: string;
  color: "blue" | "green" | "gold" | "silver";
}

const BUSINESS_BADGES: Badge[] = [
  {
    id: "ssl-certified",
    name: "SSL Certified",
    description: "Secure website with encrypted data transmission",
    icon: <Lock className="w-6 h-6" />,
    verified: true,
    verifiedDate: new Date("2024-01-01"),
    link: "https://www.ssl.com/",
    color: "blue",
  },
  {
    id: "money-back-guarantee",
    name: "Money-Back Guarantee",
    description: "100% satisfaction guarantee on all products",
    icon: <Heart className="w-6 h-6" />,
    verified: true,
    color: "gold",
  },
  {
    id: "eco-friendly",
    name: "Eco-Friendly",
    description: "Committed to sustainable business practices",
    icon: <Leaf className="w-6 h-6" />,
    verified: true,
    color: "green",
  },
  {
    id: "business-verified",
    name: "Business Verified",
    description: "Verified business identity and credentials",
    icon: <CheckCircle className="w-6 h-6" />,
    verified: true,
    verifiedDate: new Date("2023-06-15"),
    color: "green",
  },
  {
    id: "fast-shipping",
    name: "Fast Shipping",
    description: "Orders processed and shipped within 48 hours",
    icon: <Zap className="w-6 h-6" />,
    verified: true,
    color: "silver",
  },
  {
    id: "customer-rated",
    name: "Highly Rated",
    description: "4.8/5 stars from 2,000+ verified customer reviews",
    icon: <Award className="w-6 h-6" />,
    verified: true,
    color: "gold",
  },
  {
    id: "trusted-seller",
    name: "Trusted Seller",
    description: "Established business with excellent track record",
    icon: <Shield className="w-6 h-6" />,
    verified: true,
    verifiedDate: new Date("2020-03-01"),
    color: "blue",
  },
  {
    id: "industry-leader",
    name: "Industry Leader",
    description: "Top 5% of custom print providers worldwide",
    icon: <TrendingUp className="w-6 h-6" />,
    verified: true,
    color: "gold",
  },
  {
    id: "community-focused",
    name: "Community Focused",
    description: "Active supporter of local businesses and causes",
    icon: <Users className="w-6 h-6" />,
    verified: true,
    color: "green",
  },
];

interface BusinessVerificationBadgesProps {
  displayCount?: number;
  showAll?: boolean;
  compact?: boolean;
  className?: string;
}

export default function BusinessVerificationBadges({
  displayCount = 6,
  showAll = false,
  compact = false,
  className = "",
}: BusinessVerificationBadgesProps) {
  const badgesToDisplay = showAll ? BUSINESS_BADGES : BUSINESS_BADGES.slice(0, displayCount);

  const getBadgeColors = (color: string) => {
    switch (color) {
      case "gold":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "green":
        return "bg-green-50 border-green-200 text-green-700";
      case "blue":
        return "bg-blue-50 border-blue-200 text-blue-700";
      case "silver":
        return "bg-gray-50 border-gray-200 text-gray-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case "gold":
        return "text-amber-500";
      case "green":
        return "text-green-500";
      case "blue":
        return "text-blue-500";
      case "silver":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 flex-wrap ${className}`}>
        {badgesToDisplay.map((badge) => (
          <div
            key={badge.id}
            className={`p-2 rounded-lg border ${getBadgeColors(badge.color)} cursor-help group relative`}
            title={badge.description}
          >
            <div className={`${getIconColor(badge.color)}`}>{badge.icon}</div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
              <div className="bg-gray-900 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                {badge.name}
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Why Choose Us</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {badgesToDisplay.map((badge) => (
          <a
            key={badge.id}
            href={badge.link || "#"}
            target={badge.link ? "_blank" : undefined}
            rel={badge.link ? "noopener noreferrer" : undefined}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getBadgeColors(badge.color)} ${
              badge.link ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <div className={`${getIconColor(badge.color)} mb-2`}>{badge.icon}</div>
            <div className="text-xs font-semibold mb-1">{badge.name}</div>
            <div className="text-xs opacity-75">{badge.description}</div>
            {badge.verifiedDate && (
              <div className="text-xs mt-2 opacity-60">
                Since {badge.verifiedDate.getFullYear()}
              </div>
            )}
          </a>
        ))}
      </div>

      {!showAll && BUSINESS_BADGES.length > displayCount && (
        <div className="mt-4 text-center">
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">
            View all {BUSINESS_BADGES.length} certifications
          </button>
        </div>
      )}
    </div>
  );
}

// Smaller version for footer
export function FooterVerificationBadges() {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Trusted & Verified</h4>
      <div className="flex items-center gap-3 flex-wrap">
        {BUSINESS_BADGES.map((badge) => (
          <div
            key={badge.id}
            className="group relative"
            title={badge.description}
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition cursor-help text-gray-600 hover:text-gray-900">
              {badge.icon}
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
              <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                {badge.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Trust indicators for high-visibility areas
export function TrustIndicators() {
  return (
    <div className="flex items-center gap-4 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-green-600" />
        <span>Secure & Verified</span>
      </div>
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-600" />
        <span>Money-Back Guarantee</span>
      </div>
      <div className="flex items-center gap-2">
        <Award className="w-4 h-4 text-amber-600" />
        <span>Highly Rated</span>
      </div>
    </div>
  );
}

// Badges as simple list for pages like About
export function VerificationBadgesList() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Our Certifications & Badges</h3>
      <div className="space-y-4">
        {BUSINESS_BADGES.map((badge, idx) => (
          <div key={badge.id} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 text-blue-600">
                {badge.icon}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">{badge.name}</h4>
                {badge.verified && (
                  <span className="text-xs font-semibold text-green-600">✓ Verified</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{badge.description}</p>
              {badge.verifiedDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Verified since {badge.verifiedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
