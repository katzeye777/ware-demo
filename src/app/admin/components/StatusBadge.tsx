export type ManufacturingStatus =
  | 'pending_qc'
  | 'qc_passed'
  | 'qc_needs_review'
  | 'qc_failed'
  | 'sds_ready'
  | 'ready_to_batch'
  | 'batched'
  | 'labeled'
  | 'shipped'
  | 'delivered';

interface StatusBadgeProps {
  status: ManufacturingStatus;
  className?: string;
}

const statusConfig: Record<
  ManufacturingStatus,
  { label: string; color: string }
> = {
  pending_qc: {
    label: 'Pending QC',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  qc_passed: {
    label: 'QC Passed',
    color: 'bg-green-100 text-green-800 border-green-300',
  },
  qc_needs_review: {
    label: 'QC Review',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  qc_failed: {
    label: 'QC Failed',
    color: 'bg-red-100 text-red-800 border-red-300',
  },
  sds_ready: {
    label: 'SDS Ready',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
  },
  ready_to_batch: {
    label: 'Ready to Batch',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
  },
  batched: {
    label: 'Batched',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  },
  labeled: {
    label: 'Labeled',
    color: 'bg-teal-100 text-teal-800 border-teal-300',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
  },
};

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
}
