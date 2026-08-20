import { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { UnauthorizedLayout } from "@/components/app/route-layout/UnauthorizedLayout";
import { AuthorizedLayout } from "@/components/app/route-layout/AuthorizedLayout";
import { PermissionGuard } from "@/components/app";
import { MENU } from "@/utils/permissions";
import { useAppSelector, useAppMetadata } from "@/hooks";
import { useAuth } from "@/services/auth/hooks";

import SignInPage from "@/pages/signin";
import SignUpPage from "@/pages/signup";
import DashboardPage from "@/pages/dashboard";

import OutletListPage from "@/pages/setting/outlet";
import OutletCreatePage from "@/pages/setting/outlet/outletCreate";
import OutletUpdatePage from "@/pages/setting/outlet/outletUpdate";

import OutletTypePage from "@/pages/setting/type";
import POSChannelListPage from "@/pages/setting/pos/channel";
import POSCategoryListPage from "@/pages/setting/pos/category";

import POSMenuListPage from "@/pages/setting/pos/menu";
import POSMenuCreatePage from "@/pages/setting/pos/menu/menuCreate";
import POSMenuDetailPage from "@/pages/setting/pos/menu/menuDetail";
import POSMenuUpdatePage from "@/pages/setting/pos/menu/menuUpdate";

import PaymentMethodListPage from "@/pages/setting/pos/payment";

import InventoryItemListPage from "@/pages/inventory/item";
import InventoryItemCreatePage from "@/pages/inventory/item/itemCreate";
import InventoryItemUpdatePage from "@/pages/inventory/item/itemUpdate";
import InventoryItemDetailPage from "@/pages/inventory/item/itemDetail";

import InventoryCatalogListPage from "@/pages/inventory/catalog";
import InventoryCatalogCreatePage from "@/pages/inventory/catalog/catalogCreate";
import InventoryCatalogUpdatePage from "@/pages/inventory/catalog/catalogUpdate";
import InventoryCatalogDetailPage from "@/pages/inventory/catalog/catalogDetail";

import SupplierListPage from "@/pages/purchase/supplier";

import SupplierCreatePage from "@/pages/purchase/supplier/supplierCreate";
import SupplierUpdatePage from "@/pages/purchase/supplier/supplierUpdate";

import PurchaseOrderListPage from "@/pages/purchase/order";
import PurchaseOrderCreatePage from "@/pages/purchase/order/purchaseOrderCreate";
import PurchaseOrderUpdatePage from "@/pages/purchase/order/purchaseOrderUpdate";
import PurchaseOrderDetailPage from "@/pages/purchase/order/purchaseOrderDetail";

import SalesOrderCreatePage from "@/pages/sales/order/salesOrderCreate";
import SalesOrderUpdatePage from "@/pages/sales/order/salesOrderUpdate";
import SalesOrderListPage from "@/pages/sales/order";
import SalesOrderDetailPage from "@/pages/sales/order/salesOrderDetail";

import ProductionPlanListPage from "@/pages/production/plan";
import ProductionPlanCreatePage from "@/pages/production/plan/productionPlanCreate";
import ProductionPlanDetailPage from "@/pages/production/plan/productionPlanDetail";
import ProductionPlanUpdatePage from "@/pages/production/plan/productionPlanUpdate";

import DemandProductionPage from "@/pages/production/demand/demandProduction";
import DemandItemPage from "@/pages/production/demand/demandItem";

// ==== REPORT B2B ===== //
import B2BProductItemPage from "@/pages/report/b2b/productItem";
import B2BSettlementPage from "@/pages/report/b2b/settlement";
import B2BSettlementDailyPage from "@/pages/report/b2b/settlementDaily";
import B2BProductSalesPage from "@/pages/report/b2b/productSales";

// ==== REPORT POS ===== //
import PosOutstandingPage from "@/pages/report/pos/outstanding";
import POSSettlementPage from "@/pages/report/pos/settlement";
import POSSettlementDailyPage from "@/pages/report/pos/settlementDaily";
import POSCancelledProductSalesPage from "@/pages/report/pos/cancelledProductSales";
import POSProductSalesPage from "@/pages/report/pos/productSales";
import POSProductItemPage from "@/pages/report/pos/productItem";
import POSTopupCancelledPage from "@/pages/report/pos/topupCancelled";

// ==== REPORT MITRA ===== //
import MitraSettlementPage from "@/pages/report/mitra/settlement";
import MitraSettlementDailyPage from "@/pages/report/mitra/settlementDaily";
import MitraProductSalesPage from "@/pages/report/mitra/productSales";
import MitraProductItemPage from "@/pages/report/mitra/productItem";
import MitraOutletSaldoPage from "@/pages/report/mitra/outletSaldo";

// ==== REPORT FRANCHISOR ====//
import RawMaterialSalesPage from "@/pages/report/franchisor/rawMaterialSales";
import WarehouseStockPage from "@/pages/report/franchisor/warehouseStock";
import OutletMapPage from "@/pages/report/outletMap";

import WithdrawalList from "@/pages/withdrawal/WithdrawalList";
import OutletTopupListPage from "@/pages/outletTopup";

import B2BOrderListPage from "@/pages/b2b/order";
import B2BOrderCreatePage from "@/pages/b2b/order/b2bOrderCreate";
import B2BOrderDetailPage from "@/pages/b2b/order/b2bOrderDetail";
import B2BOrderUpdatePage from "@/pages/b2b/order/b2bOrderUpdate";

import UserListPage from "@/pages/user";
import UserGroupListPage from "@/pages/usergroup";
import FranchisorProfilePage from "@/pages/franchisor";
import TopupBonusPage from "@/pages/setting/member/topupBonus";

export function AppRoutes() {
  useAppMetadata();
  const { loadProfile } = useAuth();
  const isAuthenticated = useAppSelector((s) => s.auth.authenticated);

  // Saat refresh halaman (session ter-rehydrate dari persist), fetch ulang
  // /profile/me supaya permission & usergroup_id user selalu fresh.
  // Ref guard: cukup sekali per boot, jangan loop saat session di-update.
  const didFetchProfile = useRef(false);
  useEffect(() => {
    if (isAuthenticated && !didFetchProfile.current) {
      didFetchProfile.current = true;
      loadProfile();
    }
  }, [isAuthenticated, loadProfile]);

  if (!isAuthenticated) {
    return (
      <Routes>
        {/* Public routes — wrapped in UnauthorizedLayout */}
        <Route element={<UnauthorizedLayout />}>
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='*' element={<Navigate to='/signin' replace />} />
        </Route>
      </Routes>
    );
  }

  return (
    <Routes>
      {/* Protected routes — wrapped in ProtectedRoute + AuthorizedLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AuthorizedLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route
          path='/dashboard'
          element={
            <PermissionGuard permission={MENU.dashboard}>
              <DashboardPage />
            </PermissionGuard>
          }
        />

        {/* Setting - Outlet */}
        <Route
          path='/setting/outlet'
          element={
            <PermissionGuard permission={MENU.outlet}>
              <OutletListPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/setting/outlet/create'
          element={
            <PermissionGuard permission={MENU.outlet}>
              <OutletCreatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/setting/outlet/update/:id'
          element={
            <PermissionGuard permission={MENU.outlet}>
              <OutletUpdatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/setting/type/outlet'
          element={
            <PermissionGuard permission={MENU.outletType}>
              <OutletTypePage />
            </PermissionGuard>
          }
        />

        {/* Setting - POS */}
        <Route
          path='/setting/pos/channel'
          element={
            <PermissionGuard permission={MENU.posChannel}>
              <POSChannelListPage />
            </PermissionGuard>
          }
        />

        {/* Setting - POS Category */}
        <Route
          path='/setting/pos/category'
          element={
            <PermissionGuard permission={MENU.posCategory}>
              <POSCategoryListPage />
            </PermissionGuard>
          }
        />

        {/* Setting - POS Menu */}
        <Route
          path='/setting/pos/menu'
          element={
            <PermissionGuard permission={MENU.posMenu}>
              <POSMenuListPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/setting/pos/menu/create'
          element={
            <PermissionGuard permission={MENU.posMenu}>
              <POSMenuCreatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/setting/pos/menu/update/:id'
          element={
            <PermissionGuard permission={MENU.posMenu}>
              <POSMenuUpdatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/setting/pos/menu/:id'
          element={
            <PermissionGuard permission={MENU.posMenu}>
              <POSMenuDetailPage />
            </PermissionGuard>
          }
        />

        {/* Setting - POS Payment */}
        <Route
          path='/setting/pos/payment'
          element={
            <PermissionGuard permission={MENU.posPayment}>
              <PaymentMethodListPage />
            </PermissionGuard>
          }
        />

        {/* Inventory - Item & Catalog */}
        <Route
          path='/inventory/item'
          element={
            <PermissionGuard permission={MENU.inventoryItem}>
              <InventoryItemListPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/inventory/item/create'
          element={
            <PermissionGuard permission={MENU.inventoryItem}>
              <InventoryItemCreatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/inventory/item/:id'
          element={
            <PermissionGuard permission={MENU.inventoryItem}>
              <InventoryItemDetailPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/inventory/item/update/:id'
          element={
            <PermissionGuard permission={MENU.inventoryItem}>
              <InventoryItemUpdatePage />
            </PermissionGuard>
          }
        />

        <Route
          path='/inventory/catalog'
          element={
            <PermissionGuard permission={MENU.inventoryCatalog}>
              <InventoryCatalogListPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/inventory/catalog/create'
          element={
            <PermissionGuard permission={MENU.inventoryCatalog}>
              <InventoryCatalogCreatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/inventory/catalog/update/:id'
          element={
            <PermissionGuard permission={MENU.inventoryCatalog}>
              <InventoryCatalogUpdatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/inventory/catalog/:id'
          element={
            <PermissionGuard permission={MENU.inventoryCatalog}>
              <InventoryCatalogDetailPage />
            </PermissionGuard>
          }
        />

        {/* Production - Plan */}
        <Route
          path='/production/plan'
          element={
            <PermissionGuard permission={MENU.productionPlan}>
              <ProductionPlanListPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/production/plan/create'
          element={
            <PermissionGuard permission={MENU.productionPlan}>
              <ProductionPlanCreatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/production/plan/:id'
          element={
            <PermissionGuard permission={MENU.productionPlan}>
              <ProductionPlanDetailPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/production/plan/update/:id'
          element={
            <PermissionGuard permission={MENU.productionPlan}>
              <ProductionPlanUpdatePage />
            </PermissionGuard>
          }
        />

        {/* Production - Demand */}
        <Route
          path='/production/demand/production'
          element={
            <PermissionGuard permission={MENU.demand}>
              <DemandProductionPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/production/demand/item'
          element={
            <PermissionGuard permission={MENU.demand}>
              <DemandItemPage />
            </PermissionGuard>
          }
        />

        {/* Purchase - Supplier */}
        <Route
          path='/purchase/supplier'
          element={
            <PermissionGuard permission={MENU.supplier}>
              <SupplierListPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/purchase/supplier/create'
          element={
            <PermissionGuard permission={MENU.supplier}>
              <SupplierCreatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/purchase/supplier/update/:id'
          element={
            <PermissionGuard permission={MENU.supplier}>
              <SupplierUpdatePage />
            </PermissionGuard>
          }
        />

        {/* Purchase - Order */}
        <Route
          path='/purchase/order'
          element={
            <PermissionGuard permission={MENU.purchaseOrder}>
              <PurchaseOrderListPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/purchase/order/create'
          element={
            <PermissionGuard permission={MENU.purchaseOrder}>
              <PurchaseOrderCreatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/purchase/order/:id'
          element={
            <PermissionGuard permission={MENU.purchaseOrder}>
              <PurchaseOrderDetailPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/purchase/order/update/:id'
          element={
            <PermissionGuard permission={MENU.purchaseOrder}>
              <PurchaseOrderUpdatePage />
            </PermissionGuard>
          }
        />

        {/* Sales - Order */}
        <Route
          path='/sales/order'
          element={
            <PermissionGuard permission={MENU.salesOrder}>
              <SalesOrderListPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/sales/order/create'
          element={
            <PermissionGuard permission={MENU.salesOrder}>
              <SalesOrderCreatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/sales/order/update/:id'
          element={
            <PermissionGuard permission={MENU.salesOrder}>
              <SalesOrderUpdatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/sales/order/:id'
          element={
            <PermissionGuard permission={MENU.salesOrder}>
              <SalesOrderDetailPage />
            </PermissionGuard>
          }
        />

        {/* Report POS */}
        <Route
          path='/report/pos/outstanding'
          element={
            <PermissionGuard permission={MENU.reportPosOutstanding}>
              <PosOutstandingPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/pos/settlement'
          element={
            <PermissionGuard permission={MENU.reportPosSettlement}>
              <POSSettlementPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/pos/settlement/daily'
          element={
            <PermissionGuard permission={MENU.reportPosSettlement}>
              <POSSettlementDailyPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/pos/cancelled-product-sales'
          element={
            <PermissionGuard permission={MENU.reportPosTransactionCancelled}>
              <POSCancelledProductSalesPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/pos/topup-cancelled'
          element={
            <PermissionGuard permission={MENU.reportPosTopupCancelled}>
              <POSTopupCancelledPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/pos/product-item'
          element={
            <PermissionGuard permission={MENU.reportPosProductItem}>
              <POSProductItemPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/pos/product-sales'
          element={
            <PermissionGuard permission={MENU.reportPosProductSales}>
              <POSProductSalesPage />
            </PermissionGuard>
          }
        />

        {/* Report Mitra */}
        <Route
          path='/report/mitra/settlement'
          element={
            <PermissionGuard permission={MENU.reportMitraSettlement}>
              <MitraSettlementPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/mitra/settlement/daily'
          element={
            <PermissionGuard permission={MENU.reportMitraSettlement}>
              <MitraSettlementDailyPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/mitra/product-item'
          element={
            <PermissionGuard permission={MENU.reportMitraProductItem}>
              <MitraProductItemPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/mitra/product-sales'
          element={
            <PermissionGuard permission={MENU.reportMitraProductSales}>
              <MitraProductSalesPage />
            </PermissionGuard>
          }
        />

        <Route
          path='/report/mitra/outlet-saldo'
          element={
            <PermissionGuard permission={MENU.reportMitraOutletSaldo}>
              <MitraOutletSaldoPage />
            </PermissionGuard>
          }
        />

        {/* Report B2B */}
        <Route
          path='/report/b2b/product-item'
          element={
            <PermissionGuard permission={MENU.reportB2BProductItem}>
              <B2BProductItemPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/b2b/settlement'
          element={
            <PermissionGuard permission={MENU.reportB2BSettlement}>
              <B2BSettlementPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/b2b/settlement/daily'
          element={
            <PermissionGuard permission={MENU.reportB2BSettlement}>
              <B2BSettlementDailyPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/b2b/product-sales'
          element={
            <PermissionGuard permission={MENU.reportB2BProductSales}>
              <B2BProductSalesPage />
            </PermissionGuard>
          }
        />

        {/* Report Franchisor */}
        <Route
          path='/report/inventory/material-sales'
          element={
            <PermissionGuard permission={MENU.reportInventoryMaterialSales}>
              <RawMaterialSalesPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/inventory/warehouse-stock'
          element={
            <PermissionGuard permission={MENU.reportWarehouseStock}>
              <WarehouseStockPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/report/outlet-maps'
          element={
            <PermissionGuard permission={MENU.reportOutletMap}>
              <OutletMapPage />
            </PermissionGuard>
          }
        />

        <Route
          path='/withdrawal'
          element={
            <PermissionGuard permission={MENU.withdrawal}>
              <WithdrawalList />
            </PermissionGuard>
          }
        />

        {/* B2B Order */}
        <Route
          path='/b2b/order'
          element={
            <PermissionGuard permission={MENU.b2bOrder}>
              <B2BOrderListPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/b2b/order/create'
          element={
            <PermissionGuard permission={MENU.b2bOrder}>
              <B2BOrderCreatePage />
            </PermissionGuard>
          }
        />
        <Route
          path='/b2b/order/:id'
          element={
            <PermissionGuard permission={MENU.b2bOrder}>
              <B2BOrderDetailPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/b2b/order/update/:id'
          element={
            <PermissionGuard permission={MENU.b2bOrder}>
              <B2BOrderUpdatePage />
            </PermissionGuard>
          }
        />

        {/* Outlet Topup */}
        <Route
          path='/outlet-topup'
          element={
            <PermissionGuard permission={MENU.outletTopup}>
              <OutletTopupListPage />
            </PermissionGuard>
          }
        />

        {/* User Management */}
        <Route
          path='/user'
          element={
            <PermissionGuard permission={MENU.user}>
              <UserListPage />
            </PermissionGuard>
          }
        />
        <Route
          path='/usergroup'
          element={
            <PermissionGuard permission={MENU.usergroup}>
              <UserGroupListPage />
            </PermissionGuard>
          }
        />

        {/* Franchisor Profile */}
        <Route path='/franchisor' element={<FranchisorProfilePage />} />

        {/* Member - Topup Bonus */}
        <Route
          path='/setting/member/topup-bonus'
          element={
            <PermissionGuard permission={MENU.topupBonus}>
              <TopupBonusPage />
            </PermissionGuard>
          }
        />

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
