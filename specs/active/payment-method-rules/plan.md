# Plan: Payment Method Provider Rules Implementation

## Goal
Implement provider-specific rules for payment methods, including auto-filling names and conditional field visibility.

## Changes
1. **Constants**: Define `bankOptions` (BCA, Mandiri, BNI, BRI).
2. **State Management**: Update `formData` and `provider` state to handle auto-fill and field validation.
3. **UI Updates**:
   - Auto-fill `name` for `cash` ("Cash") and `qris` ("QRIS").
   - Dropdown for `name` for `manual` and `midtrans` using `bankOptions`.
   - Free text for `other`.
   - Only show `account_name` and `account_number` for `manual` provider.

## Implementation Steps
1. Update `src/pages/setting/pos/payment/index.tsx` with new logic.
2. Verify the form behavior for each provider type.
3. Update `PaymentMethodCreateRequest` and `PaymentMethodUpdateRequest` in `src/services/types/pos.ts` if needed (currently seems fine).