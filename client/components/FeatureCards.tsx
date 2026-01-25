import { Truck, Sparkles, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free ground shipping",
    subtitle: "on all orders",
    imgSrc:
      "https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2Faafc179699d44dcf9866ed923d2b9ca1",
  },
  {
    icon: Sparkles,
    title: "Out for this world quality",
    subtitle: "made in the US",
    imgSrc:
      "https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2F389300f52ff64546871c24bf11cbbd2f",
    isAnimated: true,
  },
  {
    icon: CheckCircle,
    title: "Free Online Proof",
    subtitle: "with all orders",
    imgSrc:
      "https://cdn.builder.io/api/v1/image/assets%2F1e00ee8c48924560b1c928d354e4521b%2F1e97651d4cac412f8e78e6aa02358bfe",
  },
];

export default function FeatureCards() {
  return (
    <section className="w-full bg-black py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-3xl p-4 flex items-center gap-3 transition-all duration-150 hover:bg-white/20"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <img
                  src={feature.imgSrc}
                  alt={feature.title}
                  loading="lazy"
                  className={`w-12 h-12 ${feature.isAnimated ? "animate-spin" : ""}`}
                  style={feature.isAnimated ? { animationDuration: "4s" } : {}}
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-white text-sm font-semibold leading-5 mb-0.5">
                  <span className="block">{feature.title}</span>
                  <span className="text-gray-300 text-xs font-normal leading-4">
                    {feature.subtitle}
                  </span>
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
