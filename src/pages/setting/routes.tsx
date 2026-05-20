import { BusinessSetting } from "./business/businessSetting";
import { InventoryCatalog } from "./inventory/inventoryCatalog";
import InventoryCatalogCreate from "./inventory/inventoryCatalogCreate";
import InventoryCatalogUpdate from "./inventory/inventoryCatalogUpdate";
import { InventoryItem } from "./inventory/inventoryItem";
import InventoryItemCreate from "./inventory/inventoryItemCreate";
import InventoryItemUpdate from "./inventory/inventoryItemUpdate";
import { OutletPage } from "./outlet/outlet";
import StoreOutletCreate from "./outlet/outletCreate";
import StoreOutletUpdate from "./outlet/outletUpdate";
import { OutletType } from "./outlet/outletType";
import { PosChannel } from "./pos/posChannel";
import { PosCategory } from "./pos/posCategory";
import { PosCatalog } from "./pos/posCatalog";
import PosCatalogCreate from "./pos/posCatalogCreate";
import PosCatalogUpdate from "./pos/posCatalogUpdate";
import { PosPayment } from "./pos/posPayment";
import { PosTopupSchema } from "./pos/posTopupSchema";
import { UserManagement } from "./user/userManagement";
import UserCreate from "./user/userCreate";
import UserUpdate from "./user/userUpdate";
import { ProfilePage } from "./user/profilePage";
import { UpdateRouteGuard } from "@/components/app";

export const settingRoutes = [
  {
    path: "/setting/business",
    element: <BusinessSetting />,
  },
  {
    path: "/setting/inventory/catalog",
    element: <InventoryCatalog />,
  },
  {
    path: "/setting/inventory/catalog/create",
    element: <InventoryCatalogCreate />,
  },
  {
    path: "/setting/inventory/catalog/update/:id",
    element: <InventoryCatalogUpdate />,
  },
  {
    path: "/setting/inventory/item",
    element: <InventoryItem />,
  },
  {
    path: "/setting/inventory/item/create",
    element: (
      <UpdateRouteGuard allowed={true} fallbackUrl="/setting/inventory/item">
        <InventoryItemCreate />
      </UpdateRouteGuard>
    ),
  },
  {
    path: "/setting/inventory/item/update/:id",
    element: <InventoryItemUpdate />,
  },
  {
    path: "/setting/outlet",
    element: <OutletPage />,
  },
  {
    path: "/setting/outlet/create",
    element: <StoreOutletCreate />,
  },
  {
    path: "/setting/outlet/update/:id",
    element: <StoreOutletUpdate />,
  },
  {
    path: "/setting/type/outlet",
    element: <OutletType />,
  },
  {
    path: "/setting/pos/channel",
    element: <PosChannel />,
  },
  {
    path: "/setting/pos/category",
    element: <PosCategory />,
  },
  {
    path: "/setting/pos/catalog",
    element: <PosCatalog />,
  },
  {
    path: "/setting/pos/catalog/create",
    element: <PosCatalogCreate />,
  },
  {
    path: "/setting/pos/catalog/update/:id",
    element: <PosCatalogUpdate />,
  },
  {
    path: "/setting/pos/payment",
    element: <PosPayment />,
  },
  {
    path: "/setting/pos/topup-schema",
    element: <PosTopupSchema />,
  },
  {
    path: "/setting/user",
    element: <UserManagement />,
  },
  {
    path: "/setting/user/create",
    element: <UserCreate />,
  },
  {
    path: "/setting/user/update/:id",
    element: <UserUpdate />,
  },
  {
    path: "/auth/me",
    element: <ProfilePage />,
  },
];
