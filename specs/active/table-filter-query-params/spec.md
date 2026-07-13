# Specification: Table Filter Query Parameters

**Task ID:** table-filter-query-params
**Created:** 2026-07-09
**Status:** Ready for Planning
**Version:** 1.0
**Source of Truth:** `specs/api-contract.md`

---

## 1. Problem Statement

- **The Problem:** Frontend table filter components send wrong query parameter names, missing parameters, or extra parameters that don't match the API contract. Some modules have no filter UI at all despite the backend supporting rich filtering. This causes filters to silently fail (backend ignores unrecognized params) and users can't filter data effectively.
- **Current Situation:** Audit revealed 3 param name mismatches (fixed), 2 extra unsupported params, 9 modules with zero filter components, and 6 missing contract params in existing filters.
- **Desired Outcome:** Every table filter component sends exactly the query parameters the API contract specifies, using correct names and data types. No extra params. All contract-available filters are exposed in the UI where practical.

---

## 2. Current Filter Patterns (Established Conventions)

### Pattern A: Static Options Select (Status/Dropdown filters)

Used when filter values come from a static options array defined in the codebase.

**Files:**
- `src/pages/production/plan/table/plan.filter.tsx`
- `src/pages/sales/order/table/order.filter.tsx`

**Structure:**
```tsx
import { RemoteSelect } from "@/components/ui";
import { productionPlanStatusOptions } from "@/utils/options";

// Static data source:
<RemoteSelect<SelectOptionValue>
  placeholder="Status: All"
  data={productionPlanStatusOptions}     // static array
  value={status}
  onChange={(val) => applyFilters({ document_status: val?.value || "" })}
  onClear={() => applyFilters({ document_status: "" })}
  getLabel={(item) => item ? `Status: ${item.label}` : ""}
  renderItem={(item) => item?.label}
/>
```

**How `applyFilters` works:**
```tsx
const applyFilters = (updates: any) => {
  const filters = {
    document_status: status?.value ?? "",
    ...updates,
  };
  table.filter(filters);
};
```

### Pattern B: RemoteSelect from API

Used when filter options come from a backend endpoint (e.g. outlet list, user list).

**Files:**
- `src/pages/report/table/settlement.filter.tsx`
- `src/pages/inventory/item/table/item.filter.tsx`

**Structure:**
```tsx
import { RemoteSelect } from "@/components/ui";
import { useOutlet } from "@/services/outlet/hooks";

const { get: getOutlet, getResult } = useOutlet();

// Preload on mount:
useEffect(() => {
  getOutlet({ page: 1, limit: 20, status: "active" });
}, []);

// Restore from current filter:
useEffect(() => {
  if (current.outlet_id && getResult?.data?.data) {
    const found = outlets.find((c) => c.id === current.outlet_id);
    if (found) setOutlet(found);
  } else if (!current.outlet_id) {
    setOutlet(null);
  }
}, [current.outlet_id, getResult]);

<RemoteSelect
  placeholder="Outlet: All"
  value={outlet}
  onChange={(val) => applyFilters({ outlet_id: val?.id || "" })}
  onClear={() => applyFilters({ outlet_id: "" })}
  fetchData={(page, search) => getOutlet({ page: page || 1, limit: 20, search })}
  hook={getResult as any}
  getLabel={(item) => item?.name}
  renderItem={(item) => item?.name}
  getValue={(item) => item.id}
/>
```

### Pattern C: DateRange Picker

Used for date-range filtering with start/end parameters.

**Files:**
- `src/pages/sales/order/table/order.filter.tsx`
- `src/pages/report/table/product-sales.filter.tsx`
- `src/pages/report/table/pos-outstanding.filter.tsx`
- `src/pages/production/plan/table/plan.filter.tsx`

**Structure:**
```tsx
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@/components/ui";

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

<DatePicker
  mode="range"
  value={dateRange}
  onChange={handleDateChange}
  placeholder="Date: All Time"
/>
```

---

## 3. Functional Requirements

### FR-1: Table Filter Component Template

