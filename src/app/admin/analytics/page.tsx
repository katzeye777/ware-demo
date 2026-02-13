'use client';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manufacturing Analytics</h1>
        <p className="text-gray-600 mt-2">Production metrics and insights</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <div className="text-6xl mb-4">📈</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Coming Soon</h2>
        <p className="text-gray-600 mb-6">
          Manufacturing analytics, production metrics, and performance insights will be available in a future update.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 text-left max-w-3xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Production Metrics</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Batches per day</li>
              <li>• Average batch time</li>
              <li>• Material usage trends</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Quality Control</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• QC pass rates</li>
              <li>• Common failure reasons</li>
              <li>• Override frequency</li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Order fulfillment time</li>
              <li>• Pipeline bottlenecks</li>
              <li>• Staff productivity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
