const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types matching backend API
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  marketing_consent: boolean;
  terms_consent: boolean;
}

export interface ColorMatch {
  glaze_id: string;
  glaze_name: string;
  color_hex: string;
  delta_e: number;
  confidence: number;
  preview_image_url?: string;
}

export interface GlazeDesignRequest {
  target_color_hex: string;
  finish: 'glossy' | 'matte' | 'satin';
  batch_size_grams: number;
  firing_temp_cone?: string;
}

export interface GlazeDesignResponse {
  primary_match: ColorMatch;
  alternatives: ColorMatch[];
  out_of_gamut: boolean;
  out_of_gamut_reason?: string;
  estimated_price: number;
}

export interface SavedGlaze {
  id: string;
  user_id: string;
  name: string;
  target_color_hex: string;
  finish: string;
  batch_size_grams: number;
  selected_match_id: string;
  is_private: boolean;
  created_at: string;
  preview_image_url?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending_payment' | 'paid' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  stripe_payment_intent_id?: string;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  glaze_id: string;
  glaze_name: string;
  batch_size_grams: number;
  unit_price: number;
  preview_image_url?: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface FulfillmentStatus {
  order_id: string;
  status: 'pending' | 'mixing' | 'quality_check' | 'packaging' | 'shipped';
  updated_at: string;
  notes?: string;
  tracking_number?: string;
  carrier?: string;
}

export interface PublicGlaze {
  id: string;
  name: string;
  color_hex: string;
  finish: string;
  preview_image_url?: string;
  rating_avg?: number;
  rating_count?: number;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  order_id?: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_type: 'user' | 'support';
  message: string;
  image_url?: string;
  created_at: string;
}

export interface CheckoutSession {
  session_id: string;
  checkout_url: string;
}

// API client class
class APIClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API error: ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  async register(data: RegisterRequest): Promise<User> {
    return this.fetch<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.fetch<User>('/auth/me');
  }

  // Design endpoints
  async findGlaze(data: GlazeDesignRequest): Promise<GlazeDesignResponse> {
    return this.fetch<GlazeDesignResponse>('/design/find-glaze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async saveGlaze(data: {
    name: string;
    target_color_hex: string;
    finish: string;
    batch_size_grams: number;
    selected_match_id: string;
    is_private: boolean;
  }): Promise<SavedGlaze> {
    return this.fetch<SavedGlaze>('/design/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserGlazes(): Promise<SavedGlaze[]> {
    return this.fetch<SavedGlaze[]>('/design/my-glazes');
  }

  // Vision board endpoints
  async getPublicGlazes(skip: number = 0, limit: number = 20): Promise<PublicGlaze[]> {
    return this.fetch<PublicGlaze[]>(`/vision-board?skip=${skip}&limit=${limit}`);
  }

  async getPublicGlaze(id: string): Promise<PublicGlaze> {
    return this.fetch<PublicGlaze>(`/vision-board/${id}`);
  }

  // Order endpoints
  async createCheckoutSession(data: {
    glaze_id: string;
    batch_size_grams: number;
    is_private: boolean;
    shipping_address: ShippingAddress;
  }): Promise<CheckoutSession> {
    return this.fetch<CheckoutSession>('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserOrders(): Promise<Order[]> {
    return this.fetch<Order[]>('/orders/my-orders');
  }

  async getOrder(id: string): Promise<Order> {
    return this.fetch<Order>(`/orders/${id}`);
  }

  async getFulfillmentStatus(orderId: string): Promise<FulfillmentStatus> {
    return this.fetch<FulfillmentStatus>(`/orders/${orderId}/fulfillment`);
  }

  // Support endpoints
  async createTicket(data: {
    subject: string;
    message: string;
    order_id?: string;
  }): Promise<SupportTicket> {
    return this.fetch<SupportTicket>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserTickets(): Promise<SupportTicket[]> {
    return this.fetch<SupportTicket[]>('/support/my-tickets');
  }

  async getTicket(id: string): Promise<SupportTicket> {
    return this.fetch<SupportTicket>(`/support/tickets/${id}`);
  }

  async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    return this.fetch<TicketMessage[]>(`/support/tickets/${ticketId}/messages`);
  }

  async addTicketMessage(ticketId: string, message: string): Promise<TicketMessage> {
    return this.fetch<TicketMessage>(`/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
}

export const api = new APIClient();
