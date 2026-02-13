# Ware Manufacturing Admin Dashboard

## Overview

This is the staff/admin-only manufacturing dashboard for managing the glaze production pipeline. The dashboard provides a complete workflow from QC review through batching, labeling, and shipping.

## Directory Structure

```
admin/
├── layout.tsx                 # Admin layout with sidebar navigation
├── page.tsx                   # Dashboard overview with stats
├── types.ts                   # Shared TypeScript types
├── components/
│   ├── StatusBadge.tsx       # Color-coded status badges
│   ├── QCReportDisplay.tsx   # QC report display component
│   ├── RecipeChecklist.tsx   # Recipe checklist with weight tracking
│   └── ScaleReader.tsx       # USB scale integration (stub)
├── queue/
│   ├── page.tsx              # Main manufacturing queue table
│   └── [orderId]/
│       ├── batch/
│       │   └── page.tsx      # Batching page with recipe checklist
│       ├── label/
│       │   └── page.tsx      # Label generation and print
│       └── ship/
│           └── page.tsx      # Shipping with tracking info
├── qc/
│   └── page.tsx              # QC review queue
├── orders/
│   └── page.tsx              # All orders search and list
└── analytics/
    └── page.tsx              # Analytics (stub)
```

## Pages

### Dashboard (`/admin`)
- Stats cards: Orders Today, Pending QC, Ready to Batch, Shipped Today
- Quick links to each pipeline stage
- Recent activity feed (stub)

### Manufacturing Queue (`/admin/queue`)
**THE MAIN MANUFACTURING VIEW**

- Filterable table view of all orders in the pipeline
- Status filter tabs: All | Pending QC | QC Passed | Ready to Batch | Batched | Labeled | Shipped
- Action buttons for each order based on status
- Auto-refresh every 30 seconds
- Color-coded status badges

### Batching Page (`/admin/queue/[orderId]/batch`)
**CRITICAL MANUFACTURING VIEW**

- Full recipe display with checklist format
- Three sections:
  1. Base Glaze Ingredients - table with target/actual weights and deviation calculation
  2. Stain Additions - same format for active stains
  3. Water - target weight with notes display
- Each ingredient has checkbox + actual weight input
- Deviation auto-calculates and highlights red if > 2%
- Lot number field (auto-generated, editable)
- Staff initials field
- Notes textarea
- Water content notes in blue info box
- Firing instructions card
- USB Scale Integration section (stub)
- Print-friendly layout with @media print styles
- "Complete Batch" button (requires all checkboxes checked)

### Label Page (`/admin/queue/[orderId]/label`)
- Label preview (HTML or embedded PDF)
- "Generate Label" button → calls API
- "Print" button → window.print()
- "Download PDF" link

### Shipping Page (`/admin/queue/[orderId]/ship`)
- Order summary (glaze name, batch size, customer)
- Tracking number input
- Carrier dropdown (USPS, UPS, FedEx, DHL)
- "Mark as Shipped" button
- Confirmation with tracking info

### QC Review (`/admin/qc`)
- Table of orders needing QC review
- Expandable rows showing full QC report
- Individual check results with pass/warn/fail status
- "Approve (Override)" and "Reject" buttons
- Notes textarea for review decisions
- Warning banner for FAIL items

### Orders (`/admin/orders`)
- Searchable table of all orders
- Filter by glaze name, customer name, or order ID
- View details and link to queue

### Analytics (`/admin/analytics`)
- Stub page for future analytics features
- Planned: Production metrics, QC stats, performance insights

## Components

### StatusBadge
Manufacturing status badge with color coding:
- `pending_qc`: yellow
- `qc_passed`: green
- `qc_needs_review`: orange
- `sds_ready`: blue
- `ready_to_batch`: purple
- `batched`: indigo
- `labeled`: teal
- `shipped`: emerald
- `delivered`: gray

### QCReportDisplay
Renders a QC report with:
- Overall status (large badge)
- Individual checks table: Check Name | Status | Value | Threshold | Message
- Pass checks in green, warn in yellow, fail in red
- Failure reasons highlighted

### RecipeChecklist
Reusable recipe checklist component:
- Takes recipe data (ingredients + target weights)
- Renders as form with checkboxes + weight inputs
- Calculates deviations in real-time
- Handles form state
- Callback for parent component updates

### ScaleReader
Placeholder for USB scale integration:
- "Connect Scale" button (disabled with "Coming Soon" tooltip)
- Interface definition for ScaleReading
- Comment explaining future driver interface pattern
- When connected (stub): live weight display, tare button

## Backend API Integration

All components connect to the backend API at `http://localhost:8000/api`:

### Manufacturing Endpoints
- `GET /api/manufacturing/queue?status=X` - Get pipeline queue
- `GET /api/manufacturing/orders/{id}` - Get order details
- `GET /api/manufacturing/orders/{id}/recipe` - Get full recipe for batching
- `POST /api/manufacturing/orders/{id}/batch` - Start batching
  - Body: `{ staff_initials, lot_number, notes? }`
- `PATCH /api/manufacturing/batches/{id}` - Update actual weights
- `POST /api/manufacturing/batches/{id}/complete` - Complete batch
- `POST /api/manufacturing/orders/{id}/label` - Generate label
- `POST /api/manufacturing/orders/{id}/ship` - Mark shipped
  - Body: `{ tracking_number, carrier }`

### QC Endpoints
- `GET /api/qc/pending` - List QC pending items
- `POST /api/qc/reports/{id}/review` - Submit QC review
  - Body: `{ status: 'pass' | 'fail', notes? }`

## Design Notes

### Manufacturing Environment Optimization
- High contrast colors for visibility
- Large touch targets for tablet use
- Clear typography with good spacing
- Auto-refresh for real-time updates
- Print-friendly layouts where needed

### TypeScript Types
All data structures are fully typed in `types.ts`. Components use these shared types for consistency.

### Error Handling
- All API calls have try/catch blocks
- Mock data provided for development when API is unavailable
- User-friendly error messages via alerts (TODO: replace with toast notifications)

### Future Enhancements
1. USB Scale Integration - WebUSB API or native bridge
2. Toast notifications instead of alerts
3. Real-time WebSocket updates instead of polling
4. Analytics dashboard with charts
5. Batch history and audit trail
6. PDF label generation on backend
7. Email notifications for status changes
8. Mobile-responsive improvements