All filter components MUST follow this structure:
- Interface `TableFilterProps` with `{ table: { filter: (params: any) => void; State: { filter: any } } }`
- Read current filter from `table.State?.filter ?? {}`
- Use `applyFilters()` function that calls `table.filter()`
- Each filter field has `onChange` that calls `applyFilters({ key: value })`
- Each filter field has `onClear` that calls `applyFilters({ key: "" })`

### FR-2: RemoteSelect from API

**User Story:**
> As a user, I want to filter table data by related entities (outlet, supplier, warehouse) so that I can narrow results to relevant records.

**Acceptance Criteria:**
- [ ] RemoteSelect uses `fetchData` callback to load options from API
- [ ] RemoteSelect receives `hook` prop for loading/error state
- [ ] Initial load fetches first page on mount via `useEffect`
- [ ] Selection calls `applyFilters({ field_name: selectedItem.id })`
- [ ] Clear resets field to `""`
- [ ] Current filter value restored from `table.State.filter` on mount (second `useEffect`)

### FR-3: RemoteSelect with Static Options

**User Story:**
> As a user, I want to filter by status/enum values from a predefined list so that I can find records by their state.

**Acceptance Criteria:**
- [ ] Options passed via `data` prop (static array)
- [ ] Each option has `{ value: string, label: string }` shape
- [ ] Selection calls `applyFilters({ field_name: selected.value })`
- [ ] Clear resets field to `""`

### FR-4: DateRange Filter

**User Story:**
> As a user, I want to filter records by a date range so that I can view data within a specific period.

**Acceptance Criteria:**
- [ ] DatePicker uses `mode="range"` for start + end date
- [ ] On range complete, sends `start_date` and `end_date` in `YYYY-MM-DD` format
- [ ] Clearing the date picker sends empty strings for both
- [ ] Initial state restored from current filter values if present

### FR-5: `is_active` Toggle

**User Story:**
> As a user, I want to filter by active/inactive status so that I can manage enabled and disabled records separately.

**Acceptance Criteria:**
- [ ] RemoteSelect with static options: `[{ value: "true", label: "Active" }, { value: "false", label: "Inactive" }]`
- [ ] Sends `is_active` param as boolean string
- [ ] Default: no filter (shows all)

---

## 4. Module-Specific Filter Requirements

### 4.1 `GET /inventory/item`
**Missing:** `type`, `category`
- `type`: RemoteSelect with static options `raw_material`, `finished_goods`
- `category`: RemoteSelect from API (need category endpoint or static list)

### 4.2 `GET /inventory/catalog`
**Missing:** `item_type`
- `item_type`: RemoteSelect with static options (item type values)

### 4.3 `GET /outlet`
**No filter component exists. Needs:**
- `outlet_type_id`: RemoteSelect from API (`GET /outlet/type`)
- `is_active`: RemoteSelect static (Active/Inactive)

### 4.4 `GET /outlet/type`
**No filter component exists. Needs:**
- `is_active`: Simple toggle

### 4.5 `GET /pos/menu`
**Missing:** `category_id`, `is_active`
- `category_id`: RemoteSelect from API (`GET /pos/category`)
- `is_active`: RemoteSelect static

### 4.6 `GET /pos/category`
**Empty placeholder. Needs:**
- `is_active`: RemoteSelect static

### 4.7 `GET /pos/channel`
**No filter component exists. Needs:**
- `is_active`: RemoteSelect static

### 4.8 `GET /payment/method`
**Missing:** `is_active`
- `is_active`: RemoteSelect static

### 4.9 `GET /supplier`
**No filter component exists. Needs:**
- `is_active`: RemoteSelect static
- `type`: RemoteSelect with static options `distributor`, `factory`, `store`

### 4.10 `GET /user`
**No filter component exists. Needs:**
- `usergroup_id`: RemoteSelect from API (`GET /user/usergroup`)
- `is_active`: RemoteSelect static

### 4.11 `GET /member/topup-bonus`
**No filter component exists. Needs:**
- `is_active`: RemoteSelect static

### 4.12 `GET /sales/order`
**Missing:** `outlet_id`, `warehouse_id`
**Extra:** Remove `fulfillment_status`
- `outlet_id`: RemoteSelect from API (`useOutlet`)
- `warehouse_id`: RemoteSelect from API (`useWarehouse`)

