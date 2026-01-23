import { Card } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const proofQueue = [
  { id: 1, orderNum: "ORD-001", customer: "Acme Corp", time: "2h ago", status: "pending" },
  { id: 2, orderNum: "ORD-005", customer: "Design Studio", time: "5h ago", status: "pending" },
  { id: 3, orderNum: "ORD-008", customer: "Brand Co", time: "12h ago", status: "overdue" },
  { id: 4, orderNum: "ORD-012", customer: "Creative Labs", time: "1d ago", status: "overdue" },
  { id: 5, orderNum: "ORD-015", customer: "Art House", time: "2d ago", status: "critical" },
];

export default function ProofQueueWidget() {
  const pending = proofQueue.filter((p) => p.status === "pending").length;
  const overdue = proofQueue.filter((p) => p.status === "overdue" || p.status === "critical").length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Proof Approval Queue</h3>
        <Link
          to="/admin/orders"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          Manage →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-gray-600 text-xs font-medium">Pending</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{pending}</p>
        </div>
        <div className="p-3 bg-red-50 rounded-lg">
          <p className="text-gray-600 text-xs font-medium">Overdue</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{overdue}</p>
        </div>
      </div>

      <div className="space-y-2">
        {proofQueue.slice(0, 3).map((proof) => (
          <div
            key={proof.id}
            className={`p-3 rounded-lg flex items-start justify-between ${
              proof.status === "critical"
                ? "bg-red-50 border border-red-200"
                : proof.status === "overdue"
                  ? "bg-orange-50 border border-orange-200"
                  : "bg-gray-50"
            }`}
          >
            <div>
              <p className="font-medium text-gray-900 text-sm">{proof.orderNum}</p>
              <p className="text-xs text-gray-600 mt-0.5">{proof.customer}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Clock size={12} />
                {proof.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-start gap-2">
        <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-yellow-800">
          <span className="font-semibold">{overdue} overdue proofs</span> awaiting customer approval
        </p>
      </div>
    </Card>
  );
}
