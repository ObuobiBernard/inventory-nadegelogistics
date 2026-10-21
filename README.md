# NADEGE Logistics · Inventory Management & RMS

A modern, responsive React + TypeScript application for **NADEGE Logistics** ("An anchor in a new era").

## Features Ported & Preserved

1. **Staff Access & Security**:
   - Password-protected staff gateway with default password `nadege2025`.
   - 5-minute inactivity session timeout with 30-second warning countdown and "Stay Logged In" capability.
   - Manual "Lock Now" quick action.

2. **Dashboard Overview**:
   - Live stat metrics: Total Equipment, Available Stock, Active Rentals, and Registered Customers.
   - Chronological activity log with action timestamps and clear functionality.
   - Quick navigation into specific operational views.

3. **Equipment Inventory Management**:
   - Complete inventory tracking with stock quantities, available count, daily rental rates, and purchase sale prices.
   - Dynamic category classification (LED Screens, Sound Equipment, Stage, etc.).
   - Pre-loaded with authentic NADEGE Logistics equipment items.
   - Quick actions: Quick Rent, Quick Sell, Edit specifications, and Soft-delete / Restore.
   - Live category filter and debounced search.

4. **Rentals Management**:
   - Create rentals with automated date duration computation and total price calculation.
   - Real-time stock validation preventing reservations exceeding available inventory.
   - "Return" workflow that automatically releases reserved stock back to active inventory.
   - Rental status tracking (`Active`, `Returned`, `Reserved`, `Draft`).

5. **Sales Transactions**:
   - Record equipment purchases with instant unit-cost and total multiplication.
   - Automatic deduction from available inventory stock.
   - Customer and equipment cross-referencing.

6. **Customer Directory**:
   - Customer management with names, email, phone numbers, and company associations.

7. **Category Classification**:
   - Custom category creation and editing with icon preview.
   - Dynamic calculation of equipment counts per category.

8. **Public Customer Catalog**:
   - Customer-facing equipment showcase with hero banner and gold accent theme.
   - Category filtering pills.
   - Interactive equipment cards displaying rental and purchase rates, descriptions, and stock availability.
   - One-click navigation back to staff management portal.

9. **CSV Import**:
   - Drag-and-drop or file upload for `.csv` files.
   - Automatic category detection from filename.
   - In-modal preview table and duplicate item skipping.

10. **Google Sheets Sync**:
    - Google Apps Script Web App sync integration with webhook secret key.
    - Cooldown management (30s) and status notifications.

## Tech Stack
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom NADEGE Logistics color tokens
- **Icons**: Lucide Icons & FontAwesome
