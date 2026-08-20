import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { signout } from "@/services/auth/slice";
import { MENU, type MenuSlug } from "@/utils/permissions";
import { useUserPermissions, hasPermission } from "@/utils/permission";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Receipt,
  Users,
  Store,
  Grid,
  Building,
  Factory,
  Monitor,
  BarChart3,
  MapPinned,
  ArrowDownLeft,
  ShoppingBag,
  Wallet,
  UserCircle,
  Gift,
  UsersRound,
  UserRound,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface MenuChild {
  label: string;
  path: string;
  icon?: React.ReactNode;
  /** Slug permission (MENU.*) — child disembunyikan jika user tak punya. */
  permission?: MenuSlug;
}

interface MenuItem {
  label: string;
  path?: string;
  icon: React.ReactNode;
  badge?: string;
  permission?: MenuSlug;
  /** Hanya tampil utk super admin (user tanpa usergroup). */
  superAdminOnly?: boolean;
  children?: MenuChild[];
}

interface MenuSection {
  label: string;
  items: MenuItem[];
}

// ─── Menu Config ──────────────────────────────────────────────────────────────
const menuSections: MenuSection[] = [
  {
    label: "Main Menu",
    items: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: <LayoutDashboard size={18} />,
        permission: MENU.dashboard,
      },
    ],
  },
  {
    label: "Sales",
    items: [
      {
        label: "B2B Order",
        path: "/b2b/order",
        icon: <ShoppingBag size={18} />,
        permission: MENU.b2bOrder,
      },
      {
        label: "Sales Order",
        path: "/sales/order",
        icon: <ShoppingCart size={18} />,
        permission: MENU.salesOrder,
      },
      {
        label: "Withdrawal",
        path: "/withdrawal",
        icon: <ArrowDownLeft size={18} />,
        permission: MENU.withdrawal,
      },
      {
        label: "Outlet Topup",
        path: "/outlet-topup",
        icon: <Wallet size={18} />,
        permission: MENU.outletTopup,
      },
    ],
  },
  {
    label: "Master Data",
    items: [
      {
        label: "Item",
        path: "/inventory/item",
        icon: <Package size={18} />,
        permission: MENU.inventoryItem,
      },
      {
        label: "Catalog",
        path: "/inventory/catalog",
        icon: <Grid size={18} />,
        permission: MENU.inventoryCatalog,
      },
    ],
  },
  {
    label: "Production",
    items: [
      {
        label: "Demand",
        icon: <Factory size={18} />,
        permission: MENU.demand,
        children: [
          { label: "Demand Production", path: "/production/demand/production" },
          { label: "Demand Item", path: "/production/demand/item" },
        ],
      },
      {
        label: "Production Plan",
        path: "/production/plan",
        icon: <Factory size={18} />,
        permission: MENU.productionPlan,
      },
    ],
  },
  {
    label: "Purchase",
    items: [
      {
        label: "Supplier",
        path: "/purchase/supplier",
        icon: <Users size={18} />,
        permission: MENU.supplier,
      },
      {
        label: "Purchase Order",
        path: "/purchase/order",
        icon: <Receipt size={18} />,
        permission: MENU.purchaseOrder,
      },
    ],
  },
  {
    label: "Report",
    items: [
      {
        label: "POS Report",
        icon: <Monitor size={18} />,
        children: [
          {
            label: "Report Outstanding",
            path: "/report/pos/outstanding",
            permission: MENU.reportPosOutstanding,
          },
          {
            label: "Report Settlement",
            path: "/report/pos/settlement",
            permission: MENU.reportPosSettlement,
          },
          {
            label: "Report Product Sales",
            path: "/report/pos/product-sales",
            permission: MENU.reportPosProductSales,
          },
          {
            label: "Report Menu",
            path: "/report/pos/product-item",
            permission: MENU.reportPosProductItem,
          },
          {
            label: "Report Transaction Cancel",
            path: "/report/pos/cancelled-product-sales",
            permission: MENU.reportPosTransactionCancelled,
          },
          {
            label: "Report Topup Cancel",
            path: "/report/pos/topup-cancelled",
            permission: MENU.reportPosTopupCancelled,
          },
        ],
      },
      {
        label: "Mitra Report",
        icon: <UserRound size={18} />,
        children: [
          {
            label: "Report Settlement",
            path: "/report/mitra/settlement",
            permission: MENU.reportMitraSettlement,
          },
          {
            label: "Report Product Sales",
            path: "/report/mitra/product-sales",
            permission: MENU.reportMitraProductSales,
          },
          {
            label: "Report Menu",
            path: "/report/mitra/product-item",
            permission: MENU.reportMitraProductItem,
          },
          {
            label: "Report Outlet Saldo",
            path: "/report/mitra/outlet-saldo",
            permission: MENU.reportMitraOutletSaldo,
          },
        ],
      },
      {
        label: "B2B Report",
        icon: <Building size={18} />,
        children: [
          {
            label: "Report Settlement",
            path: "/report/b2b/settlement",
            permission: MENU.reportB2BSettlement,
          },
          {
            label: "Report Product Sales",
            path: "/report/b2b/product-sales",
            permission: MENU.reportB2BProductSales,
          },
          {
            label: "Report Menu",
            path: "/report/b2b/product-item",
            permission: MENU.reportB2BProductItem,
          },
        ],
      },
      {
        label: "Inventory & Sales",
        icon: <BarChart3 size={18} />,
        children: [
          {
            label: "Report Product Sales",
            path: "/report/inventory/material-sales",
            permission: MENU.reportInventoryMaterialSales,
          },
          {
            label: "Report Warehouse Stock",
            path: "/report/inventory/warehouse-stock",
            permission: MENU.reportWarehouseStock,
          },
        ],
      },
      {
        label: "Report Outlet Maps",
        path: "/report/outlet-maps",
        icon: <MapPinned size={18} />,
        permission: MENU.reportOutletMap,
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        label: "Profil Franchisor",
        path: "/franchisor",
        icon: <UserCircle size={18} />,
        superAdminOnly: true,
      },
      {
        label: "Schema Bonus Topup",
        path: "/setting/member/topup-bonus",
        icon: <Gift size={18} />,
        permission: MENU.topupBonus,
      },
      {
        label: "User Management",
        icon: <Users size={18} />,
        children: [
          { label: "User", path: "/user", permission: MENU.user },
          {
            label: "Usergroup",
            path: "/usergroup",
            permission: MENU.usergroup,
          },
        ],
      },
      {
        label: "Outlet",
        icon: <Store size={18} />,
        children: [
          {
            label: "Outlet List",
            path: "/setting/outlet",
            permission: MENU.outlet,
          },
          {
            label: "Tipe Outlet",
            path: "/setting/type/outlet",
            permission: MENU.outletType,
          },
        ],
      },
      {
        label: "POS",
        icon: <Monitor size={18} />,
        children: [
          {
            label: "Channel",
            path: "/setting/pos/channel",
            permission: MENU.posChannel,
          },
          {
            label: "Category",
            path: "/setting/pos/category",
            permission: MENU.posCategory,
          },
          {
            label: "Menu",
            path: "/setting/pos/menu",
            permission: MENU.posMenu,
          },
          {
            label: "Payment",
            path: "/setting/pos/payment",
            permission: MENU.posPayment,
          },
        ],
      },
    ],
  },
];

