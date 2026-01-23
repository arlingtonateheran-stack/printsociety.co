import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { proofStatusColors } from "@shared/proofs";

interface Proof {
  id: string;
  proofNumber: string;
  productName: string;
  currentStatus: string;
  totalRevisions: number;
  maxRevisionsAllowed: number;
  approvalDeadline: Date;
  firstSentAt: Date;
}

interface ProofApprovalsSectionProps {
  pendingProofs: Proof[];
  pastProofs: Proof[];
}

export function ProofApprovalsSection({
  pendingProofs,
  pastProofs,
}: ProofApprovalsSectionProps) {
  const isDeadlineApproaching = (deadline: Date) => {
    const now = new Date();
    const hoursUntilDeadline =
      (new Date(deadline).getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilDeadline < 48 && hoursUntilDeadline > 0;
  };

  const isDeadlinePassed = (deadline: Date) => {
    return new Date() > new Date(deadline);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Proof Approvals</h2>
        <p className="text-gray-600">
          Review and approve your designs before production
        </p>
      </div>

      {/* Pending Proofs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Pending Approval ({pendingProofs.length})
        </h3>

        {pendingProofs.length === 0 ? (
          <Card className="p-8 text-center">
            <CheckCircle size={48} className="mx-auto text-green-300 mb-4" />
            <h4 className="font-semibold text-gray-600 mb-2">
              All Caught Up!
            </h4>
            <p className="text-gray-500">
              No pending proofs waiting for your approval
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingProofs.map((proof) => {
              const colors = proofStatusColors[proof.currentStatus as any];
              const deadlineApproaching = isDeadlineApproaching(
                proof.approvalDeadline
              );
              const deadlinePassed = isDeadlinePassed(proof.approvalDeadline);

              return (
                <Card
                  key={proof.id}
                  className="p-6 border-l-4"
                  style={{
                    borderLeftColor: deadlinePassed
                      ? "#dc2626"
                      : deadlineApproaching
                        ? "#f59e0b"
                        : "#3b82f6",
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-lg">
                        {proof.proofNumber}
                      </h4>
                      <p className="text-gray-600">{proof.productName}</p>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-full text-sm font-medium ${colors.bg} ${colors.text}`}
                    >
                      {colors.label}
                    </div>
                  </div>

                  {/* Revision Info */}
                  <div className="mb-4 pb-4 border-b">
                    <p className="text-sm text-gray-600">
                      Revisions Used: {proof.totalRevisions} of{" "}
                      {proof.maxRevisionsAllowed}
                    </p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition"
                        style={{
                          width: `${(proof.totalRevisions / proof.maxRevisionsAllowed) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Deadline Alert */}
                  {deadlinePassed ? (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                      <AlertCircle size={16} className="text-red-600" />
                      <p className="text-sm text-red-700 font-medium">
                        Approval deadline has passed
                      </p>
                    </div>
                  ) : deadlineApproaching ? (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                      <Clock size={16} className="text-yellow-600" />
                      <p className="text-sm text-yellow-700 font-medium">
                        Approval needed by{" "}
                        {new Date(proof.approvalDeadline).toLocaleDateString()}
                      </p>
                    </div>
                  ) : null}

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" className="sm:flex-1">
                      Request Revision
                    </Button>
                    <Button className="sm:flex-1 bg-green-600 hover:bg-green-700">
                      Approve Proof
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Proofs */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Past Proofs ({pastProofs.length})
        </h3>

        {pastProofs.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No past proofs to display</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {pastProofs.map((proof) => {
              const colors = proofStatusColors[proof.currentStatus as any];

              return (
                <Card key={proof.id} className="p-4 hover:shadow-md transition">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h5 className="font-semibold">{proof.proofNumber}</h5>
                      <p className="text-sm text-gray-600">
                        {proof.productName} •{" "}
                        {new Date(proof.firstSentAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-full text-sm font-medium w-fit ${colors.bg} ${colors.text}`}
                    >
                      {colors.label}
                    </div>

                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
