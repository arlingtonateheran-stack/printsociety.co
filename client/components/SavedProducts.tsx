import { useState } from "react";
import { SavedProduct } from "@shared/account";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";

interface SavedProductsProps {
  savedProducts: SavedProduct[];
  onCreateOrder?: (productId: string, specs: any) => void;
  onRemove?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export function SavedProducts({
  savedProducts,
  onCreateOrder,
  onRemove,
  onToggleFavorite,
}: SavedProductsProps) {
  const [favorites, setFavorites] = useState(
    savedProducts.filter((p) => p.isFavorite).map((p) => p.id)
  );

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
    onToggleFavorite?.(id);
  };

  const favoriteProducts = savedProducts.filter((p) => favorites.includes(p.id));
  const otherProducts = savedProducts.filter((p) => !favorites.includes(p.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Saved Products</h2>
        <p className="text-gray-600">
          Quick-start your favorite products with saved specifications
        </p>
      </div>

      {savedProducts.length === 0 ? (
        <Card className="p-8 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Saved Products
          </h3>
          <p className="text-gray-500 mb-6">
            Save your favorite product configurations for quick reordering
          </p>
          <Button className="bg-green-600 hover:bg-green-700">
            Browse Products
          </Button>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Favorites */}
          {favoriteProducts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart size={20} className="text-red-500 fill-red-500" />
                <h3 className="text-lg font-semibold">
                  Favorites ({favoriteProducts.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={true}
                    onToggleFavorite={toggleFavorite}
                    onCreateOrder={onCreateOrder}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Saved Products */}
          {otherProducts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Other Saved Products ({otherProducts.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={false}
                    onToggleFavorite={toggleFavorite}
                    onCreateOrder={onCreateOrder}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: SavedProduct;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCreateOrder?: (productId: string, specs: any) => void;
  onRemove?: (id: string) => void;
}

function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onCreateOrder,
  onRemove,
}: ProductCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{product.productName}</h4>
          {product.notes && (
            <p className="text-xs text-gray-500 mt-1">{product.notes}</p>
          )}
        </div>
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="p-1 hover:bg-gray-100 rounded transition"
        >
          <Heart
            size={18}
            className={
              isFavorite
                ? "text-red-500 fill-red-500"
                : "text-gray-400"
            }
          />
        </button>
      </div>

      {/* Specifications */}
      <div className="mb-4 pb-4 border-b space-y-1 text-sm text-gray-600 flex-1">
        <p>
          <span className="font-medium text-gray-700">Size:</span>{" "}
          {product.specifications.size}
        </p>
        <p>
          <span className="font-medium text-gray-700">Material:</span>{" "}
          {product.specifications.material}
        </p>
        <p>
          <span className="font-medium text-gray-700">Finish:</span>{" "}
          {product.specifications.finish}
        </p>
        {product.specifications.quantity && (
          <p>
            <span className="font-medium text-gray-700">Quantity:</span>{" "}
            {product.specifications.quantity}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={() =>
            onCreateOrder?.(product.productId, product.specifications)
          }
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <ShoppingCart size={16} className="mr-1" />
          Order
        </Button>
        <button
          onClick={() => onRemove?.(product.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </Card>
  );
}
