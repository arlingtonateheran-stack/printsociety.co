import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqItems = [
  {
    id: 1,
    question: 'What makes Sticky Slap\'s custom stickers special?',
    answer: 'Our stickers stand out due to their exceptional quality, durability, and vibrant colors. We use premium materials and printing techniques to ensure your designs look amazing and last for years.'
  },
  {
    id: 2,
    question: 'How long does shipping take?',
    answer: 'We offer free ground shipping on all orders, which typically takes 5-7 business days. Expedited shipping options are also available for faster delivery.'
  },
  {
    id: 3,
    question: 'Can I get a proof before my order ships?',
    answer: 'Yes! We provide free online proofs with all orders. You can review your design and request any changes before we proceed with production.'
  },
  {
    id: 4,
    question: 'What are the different size/finish options?',
    answer: 'We offer multiple sizes and finishes including matte, glossy, and holographic options. Check our product pages for the complete range of available options.'
  },
  {
    id: 5,
    question: 'Are Sticky Slap stickers waterproof?',
    answer: 'Absolutely! Our stickers are 100% waterproof and designed to last 3-5 years outdoors. Perfect for water bottles, laptops, cars, and outdoor gear.'
  },
  {
    id: 6,
    question: 'Can I use my own design?',
    answer: 'Yes! You can upload your own design in most common file formats (PNG, JPG, PDF, SVG). Our design team will review it and create a proof for you.'
  }
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 max-w-3xl mx-auto">
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-bold text-black">Frequently Asked Questions</h2>
          <p className="text-gray-600 mt-2">Learn more about Sticky Slap custom stickers and our services</p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="w-full text-left"
            >
              <div className="border border-gray-300 rounded-lg p-4 hover:border-black transition">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-black text-lg">{item.question}</h3>
                  <ChevronDown
                    size={20}
                    className={`text-gray-600 transition-transform ${
                      openId === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {openId === item.id && (
                  <p className="text-gray-700 mt-4 leading-relaxed">{item.answer}</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
