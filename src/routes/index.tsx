import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { UnauthorizedLayout } from "@/components/app/route-layout/UnauthorizedLayout";
import { AuthorizedLayout } from "@/components/app/route-layout/AuthorizedLayout";
import { useAppSelector, useAppMetadata } from "@/hooks";

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
import PaymentMethodListPage from "@/pages/setting/pos/payment";
import InventoryItemListPage from "@/pages/inventory/item";
import InventoryItemCreatePage from "@/pages/inventory/item/itemCreate";
import InventoryItemUpdatePage from "@/pages/inventory/item/itemUpdate";
import InventoryItemDetailPage from "@/pages/inventory/item/itemDetail";
import InventoryCatalogListPage from "@/pages/inventory/catalog";
import InventoryCatalogCreatePage from "@/pages/inventory/catalog/catalogCreate";
import InventoryCatalogUpdatePage from "@/pages/inventory/catalog/catalogUpdate";
import InventoryCatalogDetailPage from "@/pages/inventory/catalog/catalogDetail";
import WarehouseListPage from "@/pages/inventory/warehouse";
import SupplierListPage from "@/pages/purchase/supplier";
import SupplierCreatePage from "@/pages/purchase/supplier/supplierCreate";
import SupplierUpdatePage from "@/pages/purchase/supplier/supplierUpdate";
import PurchaseOrderListPage from "@/pages/purchase/order";
import PurchaseOrderCreatePage from "@/pages/purchase/order/purchaseOrderCreate";
import PurchaseOrderUpdatePage from "@/pages/purchase/order/purchaseOrderUpdate";
import SalesOrderCreatePage from "@/pages/sales/order/salesOrderCreate";
import SalesOrderUpdatePage from "@/pages/sales/order/salesOrderUpdate";
import SalesOrderListPage from "@/pages/sales/order";
import SalesOrderDetailPage from "@/pages/sales/order/salesOrderDetail";
import SalesReturnListPage from "@/pages/sales/return";
import SalesReturnDetailPage from "@/pages/sales/return/salesReturnDetail";
import ProductionPlanListPage from "@/pages/production/plan";
import ProductionPlanCreatePage from "@/pages/production/plan/productionPlanCreate";
import ProductionPlanDetailPage from "@/pages/production/plan/productionPlanDetail";
import ProductionPlanUpdatePage from "@/pages/production/plan/productionPlanUpdate";
import DemandProductionPage from "@/pages/production/demand/demandProduction";
import DemandItemPage from "@/pages/production/demand/demandItem";
import POSSettlementPage from "@/pages/report/posSettlement";
import POSSettlementDailyPage from "@/pages/report/posSettlementDaily";
import B2BSettlementPage from "@/pages/report/b2bSettlement";
import B2BSettlementDailyPage from "@/pages/report/b2bSettlementDaily";
import B2BProductSalesPage from "@/pages/report/b2bProductSales";
import RawMaterialSalesPage from "@/pages/report/rawMaterialSales";
import ProductSalesPage from "@/pages/report/productSales";
import WarehouseStockPage from "@/pages/report/warehouseStock";
import PosOutstandingPage from "@/pages/report/outstanding";
import POSMenuUpdatePage from "@/pages/setting/pos/menu/menuUpdate";
import { WithdrawalList } from "@/pages/withdrawal/WithdrawalList";
import { WithdrawalDetail } from "@/pages/withdrawal/WithdrawalDetail";
import { PurchaseOrderDetailPage } from "@/pages/purchase/order/purchaseOrderDetail";
import B2BOrderListPage from "@/pages/b2b/order";
import B2BOrderCreatePage from "@/pages/b2b/order/b2bOrderCreate";
import B2BOrderDetailPage from "@/pages/b2b/order/b2bOrderDetail";
import B2BOrderUpdatePage from "@/pages/b2b/order/b2bOrderUpdate";
import OutletTopupListPage from "@/pages/outletTopup";
import OutletTopupDetailPage from "@/pages/outletTopup/outletTopupDetail";
import UserListPage from "@/pages/user";
import UserCreatePage from "@/pages/user/userCreate";
import UserUpdatePage from "@/pages/user/userUpdate";
import UserGroupListPage from "@/pages/user/usergroup";
import UserGroupCreatePage from "@/pages/user/usergroup/create";
import FranchisorProfilePage from "@/pages/franchisor";

