import { useState } from "react";
import { HelpArticle, FAQ, HelpCategory } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ThumbsUp, ThumbsDown, ChevronRight, BookOpen, HelpCircle } from "lucide-react";

interface HelpCenterProps {
  articles: HelpArticle[];
  faqs: FAQ[];
  categories: HelpCategory[];
  selectedArticleId?: string;
  onArticleSelect?: (articleId: string) => void;
  onBack?: () => void;
}

export function HelpCenter({
  articles,
  faqs,
  categories,
  selectedArticleId,
  onArticleSelect,
  onBack,
}: HelpCenterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "all">("all");
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(
    selectedArticleId ? articles.find((a) => a.id === selectedArticleId) || null : null
  );

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.excerpt || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategoryId === "all" || article.category_id === selectedCategoryId;
    return matchesSearch && matchesCategory;
  });

  const filteredFaqs = faqs.filter(
    (faq) =>
      selectedCategoryId === "all" ||
      faq.category_id === selectedCategoryId
  );

  if (selectedArticle) {
    return <ArticleDetail article={selectedArticle} onBack={() => {
      setSelectedArticle(null);
      onBack?.();
    }} />;
  }

  return (
    <div className="space-y-8">
      {/* Search Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4">How Can We Help?</h1>
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-300" size={20} />
          <Input
            placeholder="Search articles and FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategoryId("all")}
          className={`px-4 py-2 rounded-full font-medium transition ${
            selectedCategoryId === "all"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              selectedCategoryId === cat.id
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Articles Section */}
      {filteredArticles.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BookOpen size={24} />
            Help Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => {
                  setSelectedArticle(article);
                  onArticleSelect?.(article.id);
                }}
              >
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.views} views</span>
                    <ChevronRight size={16} className="text-green-600" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* FAQs Section */}
      {filteredFaqs.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <HelpCircle size={24} />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <Card
                key={faq.id}
                className="overflow-hidden hover:shadow-md transition"
              >
                <button
                  onClick={() =>
                    setExpandedFaqId(
                      expandedFaqId === faq.id ? null : faq.id
                    )
                  }
                  className="w-full p-4 flex items-start gap-4 hover:bg-gray-50 transition"
                >
                  <div className="text-left flex-1">
                    <h3 className="font-semibold text-gray-900 text-left">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronRight
                    size={20}
                    className={`flex-shrink-0 text-gray-400 transition ${
                      expandedFaqId === faq.id ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {expandedFaqId === faq.id && (
                  <div className="px-4 pb-4 text-gray-700 border-t">
                    <p className="mb-4">{faq.answer}</p>
                    <div className="flex items-center gap-4 pt-4 border-t text-sm">
                      <span className="text-gray-600">Was this helpful?</span>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition">
                        <ThumbsUp size={16} />
                        {faq.helpful_yes}
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition">
                        <ThumbsDown size={16} />
                        {faq.helpful_no}
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredArticles.length === 0 && filteredFaqs.length === 0 && (
        <Card className="p-8 text-center">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Results Found
          </h3>
          <p className="text-gray-500 mb-6">
            Try a different search term or contact our support team
          </p>
          <Button className="bg-green-600 hover:bg-green-700">
            Contact Support
          </Button>
        </Card>
      )}
    </div>
  );
}

// Article Detail View
interface ArticleDetailProps {
  article: HelpArticle;
  onBack: () => void;
}

function ArticleDetail({ article, onBack }: ArticleDetailProps) {
  const [helpful, setHelpful] = useState<"yes" | "no" | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="text-green-600 hover:text-green-700 font-medium flex items-center gap-2"
      >
        ← Back to Help
      </button>

      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-96 object-cover rounded-lg"
        />
      )}

      <div>
        <h1 className="text-4xl font-bold mb-2">{article.title}</h1>
        <p className="text-gray-600">
          By {article.author || "Support Team"} •{" "}
          {new Date(article.updated_at).toLocaleDateString()} •{" "}
          {article.views} views
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {(article.tags || []).map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {article.content.split("\n").map((paragraph, idx) => {
          if (paragraph.startsWith("#")) {
            const level = paragraph.match(/#+/)?.[0].length || 1;
            const text = paragraph.replace(/#+\s/, "");
            const Heading = `h${level}` as const;
            return (
              <Heading key={idx} className="font-bold mt-4 mb-2">
                {text}
              </Heading>
            );
          } else if (paragraph.trim()) {
            return (
              <p key={idx} className="text-gray-700 mb-3">
                {paragraph}
              </p>
            );
          }
          return null;
        })}
      </div>

      {/* Helpful Section */}
      <Card className="p-6 bg-gray-50">
        <p className="font-semibold text-gray-900 mb-3">Was this article helpful?</p>
        <div className="flex gap-3">
          <button
            onClick={() => setHelpful("yes")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              helpful === "yes"
                ? "bg-green-100 text-green-700"
                : "bg-white text-gray-700 border hover:bg-green-50"
            }`}
          >
            <ThumbsUp size={18} />
            Yes ({article.helpful_yes})
          </button>
          <button
            onClick={() => setHelpful("no")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              helpful === "no"
                ? "bg-red-100 text-red-700"
                : "bg-white text-gray-700 border hover:bg-red-50"
            }`}
          >
            <ThumbsDown size={18} />
            No ({article.helpful_no})
          </button>
        </div>
      </Card>

      {/* Still Need Help */}
      <Card className="p-6 bg-green-50 border border-green-200">
        <h3 className="font-bold text-gray-900 mb-2">Still need help?</h3>
        <p className="text-gray-700 mb-4">
          Our support team is ready to assist you. Create a support ticket or check out our other help resources.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-green-600 hover:bg-green-700">
            Contact Support
          </Button>
          <Button variant="outline">View All Articles</Button>
        </div>
      </Card>
    </div>
  );
}
