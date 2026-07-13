# Technical Plan: Table Filter Query Parameters

**Task ID:** table-filter-query-params
**Status:** Ready for Implementation
**Based on:** spec.md, research.md

---

## 1. System Architecture

### Overview

The table filter architecture follows a unidirectional data flow:

```
Filter Component (UI)
  └─ calls table.filter({ key: value })
       └─ stored in Redux table state
            └─ merged with lockedFilter
                 └─ passed as query params to API:
                      GET /endpoint?page=1&limit=10&key=value
```

The `buildParams()` function in `src/services/table/api.tsx` constructs the final query by merging `{ page, limit, search, order_by, ...lockedFilter, ...filter }`, stripping empty/null values.

### Key Integration Points

| Layer | File | Role |
|-------|------|------|
| API | `src/services/table/api.tsx` | `buildParams()` merges lockedFilter + filter |
| State | `src/services/table/hooks.tsx` | `onFilter()` merges and dispatches |
| Config | `src/pages/*/table/*.config.tsx` | Defines URL, optional lockedFilter |
| Filter UI | `src/pages/*/table/*.filter.tsx` | User-facing filter controls |

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Filter pattern | 3 established patterns (static select, RemoteSelect API, DateRange) | Consistency across codebase; all existing filters follow these |
| Param cleanup | Remove extra params rather than add to contract | Contract is source of truth; backend ignores unknown params |
| New filter files | Create adjacent to existing table files | Follows project convention: `table/[entity].filter.tsx` |
| Filter registration | Via config file `filter:` property | Existing pattern — no routing changes needed |
| State restoration | Read from `table.State.filter` on mount | Existing pattern using `useMemo` + `useState` initializer |

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| UI Components | `RemoteSelect`, `DatePicker` from `@/components/ui` | Already used across codebase |
| State | Redux (via `table.State.filter`) | Existing table state management |
| API hooks | `useOutlet`, `useWarehouse`, `useSupplier`, etc. from `@/services/*/hooks` | Existing service hooks |
| Options | Static arrays from `@/utils/options` + inline definitions | Existing pattern |
| Types | `SelectOptionValue` from `@/services/types/table` | Existing type |

---

## 3. Component Design

### 3.1 Pattern A: Static Select (Status/Dropdown)

**Used for:** `document_status`, `payment_status`, `is_active`, `type`, `periode_type`

**Implementation template:**
```tsx
<RemoteSelect<SelectOptionValue>
  placeholder="Status: All"
  data={optionsArray}
  value={stateValue}
  onChange={(val) => {
    setStateValue(val);
    applyFilters({ field_name: val?.value || "" });
  }}
  onClear={() => {
    setStateValue(null);
    applyFilters({ field_name: "" });
  }}
  getLabel={(item) => (item ? `Label: ${item.label}` : "")}
  renderItem={(item) => item?.label}
/>
```

### 3.2 Pattern B: RemoteSelect from API

**Used for:** `outlet_id`, `warehouse_id`, `supplier_id`, `category_id`, `usergroup_id`, `item_id`

**Implementation template:**
```tsx
// Preload on mount:
useEffect(() => {
  getEntity({ page: 1, limit: 20, status: "active" });
}, []);

// Restore from current filter:
useEffect(() => {
  if (current.entity_id && getResult?.data?.data) {
    const items = getResult.data.data as any[];
    const found = items.find((c) => c.id === current.entity_id);
    if (found) setEntity(found);
  } else if (!current.entity_id) {
    setEntity(null);
  }
}, [current.entity_id, getResult?.data?.data]);

<RemoteSelect
  placeholder="Entity: All"
  value={entity}
  onChange={(val) => applyFilters({ entity_id: val?.id || "" })}
  onClear={() => applyFilters({ entity_id: "" })}
  fetchData={(page, search) => getEntity({ page: page || 1, limit: 20, search })}
  hook={getResult as any}
  getLabel={(item) => item?.name}
  renderItem={(item) => item?.name}
  getValue={(item) => item.id}
/>
```

### 3.3 Pattern C: DateRange

**Used for:** `start_date` + `end_date`

