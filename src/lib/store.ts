import { create } from 'zustand';
import { GlazeDesignRequest, GlazeDesignResponse } from './api';

interface DesignState {
  currentDesign: GlazeDesignRequest | null;
  designResult: GlazeDesignResponse | null;
  selectedMatchId: string | null;
  glazeName: string;
  isPrivate: boolean;
  setCurrentDesign: (design: GlazeDesignRequest) => void;
  setDesignResult: (result: GlazeDesignResponse) => void;
  setSelectedMatchId: (id: string | null) => void;
  setGlazeName: (name: string) => void;
  setIsPrivate: (isPrivate: boolean) => void;
  reset: () => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  currentDesign: null,
  designResult: null,
  selectedMatchId: null,
  glazeName: '',
  isPrivate: false,
  setCurrentDesign: (design) => set({ currentDesign: design }),
  setDesignResult: (result) => set({
    designResult: result,
    selectedMatchId: result.primary_match.glaze_id,
  }),
  setSelectedMatchId: (id) => set({ selectedMatchId: id }),
  setGlazeName: (name) => set({ glazeName: name }),
  setIsPrivate: (isPrivate) => set({ isPrivate }),
  reset: () => set({
    currentDesign: null,
    designResult: null,
    selectedMatchId: null,
    glazeName: '',
    isPrivate: false,
  }),
}));

interface CartItem {
  glazeId: string;
  glazeName: string;
  batchSizeGrams: number;
  colorHex: string;
  isPrivate: boolean;
  price: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (glazeId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items.filter(i => i.glazeId !== item.glazeId), item],
  })),
  removeItem: (glazeId) => set((state) => ({
    items: state.items.filter(i => i.glazeId !== glazeId),
  })),
  clearCart: () => set({ items: [] }),
}));
