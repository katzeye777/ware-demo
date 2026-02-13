# Manufacturing Admin Dashboard - Quick Start Guide

## Prerequisites

1. Backend API running at `http://localhost:8000/api`
2. Node.js and npm/yarn installed
3. Next.js frontend configured

## Installation

No additional installation needed - the admin dashboard is part of the main Next.js app.

## Running the Application

```bash
# From the frontend directory
npm run dev
# or
yarn dev
```

Visit: `http://localhost:3000/admin`

## Authentication

The layout checks for user role (`staff` or `admin`). Current implementation:
- Attempts to call `/api/auth/me`
- Falls back to allowing access in development mode
- **TODO**: Implement proper authentication

To implement auth:
1. Create auth endpoint at `/api/auth/me`
2. Return user object with `role` field
3. Update `layout.tsx` to handle auth properly

## API Endpoints Required

### Essential Endpoints for MVP

```typescript
// Manufacturing
GET  /api/manufacturing/queue?status=X
GET  /api/manufacturing/orders/{id}
GET  /api/manufacturing/orders/{id}/recipe
POST /api/manufacturing/orders/{id}/batch
POST /api/manufacturing/orders/{id}/label
POST /api/manufacturing/orders/{id}/ship

// QC
GET  /api/qc/pending
POST /api/qc/reports/{id}/review
```

### Optional Endpoints

```typescript
GET  /api/manufacturing/stats
GET  /api/manufacturing/orders
PATCH /api/manufacturing/batches/{id}
POST /api/manufacturing/batches/{id}/complete
```

## Mock Data for Development

All pages include mock data fallbacks when the API is unavailable. This allows frontend development without a running backend.

To disable mock data:
- Remove the try/catch fallback in each page's fetch function
- Or configure `NEXT_PUBLIC_API_URL` environment variable

## Common Workflows

### 1. QC Review Flow
```
/admin/qc
→ Click order to expand
→ Review QC report
→ Add notes
→ Approve or Reject
```

### 2. Batching Flow
```
/admin/queue (filter: Ready to Batch)
→ Click "Start Batching"
→ /admin/queue/{orderId}/batch
→ Check ingredients
→ Enter actual weights
→ Fill staff initials and lot number
→ Complete Batch
```

### 3. Label & Ship Flow
```
/admin/queue (filter: Batched)
→ Click "Print Label"
→ /admin/queue/{orderId}/label
→ Generate Label PDF
→ Print
→ Back to queue
→ Click "Ship Order"
→ /admin/queue/{orderId}/ship
→ Enter tracking info
→ Mark as Shipped
```

## Customization

### Change Status Colors
Edit `src/app/admin/components/StatusBadge.tsx`:
```typescript
const statusConfig: Record<ManufacturingStatus, { label: string; color: string }> = {
  pending_qc: {
    label: 'Pending QC',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  },
  // ... modify colors here
};
```

### Adjust Auto-Refresh Interval
Default is 30 seconds. Change in queue pages:
```typescript
const interval = setInterval(fetchOrders, 30000); // Change to desired ms
```

### Modify Print Layout
Edit print styles in `src/app/globals.css`:
```css
@media print {
  /* Add custom print styles here */
}
```

## Environment Variables

Create `.env.local` in the frontend root:

```bash
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Optional: Enable/disable features
NEXT_PUBLIC_ENABLE_USB_SCALE=false
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## Troubleshooting

### "Recipe not found" error
- Check that the backend API is running
- Verify the order ID exists
- Check browser console for API errors

### Checkboxes not printing
- Ensure `print-color-adjust: exact` in globals.css
- Try a different browser (Chrome/Firefox have better print support)

### Status not updating
- Check auto-refresh is enabled
- Verify API endpoints are returning correct data
- Force refresh with the Refresh button

### TypeScript errors
- Run `npm run type-check` to see all type errors
- Ensure all types are imported from `types.ts`

## Testing

### Manual Testing Checklist

- [ ] Dashboard shows stats
- [ ] Queue loads and filters work
- [ ] QC review accepts/rejects orders
- [ ] Batching page calculates deviations
- [ ] Label generation works
- [ ] Shipping marks order as shipped
- [ ] Print functionality works
- [ ] Auto-refresh updates data

### Development Tips

1. **Use browser DevTools**: Network tab shows API calls
2. **React DevTools**: Inspect component state
3. **Mock different scenarios**: Edit mock data to test edge cases
4. **Test print layout**: Use browser Print Preview
5. **Test tablet view**: Use responsive design mode

## Next Steps

1. **Implement USB Scale Integration**
   - WebUSB API or native bridge
   - Update `ScaleReader.tsx`

2. **Add Toast Notifications**
   - Replace `alert()` calls
   - Use a library like react-hot-toast

3. **Implement Analytics**
   - Charts for production metrics
   - QC pass rate trends
   - Staff productivity

4. **Add Real-time Updates**
   - WebSocket connection
   - Replace polling with push updates

5. **Mobile Optimization**
   - Better responsive design for phones
   - Touch-friendly controls

## Support

For issues or questions:
1. Check the main README.md
2. Review the types.ts file for data structures
3. Check browser console for errors
4. Review API documentation