// ─── Sub Components ───────────────────────────────────────────────────────────
function SidebarSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='mb-8'>
      <p className='px-6 mb-3 text-[11px] font-bold uppercase tracking-widest text--base-content/60 select-none'>
        {label}
      </p>
      {children}
    </div>
  );
}

// ─── Nav helpers ──────────────────────────────────────────────────────────────

/** Item diizinkan jika tanpa permission (selalu tampil) atau user punya slug. */
function isItemAllowed(
  userPermissions: string[] | undefined,
  item: Pick<MenuItem, "permission" | "superAdminOnly">,
  isSuperAdmin: boolean,
) {
  // Item khusus super admin (mis. Profil Franchisor) hanya utk user tanpa usergroup
  if (item.superAdminOnly) return isSuperAdmin;
  return (
    item.permission === undefined ||
    hasPermission(userPermissions, item.permission)
  );
}

/** Parent item tetap tampil jika minimal satu child diizinkan. */
function isParentAllowed(
  userPermissions: string[] | undefined,
  item: MenuItem,
  isSuperAdmin: boolean,
) {
  return item.children!.some(
    (c) =>
      // Child punya permission sendiri → gate sendiri.
      // Child tanpa permission → mewarisi permission parent (mis. Demand).
      isItemAllowed(userPermissions, c, isSuperAdmin) &&
      (c.permission !== undefined ||
        isItemAllowed(userPermissions, item, isSuperAdmin)),
  );
}

function isPathActive(currentPath: string, itemPath?: string): boolean {
  if (!itemPath) return false;
  if (currentPath === itemPath) return true;
  return currentPath.startsWith(itemPath + "/");
}

