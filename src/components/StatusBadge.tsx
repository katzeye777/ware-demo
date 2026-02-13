interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'fulfillment' | 'ticket';
}

export default function StatusBadge({ status, type = 'order' }: StatusBadgeProps) {
  const getStatusColor = () => {
    const normalizedStatus = status.toLowerCase().replace(/_/g, ' ');

    // Order statuses
    if (type === 'order') {
      switch (status) {
        case 'pending_payment':
          return 'bg-yellow-100 text-yellow-800';
        case 'paid':
          return 'bg-blue-100 text-blue-800';
        case 'in_production':
          return 'bg-purple-100 text-purple-800';
        case 'shipped':
          return 'bg-indigo-100 text-indigo-800';
        case 'delivered':
          return 'bg-green-100 text-green-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }

    // Fulfillment statuses
    if (type === 'fulfillment') {
      switch (status) {
        case 'pending':
          return 'bg-gray-100 text-gray-800';
        case 'mixing':
          return 'bg-blue-100 text-blue-800';
        case 'quality_check':
          return 'bg-purple-100 text-purple-800';
        case 'packaging':
          return 'bg-indigo-100 text-indigo-800';
        case 'shipped':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }

    // Ticket statuses
    if (type === 'ticket') {
      switch (status) {
        case 'open':
          return 'bg-yellow-100 text-yellow-800';
        case 'in_progress':
          return 'bg-blue-100 text-blue-800';
        case 'resolved':
          return 'bg-green-100 text-green-800';
        case 'closed':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }

    return 'bg-gray-100 text-gray-800';
  };

  const formatStatus = () => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {formatStatus()}
    </span>
  );
}
