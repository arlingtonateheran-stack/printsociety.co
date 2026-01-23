import { Card } from "@/components/ui/card";
import { PreflightResult } from "@/shared/preflight";
import { DetailedScore, getScoreGrade, getScoreTips } from "@/shared/scoreCalculator";
import {
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
  Download,
  RefreshCw,
} from "lucide-react";

interface ArtworkValidationDashboardProps {
  preflightResult: PreflightResult;
  detailedScore: DetailedScore;
  onRetry?: () => void;
}

export default function ArtworkValidationDashboard({
  preflightResult,
  detailedScore,
  onRetry,
}: ArtworkValidationDashboardProps) {
  const { metadata, errors, warnings } = preflightResult;
  const { overallScore, recommendation, readyToPrint, factors } = detailedScore;
  const grade = getScoreGrade(overallScore);
  const tips = getScoreTips(overallScore);

  return (
    <div className="w-full space-y-6">
      {/* Header with Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Score Card */}
        <Card className={`p-6 border-2 ${
          grade.color === "emerald"
            ? "border-emerald-200 bg-emerald-50"
            : grade.color === "green"
              ? "border-green-200 bg-green-50"
              : grade.color === "blue"
                ? "border-blue-200 bg-blue-50"
                : grade.color === "yellow"
                  ? "border-yellow-200 bg-yellow-50"
                  : grade.color === "orange"
                    ? "border-orange-200 bg-orange-50"
                    : "border-red-200 bg-red-50"
        }`}>
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{overallScore}</div>
            <div className="text-sm font-semibold mb-1">{grade.grade}</div>
            <div className={`text-xs font-medium ${
              grade.color === "emerald"
                ? "text-emerald-700"
                : grade.color === "green"
                  ? "text-green-700"
                  : grade.color === "blue"
                    ? "text-blue-700"
                    : grade.color === "yellow"
                      ? "text-yellow-700"
                      : grade.color === "orange"
                        ? "text-orange-700"
                        : "text-red-700"
            }`}>
              {grade.label}
            </div>
            <div className={`mt-4 text-sm font-medium ${
              readyToPrint ? "text-green-700" : "text-red-700"
            }`}>
              {readyToPrint ? "✓ Ready to Print" : "✗ Needs Review"}
            </div>
          </div>
        </Card>

        {/* Issues Summary */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Issues Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{errors.length}</div>
                <div className="text-xs text-gray-600">Critical Issues</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{warnings.length}</div>
                <div className="text-xs text-gray-600">Warnings</div>
              </div>
            </div>
          </div>
        </Card>

        {/* File Info */}
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">File Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-gray-600">File Name</div>
              <div className="text-gray-900 font-medium truncate">{metadata.filename}</div>
            </div>
            <div>
              <div className="text-gray-600">File Size</div>
              <div className="text-gray-900 font-medium">
                {(metadata.fileSize / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <div>
              <div className="text-gray-600">Resolution</div>
              <div className="text-gray-900 font-medium">{metadata.dpi} DPI</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recommendation */}
      <Card className={`p-6 border-l-4 ${
        readyToPrint ? "border-l-green-500 bg-green-50" : "border-l-red-500 bg-red-50"
      }`}>
        <h3 className={`font-semibold mb-2 ${
          readyToPrint ? "text-green-900" : "text-red-900"
        }`}>
          {readyToPrint ? "✓ Ready to Proceed" : "⚠ Action Required"}
        </h3>
        <p className={`text-sm ${readyToPrint ? "text-green-800" : "text-red-800"}`}>
          {recommendation}
        </p>
      </Card>

      {/* Factor Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Breakdown</h3>
        <div className="space-y-4">
          {factors.map((factor) => (
            <div key={factor.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{factor.name}</span>
                <span className="text-sm font-bold text-gray-900">{Math.round(factor.score)}/100</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    factor.score >= 90
                      ? "bg-green-500"
                      : factor.score >= 75
                        ? "bg-blue-500"
                        : factor.score >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, factor.score)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Critical Errors */}
      {errors.length > 0 && (
        <Card className="p-6 border-2 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">
              Critical Issues ({errors.length})
            </h3>
          </div>
          <div className="space-y-3">
            {errors.map((error, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{error.message}</p>
                    {error.suggestion && (
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Suggestion:</strong> {error.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card className="p-6 border-2 border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900">
              Warnings ({warnings.length})
            </h3>
          </div>
          <div className="space-y-3">
            {warnings.map((warning, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{warning.message}</p>
                    {warning.suggestion && (
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Suggestion:</strong> {warning.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tips */}
      {tips.length > 0 && (
        <Card className="p-6 border-2 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Recommendations</h3>
          </div>
          <ul className="space-y-2">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-blue-900">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {readyToPrint && (
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Proceed to Checkout
          </button>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Upload New File
          </button>
        )}
        <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2">
          <Download className="w-5 h-5" />
          Report
        </button>
      </div>

      {/* Metadata Grid */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Technical Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-600">Format</div>
            <div className="text-sm font-medium text-gray-900 uppercase">{metadata.fileFormat}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Dimensions</div>
            <div className="text-sm font-medium text-gray-900">
              {metadata.width} × {metadata.height}px
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Color Space</div>
            <div className="text-sm font-medium text-gray-900 uppercase">{metadata.colorSpace}</div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Transparency</div>
            <div className="text-sm font-medium text-gray-900">
              {metadata.hasAlpha ? "Yes" : "No"}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