export function AppRoutes() {
  useAppMetadata();
  const isAuthenticated = useAppSelector((s) => s.auth.authenticated);

  if (!isAuthenticated) {
    return (
      <Routes>
        {/* Public routes — wrapped in UnauthorizedLayout */}
        <Route element={<UnauthorizedLayout />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
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
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Setting - Outlet */}
        <Route path="/setting/outlet" element={<OutletListPage />} />
        <Route path="/setting/outlet/create" element={<OutletCreatePage />} />
        <Route
          path="/setting/outlet/update/:id"
          element={<OutletUpdatePage />}
        />
        <Route path="/setting/type/outlet" element={<OutletTypePage />} />

        {/* Setting - POS */}
        <Route path="/setting/pos/channel" element={<POSChannelListPage />} />

        {/* Setting - POS Category */}
        <Route path="/setting/pos/category" element={<POSCategoryListPage />} />

        {/* Setting - POS Menu */}
        <Route path="/setting/pos/menu" element={<POSMenuListPage />} />
        <Route
          path="/setting/pos/menu/create"
          element={<POSMenuCreatePage />}
        />
        <Route
          path="/setting/pos/menu/update/:id"
          element={<POSMenuUpdatePage />}
        />
        <Route path="/setting/pos/menu/:id" element={<POSMenuDetailPage />} />

        {/* Setting - POS Payment */}
        <Route
          path="/setting/pos/payment"
          element={<PaymentMethodListPage />}
        />

        {/* Inventory - Item & Catalog */}
        <Route path="/inventory/item" element={<InventoryItemListPage />} />
        <Route
          path="/inventory/item/create"
          element={<InventoryItemCreatePage />}
        />
        <Route
          path="/inventory/item/:id"
          element={<InventoryItemDetailPage />}
        />
        <Route
          path="/inventory/item/update/:id"
          element={<InventoryItemUpdatePage />}
        />

        <Route
          path="/inventory/catalog"
          element={<InventoryCatalogListPage />}
        />
        <Route
          path="/inventory/catalog/create"
          element={<InventoryCatalogCreatePage />}
        />
        <Route
          path="/inventory/catalog/update/:id"
          element={<InventoryCatalogUpdatePage />}
        />
        <Route
          path="/inventory/catalog/:id"
          element={<InventoryCatalogDetailPage />}
        />

        {/* Inventory - Warehouse */}
        <Route path="/inventory/warehouse" element={<WarehouseListPage />} />

        {/* Production - Plan */}
        <Route path="/production/plan" element={<ProductionPlanListPage />} />
        <Route
          path="/production/plan/create"
          element={<ProductionPlanCreatePage />}
        />
        <Route
          path="/production/plan/:id"
          element={<ProductionPlanDetailPage />}
        />
        <Route
          path="/production/plan/update/:id"
          element={<ProductionPlanUpdatePage />}
        />

        {/* Production - Demand */}
        <Route
          path="/production/demand/production"
          element={<DemandProductionPage />}
        />
        <Route path="/production/demand/item" element={<DemandItemPage />} />

        {/* Purchase - Supplier */}
        <Route path="/purchase/supplier" element={<SupplierListPage />} />
        <Route
          path="/purchase/supplier/create"
          element={<SupplierCreatePage />}
        />
        <Route
          path="/purchase/supplier/update/:id"
          element={<SupplierUpdatePage />}
        />

        {/* Purchase - Order */}
        <Route path="/purchase/order" element={<PurchaseOrderListPage />} />
        <Route
          path="/purchase/order/create"
          element={<PurchaseOrderCreatePage />}
        />
        <Route
          path="/purchase/order/:id"
          element={<PurchaseOrderDetailPage />}
        />
        <Route
          path="/purchase/order/update/:id"
          element={<PurchaseOrderUpdatePage />}
        />

        {/* Sales - Order */}
        <Route path="/sales/order" element={<SalesOrderListPage />} />
        <Route path="/sales/order/create" element={<SalesOrderCreatePage />} />
        <Route
          path="/sales/order/update/:id"
          element={<SalesOrderUpdatePage />}
        />
        <Route path="/sales/order/:id" element={<SalesOrderDetailPage />} />

        {/* Sales - Return */}
        <Route path="/sales/return" element={<SalesReturnListPage />} />
        <Route path="/sales/return/:id" element={<SalesReturnDetailPage />} />

        {/* Report */}
        <Route
          path="/report/pos/outstanding"
          element={<PosOutstandingPage />}
        />
        <Route path="/report/pos/settlement" element={<POSSettlementPage />} />
        <Route path="/report/pos/settlement/daily" element={<POSSettlementDailyPage />} />
        <Route path="/report/b2b/settlement" element={<B2BSettlementPage />} />
        <Route path="/report/b2b/settlement/daily" element={<B2BSettlementDailyPage />} />
        <Route
          path="/report/inventory/product-sales"
          element={<ProductSalesPage />}
        />
        <Route
          path="/report/b2b/product-sales"
          element={<B2BProductSalesPage />}
        />
        <Route
          path="/report/inventory/material-sales"
          element={<RawMaterialSalesPage />}
        />
        <Route
          path="/report/inventory/warehouse-stock"
          element={<WarehouseStockPage />}
        />

        <Route path="/withdrawal" element={<WithdrawalList />} />
        <Route path="/withdrawal/:id" element={<WithdrawalDetail />} />

        {/* B2B Order */}
        <Route path="/b2b/order" element={<B2BOrderListPage />} />
        <Route path="/b2b/order/create" element={<B2BOrderCreatePage />} />
        <Route path="/b2b/order/:id" element={<B2BOrderDetailPage />} />
        <Route path="/b2b/order/update/:id" element={<B2BOrderUpdatePage />} />

        {/* Outlet Topup */}
        <Route path="/outlet-topup" element={<OutletTopupListPage />} />
        <Route path="/outlet-topup/:id" element={<OutletTopupDetailPage />} />

        {/* User Management */}
        <Route path="/user" element={<UserListPage />} />
        <Route path="/user/create" element={<UserCreatePage />} />
        <Route path="/user/update/:id" element={<UserUpdatePage />} />
        <Route path="/user/group" element={<UserGroupListPage />} />
        <Route path="/user/group/create" element={<UserGroupCreatePage />} />

        {/* Franchisor Profile */}
        <Route path="/franchisor" element={<FranchisorProfilePage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
