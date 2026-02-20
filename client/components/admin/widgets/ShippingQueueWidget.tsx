import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Truck, Box, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase, extractErrorMessage } from "@/lib/supabase";
import { toast } from "sonner";

export default function ShippingQueueWidget() {
  const [shippingQueue, setShippingQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchShippingQueue();
  }, []);

  const fetchShippingQueue = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, status, created_at')
        .eq('status', 'ready-to-ship')
        .order('created_at', { ascending: true })
        .limit(5);

      if (error) throw error;
      setShippingQueue(data || []);
    } catch (error) {
      console.error("Error fetching shipping queue:", error);
      // Don't show toast for widget error to avoid cluttering dashboard
    } finally {
      setIsLoading(false);
    }
  };

  const readyToShip = shippingQueue.length;
  // Since we don't have weight in DB yet, we'll mock it for the widget
  const totalWeight = shippingQueue.length * 2.5;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Truck size={20} className="text-green-600" />
          Shipping Queue
        </h3>
        <Link
          to="/admin/shipping"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Station →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Ready</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {isLoading ? "..." : readyToShip}
          </p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-wider">Est. Weight</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {isLoading ? "..." : totalWeight.toFixed(1)} <span className="text-xs">lbs</span>
          </p>
        </div>
      </div>

      <div className="space-y-2 min-h-[100px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
          </div>
        ) : shippingQueue.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-sm text-gray-500 italic">No orders ready to ship</p>
          </div>
        ) : (
          shippingQueue.slice(0, 3).map((item) => (
            <div key={item.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border border-transparent hover:border-gray-200 transition">
              <div className="flex items-center gap-3">
                <Box size={16} className="text-gray-400" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.order_number}</p>
                  <p className="text-[10px] text-gray-500 font-medium">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-full uppercase">
                Ready
              </span>
            </div>
          ))
        )}
      </div>

      {readyToShip > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs text-blue-800 flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="font-semibold">Bulk processing</span> available for {readyToShip} orders
          </p>
        </div>
      )}
    </Card>
  );
}
