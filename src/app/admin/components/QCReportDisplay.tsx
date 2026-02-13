import StatusBadge from './StatusBadge';

export interface QCCheck {
  check_name: string;
  status: 'pass' | 'warn' | 'fail';
  value?: number | string;
  threshold?: number | string;
  message: string;
}

export interface QCReport {
  id: string;
  order_id: string;
  overall_status: 'pass' | 'warn' | 'fail';
  checks: QCCheck[];
  failure_reasons: string[];
  created_at: string;
}

interface QCReportDisplayProps {
  report: QCReport;
  showHeader?: boolean;
}

export default function QCReportDisplay({
  report,
  showHeader = true,
}: QCReportDisplayProps) {
  const getStatusColor = (status: QCCheck['status']) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 text-green-800';
      case 'warn':
        return 'bg-yellow-50 text-yellow-800';
      case 'fail':
        return 'bg-red-50 text-red-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  const getStatusIcon = (status: QCCheck['status']) => {
    switch (status) {
      case 'pass':
        return '✓';
      case 'warn':
        return '⚠';
      case 'fail':
        return '✗';
      default:
        return '?';
    }
  };

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">QC Report</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Overall Status:</span>
            <span
              className={`px-4 py-2 rounded-lg font-bold text-lg ${
                report.overall_status === 'pass'
                  ? 'bg-green-100 text-green-800'
                  : report.overall_status === 'warn'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {report.overall_status.toUpperCase()}
            </span>
          </div>
        </div>
      )}

      {report.failure_reasons && report.failure_reasons.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Failure Reasons
          </h4>
          <ul className="list-disc list-inside space-y-1 text-red-800">
            {report.failure_reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Check
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Value
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Threshold
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Message
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {report.checks.map((check, idx) => (
              <tr key={idx} className={getStatusColor(check.status)}>
                <td className="px-4 py-3 text-sm font-medium">{check.check_name}</td>
                <td className="px-4 py-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{getStatusIcon(check.status)}</span>
                    <span className="font-semibold uppercase">{check.status}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {check.value !== undefined ? check.value : 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm">
                  {check.threshold !== undefined ? check.threshold : 'N/A'}
                </td>
                <td className="px-4 py-3 text-sm">{check.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-gray-500">
        Report generated at: {new Date(report.created_at).toLocaleString()}
      </div>
    </div>
  );
}
