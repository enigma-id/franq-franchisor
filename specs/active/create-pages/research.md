# Research: Form Schemas & Legacy Payloads for Nine Missing Creation Pages

**Task ID:** `create-pages`
**Date:** 2026-05-18
**Status:** Complete

---

## Executive Summary

This research gathers, dissects, and documents the exact specifications, schemas, payloads, validation targets, and cascading reactive bindings for the **nine missing creation views** within the Enigma Franchisor client. These forms will be ported from the legacy Vue codebase (`D:\Enigma\suka-bread\clients\web\franchisor`) directly into the modern React/Tailwind/TypeScript client (`D:\Enigma\franchisor-v2`).

Additionally, this document consolidates the exact patterns found in the React repository's robust CRUD hooks (leveraging custom Redux Toolkit query wrappers `createCrudHook()`) and custom components (such as `<Input>`, `<DatePicker>`, and debounced infinite-scrolling `<RemoteSelect>`) to establish high-fidelity architectural alignment.

---

## Codebase Analysis

### 1. Legacy Form Specifications & Payload Mappings

Below is the exhaustive breakdown of each of the nine missing pages, including their original Vue configurations, validation structures, select dependencies, and precise payload outputs.

#### Page 1: Catalog (`setting/inventory/catalog`)
* **Legacy Path:** `setting/inventory/catalog/create.vue`
* **Form Structure:** Toggles dynamically between a **singular** catalog configuration and a nested **bundle (paket)** item array.
* **Fields:**
  * `type`: String (`'singular' | 'bundle'`). Defaults to `'singular'`.
  * `item_id`: Number (ID of the inventory item). Used in `singular` type.
  * `fraction_id`: Number (ID of the inventory item's fraction). Used in `singular` type.
  * `name`: String. Pre-populated as the `alias` of the selected inventory item for `singular` types, or custom-filled for `bundle` types.
  * `commission`: Number. Percentage-based. Defaults to `0`.
  * `image`: String (base64 or image path string returned by upload components).
  * `is_bundle`: Number (`0` or `1`). Automatically maps to `1` if type is `'bundle'`.
  * `description`: String. Textarea for products.
  * `unit_price`: Number (Selling Price).
  * `bundles`: Dynamic Array of bundle parts (applicable when type is `'bundle'`):
    * `item_id`: Number.
    * `fraction_id`: Number.
    * `quantity`: Number.
    * `margin`: Number.
    * `totalBase`: Number (Computed: `base_price * unit`).
    * `selling_price`: Number (Computed: `(base_price + (base_price * margin) / 100) * unit`).
    * `itemSelected`: Object | null.
    * `fractionSelected`: Object | null.
* **Reactive Logic & Computations:**
  * **Base Price computation:**
    * For `singular`: `itemSelected.base_price * fractionSelected.quantity`.
    * For `bundle`: Sum of `totalBase` of all bundle items in the array.
  * **Selling Price (Harga Jual) Auto-markup logic:**
    * For `singular`: `dpp = basePrice + (basePrice * commission) / 100`. If item is vatable (`is_vatable === 1`), `sp = dpp * 1.1`.
    * For `bundle`: `sp = sum(dpp_i)`. For each bundle item, `dpp_i = selling_price + (selling_price * commission) / 100`. If bundle item is vatable, `spp = dpp_i * 1.1`, which is summed up to auto-fill `unit_price`.

#### Page 2: Outlet Type (`setting/outlet/outlet_type`)
* **Legacy Path:** `setting/outlet/outlet_type/create.vue`
* **Fields:**
  * `name`: String. Name of the outlet classification.
* **Submit Operation:** `OutletType.Create` / RTK hook `useOutletType` -> `create` method.

#### Page 3: Outlet (`setting/outlet/outlet`)
* **Legacy Path:** `setting/outlet/outlet/create.vue`
* **Form Structure:** Highly comprehensive form divided into Outlet Info, PIC, Owner User accounts, and Regional cascading fields.
* **Fields:**
  * `name`: String.
  * `type_id`: Number (Outlet Type ID). Tapped via `useOutletType()`.
  * `recipient_name`: String. PIC contact name.
  * `phone`: String. PIC phone number.
  * `service_charge`: Number (Percentage-based service fee).
  * `address`: String (Textarea max 130 chars).
  * `province_id`: Number.
  * `regency_id`: Number.
  * `district_id`: Number.
  * `village_id`: Number.
  * `shipping_time`: String. Choices: `'morning' | 'afternoon' | 'evening' | 'night' | 'unselected'`.
  * `owner_user`: Nested Object containing credentials for the owner login:
    * `name`: String.
    * `username`: String.
    * `password`: String (6-digit numeric PIN).
* **Cascading Regional Selectors Logic:**
  * Triggering a change on `province_id` completely resets selections/IDs for regency, district, and village.
  * Triggering a change on `regency_id` completely resets selections/IDs for district and village.
  * Triggering a change on `district_id` resets village.
  * Requires dynamic API integration with `useRegion()` hook parameters (`province_id` -> regencies, `regency_id` -> districts, `district_id` -> villages).

#### Page 4: POS Category (`setting/pos/category`)
* **Legacy Path:** `setting/pos/category/create.vue`
* **Fields:**
  * `name`: String.
  * `is_topping`: Number (`0` | `1`). Hardcoded to `0` on create page by default, but customizable if requested.
* **Submit Operation:** `POSCategory.Create` / RTK hook `usePOSCategory` -> `create` method.

#### Page 5: POS Channel (`setting/pos/channel`)
* **Legacy Path:** `setting/pos/channel/create.vue`
* **Fields:**
  * `name`: String.
  * `margin`: Number (percentage margin applied for this channel).
* **Submit Operation:** `POSChannel.Create` / RTK hook `usePOSChannel` -> `create` method.

#### Page 6: POS Catalog (`setting/pos/catalog`)
* **Legacy Path:** `setting/pos/catalog/create.vue`
* **Form Structure:** Complex catalog management tying together POS Categories, Base Pricing, VAT checkboxes, multi-channel pricing tables, base64 images, and dynamic add-on groups.
* **Fields:**
  * `category_id`: Number. Selected via POS Category search.
  * `code`: String. Barcode/Item SKU.
  * `name`: String.
  * `base_price`: Number. Raw base cost.
  * `is_vatable`: Number (`0` | `1`). If selected, displays PPN notification that "Harga Jual sudah termasuk pajak".
  * `is_additional`: Number (`0` | `1`). Denotes whether it is an add-on item.
  * `image`: String (base64 image data).
  * `channels`: Dynamic Array populated on mount from the available POS Channels list. Each item tracks:
    * `name`: String (Readonly label).
    * `channel_id`: Number.
    * `is_active`: Number (`0` | `1`). Toggle active status in this sales channel.
    * `unit_price`: Number (Selling price inside this channel). Visible and validated only when `is_active` is `1`.
  * `additionals`: Dynamic Array of Add-on Groups (visible only when `is_additional` is `0`):
    * `name`: String. Name of the add-on package (e.g. "Pilih Topping").
    * `type`: String. Option selector: `'options' | 'checkbox' | 'quantity'`.
    * `childs`: Dynamic nested array of add-on options:
      * `catalogSelected`: Object | null (Filtered search of POS Catalogs where `is_additional === 1`).
      * `catalog_id`: Number.
* **Mount Operations:**
  * Fetches list of POS Channels via `usePOSChannel()` to build the dynamic row checklist inside `form.channels`.

#### Page 7: POS Payment Method (`setting/pos/payment_method`)
* **Legacy Path:** `setting/pos/payment_method/create.vue`
* **Fields:**
  * `name`: String.
  * `is_nfc`: Number (`0` | `1`).
* **Submit Operation:** `POSPaymentMethod.Create` / RTK hook `usePOSPaymentMethod` -> `create` method.

#### Page 8: Topup Schema (`setting/pos/topup_schema`)
* **Legacy Path:** `setting/pos/topup_schema/create.vue`
* **Fields:**
  * `min_nominal`: Number. Minimum rupiah amount to trigger the tier.
  * `bonus`: Number. Percentage bonus margin (`%`).
* **Submit Operation:** `POSTopupSchema.Create` / RTK hook `usePOSTopupSchema` -> `create` method.

#### Page 9: Supplier (`purchase/supplier`)
* **Legacy Path:** `purchase/supplier/create.vue`
* **Form Structure:** Columns for Supplier Info, Payment Details, and Contact Person.
* **Fields:**
  * **Supplier Info:**
    * `type`: String. Options: `'distributor' | 'factory' | 'store'`.
    * `name`: String.
    * `address`: String (Textarea max 130 chars).
    * `phone`: String.
    * `is_pkp`: Number (`0` for Non-PKP | `1` for PKP).
    * `top`: Number (Term of Payment in Days).
    * `lead_time`: Number (Shipping Lead Time in Days).
  * **Payment Details:**
    * `bank_name`: String.
    * `bank_number`: String.
    * `bank_account`: String (Bank account owner name).
  * **Contact Person:**
    * `sales_person`: String.
    * `sales_person_phone`: String.
    * `note`: String (Textarea max 130 chars).
* **Submit Operation:** `Supplier.Create` / RTK hook `useSupplier` -> `create` method.

---

## Modern React Architecture & Design Patterns

An audit of the current `franchisor-v2` repository (`D:\Enigma\franchisor-v2\src\pages\`) reveals several rigid patterns that must be adhered to:

### Redux Toolkit Query & CRUD Hooks Integration
Each service (such as `/services/pos/hooks.tsx`, `/services/outlet/hooks.tsx`, etc.) leverages a custom `createCrudHook` wrapper. This returns:
* A `create` mutation method: `create(payload)`
* A `createResult` object tracking transaction states:
  ```typescript
  const { create, createResult } = usePOSCategory();
  const { isLoading, isSuccess, data: responseData } = createResult;
  ```
* Toast actions decoupled in a `useEffect` watching `isSuccess` and `responseData`:
  ```typescript
  useEffect(() => {
    const resData = responseData as any;
    if (isSuccess && resData?.data?.id) {
      showToast({
        message: "Sales Order berhasil dibuat",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      navigate(`/setting/pos/category`);
      createResult.reset?.();
    }
  }, [isSuccess, responseData, navigate, createResult, showToast]);
  ```

### Component Interfaces & Layout Standards
All creation pages wrap their layouts using the `<Page>` semantic structure:
```tsx
<Page className="h-full flex flex-col min-h-0 bg-slate-50">
  <Page.Header
    category="setting"
    title="Tambah Tipe Outlet"
    subtitle="Buat tipe klasifikasi outlet baru."
    backTo={() => navigate("/setting/type/outlet")}
    action={
      <Button onClick={handleSubmit} disabled={isCreating} variant="success">
        {isCreating ? <Loading size="sm" ... /> : <><Save className="w-4 h-4 mr-2" /> Simpan</>}
      </Button>
    }
  />
  <Page.Body className="flex-1 overflow-auto p-4 md:p-6">
     {/* Card structures & form fields */}
  </Page.Body>
</Page>
```

### Autocomplete Selector Pattern (`<RemoteSelect>`)
Search-based selections must leverage the custom `<RemoteSelect>` widget.
* **Signature:**
  ```tsx
  <RemoteSelect
    label="Kategori"
    placeholder="Pilih Kategori"
    value={categorySelected}
    hook={categoriesResult as any}
    fetchData={(page, search) => getCategories({ page, search, is_active: "true" })}
    getLabel={(item: any) => item?.name || ""}
    getValue={(item: any) => item?.id}
    onChange={handleCategoryChange}
    onClear={handleCategoryClear}
    required
    error={validationErrors.category_id}
  />
  ```

---

## Recommendations

### 1. Form Validation Architecture
Strict-mode compilation mandates type-safe validations. All creation pages must leverage a custom `validationErrors` state mapping directly to local input fields:
* Pre-submit handlers validate field entries and record errors in `validationErrors`.
* Backend errors flowing from RTK query must be mapped dynamically via checking `FormState?.errors?.[field]` or mapping array errors gracefully using helpers like `getErrorItem(index, field)`.

### 2. Cascading Selector Management
For the cascading dropdown fields in `Outlet` (Province -> Regency -> District -> Village):
* Store selected entities inside independent state variables: `const [provinceSelected, setProvinceSelected] = useState<any | null>(null);`
* Bind cascading trigger hooks using synchronous setter methods that reset child states to `null` and child IDs to `0` whenever parent values are cleared or modified.

### 3. Dynamic Array Structuring
For forms managing complex tabular list arrays (e.g., POS Catalog dynamic channel prices or add-on groups):
* Leverage React state hooks holding arrays of objects.
* When adding rows, deep-copy templates: `JSON.parse(JSON.stringify(template))` to guarantee no shared object references.
* Compute totals (such as Bundle Subtotals or Markups) reactively using `useMemo()` hooks listening to array mutations.

---

## Open Questions

- *Supplier PKP State Data Types:* The legacy Vue client handles `is_pkp` as `0 | 1`. We must ensure the backend API processes this as a numeric `0/1` instead of boolean `false/true`.
- *PIN Constraints:* The user owner account passwords inside the Outlet form are documented as "PIN 6 Angka". We should enforce a regex numeric constraint (`/^\d{6}$/`) on validation.

---

## Next Steps

1. **Verify Plan Targets:** Apply the strict-mode TypeScript compilation corrections to `salesOrderCreate.tsx` and `purchaseOrderCreate.tsx`.
2. **Draft Technical Specification:** Formulate a structured specification (`spec.md`) and implementation roadmap (`plan.md`) mapping the route injections and page file compositions.
3. **Execute Implementation:** Draft and place code modules inside their designated target directories in `franchisor-v2`.

*Research completed with SDD 2.0*