### 4.13 `GET /sales/return`
**Extra:** Remove `date` param (not in contract)

### 4.14 `GET /purchase/order`
**No filter component (empty placeholder). Needs:**
- `document_status`: RemoteSelect static (`pending`, `published`)
- `outlet_id`: RemoteSelect from API
- `supplier_id`: RemoteSelect from API
- `start_date` + `end_date`: DatePicker range

### 4.15 `GET /b2b/order`
**No filter component exists. Needs:**
- `document_status`: RemoteSelect static (`pending`, `shipped`, `received`, `invoiced`)
- `start_date` + `end_date`: DatePicker range

### 4.16 `GET /production/plan`
**Missing:** `outlet_id`
- `outlet_id`: RemoteSelect from API

### 4.17 `GET /withdrawal-request`
**No filter component exists. Needs:**
- `document_status`: RemoteSelect static (`pending`, `approved`, `rejected`)
- `outlet_id`: RemoteSelect from API

### 4.18 `GET /outlet-topup-request`
**No filter component exists. Needs:**
- `document_status`: RemoteSelect static (`pending`, `approved`, `rejected`)
- `outlet_id`: RemoteSelect from API

### 4.19 `GET /report/outstanding`
**Missing:** `outlet_id`
- `outlet_id`: RemoteSelect from API

### 4.20 `GET /report/product-sales`
**Missing:** `outlet_id`
- `outlet_id`: RemoteSelect from API

### 4.21 `GET /report/pos-settlement`
**Missing:** `periode`, `periode_type`
- `periode`: Text input or date picker for period
- `periode_type`: RemoteSelect static (`daily`, `monthly`, `yearly`)

### 4.22 `GET /report/warehouse-stock`
**No filter component exists. Needs:**
- `warehouse_id`: RemoteSelect from API
- `item_id`: RemoteSelect from API

### 4.23 `GET /demand/production`
**Missing:** `outlet_id`
- `outlet_id`: RemoteSelect from API

---

## 5. Non-Functional Requirements

- **Consistency:** All filter components must use the same `TableFilterProps` interface and `applyFilters` pattern
- **No silent failures:** Every param sent MUST exist in the API contract
- **Restoration:** When a table page reloads, the filter state must restore correctly (current filter values read from `table.State.filter`)
- **Performance:** RemoteSelect API calls should use debounced search, limit 20 items per page

---

## 6. Out of Scope

- ❌ Adding new API endpoints for filter options (must use existing hooks/services)
- ❌ Changing the underlying table filter mechanism (`services/table/api.tsx`)
- ❌ Multi-select or advanced filter UI components beyond RemoteSelect and DatePicker
- ❌ URL-based filter persistence (filters are Redux-only)

---

## 7. Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| RemoteSelect value is null/undefined | Send `""` as param value |
| Date range partially filled | Don't send until both dates selected, or clear both |
| Component unmounts before API responds | RemoteSelect handles cancellation internally via hook |
| Current filter has value not in loaded options | First useEffect attempts to find and set; if not found, field stays null |
| User clears a filter | Send empty string `""` for that param |

---

## 8. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Param name accuracy | 100% match with contract | Audit against `specs/api-contract.md` |
| No extra params | 0 unsupported params sent | grep filter files for params not in contract |
| Filter component coverage | Every list endpoint with contract params has a filter UI | Count modules with filter vs total |

---

## 9. Open Questions

- [ ] Should `fulfillment_status` be added to the contract or confirmed as intentionally removed?
- [ ] Should `date` on sales/return be formalized as `start_date`/`end_date` in the contract?
- [ ] Priority order: fix missing params in existing filters first, or add new filter components first?
- [ ] For `GET /report/raw-material-sales` — what specific params does it accept ("Various query options")?

---

## 10. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-07-09 | Initial specification |

---

## Next Steps

1. Review specification with stakeholders
2. Resolve open questions
3. Run `/plan table-filter-query-params` to create technical implementation plan

*Specification created with SDD 4.0*
