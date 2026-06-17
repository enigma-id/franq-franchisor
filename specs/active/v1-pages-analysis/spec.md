# Specification: V1 to V2 Page-API Alignment

**Task ID:** v1-pages-analysis
**Created:** 2026-06-08
**Status:** Ready for Planning
**Version:** 1.0

## 1. Problem Statement
- The Problem: The legacy V1 module pages (Purchase, Sales, Report, Setting) are currently residing in `temp/v1-pages/` and are disconnected from the current `franchisor-v2` architecture.
- Current Situation: Developers must manually map legacy logic to the new RTK Query hooks and UI framework.
- Desired Outcome: A standardized, modular architecture where domain pages in v2 consume the same API contracts but adhere to the new component library and state management patterns.

## 2. User Personas
### Primary User: Franchisor Admin
- Goals: Manage multi-outlet operations, maintain inventory accuracy, generate reliable financial reports.
- Pain points: Fragmented workflows, lack of data visibility across outlets, difficulty maintaining legacy codebases.

## 3. Functional Requirements
### FR-1: Purchase Lifecycle Alignment
**Description:** Re-implement PO and Supplier management using v2 standardized hooks.

**User Story:**
> As an Operations Manager, I want to manage Suppliers and Purchase Orders so that inventory levels remain optimized.

**Acceptance Criteria:**
- [ ] Supplier Create/Update works using `useSupplier` hooks and standardized `SupplierForm`.
- [ ] Purchase Order logic (including line-item fractions, tax computation) preserved and integrated with v2 UI kit.

**Priority:** Must Have

### FR-2: Reporting Engine Migration
**Description:** Port dynamic settlement and stock reports into the v2 reporting module.

**User Story:**
> As a Franchisor Admin, I want daily and monthly settlement reports so that I can reconcile outlet finances.

**Acceptance Criteria:**
- [ ] Settlement daily/monthly dynamic columns rendered correctly.
- [ ] Reports data is fetched via standardized `useReport` hooks.

**Priority:** Must Have

## 4. Non-Functional Requirements
- Maintainability: Strict use of domain-based routing and table configs.
- Performance: Minimal API latency using RTK Query caching.
- Consistency: Unified UI component usage across all pages.

## 5. Out of Scope
- ❌ Adding new business features not present in V1.
- ❌ Refactoring the backend API itself.

## 6. Edge Cases & Error Handling
| Scenario | Expected Behavior |
|----------|-------------------|
| API Failure during migration | Show toast notification with error description. |
| Missing legacy data fields | Graceful degradation or default value mapping. |

## 7. Success Metrics
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Migration Coverage | 100% of modules | Checklist completeness |
| Performance | Sub-200ms API response | Audit log monitoring |

## 8. Open Questions
- [ ] Are there specific v1 pages to be explicitly excluded from v2?

## 9. Revision History
| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-06-08 | Initial specification |

## Next Steps
1. Review spec with stakeholders
2. Resolve open questions
3. Run `/plan v1-pages-analysis` to create technical plan

*Specification created with SDD 4.0*