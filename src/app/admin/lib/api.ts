// API Client for Manufacturing Dashboard
// Centralized API functions for backend communication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Generic API call handler with error handling
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    return null;
  }
}

// Manufacturing Queue API
export const manufacturingAPI = {
  // Get queue with optional status filter
  getQueue: async (status?: string) => {
    const endpoint = status
      ? `/manufacturing/queue?status=${status}`
      : '/manufacturing/queue';
    return apiCall(endpoint);
  },

  // Get order details
  getOrder: async (orderId: string) => {
    return apiCall(`/manufacturing/orders/${orderId}`);
  },

  // Get full recipe for batching
  getRecipe: async (orderId: string) => {
    return apiCall(`/manufacturing/orders/${orderId}/recipe`);
  },

  // Start batching
  startBatch: async (
    orderId: string,
    data: { staff_initials: string; lot_number: string; notes?: string }
  ) => {
    return apiCall(`/manufacturing/orders/${orderId}/batch`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update batch weights
  updateBatch: async (batchId: string, data: any) => {
    return apiCall(`/manufacturing/batches/${batchId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Complete batch
  completeBatch: async (batchId: string) => {
    return apiCall(`/manufacturing/batches/${batchId}/complete`, {
      method: 'POST',
    });
  },

  // Generate label
  generateLabel: async (orderId: string) => {
    return apiCall(`/manufacturing/orders/${orderId}/label`, {
      method: 'POST',
    });
  },

  // Mark as shipped
  shipOrder: async (
    orderId: string,
    data: { tracking_number: string; carrier: string }
  ) => {
    return apiCall(`/manufacturing/orders/${orderId}/ship`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all orders
  getAllOrders: async () => {
    return apiCall('/manufacturing/orders');
  },

  // Get dashboard stats
  getStats: async () => {
    return apiCall('/manufacturing/stats');
  },
};

// QC Review API
export const qcAPI = {
  // Get pending QC items
  getPending: async () => {
    return apiCall('/qc/pending');
  },

  // Submit QC review
  submitReview: async (
    reportId: string,
    data: { status: 'pass' | 'fail'; notes?: string }
  ) => {
    return apiCall(`/qc/reports/${reportId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get QC report by order ID
  getReport: async (orderId: string) => {
    return apiCall(`/qc/reports/${orderId}`);
  },
};

// Authentication API (placeholder)
export const authAPI = {
  // Check current user
  me: async () => {
    return apiCall('/auth/me');
  },

  // Login
  login: async (email: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Logout
  logout: async () => {
    return apiCall('/auth/logout', {
      method: 'POST',
    });
  },
};

// Utility functions
export const utils = {
  // Truncate UUID for display
  truncateId: (id: string, length: number = 8): string => {
    return id.substring(0, length);
  },

  // Generate lot number
  generateLotNumber: (): string => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `LOT${year}${month}${day}-${random}`;
  },

  // Format date
  formatDate: (date: string | Date): string => {
    return new Date(date).toLocaleDateString();
  },

  // Format datetime
  formatDateTime: (date: string | Date): string => {
    return new Date(date).toLocaleString();
  },

  // Format weight in kg
  formatWeight: (grams: number): string => {
    return `${(grams / 1000).toFixed(1)} kg`;
  },

  // Calculate deviation percentage
  calculateDeviation: (target: number, actual: number): number => {
    if (target === 0) return 0;
    return ((actual - target) / target) * 100;
  },

  // Check if deviation exceeds threshold
  hasExcessiveDeviation: (
    target: number,
    actual: number,
    threshold: number = 2
  ): boolean => {
    const deviation = Math.abs(utils.calculateDeviation(target, actual));
    return deviation > threshold;
  },
};
