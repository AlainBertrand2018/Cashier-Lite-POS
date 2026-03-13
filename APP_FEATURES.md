# CashierLite POS - App Features & Architecture

CashierLite is a dynamic, multi-location Point of Sale (POS) system designed for various business types, with a primary focus on Restaurant and Retail operations.

## Core Architecture

### 1. Dynamic Business Hierarchy
- **Single Business Profile**: Centralized management of business name, BRN, VAT, and contact details.
- **Multi-Location Support**: Ability to manage multiple **Permanent Outlets** and **Temporary Event/Fair** locations.
- **Location-Aware Context**: Every transaction, shift, and price can be tied to a specific location.

### 2. Product & Inventory Management
- **Hierarchical Categorization**: Support for parent/child categories (e.g., Food -> Pizza).
- **Supplier-Based Sourcing**: Products are linked to specific suppliers for better inventory tracking.
- **Base vs. Location Pricing**: Define a global base price with the ability to override prices for specific locations (Dynamic Pricing).

### 3. Shift & Order Processing
- **Active Shift Management**: Cashiers log in with a PIN and float amount to start a shift at a specific location.
- **Real-time Order Summary**: Interactive basket with quantity adjustments and category-linked item details.
- **Wait-list/Hold Support**: (Planned) architecture supports pending orders.

### 4. POS Interface
- **Category-Centric Menu**: Optimized for quick selection in high-volume environments (Restaurants/Cafes).
- **Adaptive Product Grid**: Responsive layout for browsing products within categories.

### 5. Reporting & Printing
- **Business-Branded Receipts**: Receipts automatically include the Business Profile headers and Location-specific footers.
- **Inventory Reports**: View stock levels and supplier information.

## Technology Stack
- **Framework**: Next.js 16 (App Router)
- **State Management**: Zustand (Persisted via LocalStorage for offline-first resilience)
- **UI Components**: Shadcn/UI (Radix UI + Tailwind CSS)
- **Validation**: Zod + React Hook Form
- **AI Integration**: Genkit (Ready for AI-driven insights and automated categorization)

## Deployment Compliance
- **Decoupled Backend**: Currently runs on a mock-data layer for rapid prototyping and offline development.
- **Git Independent**: Detached from original upstream for custom enterprise distribution.
- **Next.js 16 Ready**: Upgraded for the latest performance and Turbopack features.