// Active pill — right side indicator
function ActivePill({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span
      className='absolute right-0 top-1/2 -translate-y-1/2 w-[4px] h-[60%] bg-primary rounded-l-full'
      aria-hidden='true'
    />
  );
}

// Leaf nav item
function NavItem({
  item,
  onNavigate,
}: {
  item: MenuItem;
  onNavigate: () => void;
}) {
  const location = useLocation();
  const isActive = isPathActive(location.pathname, item.path);

  return (
    <NavLink
      to={item.path!}
      onClick={() => onNavigate()}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl text-[14px] mx-3 mb-1 transition-all duration-150 cursor-pointer group relative overflow--hidden ${isActive ? "bg-primary text-primary-content font-bold shadow-sm" : "text-base-content hover:text-primary hover:bg-base-100/60 font-medium"}`}
    >
      <span
        className={`flex-1shrink-0 transition-colors ${isActive ? "text-primary-content" : "text-base-content/60 group-hover:text-primary"}`}
      >
        {item.icon}
      </span>
      <span className='flex-1 truncate tracking-wide'>{item.label}</span>
      <ActivePill active={isActive} />
      {item.badge && (
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-primary-content/20 text-primary-content" : "bg-base-300 text-base-content"}`}
        >
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}

// Parent with accordion submenu
function ParentItem({
  item,
  onNavigate,
  userPermissions,
  isSuperAdmin,
}: {
  item: MenuItem;
  onNavigate: () => void;
  userPermissions: string[] | undefined;
  isSuperAdmin: boolean;
}) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const visibleChildren = item.children?.filter(
    (c) =>
      isItemAllowed(userPermissions, c, isSuperAdmin) &&
      (c.permission !== undefined ||
        isItemAllowed(userPermissions, item, isSuperAdmin)),
  );
  const isChildActive =
    visibleChildren?.some((c) => isPathActive(location.pathname, c.path)) ??
    false;

  return (
    <div className='mb-1'>
      {/* Parent button */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className={`
          flex items-center gap-4 px-4 py-3 rounded-xl text-[14px] mx-3 w-[calc(100%-24px)]
          transition-all duration-150 cursor-pointer group relative overflow-hidden
          ${
            isChildActive
              ? "bg-primary text-primary-content font-bold"
              : expanded
                ? "bg-base-200 text-primary font-semibold"
                : "text-base-content hover:text-primary hover:bg-base-200/60 font-medium"
          }
        `}
        aria-expanded={expanded}
      >
        <span
          className={`shrink-0 transition-colors ${isChildActive ? "text-white" : expanded ? "text-primary" : "text-base-content/60 group-hover:text-primary"}`}
        >
          {item.icon}
        </span>
        <span className='flex-1 text-left truncate tracking-wide'>
          {item.label}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-all duration-200 ${isChildActive ? "text-white" : expanded ? "text-primary" : "text-base-content/50"} ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {/* Submenu accordion */}
      <div
        className={`overflow-ys-auto transition-all duration-200 ease-out ${
          expanded ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        <div className='ml-9 pl-5 border-l border-base-300 space-y-1 py-1 mr-4'>
          {(visibleChildren ?? []).map((child) => {
            const isActive = isPathActive(location.pathname, child.path);
            return (
              <NavLink
                key={child.path}
                to={child.path}
                onClick={() => onNavigate()}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] transition-all duration-150 cursor-pointer group relative overflow-hidden ${isActive ? "bg-primary text-primary-content font-bold shadow-sm" : "text-base-content hover:text-primary hover:bg-base-200/60 font-medium"}`}
              >
                {child.icon && (
                  <span
                    className={`flex-1shrink-0 transition-colors ${isActive ? "text-primary-content" : "text-base-content/60 group-hover:text-primary"}`}
                  >
                    {child.icon}
                  </span>
                )}
                <span className='truncate tracking--wide'>{child.label}</span>
                <ActivePill active={isActive} />
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AuthorizedLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.session);
  const userPermissions = useUserPermissions();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = () => {
    dispatch(signout());
    navigate("/signin");
  };

  // Super admin = user tanpa usergroup
  const isSuperAdmin = !user?.user?.usergroup_id;

  // Filter menu berdasarkan permission — super admin (tanpa permission) lihat semua.
  const visibleSections = useMemo(() => {
    return menuSections
      .map((section) => {
        const items = section.items.filter((item) =>
          item.children
            ? isParentAllowed(userPermissions, item, isSuperAdmin)
            : isItemAllowed(userPermissions, item, isSuperAdmin),
        );
        return items.length > 0 ? { ...section, items } : null;
      })
      .filter((s): s is MenuSection => s !== null);
  }, [userPermissions, isSuperAdmin]);

  return (
    <div className='flex h-screen overflow-hidden bg-base-200'>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-[2px]'
          onClick={() => setSidebarOpen(false)}
          aria-hidden='true'
        />
      )}

      {/* Sidebar — light primary tinted base */}
      <aside
        aria-label='Main navigation'
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-[270px] bg-[#eff2f6] flex flex-col border-r border-primary/10
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {/* Logo / Branding */}
        <div className='relative flex items-center gap-3 px-6 py-8 shrink-0 border-b border-primary/10'>
          {/* Brand icon */}
          <div className='w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-sm flex-shrink-0 overflow-hidden border border-primary/20 p-1'>
            <img
              src='/rabbit.png'
              alt='Logo'
              className='w-full h-full object-contain drop-shadow-sm'
            />
          </div>

          {/* Brand text */}
          <div className='min-w-0'>
            <span className='font-black text-base-content text-[18px] leading-tight whitespace-nowrap tracking-wider uppercase'>
              Franchisor
            </span>
            <span className='block text-[10px] text-base-content/60 whitespace-nowrap font-bold tracking-widest mt-0.5 uppercase'>
              Portal Manajemen
            </span>
          </div>

          {/* Close button — mobile only */}
          <button
            className='ml-auto p-1.5 rounded-lg text-base-content/60 hover:text-primary hover:bg-base-200 transition-colors cursor-pointer lg:hidden'
            onClick={() => setSidebarOpen(false)}
            aria-label='Close sidebar'
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable nav */}
        <nav
          className='flex-1 overflow-y-auto pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pt-4'
          aria-label='Sidebar navigation'
        >
          {visibleSections.map((section) => (
            <SidebarSection key={section.label} label={section.label}>
              <div className='space-y-1'>
                {section.items.map((item) =>
                  item.children ? (
                    <ParentItem
                      key={item.label}
                      item={item}
                      onNavigate={() => setSidebarOpen(false)}
                      userPermissions={userPermissions}
                      isSuperAdmin={isSuperAdmin}
                    />
                  ) : (
                    <NavItem
                      key={item.path ?? item.label}
                      item={item}
                      onNavigate={() => setSidebarOpen(false)}
                    />
                  ),
                )}
              </div>
            </SidebarSection>
          ))}
        </nav>

        {/* User footer */}
        <div className='p-5 shrink-0 border-t border-primary/10'>
          <div className='flex items-center gap-3 p-2.5 rounded-2xl border border-primary/10 bg-primary/5'>
            {/* Avatar */}
            <div className='w-10 h-10 rounded-xl flex items-center justify-center bg-primary text-primary-content text-[15px] font-black flex-1shrink-0 shadow-sm'>
              {user?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>

            {/* User info */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2'>
                <p className='text-[14px] font-bold text-base-content truncate leading-tight'>
                  {user?.user?.name ?? "Demo"}
                </p>
                <span className='text-[8px] font-black bg-primary text-primary-content px-1.5 py-0.5 rounded uppercase tracking-wider'>
                  Admin
                </span>
              </div>
              <p className='text-[11px] text-base-content/70 truncate mt-1 font-semibold tracking-wide'>
                {user?.user?.username ?? "demo@franchisee..."}
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={handleSignOut}
              className='w-10 h-10 rounded-xl border border-primary/10 bg-base-100 flex items-center justify-center text-base-content/70 hover:text-error hover:bg-error/10 transition-all duration-150 flex-1shrink-0 cursor-pointer shadow-sm'
              title='Keluar'
              aria-label='Sign out'
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden min-w-0'>
        {/* Mobile top bar */}
        <header className='lg:hidden flex items-center gap-3 px-4 py-3.5 bg-base-100 border-b border-base-300 shrink-0'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='p-1.5 rounded-lg text-base-content/80 hover:bg-base-200 transition-colors cursor-pointer'
            aria-label='Open sidebar'
          >
            <Menu size={20} />
          </button>
          <div className='w-10 h-10 rounded-2xl flex items-center justify-center bg-white shadow-sm flex-shrink-0 overflow-hidden border border-primary/20 p-1'>
            <img
              src='/rabbit.png'
              alt='Logo'
              className='w-full h-full object-contain drop-shadow-sm'
            />
          </div>
          <span className='font-semibold text-base-content text-sm'>
            Franchisor Portal
          </span>
        </header>

        {/* Page content */}
        <main
          className='flex-1 overflow-hidden'
          id='main-content'
          tabIndex={-1}
        >
          <Outlet key={location.pathname} />
        </main>
      </div>
    </div>
  );
}