**Implementation template:**
```tsx
const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | undefined>(() => {
  const start = current.start_date as string | undefined;
  const end = current.end_date as string | undefined;
  if (start && end) return [dayjs(start), dayjs(end)];
  return undefined;
});

const handleDateChange = (date: Dayjs | [Dayjs | null, Dayjs | null] | null) => {
  let newRange: [Dayjs | null, Dayjs | null] = [null, null];
  if (Array.isArray(date)) newRange = date;
  setDateRange(newRange);
  if ((newRange[0] && newRange[1]) || (!newRange[0] && !newRange[1])) {
    applyFilters({
      start_date: newRange[0]?.format("YYYY-MM-DD") || "",
      end_date: newRange[1]?.format("YYYY-MM-DD") || "",
    });
  }
};
```

---

## 4. Data Model

### Filter State Shape (per endpoint)

```typescript
interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  document_status?: string;
  payment_status?: string;
  outlet_id?: string;
  warehouse_id?: string;
  supplier_id?: string;
  category_id?: string;
  usergroup_id?: string;
  item_id?: string;
  type?: string;
  item_type?: string;
  category?: string;
  outlet_type_id?: string;
  is_active?: string;       // "true" | "false" | ""
  start_date?: string;      // YYYY-MM-DD
  end_date?: string;        // YYYY-MM-DD
  periode?: string;
  periode_type?: string;
  production_date?: string;
  order_by?: string;
}
```

### API Hook Mapping

| Select Field | Hook/Service | Endpoint |
|-------------|-------------|----------|
| `outlet_id` | `useOutlet()` | `GET /outlet?status=active` |
| `warehouse_id` | `useWarehouse()` | `GET /warehouse` |
| `supplier_id` | `useSupplier()` | `GET /supplier?status=active` |
| `category_id` | `usePosCategory()` | `GET /pos/category` |
| `usergroup_id` | `useUsergroup()` | `GET /user/usergroup` |
| `item_id` | `useItem()` | `GET /inventory/item` |
| `outlet_type_id` | `useOutletType()` | `GET /outlet/type` |

---

## 5. Existing Contracts & File Mapping

### 5.1 Files to Modify (4 existing filters with missing params)

| File | Missing Params to Add |
|------|----------------------|
| `src/pages/sales/order/table/order.filter.tsx` | `outlet_id`, `warehouse_id`; Remove `fulfillment_status` |
| `src/pages/production/plan/table/plan.filter.tsx` | `outlet_id` |
| `src/pages/inventory/item/table/item.filter.tsx` | `type`, `category` |
| `src/pages/inventory/catalog/table/catalog.filter.tsx` | `item_type` |

### 5.2 Files to Remove Extra Params Only

| File | Extra Param to Remove |
|------|----------------------|
| `src/pages/sales/order/table/order.filter.tsx` | `fulfillment_status` (also modify above) |
| `src/pages/sales/return/table/return.filter.tsx` | `date` |

### 5.3 Files to Create (new filter components)

| File | Params |
|------|--------|
| `src/pages/setting/outlet/table/outlet.filter.tsx` | `outlet_type_id`, `is_active` |
| `src/pages/setting/outlet/type/table/type.filter.tsx` | `is_active` |
| `src/pages/setting/pos/channel/table/channel.filter.tsx` | `is_active` |
| `src/pages/supplier/table/supplier.filter.tsx` | `is_active`, `type` |
| `src/pages/user/table/user.filter.tsx` | `usergroup_id`, `is_active` |
| `src/pages/withdrawal/request/table/request.filter.tsx` | `document_status`, `outlet_id` |
| `src/pages/outlet/topup/table/topup.filter.tsx` | `document_status`, `outlet_id` |
| `src/pages/b2b/order/table/order.filter.tsx` | `document_status`, `start_date`, `end_date` |
| `src/pages/report/warehouse-stock/table/stock.filter.tsx` | `warehouse_id`, `item_id` |

### 5.4 Files to Replace Empty Placeholders

| File | Params to Add |
|------|--------------|
| `src/pages/setting/pos/menu/table/menu.filter.tsx` | `category_id`, `is_active` |
| `src/pages/setting/pos/category/table/category.filter.tsx` | `is_active` |
| `src/pages/setting/pos/payment/table/payment.filter.tsx` | `is_active` |
| `src/pages/purchase/order/table/order.filter.tsx` | `document_status`, `outlet_id`, `supplier_id`, `start_date`, `end_date` |

