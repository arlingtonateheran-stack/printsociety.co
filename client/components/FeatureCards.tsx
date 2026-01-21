import { Package, Award, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Free ground shipping',
    subtitle: 'on all orders'
  },
  {
    icon: Award,
    title: 'Out for this world quality',
    subtitle: 'made in the USA'
  },
  {
    icon: CheckCircle,
    title: 'Free Online Proof',
    subtitle: 'with all orders'
  }
];

export default function FeatureCards() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center space-y-3">
              <div className="bg-blue-100 p-4 rounded-full">
                <Icon className="text-blue-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg text-black">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.subtitle}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
