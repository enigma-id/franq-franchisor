import { Supplier } from "./supplier";
import PurchaseSupplierCreate from "./supplierCreate";
import PurchaseSupplierUpdate from "./supplierUpdate";
import { PurchaseOrder } from "./purchaseOrder";
import { PurchaseOrderCreate } from "./purchaseOrderCreate";
import { PurchaseOrderDetail } from "./purchaseOrderDetail";
import { Demand } from "./demand";

export const purchaseRoutes = [
  {
    path: "/purchase/supplier",
    element: <Supplier />,
  },
  {
    path: "/purchase/supplier/create",
    element: <PurchaseSupplierCreate />,
  },
  {
    path: "/purchase/supplier/update/:id",
    element: <PurchaseSupplierUpdate />,
  },
  {
    path: "/purchase/order",
    element: <PurchaseOrder />,
  },
  {
    path: "/purchase/order/create",
    element: <PurchaseOrderCreate />,
  },
  {
    path: "/purchase/order/:id",
    element: <PurchaseOrderDetail />,
  },
  {
    path: "/purchase/demand",
    element: <Demand />,
  },
];