### 5.5 Report Filters to Update

| File | Params to Add |
|------|--------------|
| `src/pages/report/table/pos-outstanding.filter.tsx` | `outlet_id` |
| `src/pages/report/table/product-sales.filter.tsx` | `outlet_id` |
| `src/pages/report/table/settlement.filter.tsx` | `periode`, `periode_type` |
| `src/pages/production/demand/table/production.filter.tsx` | `outlet_id` |

---

## 6. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Filter param injection | `buildParams()` strips empty/null values; no raw user input eval |
| Unauthorized data access | Filter params only narrow results; auth is server-side |
| Exposed internal IDs | `outlet_id` etc. are UUIDs; no sequential IDs to enumerate |

---

## 7. Performance Strategy

| Aspect | Approach |
|--------|----------|
| RemoteSelect search | Debounced (handled by component), limit 20 items |
| Preload data | First page fetched on mount for RemoteSelect |
| Filter state | Redux-based, no URL sync needed per spec |
| Empty string params | Stripped by `buildParams()` — no unnecessary query params |

---

## 8. Implementation Phases

### Phase 1: Cleanup Extra Params (2 files)

- [ ] Remove `fulfillment_status` from `src/pages/sales/order/table/order.filter.tsx`
- [ ] Remove `date` from `src/pages/sales/return/table/return.filter.tsx`

### Phase 2: Add Missing Params to Existing Filters (4 files)

- [ ] Add `outlet_id` + `warehouse_id` to sales/order filter (after cleanup)
- [ ] Add `outlet_id` to production/plan filter
- [ ] Add `type` + `category` to inventory/item filter
- [ ] Add `item_type` to inventory/catalog filter

### Phase 3: Replace Empty Placeholders (4 files)

- [ ] Add `category_id` + `is_active` to pos/menu filter
- [ ] Add `is_active` to pos/category filter
- [ ] Add `is_active` to payment/method filter
- [ ] Add full filter (document_status, outlet_id, supplier_id, date range) to purchase/order

### Phase 4: New Filter Components — Simple (6 files)

- [ ] Create outlet filter (`outlet_type_id`, `is_active`)
- [ ] Create outlet/type filter (`is_active`)
- [ ] Create pos/channel filter (`is_active`)
- [ ] Create supplier filter (`is_active`, `type`)
- [ ] Create user filter (`usergroup_id`, `is_active`)
- [ ] Create member/topup-bonus filter (`is_active`)

### Phase 5: New Filter Components — Full (4 files)

- [ ] Create withdrawal-request filter (`document_status`, `outlet_id`)
- [ ] Create outlet-topup-request filter (`document_status`, `outlet_id`)
- [ ] Create b2b/order filter (`document_status`, `start_date`, `end_date`)
- [ ] Create warehouse-stock report filter (`warehouse_id`, `item_id`)

### Phase 6: Update Report Filters (4 files)

- [ ] Add `outlet_id` to pos-outstanding report
- [ ] Add `outlet_id` to product-sales report
- [ ] Add `periode` + `periode_type` to pos-settlement report
- [ ] Add `outlet_id` to demand/production filter

---

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| RemoteSelect API hook doesn't exist for some entities | High — blocks filter | Medium | Check existing hooks first; create data-fetching inline if needed |
| Config files don't register filter prop | Medium — filter not rendered | Low | Every filter needs config `filter:` prop verified |
| Extra `fulfillment_status` being used elsewhere | Low | Low | Grep for usage before removing |
| `category` filter on inventory/item — no API endpoint | Medium | Medium | Use static options or confirm with backend |
| `periode` field format unclear | Medium | Low | Text input + date picker; confirm in review |

---

## 10. Open Questions

- [ ] `category` on `GET /inventory/item` — is there a category endpoint or static list? Answer: /pos/category.
- [ ] `periode` format for `GET /report/pos-settlement` — date string, month string? Answer: "YYYY-MM" format.
- [ ] `item_id` for `GET /report/warehouse-stock` — use existing `useItem()` hook? Answer: yes.

---

## Next Steps

1. Review plan
2. Run `/tasks table-filter-query-params` to generate task breakdown
3. Run `/implement table-filter-query-params` to start building
