# Ware Frontend

Custom ceramic glaze platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Color Picker:** react-colorful
- **Icons:** lucide-react
- **Payments:** Stripe

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running at `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Copy .env.local and update NEXT_PUBLIC_STRIPE_PK with your Stripe key
```

### Development

```bash
# Run development server
npm run dev

# Open http://localhost:3000 in your browser
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                       # Next.js App Router pages
│   ├── design/               # Main design tool page (STAR FEATURE)
│   │   └── components/       # Design page components
│   ├── checkout/             # Checkout flow
│   ├── orders/               # Order management
│   ├── vision-board/         # Public glaze gallery
│   ├── library/              # User's saved glazes
│   ├── support/              # Support tickets
│   ├── login/                # Authentication
│   ├── register/             # Registration
│   ├── layout.tsx            # Root layout with header/footer
│   └── page.tsx              # Landing page
│
├── components/               # Shared components
│   ├── Header.tsx            # Navigation header
│   ├── StatusBadge.tsx       # Order/ticket status badges
│   └── GlazeCard.tsx         # Glaze preview cards
│
└── lib/                      # Core libraries
    ├── api.ts                # API client with types
    ├── auth.tsx              # Auth context provider
    └── store.ts              # Zustand state stores
```

## Key Features

### Design Tool (src/app/design/page.tsx)
The centerpiece of the application featuring:
- **3-tab color picker**: Picker, Camera, and Image sampling
- **Finish selector** with fake-door pattern for coming-soon options
- **Batch size slider** with live pricing
- **Results panel** showing primary match + alternatives
- **ΔE color accuracy** visualization
- **Private glaze toggle** with add-on pricing
- **Name generator** (stub for MVP)

### Color Picker Modes
1. **Picker Tab**: HexColorPicker + RGB sliders
2. **Camera Tab**: Photo upload with color extraction
3. **Image Tab**: Upload image and click to sample color

### Vision Board
Public gallery of community glazes with:
- Grid layout with infinite scroll
- Search functionality
- Detailed glaze pages with reviews

### Order Tracking
Visual fulfillment pipeline showing:
- Order received
- Mixing glaze
- Quality check
- Packaging
- Shipped (with tracking)

### Support System
Chat-like ticket system with:
- Create tickets
- Real-time messaging
- Image attachments (UI ready)
- Status tracking

## API Integration

The frontend connects to a FastAPI backend at `http://localhost:8000/api` with endpoints for:
- Authentication (login, register)
- Glaze design (find-glaze, save)
- Orders (checkout, tracking)
- Vision board (public glazes)
- Support tickets

See `src/lib/api.ts` for complete API client implementation.

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_STRIPE_PK=pk_test_your_stripe_publishable_key
```

## Design System

### Colors
- **Brand**: Warm terracotta (#e4533d and variants)
- **Clay**: Neutral earth tones for UI
- Custom Tailwind theme in `tailwind.config.ts`

### Components
All components follow mobile-first responsive design with Tailwind utility classes.

## Authentication Flow

1. Users register with email/password + consents
2. JWT tokens stored in localStorage (refresh in httpOnly cookie for production)
3. Protected routes redirect to login
4. Auth context provides user state globally

## State Management

- **useDesignStore**: Current design, results, selected match
- **useCartStore**: Shopping cart items (stub)
- **AuthContext**: User authentication state

## Future Enhancements

- [ ] Matte and Satin finish options
- [ ] AI-powered glaze naming
- [ ] Advanced filtering on Vision Board
- [ ] Real-time order status updates via WebSocket
- [ ] Image upload for support tickets
- [ ] Shopping cart with multiple items
- [ ] User reviews and ratings
- [ ] Glaze collections/favorites

## License

Proprietary - Matt Katz / CMW
